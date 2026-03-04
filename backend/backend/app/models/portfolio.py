from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime
from pydantic_extra_types.mongo_object_id import MongoObjectId # Import MongoObjectId

class Asset(BaseModel):
    ticker: str
    name: str
    allocation_pct: float
    reason: Optional[str] = None

class Portfolio(BaseModel):
    id: Optional[MongoObjectId] = Field(alias="_id") # Use MongoObjectId
    user_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    assets: List[Asset]
    metrics: Dict[str, Any]
    simulation_history: Optional[List[Dict[str, Any]]] = None

class PortfolioCreate(BaseModel):
    user_id: str
    generated_at: datetime = Field(default_factory=datetime.utcnow)
    assets: List[Asset]
    metrics: Dict[str, Any]
    simulation_history: Optional[List[Dict[str, Any]]] = None

    model_config = {
        "populate_by_name": True,
        "json_schema_extra": {
            "example": {
                "user_id": "60d0fe4f531123616a531123",
                "assets": [
                    {"ticker": "GGAL", "name": "Grupo Galicia", "allocation_pct": 25.0, "reason": "..."},
                    {"ticker": "KO", "name": "Coca-Cola", "allocation_pct": 75.0, "reason": "..."}
                ],
                "metrics": {"expected_return": 0.12, "risk": 0.08}
            }
        }
    }
