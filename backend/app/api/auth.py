from fastapi import APIRouter, HTTPException, status, Depends
from datetime import timedelta
from app.schemas.auth import TokenRequest, TokenResponse, UserResponse, SignUpRequest
from app.core.security import verify_password, create_access_token, create_refresh_token, get_password_hash, decode_token
from app.core.config import settings
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

# Pre-hashed password for "Demo@123"
# This is just a test credential - hash was generated once and stored
DEMO_PASSWORD_HASH = "$2b$12$R9h7cIPz0giJlI.bVXDL6OJvBwvw5WA4Hxf7I0qE5zRqKJtSFZMB2"

# Mock user database for demo
USERS_DB = {
    "admin@example.com": {
        "id": "1",
        "email": "admin@example.com",
        "name": "Admin User",
        "hashed_password": DEMO_PASSWORD_HASH,
        "role": "admin",
        "is_active": True
    }
}

@router.post("/login", response_model=TokenResponse)
async def login(request: TokenRequest):
    """User login endpoint"""
    user = USERS_DB.get(request.email)

    if not user or not verify_password(request.password, user["hashed_password"]):
        logger.warning(f"Failed login attempt for {request.email}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not user["is_active"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )

    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    refresh_token = create_refresh_token(data={"sub": user["email"]})

    logger.info(f"User {user['email']} logged in successfully")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.post("/signup", response_model=TokenResponse)
async def signup(request: SignUpRequest):
    """User signup endpoint"""
    if request.email in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    USERS_DB[request.email] = {
        "id": str(len(USERS_DB) + 1),
        "email": request.email,
        "name": request.name,
        "hashed_password": get_password_hash(request.password),
        "role": "viewer",
        "is_active": True
    }

    user = USERS_DB[request.email]
    access_token = create_access_token(data={"sub": user["email"], "role": user["role"]})
    refresh_token = create_refresh_token(data={"sub": user["email"]})

    logger.info(f"New user registered: {request.email}")

    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = None):
    """Get current user info"""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )

    email = decode_token(token)
    if not email or email not in USERS_DB:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token"
        )

    user = USERS_DB[email]
    return {
        "id": user["id"],
        "email": user["email"],
        "name": user["name"],
        "role": user["role"],
        "is_active": user["is_active"]
    }
