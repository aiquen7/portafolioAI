from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

class User(BaseModel):
    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "name": "Abril Tello",
                "email": "abril@example.com",
                "password_hash": "hashedpassword",
                "country": "Argentina",
                "experience_level": "beginner",
                "investment_goal": "ahorro para casa",
                "risk_profile_answers": {"q1": "a", "q2": "b"},
                "preferences": {"assets": ["acciones", "bonos"], "amount": 100000},
                "role": "admin"
            }
        }
    }

    id: Optional[str] = Field(alias="_id")
    name: str
    email: EmailStr
    password_hash: str
    country: Optional[str] = None
    experience_level: Optional[str] = None
    investment_goal: Optional[str] = None
    risk_profile_answers: Optional[dict] = None
    preferences: Optional[dict] = None
    role: str = "user"  # Puede ser 'user' o 'admin'
    created_at: datetime = Field(default_factory=datetime.utcnow)
