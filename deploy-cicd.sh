#!/bin/bash

#################################################################################
# MSP Assistant - Automated CI/CD Pipeline Setup
#
# Description: Fully idempotent script to set up complete CI/CD pipeline
# Requirements: AWS CLI, Git, GitHub CLI (gh), Docker, Bash 4+
#
# Usage: ./deploy-cicd.sh --github-repo USERNAME/REPO --aws-region ap-south-1
#
#################################################################################

set -e

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
AWS_REGION="${AWS_REGION:-ap-south-1}"
AWS_PROFILE="${AWS_PROFILE:-default}"
ECR_REPO_NAME="msp-assistant-backend"
S3_BUCKET_NAME="msp-assistant-frontend-prod"
DYNAMODB_TABLES=("msp-costs" "msp-alerts" "msp-users" "msp-chat")
ECS_CLUSTER="msp-assistant-cluster"
ECS_SERVICE="msp-assistant-service"
GITHUB_REPO=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --github-repo)
            GITHUB_REPO="$2"
            shift 2
            ;;
        --aws-region)
            AWS_REGION="$2"
            shift 2
            ;;
        --aws-profile)
            AWS_PROFILE="$2"
            shift 2
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Utility functions
write_status() {
    local message="$1"
    local status="${2:-INFO}"
    local color=""

    case $status in
        SUCCESS) color=$GREEN ;;
        ERROR) color=$RED ;;
        WARNING) color=$YELLOW ;;
        INFO) color=$BLUE ;;
        *) color=$NC ;;
    esac

    echo -e "${color}[$status]${NC} $message"
}

# Check prerequisites
check_prerequisites() {
    echo -e "\n${BLUE}=== CHECKING PREREQUISITES ===${NC}"

    local missing=()

    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        missing+=("AWS CLI")
    else
        write_status "✓ AWS CLI found" "SUCCESS"
    fi

    # Check Git
    if ! command -v git &> /dev/null; then
        missing+=("Git")
    else
        write_status "✓ Git found" "SUCCESS"
    fi

    # Check GitHub CLI
    if ! command -v gh &> /dev/null; then
        missing+=("GitHub CLI (gh)")
    else
        write_status "✓ GitHub CLI found" "SUCCESS"
    fi

    # Check Docker
    if ! command -v docker &> /dev/null; then
        missing+=("Docker")
    else
        write_status "✓ Docker found" "SUCCESS"
    fi

    # Check AWS credentials
    if aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION" &>/dev/null; then
        local account=$(aws sts get-caller-identity --profile "$AWS_PROFILE" --region "$AWS_REGION" --query Account --output text)
        write_status "✓ AWS credentials valid (Account: $account)" "SUCCESS"
    else
        missing+=("Valid AWS credentials")
    fi

    if [ ${#missing[@]} -gt 0 ]; then
        write_status "Missing prerequisites: ${missing[*]}" "ERROR"
        write_status "Please install missing tools and try again" "ERROR"
        exit 1
    fi

    write_status "All prerequisites met" "SUCCESS "
}

# Setup ECR
setup_ecr() {
    echo -e "\n${BLUE}=== SETTING UP ECR ===${NC}"

    # Check if repo exists
    if aws ecr describe-repositories \
        --repository-names "$ECR_REPO_NAME" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" &>/dev/null; then
        write_status "ECR repository already exists: $ECR_REPO_NAME" "WARNING"
        return
    fi

    write_status "Creating ECR repository: $ECR_REPO_NAME" "INFO"

    aws ecr create-repository \
        --repository-name "$ECR_REPO_NAME" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE" \
        --output json > /dev/null

    write_status "✓ ECR repository created" "SUCCESS"
}

# Setup S3
setup_s3() {
    echo -e "\n${BLUE}=== SETTING UP S3 ===${NC}"

    # Check if bucket exists
    if aws s3 ls "s3://$S3_BUCKET_NAME" --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null; then
        write_status "S3 bucket already exists: $S3_BUCKET_NAME" "WARNING"
    else
        write_status "Creating S3 bucket: $S3_BUCKET_NAME" "INFO"

        aws s3 mb "s3://$S3_BUCKET_NAME" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE"

        write_status "✓ S3 bucket created" "SUCCESS"
    fi

    # Enable versioning (idempotent)
    write_status "Enabling S3 versioning" "INFO"
    aws s3api put-bucket-versioning \
        --bucket "$S3_BUCKET_NAME" \
        --versioning-configuration Status=Enabled \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"

    write_status "✓ S3 versioning enabled" "SUCCESS"

    # Block public access (idempotent)
    write_status "Blocking public access" "INFO"
    aws s3api put-public-access-block \
        --bucket "$S3_BUCKET_NAME" \
        --public-access-block-configuration \
        "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"

    write_status "✓ S3 public access blocked" "SUCCESS"
}

# Setup DynamoDB
setup_dynamodb() {
    echo -e "\n${BLUE}=== SETTING UP DYNAMODB ===${NC}"

    for table_name in "${DYNAMODB_TABLES[@]}"; do
        # Check if table exists
        if aws dynamodb describe-table \
            --table-name "$table_name" \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE" &>/dev/null; then
            write_status "DynamoDB table already exists: $table_name" "WARNING"
            continue
        fi

        write_status "Creating DynamoDB table: $table_name" "INFO"

        # Determine key based on table name
        local key_name="id"
        if [ "$table_name" = "msp-users" ]; then
            key_name="email"
        fi

        aws dynamodb create-table \
            --table-name "$table_name" \
            --attribute-definitions AttributeName="$key_name",AttributeType=S \
            --key-schema AttributeName="$key_name",KeyType=HASH \
            --billing-mode PAY_PER_REQUEST \
            --region "$AWS_REGION" \
            --profile "$AWS_PROFILE" \
            --output json > /dev/null

        write_status "✓ DynamoDB table created: $table_name" "SUCCESS"
    done
}

# Setup GitHub Repository
setup_github_repository() {
    echo -e "\n${BLUE}=== SETTING UP GITHUB REPOSITORY ===${NC}"

    if [ -z "$GITHUB_REPO" ]; then
        write_status "GitHub repo not specified, skipping GitHub setup" "WARNING"
        return
    fi

    # Check if remote already configured
    local git_remote=$(git remote get-url origin 2>/dev/null || echo "")

    if [[ "$git_remote" == *"$GITHUB_REPO"* ]]; then
        write_status "Git repository already configured" "WARNING"
    else
        write_status "Configuring Git repository: $GITHUB_REPO" "INFO"

        git remote remove origin 2>/dev/null || true
        git remote add origin "https://github.com/$GITHUB_REPO.git"

        write_status "✓ Git repository configured" "SUCCESS"
    fi

    # Check if already pushed
    if git branch -r 2>/dev/null | grep -q "origin/main"; then
        write_status "Code already pushed to GitHub" "WARNING"
    else
        write_status "Pushing code to GitHub" "INFO"

        git add . 2>/dev/null || true
        git commit -m "CI/CD: Automated setup" 2>/dev/null || true
        git branch -M main 2>/dev/null || true
        git push -u origin main

        write_status "✓ Code pushed to GitHub" "SUCCESS"
    fi
}

# Setup GitHub Secrets
setup_github_secrets() {
    echo -e "\n${BLUE}=== SETTING UP GITHUB SECRETS ===${NC}"

    if [ -z "$GITHUB_REPO" ]; then
        write_status "GitHub repo not specified, skipping secrets setup" "WARNING"
        return
    fi

    # Get AWS Account ID
    local account_id=$(aws sts get-caller-identity \
        --profile "$AWS_PROFILE" \
        --region "$AWS_REGION" \
        --query Account \
        --output text)

    write_status "Note: Manual secrets setup required" "WARNING"
    echo -e "\nTo complete GitHub secrets setup:"
    echo "1. Go to: https://github.com/$GITHUB_REPO/settings/secrets/actions"
    echo "2. Add these secrets:"
    echo -e "   ${RED}AWS_ACCESS_KEY_ID = [MANUAL: Enter your access key]${NC}"
    echo -e "   ${RED}AWS_SECRET_ACCESS_KEY = [MANUAL: Enter your secret key]${NC}"
    echo -e "   ${GREEN}AWS_ACCOUNT_ID = $account_id${NC}"
    echo -e "   ${GREEN}AWS_REGION = $AWS_REGION${NC}"
    echo -e "   ${GREEN}ECR_REPOSITORY_NAME = $ECR_REPO_NAME${NC}"
    echo -e "   ${GREEN}ECS_CLUSTER_NAME = $ECS_CLUSTER${NC}"
    echo -e "   ${GREEN}ECS_SERVICE_NAME = $ECS_SERVICE${NC}"
    echo -e "   ${GREEN}S3_BUCKET_NAME = $S3_BUCKET_NAME${NC}"
    echo -e "   ${RED}CLOUDFRONT_DISTRIBUTION_ID = [MANUAL: Enter later]${NC}"
    echo -e "   ${RED}TEAMS_WEBHOOK_URL = [MANUAL: Enter if using Teams]${NC}"
}

# Verify setup
verify_setup() {
    echo -e "\n${BLUE}=== VERIFYING SETUP ===${NC}"

    write_status "Verifying ECR" "INFO"
    if aws ecr describe-repositories --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null | \
        grep -q "$ECR_REPO_NAME"; then
        write_status "✓ ECR verified" "SUCCESS"
    else
        write_status "✗ ECR not found" "ERROR"
    fi

    write_status "Verifying S3" "INFO"
    if aws s3 ls --region "$AWS_REGION" --profile "$AWS_PROFILE" 2>/dev/null | \
        grep -q "$S3_BUCKET_NAME"; then
        write_status "✓ S3 verified" "SUCCESS"
    else
        write_status "✗ S3 not found" "ERROR"
    fi

    write_status "Verifying DynamoDB" "INFO"
    local tables=$(aws dynamodb list-tables --region "$AWS_REGION" --profile "$AWS_PROFILE" \
        --query TableNames --output text)

    local missing_tables=()
    for table in "${DYNAMODB_TABLES[@]}"; do
        if [[ ! "$tables" =~ $table ]]; then
            missing_tables+=("$table")
        fi
    done

    if [ ${#missing_tables[@]} -eq 0 ]; then
        write_status "✓ All DynamoDB tables verified" "SUCCESS"
    else
        write_status "✗ Missing tables: ${missing_tables[*]}" "ERROR"
    fi
}

# Show next steps
show_next_steps() {
    echo -e "\n${GREEN}=== SETUP COMPLETE ===${NC}"

    echo -e "\nNext Steps:"
    echo -e "${YELLOW}1. Add GitHub Secrets (see above):${NC}"
    echo "   AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY from IAM user"
    echo ""
    echo -e "${YELLOW}2. Configure GitHub Actions workflow:${NC}"
    echo "   File: .github/workflows/deploy.yml"
    echo ""
    echo -e "${YELLOW}3. Deploy infrastructure with Terraform:${NC}"
    echo "   cd deployment/terraform"
    echo "   terraform init"
    echo "   terraform apply"
    echo ""
    echo -e "${YELLOW}4. Push code to trigger CI/CD:${NC}"
    echo "   git push origin main"
    echo ""
    echo -e "${YELLOW}5. Monitor deployment:${NC}"
    echo "   GitHub → Actions → Watch workflow"
    echo ""
}

# Main function
main() {
    echo -e "${BLUE}╔════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║  MSP Assistant - Automated CI/CD Setup        ║${NC}"
    echo -e "${BLUE}║  AWS Region: $AWS_REGION                           ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════╝${NC}"

    check_prerequisites
    setup_ecr
    setup_s3
    setup_dynamodb
    setup_github_repository
    setup_github_secrets
    verify_setup
    show_next_steps
}

# Run main function
main
