import time
from typing import Dict
from jose import jwt, JWTError
from dotenv import load_dotenv
import os

load_dotenv()

JWT_SECRET = os.getenv("ACCESS_TOKEN_SECRET")
JWT_ALGORITHM = "HS256"

def signJWT(user_id: str, role: str = "user") -> Dict[str, str]:
    payload = {
        "user_id": user_id,
        "role": role,
        "expires": time.time() + 600  # Token expira en 10 minutos
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return {"access_token": token}

def decodeJWT(token: str) -> dict:
    try:
        decoded_token = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return decoded_token if decoded_token["expires"] >= time.time() else None
    except JWTError:
        return {}
