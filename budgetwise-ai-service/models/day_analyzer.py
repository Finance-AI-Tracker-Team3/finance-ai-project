import pandas as pd
import numpy as np
from datetime import datetime
from decimal import Decimal


class DayAnalyzer:
    """AI Model: Identifies peak spending days and patterns"""

    def find_peak_days(self, expenses_data):
        """
        Analyzes which days user spends the most

        Args:
            expenses_data: List of expense dictionaries

        Returns:
            Dict with peak day analysis
        """
        if not expenses_data or len(expenses_data) < 5:
            return {
                "message": "Need at least 5 transactions for analysis",
                "peak_day_of_week": None
            }

        df = pd.DataFrame(expenses_data)

        # Convert Decimal to float
        df['amount'] = df['amount'].apply(lambda x: float(x) if isinstance(x, Decimal) else x)

        df['date'] = pd.to_datetime(df['date'])
        df['day_of_week'] = df['date'].dt.day_name()
        df['day_of_month'] = df['date'].dt.day

        # Analyze by day of week
        day_order = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
        weekly_spending = df.groupby('day_of_week')['amount'].agg(['sum', 'count', 'mean']).to_dict('index')

        # Convert to list format with ordering
        weekly_pattern = []
        for day in day_order:
            if day in weekly_spending:
                weekly_pattern.append({
                    "day": day,
                    "total_spent": round(float(weekly_spending[day]['sum']), 2),
                    "transactions": int(weekly_spending[day]['count']),
                    "average_per_transaction": round(float(weekly_spending[day]['mean']), 2)
                })

        # Find peak day of week
        if weekly_pattern:
            peak_day = max(weekly_pattern, key=lambda x: x['total_spent'])
        else:
            peak_day = None

        # Analyze by day of month (salary pattern detection)
        daily_spending = df.groupby('day_of_month')['amount'].sum()
        avg_daily = float(daily_spending.mean())
        std_daily = float(daily_spending.std())

        # Find high spending dates (above mean + 1 std deviation)
        high_spending_dates = []
        if std_daily > 0:
            threshold = avg_daily + std_daily
            high_spending_dates = daily_spending[daily_spending > threshold].index.tolist()

        # Detect spending pattern (early/mid/late month)
        early_month = float(df[df['day_of_month'] <= 10]['amount'].sum())
        mid_month = float(df[(df['day_of_month'] > 10) & (df['day_of_month'] <= 20)]['amount'].sum())
        late_month = float(df[df['day_of_month'] > 20]['amount'].sum())

        pattern_dict = {
            'Early (1-10)': early_month,
            'Mid (11-20)': mid_month,
            'Late (21-31)': late_month
        }
        peak_period = max(pattern_dict, key=pattern_dict.get)

        return {
            "peak_day_of_week": peak_day,
            "weekly_spending_pattern": weekly_pattern,
            "high_spending_dates": [int(d) for d in high_spending_dates],
            "monthly_period_analysis": {
                "early_month_total": round(early_month, 2),
                "mid_month_total": round(mid_month, 2),
                "late_month_total": round(late_month, 2),
                "peak_period": peak_period
            },
            "insights": self._generate_insights(peak_day, peak_period),
            "analysis_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    def _generate_insights(self, peak_day, peak_period):
        """Generate human-readable insights"""
        insights = []

        if peak_day:
            insights.append(f"You tend to spend most on {peak_day['day']}s (₹{peak_day['total_spent']})")

        insights.append(f"Your highest spending period is {peak_period} of the month")

        if peak_period == 'Early (1-10)':
            insights.append("Consider budgeting carefully after salary day")

        return insights
