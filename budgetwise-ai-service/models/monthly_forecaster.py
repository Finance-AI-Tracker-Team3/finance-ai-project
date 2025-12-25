import os
import pickle
import pandas as pd
from prophet import Prophet
from decimal import Decimal
from datetime import datetime


class MonthlyForecaster:
    """AI Model: Monthly spending forecast using Prophet (with persistence)"""

    MODEL_DIR = "models/saved_models/prophet"

    def forecast_next_month(self, expenses_data, user_id=None):

        if not expenses_data or len(expenses_data) < 10:
            return {
                "message": "Need at least 10 transactions",
                "predicted_spending": 0
            }

        os.makedirs(self.MODEL_DIR, exist_ok=True)

        df = pd.DataFrame(expenses_data)
        df["amount"] = df["amount"].apply(lambda x: float(x) if isinstance(x, Decimal) else x)
        df["date"] = pd.to_datetime(df["date"])

        monthly = df.resample("M", on="date")["amount"].sum().reset_index()
        monthly.columns = ["ds", "y"]

        model_path = f"{self.MODEL_DIR}/prophet_user_{user_id}.pkl"

        # Load or Train
        if user_id and os.path.exists(model_path):
            with open(model_path, "rb") as f:
                model = pickle.load(f)
        else:
            model = Prophet(yearly_seasonality=True)
            model.fit(monthly)

            if user_id:
                with open(model_path, "wb") as f:
                    pickle.dump(model, f)

        future = model.make_future_dataframe(periods=1, freq="M")
        forecast = model.predict(future)

        prediction = max(0, float(forecast["yhat"].iloc[-1]))

        trend_change = forecast["trend"].iloc[-1] - forecast["trend"].iloc[0]
        trend = "increasing" if trend_change > 0 else "decreasing" if trend_change < 0 else "stable"

        return {
            "predicted_spending": round(prediction, 2),
            "trend": trend,
            "confidence": "high",
            "analysis_date": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }
