import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
from decimal import Decimal


class AnomalyDetector:
    """AI Model: Anomaly detection using Isolation Forest"""

    def detect_anomalies(self, expenses_data):

        if not expenses_data or len(expenses_data) < 10:
            return {
                "total_anomalies": 0,
                "anomalies": [],
                "insight": "Not enough data for anomaly detection"
            }

        df = pd.DataFrame(expenses_data)
        df["amount"] = df["amount"].apply(lambda x: float(x) if isinstance(x, Decimal) else x)

        X = df[["amount"]]

        model = IsolationForest(
            n_estimators=100,
            contamination=0.15,
            random_state=42
        )

        preds = model.fit_predict(X)
        df["anomaly"] = preds

        mean_amt = df["amount"].mean()
        anomalies = []

        for _, row in df[df["anomaly"] == -1].iterrows():
            severity = "high" if row["amount"] > mean_amt * 1.6 else "medium"
            anomalies.append({
                "expense_id": row["expense_id"],
                "category": row["category"],
                "amount": round(row["amount"], 2),
                "date": row["date"],
                "severity": severity,
                "description": "Unusual spending compared to your normal pattern"
            })

        return {
            "total_anomalies": len(anomalies),
            "anomalies": anomalies,
            "insight": "⚠️ Unusual spending detected" if anomalies else "✓ Spending looks normal"
        }
