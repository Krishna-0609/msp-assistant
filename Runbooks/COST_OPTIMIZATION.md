# MSP Assistant - Cost Optimization Strategy

## Executive Summary

**Target Baseline Cost:** $600-1,250/month  
**Target Optimized Cost:** $450-900/month (25-30% savings)  
**Optimization Techniques:** 15 key strategies

---

## 1. Compute Optimization (Lambda & ECS)

### Strategy 1.1: Lambda Memory Optimization

**Problem:** Default configurations often over-allocate memory.

**Solution:**
```yaml
Before:
  - Function: cost_analyzer
  - Memory: 1024 MB
  - Execution time: 8 seconds
  - Cost per invocation: $0.000017

After (Optimized):
  - Memory: 256 MB
  - Execution time: 12 seconds (still acceptable)
  - Cost per invocation: $0.000004
  - Savings: 75% per invocation
```

**Implementation:**
1. Profile each Lambda function with CloudWatch metrics
2. Identify memory at 30% utilization as baseline
3. Set to baseline + 10% buffer
4. Monitor execution time (keep < 60s)
5. Use Lambda Provisioned Concurrency only for cold-start critical functions

**Expected Savings:** 40-50% on Lambda compute costs

### Strategy 1.2: ECS Task Right-Sizing

**Problem:** Running t3.medium for 24/7 when traffic is low.

**Solution:**
```yaml
Before:
  - Task Size: t3.medium (1 vCPU, 2 GB RAM)
  - Desired Count: 2 (always running)
  - Monthly Cost: $60

After (Optimized):
  - Task Size: Fargate 256 CPU / 512 RAM (0.25 vCPU)
  - Auto-scaling: min=1, max=5
  - Average running: 1.5 tasks
  - Monthly Cost: $15
  - Savings: 75%
```

**Implementation:**
```hcl
# Terraform configuration
resource "aws_ecs_service" "api_backend" {
  name            = "msp-assistant-api"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.backend.arn
  desired_count   = 1  # Start low
  launch_type     = "FARGATE"
  
  deployment_configuration {
    maximum_percent         = 200
    minimum_healthy_percent = 100
  }
}

# Auto-scaling
resource "aws_appautoscaling_target" "ecs_target" {
  max_capacity       = 5
  min_capacity       = 1
  resource_id        = "service/msp-assistant/api-backend"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

resource "aws_appautoscaling_policy" "ecs_policy_cpu" {
  policy_name       = "cpu-autoscaling"
  policy_type       = "TargetTrackingScaling"
  resource_id       = aws_appautoscaling_target.ecs_target.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs_target.scalable_dimension
  service_namespace = aws_appautoscaling_target.ecs_target.service_namespace
  
  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value = 70.0
  }
}
```

**Expected Savings:** 50-70% on compute costs

### Strategy 1.3: Reserved Capacity for Predictable Workloads

**When to use:**
- ECS tasks running > 90% of the time
- Bedrock API calls with predictable volume
- Cognito with baseline users

**Cost Comparison:**
```
On-Demand:      $100/month
Reserved (1yr): $70/month (30% discount)
Reserved (3yr): $60/month (40% discount)
Annual savings: $360-480
```

---

## 2. Database Optimization (DynamoDB)

### Strategy 2.1: On-Demand vs Provisioned Billing

**DynamoDB Billing Model:**
```
On-Demand (PAY_PER_REQUEST):
  - Read: $1.25 per 1M units
  - Write: $6.25 per 1M units
  - No minimum charge
  - Best for: Unpredictable traffic

Provisioned:
  - Read: $0.47 per RCU-hour
  - Write: $2.37 per WCU-hour
  - Minimum: ~$10/month
  - Best for: Predictable, high-volume traffic

Hybrid (Recommendation):
  - Use On-Demand for: Chat messages (TTL: 10min), temporary cache
  - Use Provisioned for: Cost data cache (predictable 6h refresh)
```

**Implementation:**
```hcl
# Chat table - On-Demand (unpredictable)
resource "aws_dynamodb_table" "chat_requests" {
  name         = "msp-assistant-chat-requests"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "conversation_id"
  range_key    = "timestamp"
  
  ttl {
    attribute_name = "ttl"
    enabled        = true  # Auto-delete after 10 minutes
  }
}

# Cache table - Provisioned (predictable 6-hour refreshes)
resource "aws_dynamodb_table" "cost_cache" {
  name             = "cost-analysis-cache"
  billing_mode     = "PROVISIONED"
  read_capacity    = 5
  write_capacity   = 5
  hash_key         = "period"
  range_key        = "query_type"
  
  ttl {
    attribute_name = "ttl"
    enabled        = true  # Auto-delete after 6 hours
  }
}
```

**Expected Savings:** 30-40% on database costs

### Strategy 2.2: TTL & Auto-Cleanup

**Problem:** Tables grow unbounded, increasing storage costs.

**Solution:**
```python
# Backend service with TTL
class ChatService:
    def store_message(self, conversation_id, message):
        from datetime import datetime, timedelta
        import time
        
        # TTL: 10 minutes from now
        ttl = int((datetime.now() + timedelta(minutes=10)).timestamp())
        
        self.dynamodb.put_item(
            Item={
                'conversation_id': conversation_id,
                'timestamp': int(time.time()),
                'message': message,
                'ttl': ttl  # DynamoDB will auto-delete
            }
        )
```

**DynamoDB Storage Reduction:**
```
Before: 1,000 items (always stored)
After:  100 items (10-min TTL, auto-delete)
Storage: 1 GB → 100 MB (10x reduction)
Cost: $0.35/GB → $0.035/GB (~90% savings)
```

**Expected Savings:** 20-30% on storage costs

### Strategy 2.3: Query Optimization

**Problem:** Scanning entire table instead of using indexes.

**Bad Query (Scan - expensive):
```python
# This scans EVERY item in table
response = dynamodb.scan(
    FilterExpression='user_id = :uid',
    ExpressionAttributeValues={':uid': 'user-123'}
)
# Cost: proportional to total table size
```

**Good Query (GSI - efficient):
```python
# This uses Global Secondary Index
response = dynamodb.query(
    IndexName='user_id-index',
    KeyConditionExpression='user_id = :uid',
    ExpressionAttributeValues={':uid': 'user-123'}
)
# Cost: proportional to matching items only
```

**Expected Savings:** 50-80% on read units

---

## 3. Storage Optimization (S3)

### Strategy 3.1: Intelligent-Tiering

**Problem:** Reports stored in Standard class indefinitely.

**Solution:**
```yaml
Current State:
  - 100 reports stored
  - 90 are older than 30 days
  - All in Standard storage ($0.023 per GB)

Intelligent-Tiering Strategy:
  - Frequent: Last 7 days (accessed regularly)
  - Infrequent: 7-30 days (rarely accessed)
  - Archive: 30-90 days (compliance requirement)
  - Deep Archive: 90+ days (never accessed)

Cost Breakdown:
  - Frequent (10 reports): $0.023/GB
  - Infrequent (20 reports): $0.0125/GB (46% savings)
  - Archive (50 reports): $0.004/GB (83% savings)
  - Deep Archive (20 reports): $0.00099/GB (96% savings)

Monthly Savings: 60-70% on storage
```

**Implementation:**
```hcl
resource "aws_s3_bucket" "reports" {
  bucket = "msp-assistant-reports"
}

resource "aws_s3_bucket_intelligent_tiering_configuration" "reports" {
  bucket = aws_s3_bucket.reports.id
  name   = "EntireBucket"
  status = "Enabled"
  
  tiering {
    days          = 30
    access_tier   = "ARCHIVE_ACCESS"
  }
  
  tiering {
    days          = 90
    access_tier   = "DEEP_ARCHIVE_ACCESS"
  }
}

# Auto-delete very old reports
resource "aws_s3_bucket_lifecycle_configuration" "reports" {
  bucket = aws_s3_bucket.reports.id
  
  rule {
    id     = "delete-old-reports"
    status = "Enabled"
    
    expiration {
      days = 365  # Delete after 1 year
    }
  }
}
```

**Expected Savings:** 50-70% on storage costs

### Strategy 3.2: Compression & Deduplication

**Problem:** Report files are large, data transfer is expensive.

**Solution:**
```bash
# Compress reports before upload
gzip -9 report_april_2026.xlsx  # 9 = maximum compression
# Result: 12 MB → 2 MB (83% reduction)

# S3 Select to avoid transferring entire files
aws s3api select-object-content \
  --bucket msp-assistant-reports \
  --key "reports/april_2026.xlsx.gz" \
  --expression-type SQL \
  --expression "SELECT * FROM s3object WHERE cost > 1000" \
  --input-serialization '{"CSV": {}}' \
  --output-serialization '{"CSV": {}}'
```

**Expected Savings:** 40-60% on data transfer costs

---

## 4. Network Optimization (CloudFront & Data Transfer)

### Strategy 4.1: CloudFront Caching Strategy

**Problem:** Every page load downloads all assets from S3.

**Solution:**
```yaml
Current:
  - 1000 visits/day
  - Each downloads 3 MB of assets
  - Total transfer: 3 GB/day

Caching Strategy:
  - /js/* → 86400s (1 day)
  - /css/* → 86400s (1 day)
  - /images/* → 604800s (7 days)
  - index.html → 300s (5 minutes, for version updates)

Result:
  - Cache hit ratio: 95%
  - Actual transfer: 150 MB/day (95% reduction)
  - Cost: $0.08/GB to $0.01/GB
  - Monthly savings: $200-300
```

**Implementation:**
```hcl
resource "aws_cloudfront_distribution" "frontend" {
  enabled = true
  
  # Cache behavior for static assets
  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-frontend"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    min_ttl     = 0
    default_ttl = 86400
    max_ttl     = 31536000  # 1 year
    compress    = true
  }
  
  # Cache behavior for index.html
  ordered_cache_behavior {
    path_pattern     = "/index.html"
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "s3-frontend"
    
    forwarded_values {
      query_string = false
    }
    
    min_ttl     = 0
    default_ttl = 300  # 5 minutes
    max_ttl     = 900
    compress    = true
  }
}
```

**Expected Savings:** 70-80% on CloudFront costs

### Strategy 4.2: Compression at Edge

**Problem:** Uncompressed JSON/HTML wastes bandwidth.

**Solution:**
```yaml
File Sizes (with compression):
  - main.js (5 MB) → gzip (500 KB) → 90% reduction
  - main.css (2 MB) → gzip (150 KB) → 92.5% reduction
  - API response (1 MB) → gzip (100 KB) → 90% reduction

Yearly Savings:
  - 1,000 requests/day × 90% compression × 365 days
  - = 328 GB × $0.085/GB = $28/month
  - = $336/year
```

**Implementation (Terraform):**
```hcl
default_cache_behavior {
  compress = true  # Enable Brotli/Gzip automatically
}
```

**Expected Savings:** 20-30% on bandwidth costs

---

## 5. AI/ML Optimization (Bedrock)

### Strategy 5.1: Batch API for Non-Real-Time Requests

**Problem:** Running each request separately at full price.

**Solution:**
```python
# Real-time requests: Use invoke_model (on-demand pricing)
response = bedrock_client.invoke_model(
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    body=json.dumps({
        "max_tokens": 500,
        "messages": [{"role": "user", "content": query}]
    })
)
# Cost: $0.003 per 1K input tokens

# Batch requests (overnight reports): Use batch API (50% discount)
bedrock_client.create_model_invocation_job(
    jobName="daily-report-generation",
    modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
    inputDataConfig={
        "s3InputFormat": "JSONL",
        "s3Uri": "s3://bucket/batch-inputs.jsonl"
    },
    outputDataConfig={
        "s3OutputFormat": "JSONL",
        "s3Uri": "s3://bucket/batch-outputs.jsonl"
    }
)
# Cost: $0.0015 per 1K input tokens (50% discount)
```

**Expected Savings:** 30-50% on LLM costs for batch operations

### Strategy 5.2: Model Selection Optimization

**Token Cost Comparison:**
```yaml
Claude 3.5 Haiku (lightweight):
  Input:  $0.00080 per 1K tokens
  Output: $0.00240 per 1K tokens
  Response time: ~500ms
  Suitable for: Simple queries, classifications

Claude 3.5 Sonnet (recommended):
  Input:  $0.003 per 1K tokens
  Output: $0.015 per 1K tokens
  Response time: ~1s
  Suitable for: Complex analysis, optimization

Claude 3 Opus (heavy):
  Input:  $0.015 per 1K tokens
  Output: $0.075 per 1K tokens
  Response time: ~2s
  Suitable for: Very complex reasoning
```

**Strategy:**
```python
def select_model_for_query(query: str):
    if query in ["simple", "status", "classification"]:
        return "claude-3-5-haiku"  # 70% cheaper
    elif query in ["analysis", "recommendation", "forecast"]:
        return "claude-3-5-sonnet"  # Balanced
    else:
        return "claude-3-opus"  # For complex reasoning
```

**Expected Savings:** 30-40% by using right-sized models

### Strategy 5.3: Prompt Optimization

**Problem:** Verbose prompts waste tokens.

**Before (200 tokens):
```
You are an AWS Cost Analysis Specialist. Your job is to analyze 
AWS costs and provide recommendations. You have access to cost 
data from AWS Cost Explorer. Please analyze the following query 
and provide insights.

User Query: What services cost the most?
```

**After (50 tokens):
```
Analyze AWS costs. Top expensive services?

Cost data: <data>
```

**Savings:** 75% fewer tokens per request

**Expected Savings:** 20-30% on LLM costs

---

## 6. Monitoring Cost Optimization (CloudWatch)

### Strategy 6.1: Selective Log Retention

**Problem:** Storing all logs for 30 days.

**Solution:**
```yaml
Current Costs:
  - 1 GB/day of logs
  - 30-day retention
  - Cost: 1 GB × 30 × $0.50 = $15/month

Optimized:
  - DEBUG logs: 3-day retention ($0.45)
  - INFO logs: 7-day retention ($1.05)
  - ERROR logs: 30-day retention ($2.10)
  - CRITICAL logs: 90-day retention ($6.30)
  - Total: ~$9.90/month (34% savings)
```

**Implementation:**
```hcl
resource "aws_cloudwatch_log_group" "backend" {
  name              = "/ecs/msp-assistant-backend"
  retention_in_days = 7  # Reduced from 30
}

resource "aws_cloudwatch_log_group" "errors" {
  name              = "/ecs/msp-assistant-errors"
  retention_in_days = 30  # Keep errors longer
}
```

**Expected Savings:** 50-70% on CloudWatch Logs costs

### Strategy 6.2: Metrics instead of Logs

**Problem:** Shipping raw logs for every event.

**Solution:**
```python
# Bad: Log every API call (expensive)
logger.info(f"User {user_id} called endpoint {endpoint}")

# Good: Use CloudWatch metrics
cloudwatch.put_metric_data(
    Namespace='MSPAssistant',
    MetricData=[
        {
            'MetricName': 'APICallCount',
            'Value': 1,
            'Unit': 'Count',
            'Dimensions': [
                {'Name': 'Endpoint', 'Value': endpoint}
            ]
        }
    ]
)
# 1 metric = $0.10/month
# 1 log = $0.50 per GB
```

**Expected Savings:** 80-90% for high-volume events

---

## 7. Advanced Optimization: Reserved Capacity

### Strategy 7.1: AWS Compute Savings Plan

**When:**
- ECS running predictably > 90% of time
- CloudFront with baseline traffic
- Bedrock with predictable daily tokens

**Example:**
```
Annual Savings Plan:
  - 1 vCPU Fargate: $350/year (40% discount)
  - 1 GB Fargate: $700/year (40% discount)
  - Total: $1,050/year = $87.50/month

Current on-demand: $150/month
Savings: $62.50/month = $750/year
Breakeven: 1.4 months
```

---

## 8. Cost Monitoring & Optimization Automation

### Strategy 8.1: AWS Cost Anomaly Detection

```hcl
resource "aws_ce_anomaly_monitor" "msp_assistant" {
  name          = "msp-assistant-anomalies"
  monitor_type  = "DIMENSIONAL"
  monitor_dimension = "SERVICE"
  
  monitor_specification {
    or_dimensions {
      dimension {
        key          = "SERVICE"
        values       = ["Amazon DynamoDB", "AWS Lambda", "Amazon CloudFront"]
      }
    }
  }
}

resource "aws_ce_anomaly_subscription" "msp_alerts" {
  frequency      = "DAILY"
  monitor_arn    = aws_ce_anomaly_monitor.msp_assistant.arn
  sns_topic_arn  = aws_sns_topic.cost_alerts.arn
  threshold      = 100  # Alert if cost variance > $100
  
  subscriber_email_addresses = ["finance@company.com"]
}
```

**Cost:** Free (AWS native feature)  
**Benefit:** Automatic anomaly detection and alerts

---

## Summary: Cost Optimization Roadmap

### Phase 1 (Week 1): Quick Wins ($100-200/month savings)
- [ ] Lambda memory optimization (Profiling)
- [ ] DynamoDB TTL enablement
- [ ] CloudFront cache TTL optimization
- [ ] CloudWatch log retention reduction

### Phase 2 (Week 2): Infrastructure Optimization ($100-300/month savings)
- [ ] ECS auto-scaling implementation
- [ ] S3 Intelligent-Tiering configuration
- [ ] Bedrock model selection optimization
- [ ] API compression enablement

### Phase 3 (Week 3): Advanced Optimization ($100-200/month savings)
- [ ] DynamoDB provisioned vs on-demand hybrid
- [ ] Bedrock batch API for non-real-time jobs
- [ ] Reserved capacity evaluation
- [ ] Cost anomaly detection setup

### Expected Results:
```
Baseline (Month 0):         $900/month
After Phase 1 (Month 1):    $750/month (-17%)
After Phase 2 (Month 2):    $550/month (-39%)
After Phase 3 (Month 3):    $400/month (-56%)

Annual savings: ~$6,000-7,200
```

---

## Continuous Cost Optimization

### Monthly Tasks:
- [ ] Review CloudWatch cost metrics
- [ ] Check for unused resources (Lambda, RDS, etc.)
- [ ] Validate cache hit ratios
- [ ] Review DynamoDB auto-scaling

### Quarterly Review:
- [ ] Analyze cost trends (AWS Cost Explorer)
- [ ] Evaluate reserved capacity ROI
- [ ] Benchmark against similar services
- [ ] Plan next optimization cycle

---

**Version:** 1.0  
**Last Updated:** 2026-05-14  
**Expected ROI:** 25-30% cost reduction within 8 weeks
