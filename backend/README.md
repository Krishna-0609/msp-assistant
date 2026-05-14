# MSP Assistant - Backend

FastAPI-based backend for AWS Cost Intelligence Platform with AWS Bedrock integration.

## Features

- ✅ FastAPI with async/await
- ✅ JWT authentication
- ✅ AWS Bedrock (Claude 3.5 Sonnet) integration
- ✅ DynamoDB and PostgreSQL support
- ✅ Real-time chat with AI
- ✅ Cost analysis and recommendations
- ✅ 24/7 monitoring with alerts
- ✅ WebSocket support
- ✅ Docker ready
- ✅ Production logging

## Quick Start

### Installation

```bash
cd backend
pip install -r requirements.txt
```

### Environment Setup

```bash
cp .env.example .env
# Edit .env with your AWS credentials
```

### Run Locally

```bash
uvicorn app.main:app --reload
```

Visit: http://localhost:8000/docs

### Run with Docker

```bash
docker-compose up
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `GET /api/auth/me` - Current user info

### Costs
- `GET /api/costs/` - Get costs
- `GET /api/costs/summary` - Cost summary
- `POST /api/costs/analyze` - Analyze costs

### Alerts
- `GET /api/alerts/` - Get alerts
- `GET /api/alerts/severity/critical` - Critical alerts
- `POST /api/alerts/` - Create alert
- `PATCH /api/alerts/{id}` - Mark as read

### Chat
- `POST /api/chat/` - Send message
- `GET /api/chat/conversations/{id}` - Get conversation
- `GET /api/chat/conversations` - List conversations

### Accounts
- `GET /api/accounts/` - Get AWS accounts
- `POST /api/accounts/` - Add account
- `DELETE /api/accounts/{id}` - Remove account

### Reports
- `GET /api/reports/` - Get reports
- `POST /api/reports/generate` - Generate report
- `GET /api/reports/{id}/download` - Download report

## Demo Credentials

```
Email: admin@example.com
Password: Demo@123
```

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── auth.py      # Authentication endpoints
│   │   ├── costs.py     # Cost endpoints
│   │   ├── alerts.py    # Alert endpoints
│   │   ├── chat.py      # Chat endpoints
│   │   ├── accounts.py  # AWS account endpoints
│   │   └── reports.py   # Report endpoints
│   ├── core/
│   │   ├── config.py    # Configuration
│   │   ├── security.py  # JWT & authentication
│   │   └── logging.py   # Logging setup
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic
│   └── main.py          # FastAPI app
├── tests/               # Unit tests
├── requirements.txt     # Dependencies
├── Dockerfile          # Docker image
└── docker-compose.yml  # Docker compose
```

## Testing

```bash
pytest
```

## Deployment

### AWS Lambda

Deploy as Lambda function using Serverless Framework or AWS SAM.

### ECS Fargate

```bash
docker build -t msp-assistant .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin [account].dkr.ecr.us-east-1.amazonaws.com
docker tag msp-assistant [account].dkr.ecr.us-east-1.amazonaws.com/msp-assistant:latest
docker push [account].dkr.ecr.us-east-1.amazonaws.com/msp-assistant:latest
```

## AWS Services Used

- **Bedrock**: Claude 3.5 Sonnet for AI
- **DynamoDB**: NoSQL database
- **S3**: Document storage
- **CloudWatch**: Monitoring & logs
- **SNS**: Notifications
- **Lambda**: Serverless functions
- **Cognito**: User management

## License

Proprietary - All rights reserved
