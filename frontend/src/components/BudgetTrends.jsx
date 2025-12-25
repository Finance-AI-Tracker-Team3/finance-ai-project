import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const BudgetTrends = ({ budgets }) => {
  const data = budgets.map((b) => ({
    name: `Cat ${b.categoryId}`,
    spent: Math.abs(b.spent || 0),
    limit: b.amountLimit,
  }));

  if (data.length === 0) return null;

  return (
    <div className="bg-white/5 p-4 rounded-xl mb-6">
      <h3 className="mb-3 font-semibold">Monthly Budget Trends</h3>

      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="limit" stroke="#6366f1" />
          <Line type="monotone" dataKey="spent" stroke="#ef4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetTrends;
