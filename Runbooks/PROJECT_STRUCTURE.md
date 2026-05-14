# MSP Assistant - Complete Project Structure & Setup Guide

## Quick Start (15 minutes)

```bash
# Clone and setup
git clone <repo> && cd msp-assistant

# Local development
docker-compose up -d  # Start all services locally

# Access:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Directory Structure & File Details

### Root Level

```
msp-assistant/
├── backend/                    # FastAPI application
├── frontend/                   # React TypeScript SPA
├── infrastructure/             # Terraform + Docker
├── scripts/                    # Deployment & utility scripts
├── tests/                      # Test suites
├── .github/                    # GitHub Actions workflows
├── docker-compose.yml          # Local dev environment
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── README.md                   # Project overview
├── DEPLOYMENT.md               # Deployment procedures
├── IMPLEMENTATION_PLAN.md      # This file
└── PROJECT_STRUCTURE.md        # This file
```

---

## Backend Structure

### `backend/api/main.py` - FastAPI Entry Point

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
import logging
from contextlib import asynccontextmanager

# Import routers
from api.routes import auth, chat, costs, reports, admin, health
from api.middleware import logging_middleware, auth_middleware, error_handler

# Setup logging
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Application starting up...")
    yield
    # Shutdown
    logger.info("Application shutting down...")

app = FastAPI(
    title="MSP Assistant API",
    description="AWS Cost Intelligence Platform",
    version="1.0.0",
    lifespan=lifespan
)

# Middleware
app.add_middleware(TrustedHostMiddleware, allowed_hosts=["*"])
app.add_middleware(CORSMiddleware,
    allow_origins=["https://d1l4t01n11d7fg.cloudfront.net"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)
app.middleware("http")(logging_middleware)
app.middleware("http")(auth_middleware)

# Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(chat.router, prefix="/api/v1/chat", tags=["chat"])
app.include_router(costs.router, prefix="/api/v1/costs", tags=["costs"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["admin"])
app.include_router(health.router, prefix="/health", tags=["health"])

# Error handlers
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    return error_handler(exc)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

### `backend/api/routes/chat.py` - Chat Endpoints

```python
from fastapi import APIRouter, Depends, HTTPException, WebSocket
from typing import List, Optional
from pydantic import BaseModel
from api.dependencies import get_current_user
from api.services.bedrock import bedrock_service
from api.services.cache import cache_service
import uuid
import json

router = APIRouter()

class ChatMessage(BaseModel):
    conversation_id: str
    message: str
    user_id: str
    timestamp: str

class ChatResponse(BaseModel):
    message_id: str
    response: str
    confidence: float
    tokens_used: int

@router.post("/message")
async def send_message(
    payload: ChatMessage,
    current_user = Depends(get_current_user)
) -> ChatResponse:
    """Send message to AI agent"""
    
    try:
        # Validate and sanitize input
        message = payload.message.strip()
        if not message or len(message) > 5000:
            raise HTTPException(status_code=400, detail="Invalid message")
        
        # Store in DynamoDB
        message_id = f"msg-{uuid.uuid4()}"
        await store_message(payload.conversation_id, message_id, "user", message)
        
        # Invoke supervisor agent
        agent_response = await bedrock_service.invoke_supervisor(
            query=message,
            user_context={"user_id": current_user.id, "role": current_user.role},
            conversation_history=await get_conversation_history(payload.conversation_id)
        )
        
        # Store response
        response_id = f"msg-{uuid.uuid4()}"
        await store_message(
            payload.conversation_id,
            response_id,
            "assistant",
            agent_response["text"],
            confidence=agent_response["confidence"],
            tokens=agent_response["tokens_used"]
        )
        
        return ChatResponse(
            message_id=response_id,
            response=agent_response["text"],
            confidence=agent_response["confidence"],
            tokens_used=agent_response["tokens_used"]
        )
    
    except Exception as e:
        logger.error(f"Error in send_message: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to process message")

@router.get("/history")
async def get_history(
    limit: int = 50,
    offset: int = 0,
    current_user = Depends(get_current_user)
) -> List[dict]:
    """Get chat history for user"""
    return await get_user_conversations(current_user.id, limit, offset)

@router.websocket("/ws/{conversation_id}")
async def websocket_endpoint(websocket: WebSocket, conversation_id: str):
    """WebSocket for real-time chat streaming"""
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            
            # Stream response
            async for chunk in bedrock_service.invoke_stream(message["query"]):
                await websocket.send_json({"chunk": chunk})
    
    except Exception as e:
        logger.error(f"WebSocket error: {str(e)}")
        await websocket.close(code=1000)
```

### `backend/services/bedrock.py` - Bedrock Agent Service

```python
import boto3
import json
from typing import AsyncGenerator
from services.cost_explorer import cost_explorer_service

bedrock_client = boto3.client('bedrock-agent-runtime')

class BedrockService:
    
    async def invoke_supervisor(
        self,
        query: str,
        user_context: dict,
        conversation_history: list
    ) -> dict:
        """Route query to appropriate specialist agent"""
        
        # Classify query intent
        intent = self._classify_intent(query)
        
        # Route to specialist
        if intent == "cost_analysis":
            return await self._invoke_cost_specialist(query, conversation_history)
        elif intent == "optimization":
            return await self._invoke_optimization_specialist(query)
        elif intent == "billing":
            return await self._invoke_billing_specialist(query)
        elif intent == "security":
            return await self._invoke_security_specialist(query)
        else:
            return await self._invoke_general_response(query)
    
    async def _invoke_cost_specialist(self, query: str, history: list) -> dict:
        """Cost Analysis Specialist Agent"""
        
        # Get cost data
        costs = await cost_explorer_service.get_costs_breakdown()
        
        prompt = f"""
        You are an AWS Cost Analysis Specialist. Analyze the following query
        based on the cost data provided.
        
        User Query: {query}
        
        Cost Data:
        {json.dumps(costs, indent=2)}
        
        Conversation History:
        {json.dumps(history[-3:], indent=2)}  # Last 3 messages
        
        Provide:
        1. Direct answer to the query
        2. Key insights from the data
        3. Recommendations (if applicable)
        4. Confidence score (0-100)
        
        Format response as JSON with fields: text, confidence, recommendations
        """
        
        response = bedrock_client.invoke_model(
            modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-06-01",
                "max_tokens": 500,
                "messages": [{"role": "user", "content": prompt}]
            })
        )
        
        result = json.loads(response['body'].read())
        return {
            "text": result["content"][0]["text"],
            "confidence": 85,  # Extract from response
            "tokens_used": result.get("usage", {}).get("output_tokens", 0)
        }
    
    async def invoke_stream(self, query: str) -> AsyncGenerator[str, None]:
        """Stream response from Bedrock"""
        
        response = bedrock_client.invoke_model_with_response_stream(
            modelId="anthropic.claude-3-5-sonnet-20241022-v2:0",
            body=json.dumps({
                "anthropic_version": "bedrock-2023-06-01",
                "max_tokens": 500,
                "messages": [{"role": "user", "content": query}]
            })
        )
        
        for event in response['body']:
            if 'contentBlockDelta' in event:
                chunk = event['contentBlockDelta']['delta']['text']
                yield chunk

bedrock_service = BedrockService()
```

### `backend/services/cost_explorer.py` - Cost Data Service

```python
import boto3
from datetime import datetime, timedelta
from typing import Dict, List
import json
from services.cache import cache_service

ce_client = boto3.client('ce')

class CostExplorerService:
    
    async def get_costs_breakdown(self, days: int = 30) -> Dict:
        """Get service breakdown with caching"""
        
        # Check cache first
        cache_key = f"costs_breakdown_{days}d"
        cached = await cache_service.get(cache_key)
        if cached:
            return cached
        
        # Query AWS Cost Explorer
        end_date = datetime.now().date()
        start_date = end_date - timedelta(days=days)
        
        response = ce_client.get_cost_and_usage(
            TimePeriod={
                'Start': start_date.isoformat(),
                'End': end_date.isoformat()
            },
            Granularity='DAILY',
            Metrics=['UnblendedCost'],
            GroupBy=[{'Type': 'DIMENSION', 'Key': 'SERVICE'}],
            Filter={
                'Dimensions': {
                    'Key': 'PURCHASE_TYPE',
                    'Values': ['On Demand', 'Reserved']
                }
            }
        )
        
        # Process results
        services = {}
        total_cost = 0
        
        for result in response['ResultsByTime']:
            for group in result['Groups']:
                service = group['Keys'][0]
                cost = float(group['Metrics']['UnblendedCost']['Amount'])
                
                if service not in services:
                    services[service] = {
                        'cost': 0,
                        'days': 0,
                        'average': 0
                    }
                
                services[service]['cost'] += cost
                total_cost += cost
        
        # Calculate percentages and averages
        for service in services:
            services[service]['percentage'] = (services[service]['cost'] / total_cost * 100) \
                if total_cost > 0 else 0
            services[service]['average'] = services[service]['cost'] / days
        
        result = {
            'total_cost': total_cost,
            'services': services,
            'generated_at': datetime.now().isoformat(),
            'period_days': days
        }
        
        # Cache for 6 hours
        await cache_service.set(cache_key, result, ttl=21600)
        
        return result
    
    async def get_anomalies(self, baseline_days: int = 90) -> List[Dict]:
        """Detect cost anomalies"""
        
        # Get historical data
        costs = await self.get_daily_costs(baseline_days)
        
        # Calculate baseline
        import statistics
        daily_costs = [c['cost'] for c in costs]
        mean = statistics.mean(daily_costs)
        stdev = statistics.stdev(daily_costs) if len(daily_costs) > 1 else 0
        threshold = mean + (2 * stdev)
        
        # Detect anomalies
        anomalies = []
        for cost in costs[-7:]:  # Last 7 days
            if cost['cost'] > threshold:
                anomalies.append({
                    'date': cost['date'],
                    'cost': cost['cost'],
                    'deviation': ((cost['cost'] - mean) / mean * 100),
                    'severity': 'high' if cost['cost'] > threshold * 1.5 else 'medium'
                })
        
        return anomalies

cost_explorer_service = CostExplorerService()
```

### `backend/services/cache.py` - Caching Service

```python
import boto3
import json
from datetime import datetime, timedelta
from typing import Any, Optional

dynamodb = boto3.resource('dynamodb')
cache_table = dynamodb.Table('cost-analysis-cache')

class CacheService:
    
    async def get(self, key: str) -> Optional[Any]:
        """Get from cache"""
        try:
            response = cache_table.get_item(Key={'cache_key': key})
            if 'Item' in response:
                return json.loads(response['Item']['cache_value'])
        except Exception as e:
            logger.error(f"Cache get error: {e}")
        return None
    
    async def set(self, key: str, value: Any, ttl: int = 3600) -> bool:
        """Set cache with TTL (seconds)"""
        try:
            expiration = int((datetime.now() + timedelta(seconds=ttl)).timestamp())
            cache_table.put_item(
                Item={
                    'cache_key': key,
                    'cache_value': json.dumps(value),
                    'created_at': datetime.now().isoformat(),
                    'ttl': expiration
                }
            )
            return True
        except Exception as e:
            logger.error(f"Cache set error: {e}")
            return False

cache_service = CacheService()
```

---

## Frontend Structure

### `frontend/src/pages/Dashboard.tsx`

```typescript
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import CostCard from '../components/CostCard';
import Heatmap from '../components/Heatmap';
import ServiceBreakdown from '../components/ServiceBreakdown';
import AlertWidget from '../components/AlertWidget';
import { api } from '../services/api';

export const Dashboard: React.FC = () => {
  const [creditsFilter, setCreditsFilter] = useState<'with' | 'without' | 'custom'>('with');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch costs data
  const { data: costs, isLoading } = useQuery({
    queryKey: ['costs', creditsFilter],
    queryFn: () => api.getCostBreakdown({ filter: creditsFilter }),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch heatmap data
  const { data: heatmap } = useQuery({
    queryKey: ['heatmap'],
    queryFn: () => api.getHeatmap({ days: 90 }),
  });

  useEffect(() => {
    // Restore preferences from localStorage
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme as 'light' | 'dark');
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-slate-50'}`}>
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold">MSP Assistant</h1>
          <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="mb-6">
          <select
            value={creditsFilter}
            onChange={(e) => setCreditsFilter(e.target.value as any)}
            className="px-4 py-2 border rounded"
          >
            <option value="with">WITH Credits</option>
            <option value="without">WITHOUT Credits</option>
            <option value="custom">CUSTOM Credits</option>
          </select>
        </div>

        {/* Cost Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <CostCard
            title="Total Costs (Current Month)"
            cost={costs?.total_cost}
            trend={8.3}
          />
          <CostCard
            title="Daily Average"
            cost={costs?.total_cost / 30}
            trend={-2.1}
          />
          <CostCard
            title="Forecast (Month End)"
            cost={11143}
            trend={0}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <Heatmap data={heatmap} />
          <ServiceBreakdown data={costs?.services} />
        </div>

        {/* Alerts */}
        <AlertWidget />
      </main>
    </div>
  );
};
```

### `frontend/src/components/CostCard.tsx`

```typescript
import React from 'react';

interface CostCardProps {
  title: string;
  cost: number;
  trend: number;
}

export const CostCard: React.FC<CostCardProps> = ({ title, cost, trend }) => {
  const trendColor = trend > 0 ? 'text-red-500' : 'text-green-500';
  const trendIcon = trend > 0 ? '↑' : '↓';

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-gray-600 text-sm font-semibold">{title}</h3>
      <p className="text-4xl font-bold mt-2">${cost?.toFixed(2)}</p>
      <p className={`text-sm mt-2 ${trendColor}`}>
        {trendIcon} {Math.abs(trend)}% from last month
      </p>
    </div>
  );
};

export default CostCard;
```

---

## Infrastructure (Terraform)

### `infrastructure/terraform/main.tf`

```hcl
terraform {
  required_version = ">= 1.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  
  backend "s3" {
    bucket         = "msp-assistant-terraform-state"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "terraform-locks"
  }
}

provider "aws" {
  region = var.aws_region
  
  default_tags {
    tags = {
      Project     = "MSP Assistant"
      Environment = var.environment
      ManagedBy   = "Terraform"
      CreatedAt   = formatdate("YYYY-MM-DD", timestamp())
    }
  }
}

# VPC
module "vpc" {
  source = "./modules/vpc"
  
  name              = "msp-assistant-${var.environment}"
  cidr_block        = "10.0.0.0/16"
  availability_zones = ["us-east-1a", "us-east-1b"]
}

# DynamoDB
resource "aws_dynamodb_table" "chat_requests" {
  name           = "msp-assistant-chat-requests"
  billing_mode   = "PAY_PER_REQUEST"  # Cost optimization
  hash_key       = "conversation_id"
  range_key      = "timestamp"
  
  attribute {
    name = "conversation_id"
    type = "S"
  }
  
  attribute {
    name = "timestamp"
    type = "N"
  }
  
  attribute {
    name = "user_id"
    type = "S"
  }
  
  global_secondary_index {
    name            = "user_id-index"
    hash_key        = "user_id"
    projection_type = "ALL"
  }
  
  ttl {
    attribute_name = "ttl"
    enabled        = true
  }
  
  point_in_time_recovery {
    enabled = var.environment == "prod"
  }
  
  tags = {
    Name = "Chat Requests"
  }
}

# Lambda for cache updates
resource "aws_lambda_function" "cache_updater" {
  filename         = "lambda_cache_updater.zip"
  function_name    = "msp-assistant-cache-updater"
  role             = aws_iam_role.lambda_role.arn
  handler          = "index.handler"
  runtime          = "python3.11"
  memory_size      = 256  # Cost optimized
  timeout          = 60
  
  environment {
    variables = {
      DYNAMODB_TABLE = aws_dynamodb_table.cache.name
    }
  }
}

# EventBridge rule for cache updates (every 6 hours)
resource "aws_cloudwatch_event_rule" "cache_updater_schedule" {
  name                = "msp-cache-updater-schedule"
  schedule_expression = "rate(6 hours)"
}

resource "aws_cloudwatch_event_target" "cache_updater_target" {
  rule      = aws_cloudwatch_event_rule.cache_updater_schedule.name
  target_id = "cache-updater-lambda"
  arn       = aws_lambda_function.cache_updater.arn
}

# ECS Cluster
resource "aws_ecs_cluster" "main" {
  name = "msp-assistant-${var.environment}"
  
  setting {
    name  = "containerInsights"
    value = "enabled"
  }
}

# Output
output "api_endpoint" {
  value = aws_api_gateway_stage.main.invoke_url
}

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.frontend.domain_name
}
```

---

## CI/CD Configuration

### `.github/workflows/build.yml`

See IMPLEMENTATION_PLAN.md for complete workflow definitions.

---

## Environment Configuration

### `.env.example`

```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCOUNT_ID=123456789012

# Backend
API_URL=http://localhost:8000
JWT_SECRET=your-secret-key-here
BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0

# Cognito
COGNITO_USER_POOL_ID=us-east-1_mCiPXP2HT
COGNITO_CLIENT_ID=your-client-id
COGNITO_DOMAIN=msp-assistant

# Frontend
VITE_API_URL=http://localhost:8000
VITE_ENV=development

# Database
DYNAMODB_TABLE_PREFIX=msp-assistant
RDS_HOST=localhost
RDS_USER=postgres
RDS_PASSWORD=password

# Monitoring
CLOUDWATCH_LOG_GROUP=/ecs/msp-assistant
DATADOG_API_KEY=optional

# Notifications
SLACK_WEBHOOK_URL=https://hooks.slack.com/...
TEAMS_WEBHOOK_URL=https://outlook.webhook.office.com/...
```

---

## Local Development

### `docker-compose.yml`

```yaml
version: '3.8'

services:
  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:5173"
    environment:
      - VITE_API_URL=http://localhost:8000
    volumes:
      - ./frontend/src:/app/src

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - AWS_REGION=us-east-1
      - DYNAMODB_ENDPOINT=http://dynamodb:8000
      - JWT_SECRET=dev-secret-key
    depends_on:
      - dynamodb
      - localstack
    volumes:
      - ./backend:/app

  # DynamoDB Local
  dynamodb:
    image: amazon/dynamodb-local:latest
    ports:
      - "8001:8000"
    command: ["-jar", "DynamoDBLocal.jar", "-sharedDb"]
    volumes:
      - dynamodb_data:/data

  # LocalStack (optional - for testing AWS services)
  localstack:
    image: localstack/localstack:latest
    ports:
      - "4566:4566"
    environment:
      - SERVICES=s3,sns,sqs,cognito-idp
      - DEBUG=1
      - DATA_DIR=/tmp/localstack/data
    volumes:
      - localstack_data:/tmp/localstack

volumes:
  dynamodb_data:
  localstack_data:
```

---

## Deployment Scripts

### `scripts/deploy.sh`

```bash
#!/bin/bash

set -e

ENVIRONMENT=${1:-staging}
REGION=${2:-us-east-1}

echo "Deploying to $ENVIRONMENT in $REGION..."

# Build images
echo "Building Docker images..."
docker build -t msp-assistant:$ENVIRONMENT ./backend
docker build -t msp-assistant-frontend:$ENVIRONMENT ./frontend

# Push to ECR
echo "Pushing to ECR..."
aws ecr get-login-password --region $REGION | \
  docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com

docker tag msp-assistant:$ENVIRONMENT \
  $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/msp-assistant:$ENVIRONMENT
docker push $AWS_ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/msp-assistant:$ENVIRONMENT

# Deploy infrastructure
echo "Deploying infrastructure..."
cd infrastructure/terraform
terraform init -upgrade
terraform workspace select $ENVIRONMENT || terraform workspace new $ENVIRONMENT
terraform plan -out=tfplan
terraform apply tfplan

echo "Deployment complete!"
```

---

## Testing Strategy

### `tests/unit/test_cost_explorer.py`

```python
import pytest
from services.cost_explorer import cost_explorer_service

@pytest.mark.asyncio
async def test_get_costs_breakdown():
    result = await cost_explorer_service.get_costs_breakdown(days=30)
    
    assert 'total_cost' in result
    assert 'services' in result
    assert result['total_cost'] > 0
    assert len(result['services']) > 0

@pytest.mark.asyncio
async def test_cache_hit():
    # First call
    result1 = await cost_explorer_service.get_costs_breakdown()
    
    # Second call should hit cache
    result2 = await cost_explorer_service.get_costs_breakdown()
    
    assert result1 == result2
```

---

## Cost Optimization Tips

1. **Lambda**: Keep memory at 256MB, use provisioned concurrency only for critical functions
2. **DynamoDB**: Always use on-demand billing, enable TTL for auto-cleanup
3. **CloudFront**: Cache aggressively (1 day for most assets)
4. **S3**: Use Intelligent-Tiering, delete old reports automatically
5. **ECS**: Auto-scale (min=1, max=5), use Fargate Spot for non-critical tasks

---

**Version:** 1.0  
**Last Updated:** 2026-05-14
