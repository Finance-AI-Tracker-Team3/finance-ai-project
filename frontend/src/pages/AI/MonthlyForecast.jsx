import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const MonthlyForecast = ({ data }) => {
  if (!data || !data.historical_data) {
    return <div>Loading forecast...</div>;
  }

  // Add predicted month to chart
  const chartData = [
    ...data.historical_data,
    {
      month: 'Next Month',
      spending: data.predicted_spending
    }
  ];

  return (
    <div className="component-card">
      <h2>🔮 Monthly Spending Forecast</h2>

      <div className="forecast-highlight">
        <h3>Predicted Next Month Spending</h3>
        <p className="forecast-amount">₹{data.predicted_spending.toFixed(2)}</p>
        <div className="trend-indicator">
          <span className={`trend ${data.trend}`}>
            {data.trend_emoji} {data.trend.toUpperCase()}
          </span>
          <span className="trend-rate">₹{data.trend_rate.toFixed(2)}/month</span>
        </div>
        <div className="confidence">
          <span>Confidence: <strong>{data.confidence}</strong></span>
          <span className="confidence-score">({(data.confidence_score * 100).toFixed(0)}%)</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="spending"
            stroke="#8884d8"
            strokeWidth={2}
            name="Spending (₹)"
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="stats-grid">
        <div className="stat-item">
          <span className="stat-label">Average Monthly</span>
          <span className="stat-value">₹{data.average_monthly.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Min Monthly</span>
          <span className="stat-value">₹{data.min_monthly.toFixed(2)}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Max Monthly</span>
          <span className="stat-value">₹{data.max_monthly.toFixed(2)}</span>
        </div>
      </div>

      <div className="insights-box">
        <h4>💡 AI Insights</h4>
        {data.insights.map((insight, index) => (
          <p key={index} className="insight-item">{insight}</p>
        ))}
      </div>
    </div>
  );
};

export default MonthlyForecast;
