import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";

import CategoryTrends from "./CategoryTrends";
import MonthlyForecast from "./MonthlyForecast";
import PeakDays from "./PeakDays";
import AdvancedInsights from "./AdvancedInsights";
import "./AiDashboard.css";

const AiDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [insights, setInsights] = useState(null);
  const [budgetData, setBudgetData] = useState(null);
  const [anomalyData, setAnomalyData] = useState(null);
  const [healthScore, setHealthScore] = useState(null);

  const [userId] = useState(1);
  const [userIncome] = useState(50000);

  useEffect(() => {
    fetchAllInsights();
  }, []);

  const fetchAllInsights = async () => {
    try {
      setLoading(true);

      const basicInsights = await apiService.getFullInsights(userId);
      const budget = await apiService.getBudgetRecommendations(userId);
      const anomalies = await apiService.getAnomalies(userId);
      const health = await apiService.getHealthScore(userId, userIncome);

      if (basicInsights.success) setInsights(basicInsights.data);
      if (budget.success) setBudgetData(budget.data);
      if (anomalies.success) setAnomalyData(anomalies.data);
      if (health.success) setHealthScore(health.data);
    } catch (err) {
      setError(
        "⚠️ Cannot connect to AI backend! Ensure Flask server is running."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading AI Insights...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error ⚠️</h2>
        <p>{error}</p>
        <button onClick={fetchAllInsights}>Retry</button>
      </div>
    );
  }

  return (
    <div className="ai-dashboard">
      <h1 className="title">🤖 AI Insights Dashboard</h1>

      {/* ================= TOP SUMMARY CARD GRID ================= */}
      {insights && (
        <div className="summary-grid">
          <div className="summary-card">
            <p>Total Expenses Analyzed</p>
            <h2>{insights.total_expenses_analyzed}</h2>
          </div>

          <div className="summary-card">
            <p>Total Spending</p>
            <h2>₹{insights.total_spending.toFixed(2)}</h2>
          </div>

          <div className="summary-card">
            <p>Analysis Period</p>
            <h2>{insights.analysis_period_months} months</h2>
          </div>

          {healthScore && (
            <div className="summary-card">
              <p>Health Score</p>
              <h2>{healthScore.overall_score}/100</h2>
            </div>
          )}
        </div>
      )}

      {/* ================= ADVANCED INSIGHTS SECTION ================= */}
      <div className="section-wrapper">
        <AdvancedInsights
          budgetData={budgetData}
          anomalyData={anomalyData}
          healthScore={healthScore}
        />
      </div>

      {/* ================= 3-COLUMN INSIGHTS GRID ================= */}
      {insights && (
        <div className="insight-grid">
          <div className="insight-card">
            <CategoryTrends data={insights.category_trends} />
          </div>

          <div className="insight-card">
            <PeakDays data={insights.spending_patterns} />
          </div>

          <div className="insight-card">
            <MonthlyForecast data={insights.monthly_forecast} />
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="dashboard-footer">
        Powered by Python Flask + Machine Learning 🔥
      </footer>
    </div>
  );
};

export default AiDashboard;
