import yfinance as yf
from typing import List, Dict, Any
from fastapi import HTTPException

class YahooFinanceService:
    """Servicio para obtener datos de Yahoo Finance"""
    
    @staticmethod
    def get_stock_data(tickers: List[str]) -> List[Dict[str, Any]]:
        """
        Obtiene datos en tiempo real de múltiples acciones
        
        Args:
            tickers: Lista de símbolos de acciones (ej: ['AAPL', 'GOOGL', 'MSFT'])
            
        Returns:
            Lista de diccionarios con información de cada acción
        """
        results = []
        
        for ticker in tickers:
            try:
                # Obtener datos de Yahoo Finance
                stock = yf.Ticker(ticker)
                info = stock.info
                history = stock.history(period="2d")
                
                # Validar que tenemos datos
                if len(history) < 1:
                    results.append({
                        "ticker": ticker,
                        "name": ticker,
                        "current_price": 0,
                        "previous_close": 0,
                        "price_change": 0,
                        "price_change_percent": 0,
                        "currency": "USD",
                        "error": "No hay datos disponibles"
                    })
                    continue
                
                # Obtener precio actual y anterior
                current_price = history['Close'].iloc[-1]
                previous_close = history['Close'].iloc[-2] if len(history) > 1 else current_price
                
                # Calcular cambios
                price_change = current_price - previous_close
                price_change_percent = (price_change / previous_close * 100) if previous_close != 0 else 0
                
                # Obtener nombre de la empresa
                company_name = info.get('longName', info.get('shortName', ticker))
                currency = info.get('currency', 'USD')
                
                results.append({
                    "ticker": ticker,
                    "name": company_name,
                    "current_price": round(float(current_price), 2),
                    "previous_close": round(float(previous_close), 2),
                    "price_change": round(float(price_change), 2),
                    "price_change_percent": round(float(price_change_percent), 2),
                    "currency": currency,
                    "market_cap": info.get('marketCap'),
                    "volume": info.get('volume'),
                    "fifty_two_week_high": info.get('fiftyTwoWeekHigh'),
                    "fifty_two_week_low": info.get('fiftyTwoWeekLow'),
                })
                
            except Exception as e:
                print(f"Error obteniendo datos para {ticker}: {str(e)}")
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
            period: Período de tiempo (1d, 5d, 1mo, 3mo, 6mo, 1y, 2y, 5y, 10y, ytd, max)
            
        Returns:
            Diccionario con datos históricos
        """
        try:
            stock = yf.Ticker(ticker)
            history = stock.history(period=period)
            
            if history.empty:
                raise HTTPException(status_code=404, detail=f"No se encontraron datos para {ticker}")
            
            # Convertir a formato JSON serializable
            data = []
            for date, row in history.iterrows():
                data.append({
                    "date": date.strftime("%Y-%m-%d"),
                    "open": round(float(row['Open']), 2),
                    "high": round(float(row['High']), 2),
                    "low": round(float(row['Low']), 2),
                    "close": round(float(row['Close']), 2),
                    "volume": int(row['Volume'])
                })
            
            return {
                "ticker": ticker,
                "period": period,
                "data": data
            }
            
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error obteniendo datos históricos: {str(e)}")
