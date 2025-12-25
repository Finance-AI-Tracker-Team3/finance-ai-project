import os
import pickle
import pandas as pd
from sklearn.ensemble import IsolationForest
from decimal import Decimal


class AnomalyDetector:
    """AI Model: Anomaly detection using Isolation Forest (with persistence)"""

    MODEL_DIR = "models/saved_models/isolation_forest"

    def detect_anomalies(self, expenses_data, user_id=None):

        if not expenses_data or len(expenses_data) < 15:
            return {
                "message": "Need at least 15 transactions",
                "anomalies": []
            }

        os.makedirs(self.MODEL_DIR, exist_ok=True)

        df = pd.DataFrame(expenses_data)
        df["amount"] = df["amount"].apply(lambda x: float(x) if isinstance(x, Decimal) else x)

        anomalies = []

        for category in df["category"].unique():
            cat_df = df[df["category"] == category]

            if len(cat_df) < 5:
                continue

            X = cat_df[["amount"]]

            model_path = f"{self.MODEL_DIR}/if_user_{user_id}_{category}.pkl"

            # Load or Train
            if user_id and os.path.exists(model_path):
                with open(model_path, "rb") as f:
                    model = pickle.load(f)
            else:
                model = IsolationForest(
                    contamination=0.1,
                    random_state=42
                )
                model.fit(X)

                if user_id:
                    with open(model_path, "wb") as f:
                        pickle.dump(model, f)

            preds = model.predict(X)
            cat_df = cat_df.copy()
            cat_df["anomaly"] = preds

            for _, row in cat_df[cat_df["anomaly"] == -1].iterrows():
                anomalies.append({
                    "expense_id": int(row["expense_id"]),
                    "category": category,
                    "amount": round(float(row["amount"]), 2),
                    "severity": "high"
                })

        return {
            "total_anomalies": len(anomalies),
            "anomalies": anomalies,
            "insight": "⚠️ Unusual spending detected" if anomalies else "✓ Spending is normal"
        }
