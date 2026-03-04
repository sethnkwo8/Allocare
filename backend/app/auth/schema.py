from pydantic import BaseModel, EmailStr, field_validator, Field, SecretStr
import uuid
from datetime import datetime


# Schema for incoming registration payload
class RegisterRequest(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: SecretStr = Field(min_length=8, max_length=64, pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.lower().strip()

# Schema for what is returned as a response for register
class RegisterResponse(BaseModel):
    id: uuid.UUID
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