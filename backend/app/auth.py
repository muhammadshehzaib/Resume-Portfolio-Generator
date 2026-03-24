from fastapi import HTTPException, Depends, Header
from typing import Optional

async def get_current_user(authorization: Optional[str] = Header(None)) -> str:
    """
    Extract and validate user from Authorization header.
    Expected format: Bearer <user_id>
    """
    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Authorization header missing"
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=401,
            detail="Invalid authorization header format. Use 'Bearer <user_id>'"
        )

    user_id = parts[1]
    if not user_id or len(user_id.strip()) == 0:
        raise HTTPException(
            status_code=401,
            detail="User ID cannot be empty"
        )

    return user_id
