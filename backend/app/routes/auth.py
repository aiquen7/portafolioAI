
from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    token: str
    new_password: str

@router.post("/reset-password", response_description="Restablecer contraseña")
async def reset_password(data: ResetPasswordRequest):
    user = db.users.find_one({"email": data.email})
    if not user or user.get("reset_token") != data.token:
        raise HTTPException(status_code=400, detail="Token inválido o usuario no encontrado")
    # Opcional: verificar expiración del token
    hashed_password = get_password_hash(data.new_password)
    db.users.update_one({"_id": user["_id"]}, {"$set": {"password_hash": hashed_password}, "$unset": {"reset_token": "", "reset_token_exp": ""}})
    return {"message": "Contraseña actualizada correctamente"}
from fastapi import BackgroundTasks
import secrets
import smtplib
from email.message import EmailMessage
# Endpoint para recuperación de contraseña
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

def send_reset_email(to_email: str, token: str):
    # Configura aquí tu servidor SMTP real
    msg = EmailMessage()
    msg["Subject"] = "Recuperación de contraseña PortafolioAI"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = to_email
    msg.set_content(f"Para recuperar tu contraseña, usa este código: {token}")
    # Ejemplo: smtplib.SMTP('smtp.gmail.com', 587)
    # smtp.send_message(msg)
    print(f"Email de recuperación enviado a {to_email} con token: {token}")

def send_verification_email(to_email: str, token: str):
    msg = EmailMessage()
    msg["Subject"] = "Verifica tu correo en PortafolioAI"
    msg["From"] = "no-reply@portafolioai.com"
    msg["To"] = to_email
    verify_link = os.getenv("FRONTEND_URL", "http://localhost:5173") + f"/verify-email?token={token}&email={to_email}"
    msg.set_content(f"Gracias por registrarte en PortafolioAI. Haz clic en el siguiente enlace para verificar tu correo:\n\n{verify_link}\n\nSi no solicitaste esto, ignora este mensaje.")
    # Intentar enviar vía SMTP si está configurado
    try:
        smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_user = os.getenv("SMTP_USER")
        smtp_pass = os.getenv("SMTP_PASS")
        if smtp_user and smtp_pass:
            smtp = smtplib.SMTP(smtp_host, smtp_port)
            smtp.starttls()
            smtp.login(smtp_user, smtp_pass)
            smtp.send_message(msg)
            smtp.quit()
            print(f"Email de verificación enviado a {to_email}")
        else:
            print(f"SMTP no configurado. Mostrar enlace de verificación en logs: {verify_link}")
    except Exception as e:
        print(f"Error enviando email de verificación: {e}")

@router.post("/forgot-password", response_description="Enviar email de recuperación")
async def forgot_password(data: ForgotPasswordRequest, background_tasks: BackgroundTasks):
    user = db.users.find_one({"email": data.email})
    if not user:
        # No revelar si el email existe
        return {"message": "Si el correo existe, recibirás instrucciones."}
    # Generar token simple (en producción, usar JWT o similar)
    reset_token = secrets.token_urlsafe(8)
    db.users.update_one({"_id": user["_id"]}, {"$set": {"reset_token": reset_token, "reset_token_exp": datetime.utcnow()}})
    background_tasks.add_task(send_reset_email, data.email, reset_token)
    return {"message": "Si el correo existe, recibirás instrucciones."}
from fastapi import APIRouter, Body, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.responses import RedirectResponse

from typing import Dict, Optional
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from datetime import datetime, timedelta
from pydantic import BaseModel, EmailStr

from app.models.user import User
from app.database import db
from app.utils.jwt_handler import signJWT, decodeJWT
from bson import ObjectId
from bson.errors import InvalidId

import bcrypt

router = APIRouter()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str

def get_password_hash(password: str) -> str:
    # Encode password to bytes and truncate to 72 bytes
    truncated_password_bytes = password.encode('utf-8')[:72]
    # Generate a salt and hash the password
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(truncated_password_bytes, salt)
    return hashed_password.decode('utf-8') # Store as utf-8 string

def verify_password(plain_password: str, hashed_password: str) -> bool:
    # Encode plain password to bytes and truncate to 72 bytes
    truncated_plain_password_bytes = plain_password.encode('utf-8')[:72]
    # Check if the plain password matches the hashed password
    return bcrypt.checkpw(truncated_plain_password_bytes, hashed_password.encode('utf-8'))

async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    payload = decodeJWT(token)
    if payload is None:
        raise credentials_exception
    user_id = payload.get("user_id")
    if user_id is None:
        raise credentials_exception
    
    # Convert user_id string to ObjectId for MongoDB query
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except InvalidId:
        raise credentials_exception

    if user is None:
        raise credentials_exception
    return user

# Dependencia para requerir rol admin
from fastapi import Depends
def require_admin(current_user: dict = Depends(get_current_user)):
    if current_user.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin access required")
    return current_user

@router.post("/register", response_description="Register new user")
async def register_user(user_data: UserRegister = Body(...), background_tasks: BackgroundTasks = None):
    hashed_password = get_password_hash(user_data.password)
    if db.users.find_one({"email": user_data.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user_doc = {
        "name": user_data.name,
        "email": user_data.email,
        "password_hash": hashed_password,
        "role": "user",  # Por defecto, usuario normal
        "created_at": datetime.utcnow()
    }
    new_user = db.users.insert_one(new_user_doc)
    created_user = db.users.find_one({"_id": new_user.inserted_id})

    # Generar token de verificación y almacenarlo
    verification_token = None
    try:
        verification_token = secrets.token_urlsafe(24)
        verification_exp = datetime.utcnow() + timedelta(hours=24)
        db.users.update_one({"_id": created_user["_id"]}, {"$set": {"verification_token": verification_token, "verification_exp": verification_exp}})
    except Exception:
        verification_token = None

    # Enviar email de verificación en background si hay SMTP configurado
    if verification_token and background_tasks is not None:
        try:
            background_tasks.add_task(send_verification_email, created_user["email"], verification_token)
        except Exception:
            pass

    return {"message": "User registered successfully. Verification email sent if SMTP configured.", "user_id": str(created_user["_id"])}

@router.post("/login", response_description="Login user")
async def user_login(user_credentials: Dict[str, str] = Body(...)):
    user = db.users.find_one({"email": user_credentials["email"]})
    if user and verify_password(user_credentials["password"], user["password_hash"]):
        role = user.get("role", "user")
        return signJWT(str(user["_id"]), role)
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/me", response_description="Get current user")
async def get_me(current_user: Annotated[User, Depends(get_current_user)]):
    # Convertir ObjectId a string para la respuesta
    user_dict = dict(current_user)
    user_dict["_id"] = str(user_dict["_id"])
    # Asegurarse que el campo 'role' esté presente
    if "role" not in user_dict:
        user_dict["role"] = "user"
    # Buscar el portafolio asociado al usuario
    portfolio = db.portfolios.find_one({"user_id": user_dict["_id"]})
    if portfolio:
        portfolio["_id"] = str(portfolio["_id"])
        user_dict["portfolio"] = portfolio
    else:
        user_dict["portfolio"] = None
    return user_dict


# --- Google OAuth2 helpers and verification using google-auth ---
import os
import requests
import secrets
from urllib.parse import urlencode
from datetime import datetime
try:
    from google.oauth2 import id_token as google_id_token
    from google.auth.transport import requests as google_requests
    GOOGLE_AUTH_AVAILABLE = True
except Exception:
    google_id_token = None
    google_requests = None
    GOOGLE_AUTH_AVAILABLE = False


@router.post("/google/verify", response_description="Verify Google id_token and create/update user")
async def google_verify(payload: dict = Body(...)):
    if not GOOGLE_AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-auth no está instalado en el entorno. Ejecuta 'pip install -r requirements.txt' en el backend.")
    idtoken = payload.get("id_token")
    if not idtoken:
        raise HTTPException(status_code=400, detail="Missing id_token")
    try:
        # Verify the token and get claims
        request_adapter = google_requests.Request()
        info = google_id_token.verify_oauth2_token(idtoken, request_adapter, os.getenv("GOOGLE_CLIENT_ID"))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid id_token: {e}")

    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email
    picture = info.get("picture")

    # Buscar usuario por google_id o email
    user = db.users.find_one({"google_id": google_id}) or db.users.find_one({"email": email})
    now = datetime.utcnow()
    if user:
        db.users.update_one({"_id": user["_id"]}, {"$set": {"email": email, "name": name, "picture": picture, "google_id": google_id, "updated_at": now}})
        user_id = user["_id"]
        role = user.get("role", "user")
    else:
        res = db.users.insert_one({"email": email, "name": name, "picture": picture, "google_id": google_id, "role": "user", "created_at": now})
        user_id = res.inserted_id
        role = "user"

    app_token = signJWT(str(user_id), role)
    return app_token


# Backwards-compatible redirect flow (kept for non-SPA clients)
@router.get("/google/login", response_description="Redirect to Google OAuth2")
async def google_login():
    client_id = os.getenv("GOOGLE_CLIENT_ID")
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    if not client_id or not redirect_uri:
        raise HTTPException(status_code=500, detail="Google OAuth not configured")
    state = secrets.token_urlsafe(16)
    try:
        db.oauth_states.insert_one({"state": state, "created_at": datetime.utcnow()})
    except Exception:
        pass
    params = {
        "client_id": client_id,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "state": state,
        "access_type": "offline",
        "prompt": "consent"
    }
    auth_url = "https://accounts.google.com/o/oauth2/v2/auth?" + urlencode(params)
    return RedirectResponse(auth_url)


@router.get("/google/callback", response_description="Google OAuth2 callback")
async def google_callback(code: Optional[str] = None, state: Optional[str] = None):
    if not GOOGLE_AUTH_AVAILABLE:
        raise HTTPException(status_code=500, detail="google-auth no está instalado en el entorno. Ejecuta 'pip install -r requirements.txt' en el backend.")
    if not code or not state:
        raise HTTPException(status_code=400, detail="Missing code or state")
    stored = db.oauth_states.find_one({"state": state})
    if not stored:
        raise HTTPException(status_code=400, detail="Invalid state")
    token_url = "https://oauth2.googleapis.com/token"
    data = {
        "code": code,
        "client_id": os.getenv("GOOGLE_CLIENT_ID"),
        "client_secret": os.getenv("GOOGLE_CLIENT_SECRET"),
        "redirect_uri": os.getenv("GOOGLE_REDIRECT_URI"),
        "grant_type": "authorization_code"
    }
    token_resp = requests.post(token_url, data=data)
    if token_resp.status_code != 200:
        raise HTTPException(status_code=400, detail="Token exchange failed")
    token_json = token_resp.json()
    id_token = token_json.get("id_token")
    # Verify id_token using google-auth
    try:
        request_adapter = google_requests.Request()
        info = google_id_token.verify_oauth2_token(id_token, request_adapter, os.getenv("GOOGLE_CLIENT_ID"))
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid id_token")

    google_id = info.get("sub")
    email = info.get("email")
    name = info.get("name") or email
    picture = info.get("picture")

    user = db.users.find_one({"google_id": google_id}) or db.users.find_one({"email": email})
    now = datetime.utcnow()
    if user:
        db.users.update_one({"_id": user["_id"]}, {"$set": {"email": email, "name": name, "picture": picture, "google_id": google_id, "updated_at": now}})
        user_id = user["_id"]
        role = user.get("role", "user")
    else:
        res = db.users.insert_one({"email": email, "name": name, "picture": picture, "google_id": google_id, "role": "user", "created_at": now})
        user_id = res.inserted_id
        role = "user"

    app_token = signJWT(str(user_id), role)
    frontend = os.getenv("FRONTEND_URL", "http://localhost:5173")
    access = app_token["access_token"] if isinstance(app_token, dict) and app_token.get("access_token") else app_token
    redirect_to = f"{frontend}/auth/callback?token={access}"
    return RedirectResponse(redirect_to)