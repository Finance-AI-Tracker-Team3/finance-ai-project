import pandas as pd
from flask import Flask, request, jsonify
from flask_cors import CORS

from utils.db_connector import DatabaseConnector
from models.category_analyzer import CategoryAnalyzer
from models.day_analyzer import DayAnalyzer
from models.monthly_forecaster import MonthlyForecaster
from models.budget_recommender import BudgetRecommender
from models.anomaly_detector import AnomalyDetector
from models.financial_health_scorer import FinancialHealthScorer
from config import Config

# --------------------------------------------------
# App Initialization
# --------------------------------------------------

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

# --------------------------------------------------
# Initialize Components
# --------------------------------------------------

db = DatabaseConnector()

category_analyzer = CategoryAnalyzer()
day_analyzer = DayAnalyzer()
monthly_forecaster = MonthlyForecaster()
budget_recommender = BudgetRecommender()
anomaly_detector = AnomalyDetector()
health_scorer = FinancialHealthScorer()

# --------------------------------------------------
# Root & Health Endpoints
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "service": "BudgetWise AI Service",
        "version": "2.0.0",
        "status": "running",
        "description": "AI-powered expense analysis microservice",
        "endpoints": {
            "health": "/health",
            "full_insights": "/api/analyze/full-insights/<user_id>",
            "categories": "/api/analyze/categories/<user_id>",
            "peak_days": "/api/analyze/peak-days/<user_id>",
            "forecast": "/api/analyze/forecast/<user_id>",
            "budget_recommendations": "/api/analyze/budget-recommendations/<user_id>",
            "anomalies": "/api/analyze/anomalies/<user_id>",
            "health_score": "/api/analyze/health-score/<user_id>"
        }
    })


@app.route("/health", methods=["GET"])
def health_check():
    db_status = "connected" if db.test_connection() else "disconnected"
    return jsonify({
        "status": "healthy",
        "database": db_status,
        "timestamp": pd.Timestamp.now().strftime("%Y-%m-%d %H:%M:%S")
    })

# --------------------------------------------------
# Core AI Endpoints
# --------------------------------------------------

@app.route("/api/analyze/full-insights/<int:user_id>", methods=["GET"])
def full_insights(user_id):
    """
    Main endpoint:
    Runs all AI analyses and returns a complete insight report
    """
    try:
        months = request.args.get("months", 6, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({
                "success": False,
                "message": "No expense data found",
                "user_id": user_id
            }), 404

        category_trends = category_analyzer.analyze_trends(expenses)
        peak_days = day_analyzer.find_peak_days(expenses)
        monthly_forecast = monthly_forecaster.forecast_next_month(expenses, user_id)
        budget_recs = budget_recommender.recommend_budgets(expenses)
        anomalies = anomaly_detector.detect_anomalies(expenses, user_id)
        health_score = health_scorer.calculate_score(expenses)

        total_spending = round(
            sum(float(exp["amount"]) for exp in expenses), 2
        )

        response = {
            "user_id": user_id,
            "analysis_period_months": months,
            "total_transactions": len(expenses),
            "total_spending": total_spending,
            "category_trends": category_trends,
            "peak_spending_patterns": peak_days,
            "monthly_forecast": monthly_forecast,
            "budget_recommendations": budget_recs,
            "anomaly_report": anomalies,
            "financial_health": health_score
        }

        db.save_insight(user_id, "FULL_ANALYSIS", response)

        return jsonify({
            "success": True,
            "data": response
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


@app.route("/api/analyze/categories/<int:user_id>", methods=["GET"])
def analyze_categories(user_id):
    try:
        months = request.args.get("months", 3, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": category_analyzer.analyze_trends(expenses)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/analyze/peak-days/<int:user_id>", methods=["GET"])
def analyze_peak_days(user_id):
    try:
        months = request.args.get("months", 3, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": day_analyzer.find_peak_days(expenses)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/analyze/forecast/<int:user_id>", methods=["GET"])
def forecast(user_id):
    try:
        months = request.args.get("months", 6, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": monthly_forecaster.forecast_next_month(expenses, user_id)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/analyze/budget-recommendations/<int:user_id>", methods=["GET"])
def budget_recommendations(user_id):
    try:
        months = request.args.get("months", 6, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": budget_recommender.recommend_budgets(expenses)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/analyze/anomalies/<int:user_id>", methods=["GET"])
def anomalies(user_id):
    """
    Overspending & anomaly detection using Isolation Forest
    """
    try:
        months = request.args.get("months", 6, type=int)
        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": anomaly_detector.detect_anomalies(expenses, user_id)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@app.route("/api/analyze/health-score/<int:user_id>", methods=["GET"])
def health_score(user_id):
    try:
        months = request.args.get("months", 6, type=int)
        income = request.args.get("income", type=float)

        expenses = db.get_user_expenses(user_id, months)

        if not expenses:
            return jsonify({"success": False, "message": "No expense data found"}), 404

        return jsonify({
            "success": True,
            "data": health_scorer.calculate_score(expenses, income)
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# --------------------------------------------------
# App Runner
# --------------------------------------------------

if __name__ == "__main__":
    print("=" * 60)
    print("🚀 Starting BudgetWise AI Service")
    print("🤖 AI Features Enabled:")
    print("  1. Category trend detection")
    print("  2. Peak spending day analysis")
    print("  3. Monthly spending forecast (Prophet)")
    print("  4. Smart budget recommendations")
    print("  5. Anomaly detection (Isolation Forest)")
    print("  6. Financial health scoring")
    print("=" * 60)

    if db.test_connection():
        print("✓ Database connected successfully")
    else:
        print("✗ Database connection failed (check config.py)")

    app.run(host="0.0.0.0", port=5001, debug=True)
