
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware

from app.routes import auth, portfolio, profile, stocks
from app.routes import admin_users, admin_portfolios, admin_support

app = FastAPI(
    title="PortafolioAI API",
    description="API para la gestión de portafolios de inversión impulsada por IA.",
    version="0.1.0"
)

# Configuración de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En producción, cambiar a la URL del frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclusión de rutas
app.include_router(auth.router, prefix="/api/auth", tags=["Autenticación"])
app.include_router(profile.router, prefix="/api", tags=["Perfil de Riesgo"])
app.include_router(portfolio.router, prefix="/api", tags=["Portafolio"])
app.include_router(stocks.router, prefix="/api", tags=["Datos de Acciones"])
app.include_router(admin_users.router, prefix="/api", tags=["Admin Usuarios"])
app.include_router(admin_portfolios.router, prefix="/api", tags=["Admin Portafolios"])
app.include_router(admin_support.router, prefix="/api", tags=["Admin Soporte"])
## app.include_router(admin_config.router, prefix="/api", tags=["Admin Configuración"])
## app.include_router(admin_logs.router, prefix="/api", tags=["Admin Logs"])

@app.get("/test", tags=["Test"])
async def test_endpoint():
    return {"message": "Test endpoint works!"}

@app.get("/", tags=["Root"])
async def read_root():
    return {"message": "Bienvenido a la API de PortafolioAI"}
