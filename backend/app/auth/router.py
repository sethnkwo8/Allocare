from .schema import RegisterRequest, RegisterResponse
from . import service
from fastapi import APIRouter, Depends, Response
from app.database import get_session
from sqlmodel import Session

router = APIRouter()

# Post route for registering
@router.post('/register', response_model=RegisterResponse, status_code=201)
def register(
    payload: RegisterRequest,
    response: Response,
    db_session: Session = Depends(get_session)
):
    # Creates full user object
    user = service.create_user(payload, db_session)

    # Creates session token
    session_token = service.create_session(user.id, db_session)

    # Set cookie
    response.set_cookie(key="session_token",
                        value=session_token,
                        httponly=True,
                        samesite="lax", # CSRF protection
                        secure=False, # Forces HTTPS, False for development
                        max_age=604800 # 7 days
                        )
    
    return RegisterResponse(email=user.email, id=user.id, created_at=user.created_at)