from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from .. import crud, schemas
from ..core.config import settings
from ..core.database import get_db
from ..core.security import create_access_token, hash_password, verify_password
from ..dependencies import get_current_user

router = APIRouter(prefix="/api/auth", tags=["auth"])


def auth_response(user, token: str):
    return {
        "user": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "isAdmin": bool(user.is_admin),
        },
        "token": token,
    }


@router.post("/register")
async def register(payload: schemas.RegisterRequest, db: AsyncSession = Depends(get_db)):
    if not payload.username or not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Missing required fields")

    existing_user = await crud.get_user_by_username(db, payload.username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    existing_email = await crud.get_user_by_email(db, payload.email)
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = await crud.create_user(
        db,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        is_admin=False,
    )
    token = create_access_token(
        {"id": user.id, "username": user.username, "email": user.email, "is_admin": bool(user.is_admin)}
    )
    return auth_response(user, token)


@router.post("/admin/register")
async def admin_register(payload: schemas.RegisterRequest, db: AsyncSession = Depends(get_db)):
    if not payload.username or not payload.email or not payload.password:
        raise HTTPException(status_code=400, detail="Missing required fields")

    existing_user = await crud.get_user_by_username(db, payload.username)
    if existing_user:
        raise HTTPException(status_code=409, detail="Username already exists")

    existing_email = await crud.get_user_by_email(db, payload.email)
    if existing_email:
        raise HTTPException(status_code=409, detail="Email already registered")

    user = await crud.create_user(
        db,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        is_admin=True,
    )
    token = create_access_token(
        {"id": user.id, "username": user.username, "email": user.email, "is_admin": True}
    )
    return auth_response(user, token)


@router.post("/login")
async def login(payload: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    login_id = payload.username or payload.email
    if not login_id or not payload.password:
        raise HTTPException(status_code=400, detail="Missing username or password")

    user = await crud.get_user_by_username(db, login_id)
    if not user:
        user = await crud.get_user_by_email(db, login_id)

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(
        {"id": user.id, "username": user.username, "email": user.email, "is_admin": bool(user.is_admin)}
    )
    return auth_response(user, token)


@router.post("/admin/login")
async def admin_login(payload: schemas.LoginRequest, db: AsyncSession = Depends(get_db)):
    login_id = payload.username or payload.email
    if not login_id or not payload.password:
        raise HTTPException(status_code=400, detail="Missing username or password")

    user = await crud.get_user_by_username(db, login_id)
    if not user:
        user = await crud.get_user_by_email(db, login_id)

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bool(user.is_admin):
        raise HTTPException(status_code=403, detail="Admin account required")

    token = create_access_token(
        {"id": user.id, "username": user.username, "email": user.email, "is_admin": True}
    )
    return auth_response(user, token)


@router.get("/me")
async def me(current=Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_id(db, int(current["id"]))
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "isAdmin": bool(user.is_admin),
        "created_at": user.created_at,
    }


@router.post("/forgot-password")
async def forgot_password(payload: schemas.ForgotPasswordRequest, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    token = create_access_token({"id": user.id, "email": user.email})
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    await crud.update_reset_token(db, payload.email, token, expiry)

    reset_link = f"{settings.frontend_url}/reset-password?token={token}"
    print(f"[password-reset] Send to {payload.email}: {reset_link}")

    return {"message": "Password reset email sent"}


@router.post("/reset-password")
async def reset_password(payload: schemas.ResetPasswordRequest, db: AsyncSession = Depends(get_db)):
    user = await crud.get_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if user.reset_token != payload.token:
        raise HTTPException(status_code=401, detail="Invalid or expired reset token")

    if user.reset_token_expiry and datetime.now(timezone.utc) > user.reset_token_expiry.replace(tzinfo=timezone.utc):
        raise HTTPException(status_code=401, detail="Invalid or expired reset token")

    await crud.reset_password(db, payload.email, hash_password(payload.newPassword))
    return {"message": "Password reset successful"}
