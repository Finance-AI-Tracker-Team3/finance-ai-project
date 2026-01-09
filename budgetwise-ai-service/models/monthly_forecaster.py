import pandas as pd
import os
from prophet import Prophet


class MonthlyForecaster:

    MODEL_DIR = "models/saved_models"

    def forecast_next_month(self, expenses, user_id=None):
        if not expenses or len(expenses) < 2:
            return {
                "status": "insufficient_data",
                "message": "Not enough data to forecast monthly spending."
            }

        df = pd.DataFrame(expenses)
        df["date"] = pd.to_datetime(df["date"])
        df["amount"] = df["amount"].astype(float)

        # Prophet needs positive values
        df["amount"] = df["amount"].abs()

        monthly = (
            df.resample("ME", on="date")["amount"]
            .sum()
            .reset_index()
            .rename(columns={"date": "ds", "amount": "y"})
        )

        # Prophet needs at least 2 rows
        if len(monthly) < 2:
            return {
                "status": "insufficient_data",
                "message": "At least 2 months of data required for forecasting."
            }

        # ✅ FIX: Ensure directory exists
        os.makedirs(self.MODEL_DIR, exist_ok=True)

        model = Prophet()
        model.fit(monthly)

        future = model.make_future_dataframe(periods=1, freq="M")
        forecast = model.predict(future)

        next_month = forecast.iloc[-1]

        return {
            "status": "success",
            "predicted_month": str(next_month["ds"].date()),
            "predicted_spending": round(float(next_month["yhat"]), 2)
        }
