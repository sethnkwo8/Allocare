from . import schema
from . import service
from fastapi import APIRouter, Depends, Response, Cookie
from typing import Annotated
from app.database import get_session
from sqlmodel import Session

router = APIRouter()

# POST route for registering
@router.post('/register', response_model=schema.RegisterResponse, status_code=201)
def register(
    payload: schema.RegisterRequest,
    response: Response,
    db_session: Session = Depends(get_session)
):
    # Create full user object
    user = service.create_user(payload, db_session)

    # Create session token
    session_token = service.create_session(user.id, db_session)

    # Set cookie
    response.set_cookie(key="session_token",
                        value=session_token,
                        httponly=True,
                        samesite="lax", # CSRF protection
                        secure=False, # Forces HTTPS, False for development
                        max_age=604800 # 7 days
                        )
    
    return schema.RegisterResponse(email=user.email, id=user.id, onboarding=user.onboarding, created_at=user.created_at)

# POST route for login
@router.post('/login', response_model=schema.LoginResponse, status_code=201)
def login(
    payload: schema.LoginRequest,
    response: Response,
    db_session: Session = Depends(get_session)
):
    
    # Authenticate user and return user object
    user = service.authenticate_user(payload, db_session)

    # Create session token
    session_token = service.create_session(user.id, db_session)

    # Set cookie
    response.set_cookie(key="session_token",
                        value=session_token,
                        httponly=True,
                        samesite="lax", # CSRF protection
                        secure=False, # Forces HTTPS, False for development
                        max_age=604800 # 7 days
                        )
    
    return schema.LoginResponse(email=user.email, id=user.id, onboarding=user.onboarding, created_at=user.created_at)

# POST route for logout
@router.post('/logout', status_code=200)
def logout(
    response: Response,
    session_token: Annotated[str | None, Cookie()] = None, # Cookie that was set
    db_session: Session = Depends(get_session)
):
    # Call logout logic
    service.logout_user(session_token, db_session)

    # Clear cookie from browser
    response.delete_cookie(key="session_token")

    return {"detail": "Successfully logged out"}