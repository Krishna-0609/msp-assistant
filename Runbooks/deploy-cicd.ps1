#Requires -Version 5.0
<#
.SYNOPSIS
Automated CI/CD Pipeline Setup - PowerShell Script (Simplified)
Fully Idempotent - Safe to run multiple times

.EXAMPLE
./deploy-cicd.ps1 -GitHubRepo "Krishna-0609/msp-assistant"
#>

param(
    [string]$AwsRegion = "ap-south-1",
    [string]$GitHubRepo = "Krishna-0609/msp-assistant",
    [string]$AwsProfile = "default"
)

# Configuration
$ECR_REPO_NAME = "msp-assistant-backend"
$S3_BUCKET_NAME = "msp-assistant-frontend-prod"
$DYNAMODB_TABLES = @("msp-costs", "msp-alerts", "msp-users", "msp-chat")
$ECS_CLUSTER = "msp-assistant-cluster"
$ECS_SERVICE = "msp-assistant-service"

Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "MSP Assistant - CI/CD Setup" -ForegroundColor Cyan
Write-Host "AWS Region: $AwsRegion" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Test Prerequisites
Write-Host "[1/5] Checking prerequisites..." -ForegroundColor Yellow
$missing = @()

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) { $missing += "AWS CLI" }
if (-not (Get-Command git -ErrorAction SilentlyContinue)) { $missing += "Git" }
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) { $missing += "Docker" }

if ($missing.Count -gt 0) {
    Write-Host "  ERROR: Missing: $($missing -join ', ')" -ForegroundColor Red
    exit 1
}

# Check AWS credentials
try {
    $account = aws sts get-caller-identity --profile $AwsProfile --region $AwsRegion --output json 2>$null | ConvertFrom-Json
    Write-Host "  OK AWS credentials valid (Account: $($account.Account))" -ForegroundColor Green
} catch {
    Write-Host "  ERROR: Invalid AWS credentials" -ForegroundColor Red
    exit 1
}

# Setup ECR
Write-Host "`n[2/5] Setting up ECR repository..." -ForegroundColor Yellow
$ecr = $null
try {
    $ecr = aws ecr describe-repositories --repository-names $ECR_REPO_NAME --region $AwsRegion --profile $AwsProfile --output json 2>$null | ConvertFrom-Json
}
catch {}

if ($ecr.repositories) {
    Write-Host "  OK ECR repository already exists" -ForegroundColor Green
} else {
    Write-Host "  Creating ECR repository..." -ForegroundColor Gray
    aws ecr create-repository --repository-name $ECR_REPO_NAME --region $AwsRegion --profile $AwsProfile --output json | Out-Null
    Write-Host "  OK ECR repository created" -ForegroundColor Green
}

# Setup S3
Write-Host "`n[3/5] Setting up S3 bucket..." -ForegroundColor Yellow
$s3exists = $null
try {
    $s3exists = aws s3 ls "s3://$S3_BUCKET_NAME" --region $AwsRegion --profile $AwsProfile 2>$null
}
catch {}

if ($s3exists) {
    Write-Host "  OK S3 bucket already exists" -ForegroundColor Green
} else {
    Write-Host "  Creating S3 bucket..." -ForegroundColor Gray
    aws s3 mb "s3://$S3_BUCKET_NAME" --region $AwsRegion --profile $AwsProfile | Out-Null
    Write-Host "  OK S3 bucket created" -ForegroundColor Green
}

# Enable versioning
aws s3api put-bucket-versioning --bucket $S3_BUCKET_NAME --versioning-configuration Status=Enabled --region $AwsRegion --profile $AwsProfile 2>$null
# Block public access
aws s3api put-public-access-block --bucket $S3_BUCKET_NAME --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true" --region $AwsRegion --profile $AwsProfile 2>$null
Write-Host "  OK S3 versioning and public access blocking enabled" -ForegroundColor Green

# Setup DynamoDB
Write-Host "`n[4/5] Setting up DynamoDB tables..." -ForegroundColor Yellow
foreach ($tableName in $DYNAMODB_TABLES) {
    $table = $null
    try {
        $table = aws dynamodb describe-table --table-name $tableName --region $AwsRegion --profile $AwsProfile --output json 2>$null | ConvertFrom-Json
    }
    catch {}

    if ($table.Table) {
        Write-Host "  OK Table already exists: $tableName" -ForegroundColor Green
    } else {
        Write-Host "  Creating table: $tableName..." -ForegroundColor Gray
        if ($tableName -eq "msp-users") {
            $keyName = "email"
        } else {
            $keyName = "id"
        }

        aws dynamodb create-table --table-name $tableName --attribute-definitions AttributeName=$keyName,AttributeType=S --key-schema AttributeName=$keyName,KeyType=HASH --billing-mode PAY_PER_REQUEST --region $AwsRegion --profile $AwsProfile --output json 2>$null | Out-Null
        Write-Host "  OK Table created: $tableName" -ForegroundColor Green
    }
}

# Setup GitHub
Write-Host "`n[5/5] Setting up GitHub repository..." -ForegroundColor Yellow
if ($GitHubRepo) {
    $gitRemote = $null
    try {
        $gitRemote = git remote get-url origin 2>$null
    }
    catch {}

    if ($gitRemote -like "*$GitHubRepo*") {
        Write-Host "  OK Git remote already configured" -ForegroundColor Green
    } else {
        Write-Host "  Configuring Git remote..." -ForegroundColor Gray
        git remote remove origin 2>$null
        git remote add origin "https://github.com/$GitHubRepo.git"
        Write-Host "  OK Git remote configured" -ForegroundColor Green
    }

    $branches = $null
    try {
        $branches = git branch -r 2>$null | Select-String "origin/main"
    }
    catch {}

    if ($branches) {
        Write-Host "  OK Code already pushed to GitHub" -ForegroundColor Green
    } else {
        Write-Host "  Pushing code to GitHub..." -ForegroundColor Gray
        git add .
        git commit -m "CI/CD: Automated setup" 2>$null
        git branch -M main
        git push -u origin main
        Write-Host "  OK Code pushed to GitHub" -ForegroundColor Green
    }
}

# Summary
Write-Host "`n================================" -ForegroundColor Green
Write-Host "Setup Complete!" -ForegroundColor Green
Write-Host "================================`n" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Add GitHub Secrets:" -ForegroundColor Yellow
Write-Host "   https://github.com/$GitHubRepo/settings/secrets/actions" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Add these secrets (AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, etc.)" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Deploy infrastructure:" -ForegroundColor Yellow
Write-Host "   cd deployment/terraform && terraform init && terraform apply" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Monitor deployment:" -ForegroundColor Yellow
Write-Host "   GitHub → Actions → Watch workflow" -ForegroundColor Gray
Write-Host ""
