
from fastapi import APIRouter, Depends, HTTPException, status, Body
from typing import List, Dict, Any
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.routes.auth import require_admin

router = APIRouter(prefix="/admin/support", tags=["admin-support"])

@router.patch("/messages/{message_id}/reply", response_description="Reply to support message")
async def reply_support_message(message_id: str, reply: str = Body(...), current_user: User = Depends(require_admin)):
    result = db.contact_messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"admin_reply": reply}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Reply saved"}

@router.patch("/messages/{message_id}/assign", response_description="Assign support message to admin")
async def assign_support_message(message_id: str, admin_id: str = Body(...), current_user: User = Depends(require_admin)):
    # Verifica que el admin existe y es admin
    admin = db.users.find_one({"_id": ObjectId(admin_id), "role": "admin"})
    if not admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    result = db.contact_messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"assigned_admin": str(admin_id)}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Support message assigned to admin"}

@router.get("/messages", response_description="List all support messages")
async def list_support_messages(current_user: User = Depends(require_admin)):
    messages = list(db.contact_messages.find())
    for m in messages:
        m["_id"] = str(m["_id"])
    return messages

@router.delete("/messages/{message_id}", response_description="Delete support message")
async def delete_support_message(message_id: str, current_user: User = Depends(require_admin)):
    result = db.contact_messages.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Support message deleted"}

@router.patch("/messages/{message_id}/resolve", response_description="Mark support message as resolved")
async def resolve_support_message(message_id: str, current_user: User = Depends(require_admin)):
    result = db.contact_messages.update_one({"_id": ObjectId(message_id)}, {"$set": {"status": "resuelto"}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Support message marked as resolved"}

@router.delete("/messages/{message_id}", response_description="Delete support message")
async def delete_support_message(message_id: str, current_user: User = Depends(require_admin)):
    result = db.contact_messages.delete_one({"_id": ObjectId(message_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Message not found")
    return {"message": "Support message deleted"}
