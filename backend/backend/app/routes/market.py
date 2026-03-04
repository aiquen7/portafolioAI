from fastapi import APIRouter, HTTPException
from typing import List
from pydantic import BaseModel
from app.services.yahoo_service import YahooFinanceService

router = APIRouter()
yahoo_service = YahooFinanceService()

class StockRequest(BaseModel):
    tickers: List[str]

@router.post("/stock-data")
async def get_stock_data(request: StockRequest):
    """
    Obtiene datos en tiempo real de múltiples acciones desde Yahoo Finance
    
    Body:
        tickers: Lista de símbolos de acciones
    
    Returns:
        Lista con información de cada acción
    """
    try:
        if not request.tickers:
            raise HTTPException(status_code=400, detail="La lista de tickers no puede estar vacía")
        
        stocks_data = yahoo_service.get_stock_data(request.tickers)
        
        return {
            "success": True,
            "count": len(stocks_data),
            "stocks": stocks_data
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo datos de mercado: {str(e)}")

@router.get("/historical/{ticker}")
async def get_historical_data(ticker: str, period: str = "1y"):
    """
    Obtiene datos históricos de una acción
    
    Args:
        ticker: Símbolo de la acción
        period: Período de tiempo (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
    
    Returns:
        Datos históricos de la acción
    """
    try:
        historical_data = yahoo_service.get_historical_data(ticker, period)
        return {
            "success": True,
            **historical_data
        }
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error obteniendo datos históricos: {str(e)}")
