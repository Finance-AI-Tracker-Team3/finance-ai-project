import pandas as pd
from decimal import Decimal
from datetime import datetime


class FinancialHealthScorer:
    """AI Model: Calculates financial health score based on spending behavior"""

    def calculate_score(self, expenses_data, user_income=None):
        """
        Calculates financial health score (0-100)
        Based on multiple factors:
        - Consistency (30 points)
        - Trend (25 points)
        - Category diversity (20 points)
        - Budget adherence (25 points)
        """
        if not expenses_data or len(expenses_data) < 10:
            return {
                "score": 0,
                "message": "Insufficient data for scoring"
            }

        df = pd.DataFrame(expenses_data)
        df['amount'] = df['amount'].apply(lambda x: float(x) if isinstance(x, Decimal) else x)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M')

        # Factor 1: Spending Consistency (0-30 points)
        monthly_totals = df.groupby('month')['amount'].sum()
        consistency_score = self._calculate_consistency_score(monthly_totals)

        # Factor 2: Spending Trend (0-25 points)
        trend_score = self._calculate_trend_score(monthly_totals)

        # Factor 3: Category Diversity (0-20 points)
        diversity_score = self._calculate_diversity_score(df)

        # Factor 4: Budget Adherence (0-25 points)
        budget_score = self._calculate_budget_score(df, user_income)

        total_score = consistency_score + trend_score + diversity_score + budget_score

        return {
            "overall_score": round(total_score, 1),
            "grade": self._get_grade(total_score),
            "breakdown": {
                "consistency": round(consistency_score, 1),
                "trend": round(trend_score, 1),
                "diversity": round(diversity_score, 1),
                "budget_adherence": round(budget_score, 1)
            },
            "insights": self._generate_score_insights(total_score, consistency_score, trend_score),
            "analysis_date": datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        }

    def _calculate_consistency_score(self, monthly_totals):
        """Lower variance = higher consistency = better score"""
        if len(monthly_totals) < 2:
            return 15  # Default mid score

        mean = monthly_totals.mean()
        std = monthly_totals.std()

        if mean == 0:
            return 15

        cv = (std / mean) * 100  # Coefficient of variation

        # Lower CV = more consistent
        if cv < 20:
            return 30
        elif cv < 40:
            return 22
        elif cv < 60:
            return 15
        else:
            return 8

    def _calculate_trend_score(self, monthly_totals):
        """Decreasing or stable spending = good"""
        if len(monthly_totals) < 2:
            return 12

        first_half = monthly_totals.iloc[:len(monthly_totals) // 2].mean()
        second_half = monthly_totals.iloc[len(monthly_totals) // 2:].mean()

        change = ((second_half - first_half) / first_half) * 100 if first_half > 0 else 0

        if change < -10:  # Decreasing spending
            return 25
        elif change < 5:  # Stable
            return 20
        elif change < 15:  # Slight increase
            return 12
        else:  # High increase
            return 5

    def _calculate_diversity_score(self, df):
        """Balanced spending across categories = better"""
        category_spending = df.groupby('category')['amount'].sum()

        num_categories = len(category_spending)

        if num_categories >= 5:
            return 20
        elif num_categories >= 3:
            return 15
        elif num_categories >= 2:
            return 10
        else:
            return 5

    def _calculate_budget_score(self, df, user_income):
        """Spending < 70% of income = good (if income provided)"""
        if user_income is None or user_income <= 0:
            return 12  # Default mid score if no income data

        total_spending = df['amount'].sum()
        num_months = df['date'].dt.to_period('M').nunique()
        avg_monthly_spending = total_spending / num_months if num_months > 0 else total_spending

        spending_ratio = (avg_monthly_spending / user_income) * 100

        if spending_ratio < 50:
            return 25
        elif spending_ratio < 70:
            return 18
        elif spending_ratio < 90:
            return 10
        else:
            return 3

    def _get_grade(self, score):
        """Convert score to letter grade"""
        if score >= 85:
            return "A+ Excellent"
        elif score >= 75:
            return "A Good"
        elif score >= 65:
            return "B Fair"
        elif score >= 50:
            return "C Needs Improvement"
        else:
            return "D Poor"

    def _generate_score_insights(self, total_score, consistency_score, trend_score):
        """Generate personalized insights"""
        insights = []

        if total_score >= 80:
            insights.append("🎉 Excellent financial discipline! Keep it up!")
        elif total_score >= 60:
            insights.append("👍 Good spending habits. Room for improvement.")
        else:
            insights.append("⚠️ Consider reviewing your spending patterns.")

        if consistency_score < 15:
            insights.append("💡 Your spending varies significantly. Try setting monthly budgets.")

        if trend_score < 12:
            insights.append("📈 Your spending is increasing. Look for areas to cut back.")

        return insights
