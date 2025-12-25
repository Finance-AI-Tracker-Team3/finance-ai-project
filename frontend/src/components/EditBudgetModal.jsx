import React, { useState } from "react";
import { updateBudget } from "../services/budgetService";

const EditBudgetModal = ({ budget, close, refresh }) => {
  const [amount, setAmount] = useState(budget.amountLimit);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!amount) return alert("Enter amount");

    try {
      setLoading(true);
      await updateBudget(budget.budgetId, {
        categoryId: budget.categoryId,
        amountLimit: Number(amount),
        startDate: budget.startDate,
        endDate: budget.endDate,
      });
      refresh();
      close();
    } catch (err) {
      console.error(err);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-80">
        <h3 className="text-lg mb-4">Edit Budget</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-4 p-2 bg-slate-700 rounded"
        />

        <div className="flex justify-end gap-3">
          <button onClick={close} className="text-gray-400">
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={loading}
            className="bg-indigo-500 px-4 py-2 rounded"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditBudgetModal;
