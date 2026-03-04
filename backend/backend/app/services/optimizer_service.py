import os
import json
import random
from datetime import datetime

import google.genai as genai
import numpy as np
import pandas as pd
import yfinance as yf
from pypfopt.expected_returns import mean_historical_return
from pypfopt.risk_models import sample_cov
from pypfopt.efficient_frontier import EfficientFrontier

from typing import Dict, Any, List

# Configurar la API Key
api_key = os.getenv("API_KEY_GEMINI")
client = None
if api_key:
    try:
        client = genai.Client(api_key=api_key)
    except Exception as e:
        print(f"[genai] Error configurando API: {e}")

# más símbolos con nombres y sectores para fallback aleatorio
ASSET_UNIVERSE = [
    {"ticker": "VOO", "name": "Vanguard S&P 500 ETF", "sector": "Equity - US Large Cap"},
    {"ticker": "VTI", "name": "Vanguard Total Stock Market ETF", "sector": "Equity - US"},
    {"ticker": "QQQ", "name": "Invesco QQQ Trust", "sector": "Equity - US Tech"},
    {"ticker": "SPY", "name": "SPDR S&P 500 ETF Trust", "sector": "Equity - US Large Cap"},
    {"ticker": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "sector": "Fixed Income"},
    {"ticker": "BND", "name": "Vanguard Total Bond Market ETF", "sector": "Fixed Income"},
    {"ticker": "GLD", "name": "SPDR Gold Trust", "sector": "Commodity - Gold"},
    {"ticker": "EMB", "name": "iShares Emerging Markets Bond ETF", "sector": "Fixed Income"},
    {"ticker": "VWO", "name": "Vanguard FTSE Emerging Markets ETF", "sector": "Equity - Emerging"},
    {"ticker": "VNQ", "name": "Vanguard Real Estate ETF", "sector": "Real Estate"},
    {"ticker": "IWM", "name": "iShares Russell 2000 ETF", "sector": "Equity - Small Cap"},
    {"ticker": "XLF", "name": "Financial Select Sector SPDR Fund", "sector": "Equity - Financials"},
    {"ticker": "XLK", "name": "Technology Select Sector SPDR Fund", "sector": "Equity - Technology"},
    {"ticker": "XLE", "name": "Energy Select Sector SPDR Fund", "sector": "Equity - Energy"},
    {"ticker": "VNQ", "name": "Vanguard Real Estate ETF", "sector": "Real Estate"},
    {"ticker": "BTC-USD", "name": "Bitcoin USD", "sector": "Cryptocurrency"},
    {"ticker": "ETH-USD", "name": "Ethereum USD", "sector": "Cryptocurrency"}
]


def get_market_data(symbols: List[str], period: str = "1y") -> pd.DataFrame:
    """Descarga datos históricos de cierre para los símbolos y devuelve un DataFrame.
    Usa `auto_adjust` para simplificar la estructura de columnas.
    """
    try:
        df = yf.download(symbols, period=period, progress=False, auto_adjust=True)
        # `Close` puede estar en un nivel superior si se descargan múltiples símbolos
        if "Close" in df.columns:
            df = df["Close"]
        if isinstance(df, pd.Series):
            df = df.to_frame()
        return df.dropna(axis=1, how="all")
    except Exception as e:
        print(f"[market] Error descargando datos: {e}")
        raise


def select_assets(risk_level: str, num_assets: int = 6, seed: Any = None) -> List[Dict[str, Any]]:
    """Selecciona aleatoriamente activos del universo basado en el nivel de riesgo.

    La función filtra por sectores apropiados para cada perfil y luego elige
    aleatoriamente `num_assets`. Si el filtrado deja menos candidatos que el
    número deseado, se amplia al universo completo.
    """
    rng = random.Random(seed)
    risk = risk_level.lower()
    # definir qué sectores son compatibles con cada categoría
    if risk == "low":
        allowed = ["Fixed Income", "Commodity"]
    elif risk == "high":
        allowed = ["Equity", "Cryptocurrency", "Commodity", "Real Estate"]
    else:  # medio o cualquier otra cosa
        allowed = ["Equity", "Fixed Income", "Real Estate", "Commodity"]

    candidates = [a for a in ASSET_UNIVERSE if any(sec in a.get("sector", "") for sec in allowed)]
    if len(candidates) < num_assets:
        candidates = ASSET_UNIVERSE.copy()
    selected = rng.sample(candidates, k=min(num_assets, len(candidates)))
    return selected


def optimize_weights(prices: pd.DataFrame) -> Dict[str, float]:
    """Usa PyPortfolioOpt para calcular pesos óptimos maximizando Sharpe.

    Si el resultado hace que un solo activo tenga prácticamente el 100% de
    la asignación, reajusta a una distribución mínima entre varios.
    """
    mu = mean_historical_return(prices)
    S = sample_cov(prices)
    ef = EfficientFrontier(mu, S)
    try:
        _ = ef.max_sharpe()
        cleaned = ef.clean_weights()
        # garantizar al menos dos activos y evitar >80% en uno
        positives = [k for k, v in cleaned.items() if v > 0]
        if len(positives) < 2 and len(cleaned) > 1:
            # distribución uniforme obligatoria
            n = len(cleaned)
            return {sym: 1 / n for sym in cleaned}
        # si alguno es demasiado preponderante
        max_sym, max_val = max(cleaned.items(), key=lambda kv: kv[1])
        if max_val > 0.8 and len(cleaned) > 1:
            remainder = 1 - 0.7
            others = [sym for sym in cleaned if sym != max_sym]
            share = remainder / len(others)
            cleaned[max_sym] = 0.7
            for sym in others:
                cleaned[sym] = share
        return cleaned
    except Exception as e:
        print(f"[optimize] Error en optimización: {e}")
        # fallback: pesos iguales
        n = len(prices.columns)
        return {sym: 1 / n for sym in prices.columns}


def calculate_metrics(prices: pd.DataFrame, weights: Dict[str, float]) -> Dict[str, float]:
    """Calcula métricas básicas del portafolio a partir de precios históricos y pesos."""
    returns = prices.pct_change().dropna()
    portfolio_returns = returns.dot(pd.Series(weights))
    exp_return = portfolio_returns.mean() * 252
    vol = portfolio_returns.std() * (252 ** 0.5)
    sharpe = exp_return / vol if vol != 0 else 0
    # max drawdown
    cumulative = (1 + portfolio_returns).cumprod()
    max_drawdown = (cumulative / cumulative.cummax() - 1).min()
    return {
        "expected_return": float(exp_return),
        "volatility": float(vol),
        "sharpe_ratio": float(sharpe),
        "max_drawdown": float(max_drawdown)
    }




def generate_portfolio(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Intenta generar un portafolio con Gemini (si hay API key). Si hay cualquier fallo
    en la llamada (cuota, error, JSON inválido), cae automáticamente en la generación
    aleatoria controlada (`generate_portfolio_random`).
    """
    seed = preferences.get("seed") or preferences.get("random_seed")

    # primero trato con Gemini si el cliente está configurado
    if api_key and client:
        prompt = f"""
        Eres un asesor financiero experto. Crea un portafolio de inversión diversificado e inteligente para un cliente con el siguiente perfil:
        - Nivel de riesgo tolerado: {user_profile.get('risk_level', 'medio')}
        - Objetivo de inversión: {user_profile.get('investment_goal', 'crecimiento')}
        - Nivel de experiencia: {user_profile.get('experience_level', 'intermedio')}
        - País de residencia: {user_profile.get('country', 'desconocido')}
        - Monto inicial a invertir: {preferences.get('amount', 10000)} USD

        Reglas:
        1. Selecciona entre 5 y 8 activos (tickers reales de Yahoo Finance, ej. AAPL, SPY, TLT, BTC-USD).
        2. La suma de 'allocation_pct' debe ser exactamente 100.
        3. Adapta los activos a la situación macroeconómica del país del usuario pero mantén diversificación global.

        Devuelve ÚNICAMENTE un objeto JSON válido con la siguiente estructura exacta, sin texto adicional ni formato markdown:
        {{
            "assets": [
                {{
                    "ticker": "Símbolo",
                    "name": "Nombre completo de la empresa o fondo",
                    "allocation_pct": 20.5,
                    "reason": "Justificación breve y profesional de por qué este activo es ideal para este perfil."
                }}
            ],
            "metrics": {{
                "expected_return": 0.12,
                "risk": 0.08
            }}
        }}
        """

        try:
            model_to_use = "gemini-1.5-flash"
            response = client.models.generate_content(
                model=model_to_use,
                contents=prompt
            )
            response_text = response.text.strip() if hasattr(response, 'text') else str(response).strip()
            if response_text.startswith("```json"):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith("```"):
                response_text = response_text[3:-3].strip()
            portfolio_data = json.loads(response_text)
            if "assets" in portfolio_data and "metrics" in portfolio_data:
                print("[genai] Portafolio generado exitosamente con Gemini AI")
                # incluir seed si fue usado
                if seed is not None:
                    portfolio_data["seed"] = seed
                return portfolio_data
            else:
                raise ValueError("JSON inválido: falta 'assets' o 'metrics'")
        except Exception as e:
            print(f"[genai] Error o cuota, cayendo a generador aleatorio: {e}")
            # no retornamos nada aquí, dejamos que caiga al fallback abajo

    # si no hay key, no hubo cliente o falló Gemini, usamos generador aleatorio
    return generate_portfolio_random(user_profile, preferences, seed)


def generate_portfolio_random(user_profile: Dict[str, Any], preferences: Dict[str, Any], seed: Any = None) -> Dict[str, Any]:
    """Genera portafolios usando datos de mercado y aleatoriedad controlada."""
    risk = user_profile.get("risk_level", "medium").lower()
    amount = preferences.get("amount", 10000)
    num_assets = preferences.get("num_assets", 6)

    try:
        selected = select_assets(risk, num_assets, seed)
        symbols = [a["ticker"] for a in selected]
        prices = get_market_data(symbols)
        if prices.empty:
            raise ValueError("No se obtuvieron precios")
        weights = optimize_weights(prices)
        metrics = calculate_metrics(prices, weights)
        # construir salida con nombres, sectores, pesos
        portfolio = []
        for sym in weights:
            if weights[sym] <= 0:
                continue
            info = next((a for a in selected if a["ticker"] == sym), {})
            portfolio.append({
                "symbol": sym,
                "name": info.get("name", sym),
                "sector": info.get("sector", ""),
                "allocation": round(weights[sym] * 100, 2),
                "expected_return": metrics["expected_return"],
                "volatility": metrics["volatility"]
            })
        result = {
            "portfolio": portfolio,
            "total_allocation": sum(w for w in weights.values() if w > 0) * 100,
            "portfolio_metrics": metrics,
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "seed": seed
        }
        # compatibilidad: también devolver en formato antiguo para la ruta
        assets = []
        for item in portfolio:
            assets.append({
                "ticker": item.get("symbol"),
                "name": item.get("name"),
                "allocation_pct": item.get("allocation"),
                "reason": item.get("reason", "")
            })
        result["assets"] = assets
        result["metrics"] = metrics
        return result
    except Exception as e:
        print(f"[random] Error generando portafolio aleatorio: {e}")
        # fallback rígido anterior
        return generate_portfolio_static(user_profile, preferences)


def generate_portfolio_static(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Versión estática original (Respaldo)
    """
    risk_level = user_profile.get("risk_level", "medium")
    
    EXTENDED_ASSETS = [
        {"ticker": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "reason": "Bonos del tesoro estadounidense a largo plazo."},
        {"ticker": "JNJ", "name": "Johnson & Johnson", "reason": "Empresa farmacéutica estable con dividendos."},
        {"ticker": "MSFT", "name": "Microsoft Corporation", "reason": "Líder tecnológico global."},
        {"ticker": "EMB", "name": "iShares Emerging Markets Bond ETF", "reason": "Bonos de mercados emergentes."},
        {"ticker": "VT", "name": "Vanguard Total World Stock ETF", "reason": "Cobertura global diversificada."},
        {"ticker": "NVDA", "name": "NVIDIA Corporation", "reason": "Tecnología y semiconductores."},
        {"ticker": "BTC-USD", "name": "Bitcoin USD", "reason": "Criptomoneda líder, alta volatilidad."},
        {"ticker": "GLD", "name": "SPDR Gold Trust", "reason": "Oro físico, protección contra inflación."}
    ]

    if risk_level == "low":
        selected = EXTENDED_ASSETS[:5]
        allocations = [35, 25, 15, 15, 10]
        expected_return = 0.05
        risk = 0.03
    elif risk_level == "medium":
        selected = EXTENDED_ASSETS[:7]
        allocations = [25, 15, 15, 15, 10, 10, 10]
        expected_return = 0.10
        risk = 0.08
    else: 
        selected = EXTENDED_ASSETS[:8]
        allocations = [20, 15, 15, 15, 10, 10, 10, 5]
        expected_return = 0.18
        risk = 0.15

    portfolio_assets = []
    for i, asset in enumerate(selected):
        portfolio_assets.append({
            "ticker": asset["ticker"],
            "name": asset["name"],
            "allocation_pct": allocations[i],
            "reason": asset["reason"]
        })

    return {
        "assets": portfolio_assets,
        "metrics": {"expected_return": expected_return, "risk": risk}
    }