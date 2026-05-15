#!/bin/bash

# Bootstrap script to create Terraform state bucket and DynamoDB lock table
# Run this once before the first Terraform deployment

set -e

AWS_REGION=${AWS_REGION:-"ap-south-1"}
STATE_BUCKET="msp-assistant-terraform-state"
LOCK_TABLE="terraform-lock"

echo "🚀 Bootstrapping Terraform backend in $AWS_REGION..."

# Create S3 bucket for Terraform state
echo "📦 Creating S3 bucket for Terraform state..."
aws s3api create-bucket \
  --bucket "$STATE_BUCKET" \
  --region "$AWS_REGION" \
  --create-bucket-configuration LocationConstraint="$AWS_REGION" \
  2>/dev/null || echo "✓ Bucket already exists"

# Enable versioning on the bucket
echo "📝 Enabling versioning..."
aws s3api put-bucket-versioning \
  --bucket "$STATE_BUCKET" \
  --versioning-configuration Status=Enabled \
  --region "$AWS_REGION"

# Block public access
echo "🔒 Blocking public access..."
aws s3api put-public-access-block \
  --bucket "$STATE_BUCKET" \
  --region "$AWS_REGION" \
  --public-access-block-configuration \
  "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"

# Enable encryption
echo "🔐 Enabling encryption..."
aws s3api put-bucket-encryption \
  --bucket "$STATE_BUCKET" \
  --region "$AWS_REGION" \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'

# Create DynamoDB lock table
echo "🔐 Creating DynamoDB lock table..."
aws dynamodb create-table \
  --table-name "$LOCK_TABLE" \
  --attribute-definitions AttributeName=LockID,AttributeType=S \
  --key-schema AttributeName=LockID,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST \
  --region "$AWS_REGION" \
  2>/dev/null || echo "✓ Table already exists"

echo "✅ Bootstrap complete! Terraform state backend is ready."
echo "📋 Bucket: $STATE_BUCKET"
echo "📋 Lock Table: $LOCK_TABLE"
echo "📋 Region: $AWS_REGION"
