# MSP Assistant - Production Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     CloudFront (CDN)                        │
│              (S3 + API Gateway + ALB)                       │
└────────────────────────┬────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼─────┐   ┌──────▼──────┐  ┌────▼──────┐
   │     S3    │   │ Application │  │   Route   │
   │ (Frontend)│   │ Load Balancer│  │   53      │
   └──────────┘   └──────┬───────┘  └───────────┘
                        │
                   ┌────▼────┐
                   │ECS Fargate│
                   │Cluster    │
                   │(Backend)  │
                   └────┬──────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
   ┌────▼────┐  ┌──────▼──────┐ ┌────▼──────┐
   │DynamoDB  │  │CloudWatch   │ │AWS Bedrock│
   │(Data)    │  │(Monitoring) │ │(AI)       │
   └──────────┘  └─────────────┘ └───────────┘
```

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** configured with credentials
3. **Terraform** (v1.0+)
4. **Docker** for local testing
5. **Git** for version control
6. **GitHub** repository access

## Step 1: Setup AWS Infrastructure Prerequisites

### 1.1 Create IAM Role for GitHub Actions

```bash
# Create trust policy file
cat > trust-policy.json << 'EOF'
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "arn:aws:iam::ACCOUNT_ID:oidc-provider/token.actions.githubusercontent.com"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        },
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:YOUR_ORG/msp-assistant:*"
        }
      }
    }
  ]
}
EOF

# Create IAM role
aws iam create-role \
  --role-name github-actions-role \
  --assume-role-policy-document file://trust-policy.json

# Attach policies
aws iam attach-role-policy \
  --role-name github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser

aws iam attach-role-policy \
  --role-name github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonECS_FullAccess

aws iam attach-role-policy \
  --role-name github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3FullAccess

aws iam attach-role-policy \
  --role-name github-actions-role \
  --policy-arn arn:aws:iam::aws:policy/CloudFrontFullAccess
```

### 1.2 Create ECR Repository

```bash
aws ecr create-repository \
  --repository-name msp-assistant-backend \
  --region us-east-1

# Get repository URL
aws ecr describe-repositories \
  --repository-names msp-assistant-backend \
  --query 'repositories[0].repositoryUri' \
  --output text
```

### 1.3 Create S3 Bucket for Terraform State

```bash
aws s3 mb s3://msp-assistant-terraform-state --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket msp-assistant-terraform-state \
  --versioning-configuration Status=Enabled

# Enable encryption
aws s3api put-bucket-encryption \
  --bucket msp-assistant-terraform-state \
  --server-side-encryption-configuration '{
    "Rules": [
      {
        "ApplyServerSideEncryptionByDefault": {
          "SSEAlgorithm": "AES256"
        }
      }
    ]
  }'

# Create DynamoDB table for state locking
aws dynamodb create-table \
  --table-name terraform-lock \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 1.4 Create DynamoDB Tables

```bash
# Create costs table
aws dynamodb create-table \
  --table-name msp-costs \
  --attribute-definitions AttributeName=account_id,AttributeType=S AttributeName=date,AttributeType=S \
  --key-schema AttributeName=account_id,KeyType=HASH AttributeName=date,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Create alerts table
aws dynamodb create-table \
  --table-name msp-alerts \
  --attribute-definitions AttributeName=alert_id,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=alert_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Create users table
aws dynamodb create-table \
  --table-name msp-users \
  --attribute-definitions AttributeName=user_id,AttributeType=S \
  --key-schema AttributeName=user_id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1

# Create chat table
aws dynamodb create-table \
  --table-name msp-chat \
  --attribute-definitions AttributeName=conversation_id,AttributeType=S AttributeName=timestamp,AttributeType=S \
  --key-schema AttributeName=conversation_id,KeyType=HASH AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST \
  --region us-east-1
```

### 1.5 Create S3 Bucket for Frontend

```bash
aws s3 mb s3://msp-assistant-frontend-prod --region us-east-1

# Block public access
aws s3api put-public-access-block \
  --bucket msp-assistant-frontend-prod \
  --public-access-block-configuration \
    "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

### 1.6 Store Secrets in AWS Secrets Manager

```bash
# Store Teams webhook
aws secretsmanager create-secret \
  --name msp-assistant/teams-webhook \
  --secret-string "https://outlook.webhook.office.com/webhookb2/..."

# Store JWT secret
aws secretsmanager create-secret \
  --name msp-assistant/secret-key \
  --secret-string "your-production-secret-key-here"

# Store Slack webhook (optional)
aws secretsmanager create-secret \
  --name msp-assistant/slack-webhook \
  --secret-string "https://hooks.slack.com/services/..."
```

## Step 2: Configure GitHub Secrets

Add the following secrets to your GitHub repository:

1. **AWS_ACCOUNT_ID**: Your AWS account ID
2. **TEAMS_WEBHOOK_URL**: Teams webhook URL
3. **SLACK_WEBHOOK_URL**: Slack webhook URL (optional)

```bash
# Using GitHub CLI
gh secret set AWS_ACCOUNT_ID --body "123456789012"
gh secret set TEAMS_WEBHOOK_URL --body "https://outlook.webhook.office.com/..."
gh secret set SLACK_WEBHOOK_URL --body "https://hooks.slack.com/..."
```

## Step 3: Deploy Infrastructure with Terraform

```bash
cd deployment/terraform

# Initialize Terraform
terraform init

# Create terraform.tfvars
cat > terraform.tfvars << 'EOF'
aws_region           = "us-east-1"
environment          = "production"
ecr_repository_url   = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/msp-assistant-backend"
frontend_bucket_name = "msp-assistant-frontend-prod"
desired_count        = 2
cors_origins         = "https://msp-assistant.example.com,https://www.msp-assistant.example.com"
EOF

# Plan deployment
terraform plan -out=tfplan

# Apply configuration
terraform apply tfplan

# Get outputs
terraform output
```

## Step 4: Build and Push Docker Image

```bash
# Authenticate with ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build image
cd backend
docker build -t msp-assistant-backend:latest .

# Tag image
docker tag msp-assistant-backend:latest \
  ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/msp-assistant-backend:latest

# Push image
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/msp-assistant-backend:latest
```

## Step 5: Deploy Frontend

```bash
# Build frontend
cd frontend
npm run build

# Sync to S3
aws s3 sync dist/ s3://msp-assistant-frontend-prod/ --delete

# Invalidate CloudFront cache
DISTRIBUTION_ID=$(aws cloudfront list-distributions \
  --query "DistributionList.Items[0].Id" \
  --output text)

aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"
```

## Step 6: Configure Custom Domain (Optional)

```bash
# Create Route53 hosted zone
aws route53 create-hosted-zone \
  --name msp-assistant.example.com \
  --caller-reference $(date +%s)

# Get nameservers
aws route53 get-hosted-zone \
  --id /hostedzone/ZONE_ID \
  --query 'DelegationSet.NameServers' \
  --output table

# Create A record pointing to CloudFront
aws route53 change-resource-record-sets \
  --hosted-zone-id ZONE_ID \
  --change-batch '{
    "Changes": [
      {
        "Action": "CREATE",
        "ResourceRecordSet": {
          "Name": "msp-assistant.example.com",
          "Type": "A",
          "AliasTarget": {
            "HostedZoneId": "Z2FDTNDATAQYW2",
            "DNSName": "CLOUDFRONT_DOMAIN",
            "EvaluateTargetHealth": false
          }
        }
      }
    ]
  }'
```

## Step 7: Enable Monitoring and Logging

```bash
# Create CloudWatch dashboard
aws cloudwatch put-dashboard \
  --dashboard-name MSPAssistantDashboard \
  --dashboard-body file://dashboard-config.json

# Set up alarms
aws cloudwatch put-metric-alarm \
  --alarm-name msp-assistant-cpu-high \
  --alarm-description "Alert when ECS CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:ACCOUNT_ID:msp-alerts
```

## Scaling Configuration

The deployment includes auto-scaling configured as:
- **Min Capacity**: 1 task
- **Max Capacity**: 4 tasks
- **CPU Target**: 70%
- **Memory Target**: 80%

To adjust scaling:

```bash
# Update scaling targets
aws application-autoscaling register-scalable-target \
  --service-namespace ecs \
  --resource-id service/msp-assistant-cluster/msp-assistant-backend-service \
  --scalable-dimension ecs:service:DesiredCount \
  --min-capacity 1 \
  --max-capacity 10
```

## Cost Estimation (Monthly)

| Service | Usage | Est. Cost |
|---------|-------|-----------|
| ECS Fargate | 2x 512 CPU, 1GB RAM | $28 |
| S3 (Frontend) | 10GB storage | $0.23 |
| CloudFront | 100GB transfer | $8.50 |
| DynamoDB | On-demand (Pay-per-request) | $25 |
| CloudWatch Logs | 10GB/month | $5 |
| **Total** | | **~$67/month** |

## Monitoring & Alerts

### CloudWatch Metrics to Monitor
- ECS task CPU/memory utilization
- ALB request count and latency
- DynamoDB read/write capacity
- CloudFront cache hit ratio
- Backend error rates

### Set Up Alerts
1. **High CPU**: > 80% for 2 consecutive periods
2. **High Memory**: > 80% for 2 consecutive periods
3. **Service Unhealthy**: < 1 healthy task
4. **API Errors**: 4xx/5xx > 1% of requests

## Troubleshooting

### ECS Tasks Not Starting
```bash
# Check task definition
aws ecs describe-task-definition \
  --task-definition msp-assistant-backend

# Check service events
aws ecs describe-services \
  --cluster msp-assistant-cluster \
  --services msp-assistant-backend-service
```

### CloudFront Not Showing New Content
```bash
# Invalidate cache
aws cloudfront create-invalidation \
  --distribution-id DISTRIBUTION_ID \
  --paths "/*"
```

### Backend API Errors
```bash
# Check logs
aws logs tail /ecs/msp-assistant-backend --follow
```

## Disaster Recovery

### Backup Strategy
- DynamoDB: Auto backups enabled (35-day retention)
- S3 Frontend: Versioning enabled
- Terraform State: Versioned in S3

### Restore Procedure
```bash
# Restore DynamoDB from backup
aws dynamodb restore-table-from-backup \
  --target-table-name msp-costs-restored \
  --backup-arn arn:aws:dynamodb:us-east-1:ACCOUNT_ID:table/msp-costs/backup/...

# Restore S3 version
aws s3 cp s3://msp-assistant-frontend/index.html \
  --version-id VERSION_ID .
```

## Security Best Practices

1. **Secrets Management**: Use AWS Secrets Manager (done)
2. **VPC Isolation**: Backend runs in private subnets with security groups
3. **HTTPS Only**: CloudFront enforces HTTPS
4. **DynamoDB Encryption**: Enabled by default
5. **S3 Encryption**: Enabled with AES-256
6. **IAM Roles**: Least-privilege access model
7. **Logging**: All API calls logged to CloudWatch
8. **WAF** (Optional): Can be added to CloudFront

## Next Steps

1. Set up custom domain name
2. Enable AWS WAF on CloudFront
3. Configure backup retention policies
4. Set up cost anomaly detection in AWS
5. Implement Blue-Green deployments
6. Set up disaster recovery plan
