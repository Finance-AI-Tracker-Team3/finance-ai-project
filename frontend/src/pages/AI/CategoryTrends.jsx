import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CategoryTrends = ({ data }) => {
  if (!data || !data.categories) {
    return <div>Loading category trends...</div>;
  }

  const chartData = data.categories.map(cat => ({
    name: cat.category,
    current: cat.current_spending,
    previous: cat.previous_spending,
    growthRate: cat.growth_rate
  }));

  return (
    <div className="component-card">
      <h2>📊 Category Spending Trends</h2>
      <div className="top-category">
        <h3>🔥 Top Growing Category: {data.top_growing_category}</h3>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="previous" fill="#8884d8" name="Previous Month (₹)" />
          <Bar dataKey="current" fill="#82ca9d" name="Current Month (₹)" />
        </BarChart>
      </ResponsiveContainer>

      <div className="category-list">
        {data.categories.map((cat, index) => (
          <div key={index} className={`category-item ${cat.trend}`}>
            <div className="category-header">
              <span className="category-name">{cat.category}</span>
              <span className={`growth-rate ${cat.trend}`}>
                {cat.growth_rate > 0 ? '+' : ''}{cat.growth_rate}%
              </span>
            </div>
            <div className="category-details">
              <span>Previous: ₹{cat.previous_spending.toFixed(2)}</span>
              <span>Current: ₹{cat.current_spending.toFixed(2)}</span>
              <span className="alert">{cat.alert}</span>
            </div>
            <div className="category-stats">
              <small>{cat.total_transactions} transactions</small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryTrends;
