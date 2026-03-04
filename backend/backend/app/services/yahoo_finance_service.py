import yfinance as yf
from typing import List, Dict, Any
import logging

logger = logging.getLogger(__name__)

class YahooFinanceService:
    """Servicio para obtener datos de Yahoo Finance"""
    
    @staticmethod
    def get_stock_data(tickers: List[str]) -> List[Dict[str, Any]]:
        """
        Obtiene datos actuales de acciones desde Yahoo Finance
        
        Args:
            tickers: Lista de símbolos de acciones (ej: ['AAPL', 'GOOGL', 'MSFT'])
            
        Returns:
            Lista de diccionarios con información de cada acción
        """
        results = []
        
        for ticker in tickers:
            try:
                # Obtener información de la acción
                stock = yf.Ticker(ticker)
                info = stock.info
                history = stock.history(period="5d")  # Últimos 5 días
                
                # Verificar si tenemos datos válidos
                if history.empty or not info:
                    logger.warning(f"No se encontraron datos para {ticker}")
                    results.append({
                        "ticker": ticker,
                        "name": ticker,
                        "current_price": 0,
                        "previous_close": 0,
                        "price_change": 0,
                        "price_change_percent": 0,
                        "currency": "USD",
                        "error": "No se encontraron datos"
                    })
                    continue
                
                # Obtener precio actual y anterior
                current_price = history['Close'].iloc[-1] if len(history) > 0 else 0
                previous_close = info.get('previousClose', history['Close'].iloc[-2] if len(history) > 1 else current_price)
                
                # Calcular cambio
                price_change = current_price - previous_close
                price_change_percent = (price_change / previous_close * 100) if previous_close > 0 else 0
                
                # Obtener nombre de la empresa
                company_name = info.get('longName') or info.get('shortName') or ticker
                
                # Obtener moneda
                currency = info.get('currency', 'USD')
                
                results.append({
                    "ticker": ticker,
                    "name": company_name,
                    "current_price": round(current_price, 2),
                    "previous_close": round(previous_close, 2),
                    "price_change": round(price_change, 2),
                    "price_change_percent": round(price_change_percent, 2),
                    "currency": currency,
                    "market_cap": info.get('marketCap'),
                    "volume": info.get('volume'),
                    "avg_volume": info.get('averageVolume'),
                    "day_high": info.get('dayHigh'),
                    "day_low": info.get('dayLow'),
                    "fifty_two_week_high": info.get('fiftyTwoWeekHigh'),
                    "fifty_two_week_low": info.get('fiftyTwoWeekLow'),
                    "pe_ratio": info.get('trailingPE'),
                    "dividend_yield": info.get('dividendYield'),
                    "sector": info.get('sector'),
                    "industry": info.get('industry')
                })
                
                logger.info(f"Datos obtenidos exitosamente para {ticker}: {company_name}")
                
            except Exception as e:
                logger.error(f"Error al obtener datos para {ticker}: {str(e)}")
                results.append({
                    "ticker": ticker,
                    "name": ticker,
                    "current_price": 0,
                    "previous_close": 0,
                    "price_change": 0,
                    "price_change_percent": 0,
                    "currency": "USD",
                    "error": f"Error: {str(e)}"
                })
        
        return results
    
    @staticmethod
    def get_historical_data(ticker: str, period: str = "1y") -> Dict[str, Any]:
        """
        Obtiene datos históricos de una acción
        
        Args:
            ticker: Símbolo de la acción
            period: Período de tiempo ('1d', '5d', '1mo', '3mo', '6mo', '1y', '2y', '5y', '10y', 'ytd', 'max')
            
        Returns:
            Diccionario con datos históricos
        """
        try:
            stock = yf.Ticker(ticker)
            history = stock.history(period=period)
            
            if history.empty:
                return {"error": "No se encontraron datos históricos"}
            
            # Convertir a lista de diccionarios
            data = []
            for date, row in history.iterrows():
                data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(row['Open'], 2),
                    "high": round(row['High'], 2),
                    "low": round(row['Low'], 2),
                    "close": round(row['Close'], 2),
                    "volume": int(row['Volume'])
                })
            
            return {
                "ticker": ticker,
                "period": period,
                "data": data
            }
            
        except Exception as e:
            logger.error(f"Error al obtener datos históricos para {ticker}: {str(e)}")
            return {"error": str(e)}
