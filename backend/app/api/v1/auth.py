from datetime import timedelta
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm

from app.core import security
from app.core.config import settings
from app.core.database import get_db
from app import models, schemas

router = APIRouter()

@router.post("/register", response_model=schemas.UserResponse)
def register_user(
    user_in: schemas.UserCreate,
    db: Session = Depends(get_db)
) -> Any:
    """
    Create new user.
    """
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this username already exists in the system.",
        )
    
    user = models.User(
        email=user_in.email,
        password_hash=security.get_password_hash(user_in.password),
        full_name=user_in.full_name,
        department=user_in.department,
        position=user_in.position
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

@router.post("/login")
def login_access_token(
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests
    """
    user = db.query(models.User).filter(models.User.email == form_data.username).first()
    if not user or not security.verify_password(form_data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    
    if not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
        
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return {
        "access_token": security.create_access_token(
            user.id, expires_delta=access_token_expires
        ),
        "token_type": "bearer",
    }

@router.post("/forgot-password")
def forgot_password(
    email_in: schemas.UserLogin, # reusing schema just for email
    db: Session = Depends(get_db)
) -> Any:
    """
    Password Reset Request.
    """
    user = db.query(models.User).filter(models.User.email == email_in.email).first()
    if not user:
        # Return 200 even if user not found to prevent user enumeration
        return {"message": "If the email exists, a reset link has been sent."}
    
    # Generate reset token (short lived, e.g., 15 min)
    reset_token = security.create_access_token(user.email, expires_delta=timedelta(minutes=15))
    
    # TODO: Send email
    print(f"------------ PASSWORD RESET LINK ------------")
    print(f"Token: {reset_token}")
    print(f"In production, send this link: https://lokai.com/reset-password?token={reset_token}")
    print(f"---------------------------------------------")
    
    return {"message": "If the email exists, a reset link has been sent."}

@router.post("/reset-password")
def reset_password(
    token: str,
    new_password: str,
    db: Session = Depends(get_db)
) -> Any:
    """
    Reset Password with token.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    email = security.verify_token(token, credentials_exception)
    
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise credentials_exception
    
    user.password_hash = security.get_password_hash(new_password)
    db.add(user)
    db.commit()
    
    return {"message": "Password updated successfully."}
