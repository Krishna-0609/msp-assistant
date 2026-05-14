from fastapi import APIRouter, HTTPException, status, Query
from typing import List
from pydantic import BaseModel

logger = None
router = APIRouter()

class AWSAccount(BaseModel):
    id: str
    name: str
    account_id: str
    region: str
    status: str

# Mock data
AWS_ACCOUNTS = [
    {"id": "1", "name": "Production", "account_id": "123456789012", "region": "us-east-1", "status": "Connected"},
    {"id": "2", "name": "Development", "account_id": "210987654321", "region": "us-west-2", "status": "Connected"},
    {"id": "3", "name": "Staging", "account_id": "111222333444", "region": "eu-west-1", "status": "Pending"},
]

@router.get("/", response_model=List[AWSAccount])
async def get_accounts():
    """Get connected AWS accounts"""
    return AWS_ACCOUNTS

@router.get("/{account_id}", response_model=AWSAccount)
async def get_account(account_id: str):
    """Get specific AWS account"""
    account = next((a for a in AWS_ACCOUNTS if a["id"] == account_id), None)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    return account

@router.post("/", response_model=AWSAccount)
async def create_account(account: AWSAccount):
    """Add new AWS account"""
    new_account = {
        "id": str(len(AWS_ACCOUNTS) + 1),
        **account.model_dump()
    }

    AWS_ACCOUNTS.append(new_account)
    return new_account

@router.delete("/{account_id}")
async def delete_account(account_id: str):
    """Remove AWS account"""
    account = next((a for a in AWS_ACCOUNTS if a["id"] == account_id), None)

    if not account:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Account not found"
        )

    AWS_ACCOUNTS.remove(account)
    return {"message": "Account deleted"}
