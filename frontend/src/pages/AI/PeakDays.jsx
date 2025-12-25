import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

const PeakDays = ({ data }) => {
  if (!data || !data.peak_day_of_week) {
    return <div>Loading peak days analysis...</div>;
  }

  const weeklyData = data.weekly_spending_pattern.map(day => ({
    name: day.day,
    value: day.total_spent
  }));

  return (
    <div className="component-card">
      <h2>📅 Peak Spending Days Analysis</h2>

      <div className="peak-day-highlight">
        <h3>🎯 Peak Day: {data.peak_day_of_week.day}</h3>
        <p className="peak-amount">₹{data.peak_day_of_week.total_spent.toFixed(2)}</p>
        <p className="peak-details">
          {data.peak_day_of_week.transactions} transactions •
          Avg ₹{data.peak_day_of_week.average_per_transaction.toFixed(2)} per transaction
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={weeklyData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {weeklyData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>

      <div className="monthly-period">
        <h3>📆 Monthly Spending Pattern</h3>
        <div className="period-grid">
          <div className="period-item">
            <span className="period-label">Early (1-10)</span>
            <span className="period-amount">₹{data.monthly_period_analysis.early_month_total.toFixed(2)}</span>
          </div>
          <div className="period-item">
            <span className="period-label">Mid (11-20)</span>
            <span className="period-amount">₹{data.monthly_period_analysis.mid_month_total.toFixed(2)}</span>
          </div>
          <div className="period-item">
            <span className="period-label">Late (21-31)</span>
            <span className="period-amount">₹{data.monthly_period_analysis.late_month_total.toFixed(2)}</span>
          </div>
        </div>
        <p className="peak-period">
          Peak Period: <strong>{data.monthly_period_analysis.peak_period}</strong>
        </p>
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

export default PeakDays;
