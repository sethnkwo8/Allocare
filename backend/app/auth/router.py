from . import schema
from . import service
from app.onboarding.schema import OnboardingUpdateRequest
from fastapi import APIRouter, Depends, Response, Cookie
from typing import Annotated, Optional
from app.database import get_session
from sqlmodel import Session

router = APIRouter(prefix="/auth")

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
    
    return schema.RegisterResponse(name=user.name, email=user.email, id=user.id, onboarding=user.onboarding, created_at=user.created_at)

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

# GET route for current user
@router.get('/me', response_model=schema.UserResponse, status_code=200)
def get_user(
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    # Use get current user function
    user = service.get_current_user(db_session, session_token)

    return schema.UserResponse(id=user.id, name=user.name, email=user.email, currency=user.currency, onboarding=user.onboarding)

# GET route to get budget configurations
@router.get("/budget-configuration", response_model=OnboardingUpdateRequest)
def get_config(
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)   
):
    return service.get_bucket_configurations(session_token, db_session)

# PATCH route to update budgets
@router.patch("/budget-configuration", status_code=200)
def update_allocations(
    payload: OnboardingUpdateRequest,
    session_token: Annotated[Optional[str], Cookie()] = None,
    db_session: Session = Depends(get_session)
):
    return service.update_budget_allocations(session_token=session_token, db_session=db_session, buckets_data=payload)

