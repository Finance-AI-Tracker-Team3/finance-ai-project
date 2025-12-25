import pandas as pd
from datetime import datetime


class CategoryAnalyzer:
    """AI Model: Analyzes spending trends across categories"""

    def analyze_trends(self, expenses_data):
        """
        Identifies which expense categories are increasing

        Args:
            expenses_data: List of expense dictionaries

        Returns:
            List of categories with growth analysis
        """
        if not expenses_data or len(expenses_data) < 5:
            return {
                "message": "Need at least 5 transactions for analysis",
                "categories": []
            }

        df = pd.DataFrame(expenses_data)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')

        # Group by category and month
        monthly_category = df.groupby(['category', 'month'])['amount'].sum().reset_index()

        results = []
        categories = df['category'].unique()

        for category in categories:
            cat_data = monthly_category[monthly_category['category'] == category]

            if len(cat_data) >= 2:
                # Compare current month vs previous month
                current_month = float(cat_data.iloc[-1]['amount'])
                previous_month = float(cat_data.iloc[-2]['amount'])

                # Calculate growth rate
                if previous_month > 0:
                    growth_rate = ((current_month - previous_month) / previous_month) * 100
                else:
                    growth_rate = 100.0 if current_month > 0 else 0.0

                # Determine trend status
                if growth_rate > 15:
                    trend = "increasing"
                    alert = "⚠️ High increase"
                elif growth_rate < -15:
                    trend = "decreasing"
                    alert = "✓ Good reduction"
                else:
                    trend = "stable"
                    alert = "→ Stable"

                results.append({
                    "category": category,
                    "current_spending": round(current_month, 2),
                    "previous_spending": round(previous_month, 2),
                    "growth_rate": round(growth_rate, 2),
                    "trend": trend,
                    "alert": alert,
                    "total_transactions": int(len(df[df['category'] == category]))
                })
            else:
                # Only one month of data
                total = float(cat_data['amount'].sum())
                results.append({
                    "category": category,
                    "current_spending": round(total, 2),
                    "previous_spending": 0,
                    "growth_rate": 0,
                    "trend": "insufficient_data",
                    "alert": "ℹ️ Need more data",
                    "total_transactions": int(len(df[df['category'] == category]))
                })

        # Sort by growth rate descending
        results.sort(key=lambda x: x['growth_rate'], reverse=True)

        # Identify top growing category
        top_category = results[0] if results else None

        return {
            "categories": results,
            "top_growing_category": top_category['category'] if top_category else None,
            "analysis_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }
