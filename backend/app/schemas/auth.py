from pydantic import BaseModel, EmailStr, field_validator, Field, SecretStr

# Schema for incoming registration payload
class RegisterRequest(BaseModel):
    email: EmailStr = Field(max_length=255)
    password: SecretStr = Field(min_length=8, max_length=64, pattern=r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$")

    @field_validator("email")
    @classmethod
    def validate_email(cls, v: str) -> str:
        return v.lower().strip()