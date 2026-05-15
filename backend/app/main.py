from fastapi import FastAPI, WebSocket, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging
from app.api import costs, alerts, chat, auth, accounts, reports, webhooks, youtrack
from app.api import settings as settings_api
from app.core.config import settings
from app.core.logging import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


# Lifespan context manager
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting MSP Assistant Backend")
    yield
    logger.info("Shutting down MSP Assistant Backend")


# Create FastAPI app
app = FastAPI(
    title="MSP Assistant API",
    description="AWS Cost Intelligence Platform API",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
cors_origins = [origin.strip() for origin in settings.CORS_ORIGINS.split(",")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(accounts.router, prefix="/api/accounts", tags=["accounts"])
app.include_router(costs.router, prefix="/api/costs", tags=["costs"])
app.include_router(alerts.router, prefix="/api/alerts", tags=["alerts"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(reports.router, prefix="/api/reports", tags=["reports"])
app.include_router(webhooks.router, prefix="/api", tags=["webhooks"])
app.include_router(youtrack.router, tags=["youtrack"])
app.include_router(settings_api.router, tags=["settings"])


# Health check
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "MSP Assistant API", "version": "1.0.0"}


# Root endpoint
@app.get("/")
async def root():
    return {
        "message": "Welcome to MSP Assistant API",
        "docs": "/docs",
        "redoc": "/redoc",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG
    )
