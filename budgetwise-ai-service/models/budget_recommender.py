import pandas as pd
import numpy as np
from decimal import Decimal


class BudgetRecommender:
    """AI Model: Recommends personalized budget for each category"""

    def recommend_budgets(self, expenses_data):
        """
        Calculates recommended budget using statistical analysis
        Formula: Average + (Std Dev * Safety Factor)
        """
        if not expenses_data or len(expenses_data) < 10:
            return {
                "message": "Need at least 10 transactions for recommendations",
                "budgets": []
            }

        df = pd.DataFrame(expenses_data)
        df['amount'] = df['amount'].apply(lambda x: float(x) if isinstance(x, Decimal) else x)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')

        # Group by category and month
        monthly_category = df.groupby(['category', 'month'])['amount'].sum().reset_index()

        recommendations = []

        for category in df['category'].unique():
            cat_data = monthly_category[monthly_category['category'] == category]

            if len(cat_data) >= 2:
                avg = float(cat_data['amount'].mean())
                std = float(cat_data['amount'].std())

                # Conservative recommendation (avg + 1 std dev)
                recommended = avg + std

                # Current month spending
                current = float(cat_data.iloc[-1]['amount'])

                # Calculate if over/under budget
                variance = current - recommended
                variance_percent = (variance / recommended) * 100 if recommended > 0 else 0

                recommendations.append({
                    "category": category,
                    "recommended_budget": round(recommended, 2),
                    "current_spending": round(current, 2),
                    "variance": round(variance, 2),
                    "variance_percent": round(variance_percent, 2),
                    "status": "over_budget" if variance > 0 else "under_budget",
                    "savings_opportunity": round(abs(variance), 2) if variance < 0 else 0
                })

        # Sort by variance (highest overspending first)
        recommendations.sort(key=lambda x: x['variance'], reverse=True)

        return {
            "recommendations": recommendations,
            "total_recommended_budget": round(sum(r['recommended_budget'] for r in recommendations), 2),
            "total_current_spending": round(sum(r['current_spending'] for r in recommendations), 2)
        }
