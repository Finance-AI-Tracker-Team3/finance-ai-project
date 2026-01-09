from flask import Flask, request
from flask_cors import CORS

from utils.db_connector import DatabaseConnector
from models.category_analyzer import CategoryAnalyzer
from models.day_analyzer import DayAnalyzer
from models.monthly_forecaster import MonthlyForecaster
from models.budget_recommender import BudgetRecommender
from models.anomaly_detector import AnomalyDetector
from models.financial_health_scorer import FinancialHealthScorer
from models.overspending_alerts import OverspendingAlertEngine

app = Flask(__name__)
CORS(app)

db = DatabaseConnector()

category_analyzer = CategoryAnalyzer()
day_analyzer = DayAnalyzer()
monthly_forecaster = MonthlyForecaster()
budget_recommender = BudgetRecommender()
anomaly_detector = AnomalyDetector()
health_scorer = FinancialHealthScorer()
alert_engine = OverspendingAlertEngine()


@app.route("/")
def home():
    return {"service": "BudgetWise AI Service", "status": "running"}


# ---------------- FULL DASHBOARD ----------------
@app.route("/api/analyze/full-insights/<int:user_id>")
def full_insights(user_id):
    months = request.args.get("months", 6, type=int)
    income = request.args.get("income", type=float)

    expenses = db.get_user_expenses(user_id, months)

    if not expenses:
        return {"success": False, "message": "No expenses found"}, 404

    return {
        "success": True,
        "data": {
            "total_transactions": len(expenses),
            "total_spending": sum(e["amount"] for e in expenses),

            "category_trends": category_analyzer.analyze_trends(expenses),
            "peak_spending_patterns": day_analyzer.find_peak_days(expenses),
            "monthly_forecast": monthly_forecaster.forecast_next_month(expenses),
            "budget_recommendations": budget_recommender.recommend_budgets(expenses),
            "anomaly_report": anomaly_detector.detect_anomalies(expenses),
            "financial_health": health_scorer.calculate_score(expenses, income),
            "overspending_alerts": alert_engine.generate_alerts(expenses, income)
        }
    }


# ---------------- INDIVIDUAL ENDPOINTS ----------------
@app.route("/api/analyze/budget-recommendations/<int:user_id>")
def budget(user_id):
    expenses = db.get_user_expenses(user_id)
    return {"success": True, "data": budget_recommender.recommend_budgets(expenses)}


@app.route("/api/analyze/anomalies/<int:user_id>")
def anomalies(user_id):
    expenses = db.get_user_expenses(user_id)
    return {"success": True, "data": anomaly_detector.detect_anomalies(expenses)}


@app.route("/api/analyze/health-score/<int:user_id>")
def health_score(user_id):
    income = request.args.get("income", type=float)
    expenses = db.get_user_expenses(user_id)
    return {"success": True, "data": health_scorer.calculate_score(expenses, income)}


@app.route("/api/analyze/overspending-alerts/<int:user_id>")
def overspending_alerts(user_id):
    income = request.args.get("income", type=float)
    expenses = db.get_user_expenses(user_id)
    return {"success": True, "data": alert_engine.generate_alerts(expenses, income)}


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001, debug=True)
