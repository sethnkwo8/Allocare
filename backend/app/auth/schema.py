from pydantic import BaseModel, EmailStr, field_validator, Field, SecretStr
import uuid
from datetime import datetime
import re


# Schema for incoming registration payload
class RegisterRequest(BaseModel):
    name: str = Field(max_length=255)
    email: EmailStr = Field(max_length=255)
    password: SecretStr = Field(min_length=8, max_length=64)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.lower().strip()
    
    @field_validator('password', mode='after')
    @classmethod
    def password_complexity(cls, v: SecretStr) -> SecretStr:
        # Extract the actual string for validation
        password_val = v.get_secret_value()
        
        if len(password_val) < 8:
            raise ValueError('Password must be at least 8 characters long')
        if not re.search(r'[A-Z]', password_val):
            raise ValueError('Password must contain at least one uppercase letter')
        if not re.search(r'[a-z]', password_val):
            raise ValueError('Password must contain at least one lowercase letter')
        if not re.search(r'\d', password_val):
            raise ValueError('Password must contain at least one number')
        if not re.search(r'[@$!%*?&]', password_val):
            raise ValueError('Password must contain at least one special character (@$!%*?&)')
            
        return v # Return the original SecretStr object

# Schema for what is returned as a response for register
class RegisterResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    onboarding: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for incoming login payload
class LoginRequest(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: SecretStr = Field(min_length=8, max_length=64)

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.lower().strip()

# Schema for what is returned as a response for login
class LoginResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    onboarding: bool
    created_at: datetime

    class Config:
        from_attributes = True

# Schema for what is returned as a response for getting current user
class UserResponse(BaseModel):
    id: uuid.UUID
    name: str
    email: EmailStr
    currency: str
    onboarding: bool