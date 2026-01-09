import pandas as pd
from decimal import Decimal
from datetime import datetime


class OverspendingAlertEngine:
    """
    AI Rule-Based Overspending Alert Engine
    """

    def generate_alerts(self, expenses, monthly_income):
        alerts = []

        if not expenses or not monthly_income:
            return alerts

        df = pd.DataFrame(expenses)
        df["amount"] = df["amount"].apply(
            lambda x: float(x) if isinstance(x, Decimal) else x
        )
        df["date"] = pd.to_datetime(df["date"])

        # ------------------------------
        # 1️⃣ MONTHLY OVESPENDING CHECK
        # ------------------------------
        monthly_spend = df["amount"].sum()
        spending_ratio = (monthly_spend / monthly_income) * 100

        if spending_ratio > 90:
            alerts.append({
                "type": "CRITICAL",
                "title": "Severe Overspending",
                "message": f"You spent {spending_ratio:.1f}% of your income this month.",
                "suggestion": "Immediately reduce discretionary expenses."
            })
        elif spending_ratio > 80:
            alerts.append({
                "type": "WARNING",
                "title": "High Spending Alert",
                "message": f"You have spent {spending_ratio:.1f}% of your income.",
                "suggestion": "Track expenses carefully for the rest of the month."
            })

        # ------------------------------
        # 2️⃣ CATEGORY OVESPENDING
        # ------------------------------
        category_totals = df.groupby("category")["amount"].sum()

        for category, amount in category_totals.items():
            category_ratio = (amount / monthly_income) * 100

            if category_ratio > 30:
                alerts.append({
                    "type": "CATEGORY",
                    "title": f"Overspending in {category}",
                    "message": f"{category} accounts for {category_ratio:.1f}% of your income.",
                    "suggestion": f"Set a stricter budget for {category}."
                })

        # ------------------------------
        # 3️⃣ SPIKE DETECTION (RULE BASED)
        # ------------------------------
        avg_transaction = df["amount"].mean()

        spikes = df[df["amount"] > (2.5 * avg_transaction)]

        if not spikes.empty:
            alerts.append({
                "type": "ANOMALY",
                "title": "Unusual Spending Detected",
                "message": f"{len(spikes)} unusually high transactions found.",
                "suggestion": "Review recent large expenses."
            })

        # ------------------------------
        # META
        # ------------------------------
        for alert in alerts:
            alert["generated_at"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        return alerts
