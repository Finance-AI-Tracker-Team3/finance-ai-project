import pandas as pd
from decimal import Decimal
from datetime import datetime


class FinancialHealthScorer:
    """AI Model: Calculates financial health score based on spending behavior"""

    def calculate_score(self, expenses_data, user_income=None):

        if not expenses_data or len(expenses_data) < 5:
            return {
                "overall_score": 0,
                "grade": "Insufficient Data",
                "breakdown": {},
                "insights": ["Add more transactions to generate insights"],
                "analysis_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
            }

        df = pd.DataFrame(expenses_data)
        df["amount"] = df["amount"].apply(lambda x: float(x) if isinstance(x, Decimal) else x)
        df["date"] = pd.to_datetime(df["date"])
        df["month"] = df["date"].dt.to_period("M")

        # Monthly totals
        monthly_totals = df.groupby("month")["amount"].sum()

        consistency = self._consistency_score(monthly_totals)
        trend = self._trend_score(monthly_totals)
        diversity = self._diversity_score(df)
        budget = self._budget_score(monthly_totals, user_income)

        total = consistency + trend + diversity + budget

        return {
            "overall_score": round(total, 1),
            "grade": self._grade(total),
            "breakdown": {
                "consistency": round(consistency, 1),
                "trend": round(trend, 1),
                "diversity": round(diversity, 1),
                "budget_adherence": round(budget, 1)
            },
            "insights": self._insights(total, consistency, trend, budget),
            "analysis_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    # ---------- SCORING HELPERS ----------

    def _consistency_score(self, monthly):
        if len(monthly) < 2:
            return 15

        std = monthly.std()
        mean = monthly.mean()

        if mean == 0:
            return 15

        cv = (std / mean) * 100

        if cv < 25:
            return 30
        elif cv < 50:
            return 22
        elif cv < 75:
            return 15
        else:
            return 8

    def _trend_score(self, monthly):
        if len(monthly) < 2:
            return 12

        first = monthly.iloc[:len(monthly)//2].mean()
        second = monthly.iloc[len(monthly)//2:].mean()

        if first == 0:
            return 12

        change = ((second - first) / first) * 100

        if change < -10:
            return 25
        elif change < 10:
            return 18
        elif change < 25:
            return 10
        else:
            return 5

    def _diversity_score(self, df):
        categories = df["category"].nunique()
        return min(categories * 4, 20)

    def _budget_score(self, monthly, income):
        if not income or income <= 0:
            return 12

        avg_spend = monthly.mean()
        ratio = (avg_spend / income) * 100

        if ratio < 50:
            return 25
        elif ratio < 70:
            return 18
        elif ratio < 90:
            return 10
        else:
            return 5

    def _grade(self, score):
        if score >= 85:
            return "A+ Excellent"
        elif score >= 70:
            return "A Good"
        elif score >= 55:
            return "B Fair"
        elif score >= 40:
            return "C Needs Improvement"
        else:
            return "D Poor"

    def _insights(self, total, consistency, trend, budget):
        insights = []

        if total >= 75:
            insights.append("🎉 Strong financial discipline")
        elif total >= 55:
            insights.append("👍 Good habits, can improve savings")
        else:
            insights.append("⚠️ Spending needs attention")

        if consistency < 15:
            insights.append("💡 Your spending varies a lot month to month")

        if trend < 10:
            insights.append("📈 Spending trend is rising")

        if budget < 10:
            insights.append("🚨 Expenses consume most of your income")

        return insights
