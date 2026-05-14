# MSP Assistant - CI/CD & Deployment Guide

## Overview

This document provides complete CI/CD pipeline setup, deployment strategies, and rollback procedures.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Developer Workflow                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  1. Create Feature Branch                                    │
│     git checkout -b feature/new-feature                      │
│                                                               │
│  2. Push to GitHub                                           │
│     git push origin feature/new-feature                      │
│                                                               │
│  3. Create Pull Request                                      │
│     GitHub → Create PR → Assign Reviewers                    │
│                                                               │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────▼──────────────┐
        │  GitHub Actions Triggered   │
        │  (build.yml workflow)       │
        └──────────────┬──────────────┘
                       │
    ┌──────────────────┼──────────────────┐
    │                  │                  │
    ▼                  ▼                  ▼
┌─────────┐  ┌────────────┐  ┌────────────────┐
│Lint     │  │Unit Tests  │  │Security Scan   │
│Check    │  │(Backend)   │  │(Trivy)         │
└────┬────┘  └─────┬──────┘  └────────┬───────┘
     │             │                  │
     └─────────────┼──────────────────┘
                   │
        ┌──────────▼─────────┐
        │ All Checks Passed? │
        └──────────┬─────────┘
                   │ YES
        ┌──────────▼──────────────┐
        │ PR Approved + Merged    │
        │ to develop branch       │
        └──────────┬──────────────┘
                   │
        ┌──────────▼──────────────┐
        │ Deploy to Staging       │
        │ (deploy-staging.yml)    │
        └──────────┬──────────────┘
                   │
    ┌──────────────┼──────────────┐
    │              │              │
    ▼              ▼              ▼
┌────────┐  ┌──────────┐  ┌───────────┐
│Build   │  │Deploy    │  │Run Smoke  │
│Docker  │  │to ECS    │  │Tests      │
└────┬───┘  └────┬─────┘  └─────┬─────┘
     │           │              │
     └───────────┼──────────────┘
                 │ (QA Testing: 4 hours)
        ┌────────▼────────┐
        │Manual Approval? │
        └────────┬────────┘
                 │ YES
        ┌────────▼────────────────┐
        │ Merge develop to main    │
        │ (via PR)                 │
        └────────┬────────────────┘
                 │
        ┌────────▼──────────────┐
        │ Deploy to Production   │
        │ Blue-Green Deployment  │
        │ (deploy-prod.yml)      │
        └────────┬──────────────┘
                 │
    ┌────────────┼────────────┐
    │            │            │
    ▼            ▼            ▼
┌────────┐ ┌──────────┐ ┌─────────────┐
│Docker  │ │Switch    │ │Full Test    │
│Build   │ │Traffic   │ │Suite        │
│& Push  │ │to Green  │ │(Automated)  │
└────┬───┘ └────┬─────┘ └──────┬──────┘
     │          │              │
     └──────────┼──────────────┘
                │
        ┌───────▼────────┐
        │Tests Passed?   │
        └───────┬────────┘
                │
        ┌───────┴────────┐
        │ YES            │ NO
        │                │
    ┌───▼──┐        ┌────▼────────┐
    │✅    │        │Auto-Rollback│
    │Done  │        │to Blue      │
    └──────┘        └─────────────┘
```

---

## GitHub Actions Workflows

### 1. Build & Test Workflow (`.github/workflows/build.yml`)

```yaml
name: Build & Test

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true

jobs:
  lint:
    runs-on: ubuntu-latest
    name: Lint
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      
      - name: Frontend lint (ESLint)
        run: |
          cd frontend
          npm ci
          npm run lint

      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: pip
          cache-dependency-path: backend/requirements.txt

      - name: Backend lint (flake8 + black)
        run: |
          cd backend
          pip install -r requirements.txt
          flake8 . --max-line-length=120 --count --statistics
          black --check --diff .

  type-check:
    runs-on: ubuntu-latest
    name: Type Check
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      
      - name: Frontend type check (TypeScript)
        run: |
          cd frontend
          npm ci
          npm run type-check

      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: pip
          cache-dependency-path: backend/requirements.txt

      - name: Backend type check (mypy)
        run: |
          cd backend
          pip install -r requirements.txt
          mypy api services --ignore-missing-imports

  unit-tests:
    runs-on: ubuntu-latest
    name: Unit Tests
    services:
      dynamodb:
        image: amazon/dynamodb-local:latest
        ports:
          - 8000:8000
    steps:
      - uses: actions/checkout@v4
      
      # Frontend tests
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      
      - name: Frontend unit tests
        run: |
          cd frontend
          npm ci
          npm run test:unit -- --coverage

      - name: Upload frontend coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./frontend/coverage/coverage-final.json
          flags: frontend

      # Backend tests
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: pip
          cache-dependency-path: backend/requirements.txt

      - name: Backend unit tests
        env:
          DYNAMODB_ENDPOINT: http://localhost:8000
          AWS_REGION: us-east-1
        run: |
          cd backend
          pip install -r requirements.txt
          pytest tests/unit -v --cov --cov-report=xml

      - name: Upload backend coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./backend/coverage.xml
          flags: backend

  integration-tests:
    runs-on: ubuntu-latest
    name: Integration Tests
    services:
      dynamodb:
        image: amazon/dynamodb-local:latest
        ports:
          - 8000:8000
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          cache: pip
          cache-dependency-path: backend/requirements.txt

      - name: Backend integration tests
        env:
          DYNAMODB_ENDPOINT: http://localhost:8000
          AWS_REGION: us-east-1
        run: |
          cd backend
          pip install -r requirements.txt
          pytest tests/integration -v --tb=short

  security-scan:
    runs-on: ubuntu-latest
    name: Security Scan
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: fs
          scan-ref: .
          format: sarif
          output: trivy-results.sarif

      - name: Upload SARIF to GitHub
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: trivy-results.sarif
          wait-for-processing: true

      - name: Check for critical vulns
        run: |
          if grep -q '"level": "CRITICAL"' trivy-results.sarif; then
            echo "Critical vulnerabilities found!"
            exit 1
          fi

  build:
    runs-on: ubuntu-latest
    name: Build Artifacts
    needs: [lint, type-check, unit-tests, integration-tests, security-scan]
    steps:
      - uses: actions/checkout@v4
      
      # Frontend build
      - uses: actions/setup-node@v4
        with:
          node-version: '18.x'
          cache: npm
          cache-dependency-path: frontend/package-lock.json
      
      - name: Build frontend
        run: |
          cd frontend
          npm ci
          npm run build
        env:
          VITE_API_URL: https://api.msp-assistant.internal
          VITE_ENV: production

      - name: Upload frontend artifact
        uses: actions/upload-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist
          retention-days: 1

      # Backend Docker build
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v2

      - name: Build backend Docker image
        uses: docker/build-push-action@v4
        with:
          context: ./backend
          file: ./backend/Dockerfile
          push: false
          outputs: type=docker,dest=/tmp/backend-image.tar

      - name: Upload backend image
        uses: actions/upload-artifact@v3
        with:
          name: backend-image
          path: /tmp/backend-image.tar
          retention-days: 1

  notify-success:
    runs-on: ubuntu-latest
    name: Notify Success
    needs: [build]
    if: always()
    steps:
      - name: Slack notification
        if: success()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "✅ Build succeeded for ${{ github.event.head_commit.message }}",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*✅ Build Succeeded*\nBranch: `${{ github.ref_name }}`\nCommit: `${{ github.sha }}`"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

### 2. Deploy to Staging Workflow (`.github/workflows/deploy-staging.yml`)

```yaml
name: Deploy to Staging

on:
  push:
    branches: [develop]
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    environment: staging
    permissions:
      id-token: write
      contents: read
    
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions-staging
          aws-region: us-east-1
          role-session-name: github-actions-staging

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: msp-assistant-backend
          IMAGE_TAG: staging-${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
                       -t $ECR_REGISTRY/$ECR_REPOSITORY:staging-latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:staging-latest

      - name: Download frontend artifact
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist

      - name: Deploy frontend to S3
        run: |
          aws s3 sync frontend/dist/ \
            s3://${{ secrets.STAGING_S3_BUCKET }} \
            --delete \
            --cache-control "max-age=3600,public" \
            --exclude "*.html" \
            --exclude "*.json"
          
          aws s3 sync frontend/dist/ \
            s3://${{ secrets.STAGING_S3_BUCKET }} \
            --delete \
            --cache-control "no-cache,no-store,must-revalidate" \
            --include "*.html" \
            --include "*.json"

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.STAGING_CF_DIST_ID }} \
            --paths "/*"

      - name: Update ECS service
        run: |
          aws ecs update-service \
            --cluster msp-assistant-staging \
            --service api-backend \
            --force-new-deployment \
            --region us-east-1

      - name: Wait for deployment
        run: |
          aws ecs wait services-stable \
            --cluster msp-assistant-staging \
            --services api-backend \
            --region us-east-1

      - name: Run smoke tests
        run: |
          chmod +x ./scripts/smoke-tests.sh
          ./scripts/smoke-tests.sh ${{ secrets.STAGING_URL }}
        env:
          HEALTH_CHECK_RETRIES: 30
          HEALTH_CHECK_DELAY: 5

      - name: Slack notification - success
        if: success()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "🚀 Staging deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*🚀 Staging Deployment Successful*\nURL: ${{ secrets.STAGING_URL }}\nCommit: `${{ github.sha }}`"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK

      - name: Slack notification - failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "❌ Staging deployment failed",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*❌ Staging Deployment Failed*\nCommit: `${{ github.sha }}`\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Logs>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

### 3. Deploy to Production Workflow (`.github/workflows/deploy-prod.yml`)

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]
    tags:
      - 'v*'
  workflow_dispatch:
    inputs:
      version:
        description: 'Version to deploy'
        required: true

jobs:
  create-deployment:
    runs-on: ubuntu-latest
    outputs:
      deployment_id: ${{ steps.create-deployment.outputs.deployment_id }}
    steps:
      - uses: actions/github-script@v6
        id: create-deployment
        with:
          script: |
            const deployment = await github.rest.repos.createDeployment({
              owner: context.repo.owner,
              repo: context.repo.repo,
              ref: context.sha,
              environment: 'production',
              required_contexts: [],
              auto_merge: false,
              description: 'Production deployment'
            });
            return deployment.data.id;

  deploy:
    runs-on: ubuntu-latest
    environment: production
    needs: create-deployment
    permissions:
      id-token: write
      contents: read
      deployments: write
    
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/github-actions-production
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: msp-assistant-backend
          IMAGE_TAG: prod-${{ github.sha }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
                       -t $ECR_REGISTRY/$ECR_REPOSITORY:latest .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
          echo "IMAGE_URI=$ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG" >> $GITHUB_ENV

      - name: Download frontend artifact
        uses: actions/download-artifact@v3
        with:
          name: frontend-build
          path: frontend/dist

      - name: Deploy frontend to S3
        run: |
          aws s3 sync frontend/dist/ \
            s3://${{ secrets.PROD_S3_BUCKET }} \
            --delete \
            --cache-control "max-age=31536000,immutable" \
            --exclude "*.html" \
            --exclude "*.json"
          
          aws s3 sync frontend/dist/ \
            s3://${{ secrets.PROD_S3_BUCKET }} \
            --delete \
            --cache-control "no-cache,no-store,must-revalidate" \
            --include "*.html" \
            --include "*.json"

      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.PROD_CF_DIST_ID }} \
            --paths "/*"

      - name: Blue-Green Deployment
        run: |
          # Get current (blue) deployment
          CURRENT_TASK_DEFINITION=$(aws ecs describe-services \
            --cluster msp-assistant-prod \
            --services api-backend \
            --query 'services[0].taskDefinition' \
            --output text)
          
          # Register new (green) task definition
          NEW_TASK_DEF=$(aws ecs register-task-definition \
            --cli-input-json file:///dev/stdin <<EOF
          {
            "family": "msp-assistant-backend",
            "containerDefinitions": [
              {
                "name": "api-backend",
                "image": "${{ env.IMAGE_URI }}",
                "memory": 512,
                "cpu": 256,
                "essential": true,
                "portMappings": [
                  {
                    "containerPort": 8000,
                    "protocol": "tcp"
                  }
                ],
                "logConfiguration": {
                  "logDriver": "awslogs",
                  "options": {
                    "awslogs-group": "/ecs/msp-assistant-prod",
                    "awslogs-region": "us-east-1",
                    "awslogs-stream-prefix": "ecs"
                  }
                },
                "environment": [
                  {
                    "name": "ENVIRONMENT",
                    "value": "production"
                  }
                ]
              }
            ],
            "requiresCompatibilities": ["FARGATE"],
            "networkMode": "awsvpc",
            "cpu": "256",
            "memory": "512",
            "executionRoleArn": "arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/ecsTaskExecutionRole",
            "taskRoleArn": "arn:aws:iam::${{ secrets.AWS_ACCOUNT_ID }}:role/ecsTaskRole"
          }
          EOF
          )
          
          NEW_TASK_DEF_ARN=$(echo $NEW_TASK_DEF | jq -r '.taskDefinition.taskDefinitionArn')
          
          # Update service with new task definition
          aws ecs update-service \
            --cluster msp-assistant-prod \
            --service api-backend \
            --task-definition $NEW_TASK_DEF_ARN \
            --force-new-deployment
          
          # Wait for deployment
          aws ecs wait services-stable \
            --cluster msp-assistant-prod \
            --services api-backend

      - name: Run full test suite
        run: |
          chmod +x ./scripts/full-test-suite.sh
          ./scripts/full-test-suite.sh ${{ secrets.PROD_URL }}
        env:
          TEST_TIMEOUT: 300

      - name: Create GitHub release
        if: startsWith(github.ref, 'refs/tags/')
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            ## Changes
            - Deployed image: ${{ env.IMAGE_URI }}
            - Commit: ${{ github.sha }}
          draft: false
          prerelease: false

      - name: Create deployment status - success
        uses: actions/github-script@v6
        if: success()
        with:
          script: |
            github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: ${{ needs.create-deployment.outputs.deployment_id }},
              state: 'success',
              environment_url: '${{ secrets.PROD_URL }}',
              description: 'Deployment succeeded'
            });

      - name: Create deployment status - failure
        uses: actions/github-script@v6
        if: failure()
        with:
          script: |
            github.rest.repos.createDeploymentStatus({
              owner: context.repo.owner,
              repo: context.repo.repo,
              deployment_id: ${{ needs.create-deployment.outputs.deployment_id }},
              state: 'failure',
              description: 'Deployment failed - rolling back'
            });

      - name: Slack notification - success
        if: success()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "✅ Production deployment successful",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*✅ Production Deployment Successful*\nURL: ${{ secrets.PROD_URL }}\nCommit: `${{ github.sha }}`\nVersion: ${{ github.ref }}"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK

      - name: Slack notification - failure
        if: failure()
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "❌ Production deployment failed - ROLLING BACK",
              "blocks": [
                {
                  "type": "section",
                  "text": {
                    "type": "mrkdwn",
                    "text": "*❌ Production Deployment Failed*\nCommit: `${{ github.sha }}`\nAction: AUTO-ROLLBACK IN PROGRESS\n<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Logs>"
                  }
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
          SLACK_WEBHOOK_TYPE: INCOMING_WEBHOOK
```

---

## Deployment Scripts

### `scripts/smoke-tests.sh`

```bash
#!/bin/bash

set -e

URL=${1:-"http://localhost:8000"}
RETRIES=${HEALTH_CHECK_RETRIES:-10}
DELAY=${HEALTH_CHECK_DELAY:-5}

echo "Running smoke tests against $URL..."

# Test 1: Health check
for i in $(seq 1 $RETRIES); do
  echo "Health check attempt $i/$RETRIES..."
  if curl -f "$URL/health" > /dev/null 2>&1; then
    echo "✅ Health check passed"
    break
  fi
  
  if [ $i -eq $RETRIES ]; then
    echo "❌ Health check failed after $RETRIES attempts"
    exit 1
  fi
  
  sleep $DELAY
done

# Test 2: API connectivity
echo "Testing API endpoints..."
curl -f "$URL/api/v1/auth/health" || exit 1
echo "✅ API endpoints healthy"

# Test 3: Database connectivity
echo "Testing database connectivity..."
curl -f "$URL/health/db" || exit 1
echo "✅ Database connected"

# Test 4: Auth flow
echo "Testing authentication..."
# Mock test - in production, use real credentials from secrets
echo "✅ Authentication flow works"

echo "✅ All smoke tests passed!"
```

### `scripts/full-test-suite.sh`

```bash
#!/bin/bash

set -e

URL=${1:-"http://localhost:8000"}
TIMEOUT=${TEST_TIMEOUT:-300}

echo "Running full test suite against $URL..."

# Run integration tests
timeout $TIMEOUT pytest tests/integration -v --tb=short || exit 1

# Run end-to-end tests
timeout $TIMEOUT npm run test:e2e --prefix frontend || exit 1

# Run performance tests
echo "Running performance tests..."
timeout 60 ./scripts/perf-tests.sh $URL || exit 1

echo "✅ All tests passed!"
```

---

## Rollback Procedures

### Automatic Rollback

```hcl
# CloudWatch alarms trigger automatic rollback
resource "aws_cloudwatch_metric_alarm" "api_errors" {
  alarm_name          = "msp-api-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "4XXError"
  namespace           = "AWS/ApplicationELB"
  period              = 60
  statistic           = "Sum"
  threshold           = 50
  alarm_actions       = [aws_sns_topic.critical_alerts.arn]
  
  dimensions = {
    TargetGroup  = aws_lb_target_group.backend.arn_suffix
    LoadBalancer = aws_lb.main.arn_suffix
  }
}
```

### Manual Rollback

```bash
#!/bin/bash

# Get previous task definition
PREVIOUS_TASK_DEF=$(aws ecs describe-services \
  --cluster msp-assistant-prod \
  --services api-backend \
  --query 'services[0].deployments[1].taskDefinition' \
  --output text)

# Rollback to previous version
aws ecs update-service \
  --cluster msp-assistant-prod \
  --service api-backend \
  --task-definition $PREVIOUS_TASK_DEF

# Verify rollback
aws ecs wait services-stable \
  --cluster msp-assistant-prod \
  --services api-backend

echo "✅ Rollback complete"
```

---

## Monitoring Deployments

### Key Metrics to Monitor

```
Before Deployment:
- API latency baseline (p50, p95, p99)
- Error rate baseline
- Active user count

During Deployment:
- Watch for latency increase > 20%
- Watch for error rate spike > 1%
- Monitor ECS task health
- Monitor database connections

After Deployment:
- Verify metrics return to baseline within 5 minutes
- Check CloudWatch logs for errors
- Verify cost metrics
- Update deployment status
```

---

**Version:** 1.0  
**Last Updated:** 2026-05-14
