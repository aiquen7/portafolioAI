from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import Dict, Any
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from app.database import db
from app.models.user import User
from app.routes.auth import get_current_user
from bson import ObjectId # Import ObjectId

router = APIRouter()

@router.post("/risk-profile", response_description="Save or update user risk profile answers")
async def save_risk_profile(
    current_user: Annotated[User, Depends(get_current_user)],
    risk_profile_data: Dict[str, Any] = Body(...)
):
    user_id = str(current_user["_id"])
    update_result = db.users.update_one(
        {"_id": ObjectId(user_id)}, # Convert user_id string to ObjectId
        {"$set": {
            "risk_profile_answers": risk_profile_data.get("risk_profile_answers"),
            "country": risk_profile_data.get("country"),
            "experience_level": risk_profile_data.get("experience_level"),
            "investment_goal": risk_profile_data.get("investment_goal"),
            "preferences": risk_profile_data.get("preferences"),
            "risk_level": risk_profile_data.get("risk_level") # Añadir risk_level al perfil del usuario
        }}
    )
    if update_result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found or no changes made")
    return {"message": "Risk profile updated successfully"}
