import React from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

const AdvancedInsights = ({ budgetData, anomalyData, healthScore }) => {

  // Financial Health Radar Chart Data
  const healthRadarData = healthScore?.breakdown ? [
    { category: 'Consistency', value: healthScore.breakdown.consistency, fullMark: 30 },
    { category: 'Trend', value: healthScore.breakdown.trend, fullMark: 25 },
    { category: 'Diversity', value: healthScore.breakdown.diversity, fullMark: 20 },
    { category: 'Budget', value: healthScore.breakdown.budget_adherence, fullMark: 25 }
  ] : [];

  // Budget comparison chart data
  const budgetChartData = budgetData?.recommendations?.map(rec => ({
    category: rec.category,
    recommended: rec.recommended_budget,
    current: rec.current_spending
  })) || [];

  return (
    <div className="advanced-insights">

      {/* Financial Health Score */}
      {healthScore && (
        <div className="component-card health-score-card">
          <h2>💯 Financial Health Score</h2>
          <div className="score-display">
            <div className="score-circle">
              <span className="score-number">{healthScore.overall_score}</span>
              <span className="score-total">/100</span>
            </div>
            <div className="score-grade">
              <h3>{healthScore.grade}</h3>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={healthRadarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="category" />
              <PolarRadiusAxis />
              <Radar name="Score" dataKey="value" stroke="#5B86E5" fill="#5B86E5" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>

          <div className="insights-box">
            <h4>💡 Insights</h4>
            {healthScore.insights.map((insight, idx) => (
              <p key={idx} className="insight-item">{insight}</p>
            ))}
          </div>
        </div>
      )}

      {/* Budget Recommendations */}
      {budgetData && budgetData.recommendations && (
        <div className="component-card budget-recommendations">
          <h2>🎯 Smart Budget Recommendations</h2>
          <div className="budget-summary">
            <div className="budget-stat">
              <span>Recommended Total</span>
              <strong>₹{budgetData.total_recommended_budget.toFixed(2)}</strong>
            </div>
            <div className="budget-stat">
              <span>Current Spending</span>
              <strong>₹{budgetData.total_current_spending.toFixed(2)}</strong>
            </div>
            <div className="budget-stat savings">
              <span>Total Savings</span>
              <strong>₹{(budgetData.total_recommended_budget - budgetData.total_current_spending).toFixed(2)}</strong>
            </div>
          </div>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={budgetChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="recommended" fill="#5B86E5" name="Recommended Budget (₹)" />
              <Bar dataKey="current" fill="#36D1DC" name="Current Spending (₹)" />
            </BarChart>
          </ResponsiveContainer>

          <div className="budget-list">
            {budgetData.recommendations.map((rec, idx) => (
              <div key={idx} className={`budget-item ${rec.status}`}>
                <div className="budget-header">
                  <span className="budget-category">{rec.category}</span>
                  <span className={`budget-status ${rec.status}`}>
                    {rec.status === 'over_budget' ? '⚠️ Over Budget' : '✓ Under Budget'}
                  </span>
                </div>
                <div className="budget-details">
                  <div>
                    <small>Recommended</small>
                    <strong>₹{rec.recommended_budget.toFixed(2)}</strong>
                  </div>
                  <div>
                    <small>Current</small>
                    <strong>₹{rec.current_spending.toFixed(2)}</strong>
                  </div>
                  <div>
                    <small>Variance</small>
                    <strong className={rec.variance > 0 ? 'negative' : 'positive'}>
                      {rec.variance > 0 ? '+' : ''}₹{Math.abs(rec.variance).toFixed(2)}
                    </strong>
                  </div>
                </div>
                {rec.savings_opportunity > 0 && (
                  <div className="savings-badge">
                    💰 Saving ₹{rec.savings_opportunity.toFixed(2)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Anomaly Detection */}
      {anomalyData && anomalyData.anomalies && anomalyData.anomalies.length > 0 && (
        <div className="component-card anomaly-detection">
          <h2>🚨 Unusual Transactions Detected</h2>
          <div className="anomaly-summary">
            <p>{anomalyData.insight}</p>
            <span className="anomaly-count">{anomalyData.total_anomalies} anomalies found</span>
          </div>

          <div className="anomaly-list">
            {anomalyData.anomalies.map((anomaly, idx) => (
              <div key={idx} className={`anomaly-item ${anomaly.severity}`}>
                <div className="anomaly-header">
                  <span className="anomaly-date">{anomaly.date}</span>
                  <span className={`severity-badge ${anomaly.severity}`}>
                    {anomaly.severity === 'high' ? '🔴' : '🟡'} {anomaly.severity.toUpperCase()}
                  </span>
                </div>
                <div className="anomaly-details">
                  <strong>{anomaly.category}</strong>
                  <span className="anomaly-amount">₹{anomaly.amount.toFixed(2)}</span>
                </div>
                <p className="anomaly-description">{anomaly.description}</p>
                <small className="anomaly-expected">Expected range: {anomaly.expected_range}</small>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default AdvancedInsights;
