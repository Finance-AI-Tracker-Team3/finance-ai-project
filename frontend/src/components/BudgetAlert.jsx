import React from "react";

const BudgetAlert = ({ budgets }) => {
  const exceeded = budgets.filter(
    (b) => Math.abs(b.spent || 0) > b.amountLimit
  );

  if (exceeded.length === 0) return null;

  return (
    <div className="bg-red-500/20 border border-red-500/40 p-4 rounded-xl mb-6">
      <h4 className="font-semibold text-red-300 mb-1">Budget Alert 🚨</h4>
      {exceeded.map((b) => (
        <p key={b.budgetId} className="text-sm">
          Budget exceeded for category ID: {b.categoryId}
        </p>
      ))}
    </div>
  );
};

export default BudgetAlert;
