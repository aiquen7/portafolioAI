from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.services.yahoo_finance_service import YahooFinanceService
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

class StockDataRequest(BaseModel):
    tickers: List[str]

class HistoricalDataRequest(BaseModel):
    ticker: str
    period: str = "1y"

@router.post("/stock-data")
async def get_stock_data(request: StockDataRequest):
    """
    Obtiene datos actuales de múltiples acciones desde Yahoo Finance
    
    Request body:
        tickers: Lista de símbolos de acciones (ej: ["AAPL", "GOOGL", "MSFT"])
    
    Returns:
        stocks: Lista con información detallada de cada acción
    """
    try:
        if not request.tickers:
            raise HTTPException(status_code=400, detail="La lista de tickers no puede estar vacía")
        
        # Limitar a 50 tickers por request para evitar timeout
        if len(request.tickers) > 50:
            raise HTTPException(status_code=400, detail="Máximo 50 tickers por solicitud")
        
        logger.info(f"Obteniendo datos para {len(request.tickers)} tickers: {request.tickers}")
        
        stocks_data = YahooFinanceService.get_stock_data(request.tickers)
        
        return {
            "success": True,
            "count": len(stocks_data),
            "stocks": stocks_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_stock_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos de acciones: {str(e)}")

@router.post("/stock-data/historical")
async def get_historical_data(request: HistoricalDataRequest):
    """
    Obtiene datos históricos de una acción
    
    Request body:
        ticker: Símbolo de la acción
        period: Período ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
    
    Returns:
        Datos históricos de la acción
    """
    try:
        if not request.ticker:
            raise HTTPException(status_code=400, detail="El ticker es requerido")
        
        logger.info(f"Obteniendo datos históricos para {request.ticker} con período {request.period}")
        
        historical_data = YahooFinanceService.get_historical_data(request.ticker, request.period)
        
        if "error" in historical_data:
            raise HTTPException(status_code=404, detail=historical_data["error"])
        
        return {
            "success": True,
            **historical_data
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_historical_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos históricos: {str(e)}")

@router.get("/stock-data/{ticker}")
async def get_single_stock_data(ticker: str):
    """
    Obtiene datos actuales de una sola acción
    
    Path parameter:
        ticker: Símbolo de la acción
    
    Returns:
        Información detallada de la acción
    """
    try:
        logger.info(f"Obteniendo datos para ticker individual: {ticker}")
        
        stocks_data = YahooFinanceService.get_stock_data([ticker])
        
        if not stocks_data:
            raise HTTPException(status_code=404, detail=f"No se encontraron datos para {ticker}")
        
        stock = stocks_data[0]
        
        if "error" in stock and stock["current_price"] == 0:
            raise HTTPException(status_code=404, detail=stock["error"])
        
        return {
            "success": True,
            "stock": stock
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error en get_single_stock_data: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error al obtener datos de la acción: {str(e)}")
