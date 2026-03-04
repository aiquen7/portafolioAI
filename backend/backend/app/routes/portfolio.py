from fastapi import APIRouter, Body, Depends, HTTPException, status
from typing import Dict, Any, List
try:
    from typing import Annotated
except ImportError:
    from typing_extensions import Annotated
from datetime import datetime
from bson import ObjectId
from app.database import db
from app.models.user import User
from app.models.portfolio import Portfolio, PortfolioCreate
from app.routes.auth import get_current_user
from app.services.optimizer_service import generate_portfolio
## Chatbot eliminado: no se importa ni usa explain_concept

router = APIRouter()

@router.post("/optimize", response_description="Generate and save user portfolio")
async def optimize_portfolio(
    current_user: Annotated[User, Depends(get_current_user)],
    portfolio_data: Dict[str, Any] = Body(...)
):
    user_id = str(current_user["_id"])
    user_profile = {
        "risk_level": portfolio_data.get("risk_level"),
        "investment_goal": portfolio_data.get("investment_goal"),
        "experience_level": portfolio_data.get("experience_level"),
        "country": portfolio_data.get("country"),
    }
    preferences = portfolio_data.get("preferences", {})

    # Generar portafolio usando el servicio de optimización (simple o avanzado)
    optimized_portfolio = generate_portfolio(user_profile, preferences)

    # Opcional: Usar Gemini para generar el portafolio (si está configurado y se desea)
    # gemini_portfolio_response = generate_portfolio_prompt(user_profile, preferences)
    # if gemini_portfolio_response and "assets" in gemini_portfolio_response:
    #     optimized_portfolio["assets"] = gemini_portfolio_response["assets"]
    #     optimized_portfolio["metrics"] = gemini_portfolio_response["metrics"]

    # Usar PortfolioCreate para la creación inicial
    new_portfolio_data = PortfolioCreate(
        user_id=user_id,
        assets=optimized_portfolio["assets"],
        metrics=optimized_portfolio["metrics"]
    )
    
    # Guardar el portafolio en la base de datos
    inserted_portfolio = db.portfolios.insert_one(new_portfolio_data.model_dump(by_alias=True, exclude_unset=True))
    created_portfolio = db.portfolios.find_one({"_id": inserted_portfolio.inserted_id})
    
    # Convertir ObjectId a string para poder serializar la respuesta
    if created_portfolio and "_id" in created_portfolio:
        created_portfolio["_id"] = str(created_portfolio["_id"])
    
    return created_portfolio

@router.get("/portfolio/{user_id}", response_description="Get user portfolio and simulations")
async def get_user_portfolio(user_id: str, current_user: Annotated[User, Depends(get_current_user)]):
    if str(current_user["_id"]) != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to view this portfolio")
    
    portfolio = db.portfolios.find_one({"user_id": user_id})
    if portfolio:
        # Convert ObjectId fields to string for serialization
        if "_id" in portfolio:
            portfolio["_id"] = str(portfolio["_id"])
        # Also convert asset IDs if present
        if "assets" in portfolio and isinstance(portfolio["assets"], list):
            for asset in portfolio["assets"]:
                if isinstance(asset, dict) and "_id" in asset and isinstance(asset["_id"], ObjectId):
                    asset["_id"] = str(asset["_id"])
        return portfolio
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found")

@router.post("/simulate", response_description="Execute or save a simulation")
async def simulate_portfolio(
    current_user: Annotated[User, Depends(get_current_user)],
    simulation_data: Dict[str, Any] = Body(...)
):
    user_id = str(current_user["_id"])
    portfolio_id = simulation_data.get("portfolio_id")
    if not portfolio_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Portfolio ID is required for simulation")

    # Aquí iría la lógica de simulación. Por ahora, solo guardamos los datos.
    # En una implementación real, esto ejecutaría cálculos complejos.
    simulation_result = {
        "timestamp": datetime.utcnow().isoformat(),
        "params": simulation_data.get("params"),
        "result": {"mock_performance": [10000, 10100, 10250, 10400, 10500]}
    }

    update_result = db.portfolios.update_one(
        {"_id": ObjectId(portfolio_id), "user_id": user_id},
        {"$push": {"simulation_history": simulation_result}}
    )

    if update_result.modified_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Portfolio not found or not authorized")
    
    return {"message": "Simulation saved successfully", "simulation": simulation_result}

@router.post("/support/contact", response_description="Submit a contact message")
async def submit_contact_message(
    contact_data: Dict[str, Any] = Body(...)
):
    from app.database import db
    from datetime import datetime
    # Construir el documento con los campos necesarios
    message_doc = {
        "user": contact_data.get("name", ""),
        "email": contact_data.get("email", ""),
        "message": contact_data.get("message", ""),
        "created_at": datetime.utcnow(),
        "status": "pendiente"
    }
    db.contact_messages.insert_one(message_doc)
    return {"message": "Mensaje de contacto recibido con éxito."}

@router.get("/news", response_description="Get financial news")
async def get_news():
    # Mock de noticias. En una implementación real, se integraría con una API de noticias.
    mock_news = [
        {
            "id": "1",
            "source": "Bloomberg",
            "title": "Mercados Globales Reaccionan a Nuevas Políticas Económicas",
            "summary": "Analistas observan con cautela los movimientos en las principales bolsas tras los anuncios de la Reserva Federal.",
            "date": "2023-10-26T10:00:00Z"
        },
        {
            "id": "2",
            "source": "Reuters",
            "title": "Innovación en IA Impulsa Acciones Tecnológicas",
            "summary": "El sector tecnológico muestra un fuerte crecimiento impulsado por avances en inteligencia artificial y semiconductores.",
            "date": "2023-10-26T09:30:00Z"
        },
        {
            "id": "3",
            "source": "Financial Times",
            "title": "El Futuro de las Inversiones Sostenibles",
            "summary": "Cada vez más inversores buscan oportunidades en empresas con sólidos criterios ESG (Ambientales, Sociales y de Gobernanza).",
            "date": "2023-10-25T15:00:00Z"
        }
    ]
    return mock_news

## Endpoint y lógica de chatbot eliminados

@router.post("/stock-data", response_description="Get real-time stock data from Yahoo Finance")
async def get_stock_data(
    current_user: Annotated[User, Depends(get_current_user)],
    stock_data: Dict[str, Any] = Body(...)
):
    """
    Obtiene datos en tiempo real de acciones desde Yahoo Finance.
    Recibe una lista de tickers y retorna precios, nombres y métricas.
    """
    tickers = stock_data.get("tickers", [])
    if not tickers:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Tickers list is required")
    
    try:
        import yfinance as yf
        
        stock_info = []
        for ticker in tickers:
            try:
                stock = yf.Ticker(ticker)
                info = stock.info
                
                # Obtener precio actual
                current_price = info.get('currentPrice') or info.get('regularMarketPrice') or info.get('previousClose', 0)
                
                # Obtener cambio del día
                previous_close = info.get('previousClose', current_price)
                price_change = current_price - previous_close
                price_change_percent = (price_change / previous_close * 100) if previous_close else 0
                
                stock_info.append({
                    "ticker": ticker,
                    "name": info.get('longName') or info.get('shortName') or ticker,
                    "current_price": round(current_price, 2),
                    "previous_close": round(previous_close, 2),
                    "price_change": round(price_change, 2),
                    "price_change_percent": round(price_change_percent, 2),
                    "currency": info.get('currency', 'USD'),
                    "market_cap": info.get('marketCap'),
                    "volume": info.get('volume'),
                    "pe_ratio": info.get('trailingPE'),
                    "dividend_yield": info.get('dividendYield')
                })
            except Exception as e:
                # Si falla un ticker específico, agregar datos de error
                stock_info.append({
                    "ticker": ticker,
                    "name": ticker,
                    "current_price": 0,
                    "error": str(e)
                })
        
        return {"stocks": stock_info}
    
    except ImportError:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="yfinance library is not installed. Please install it with: pip install yfinance"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error fetching stock data: {str(e)}"
        )
