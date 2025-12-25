import React, { useEffect, useState } from "react";
import {
  getBudgets,
  createBudget,
  deleteBudget,
} from "../services/budgetService";
import { getCategories } from "../services/apiService";

/* ✅ Components */
import EditBudgetModal from "../components/EditBudgetModal";
import BudgetAlert from "../components/BudgetAlert";
import BudgetTrends from "../components/BudgetTrends";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

const Budgets = () => {
  const [budgets, setBudgets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(true);

  /* ✏️ Edit modal */
  const [editBudget, setEditBudget] = useState(null);

  /* ❌ Delete modal */
  const [deleteBudgetId, setDeleteBudgetId] = useState(null);

  /* ================= LOAD ================= */

  const load = async () => {
    try {
      setLoading(true);
      const [bRes, cRes] = await Promise.all([getBudgets(), getCategories()]);
      setBudgets(bRes?.data || []);
      setCategories(cRes?.data || []);
    } catch (err) {
      console.error("Failed to load budgets", err);
      alert("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /* ================= CREATE ================= */

  const submit = async () => {
    if (!categoryId || !amount) {
      alert("Please select category and amount");
      return;
    }

    try {
      await createBudget({
        categoryId: Number(categoryId),
        amountLimit: Number(amount),
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date(
          new Date().getFullYear(),
          new Date().getMonth() + 1,
          0
        )
          .toISOString()
          .slice(0, 10),
      });

      setCategoryId("");
      setAmount("");
      load();
    } catch (err) {
      console.error("Create budget failed", err);
      alert("Failed to create budget");
    }
  };

  /* ================= DELETE ================= */

  const confirmDelete = async () => {
    try {
      await deleteBudget(deleteBudgetId);
      setDeleteBudgetId(null);
      load();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete budget");
    }
  };

  /* ================= HELPERS ================= */

  const getCategoryName = (id) =>
    categories.find((c) => c.categoryId === id)?.categoryName || "—";

  /* ================= UI ================= */

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-4">Budgets</h1>

      {/* 🔔 Alerts */}
      <BudgetAlert budgets={budgets} />

      {/* 📊 Trends */}
      <BudgetTrends budgets={budgets} />

      {/* ➕ Add Budget */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Limit Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        />

        <button
          onClick={submit}
          className="bg-indigo-500 px-4 py-2 rounded hover:bg-indigo-600"
        >
          Add
        </button>
      </div>

      {/* 📋 Table */}
      <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
        {loading ? (
          <p className="text-center text-sm text-gray-400">Loading...</p>
        ) : budgets.length === 0 ? (
          <p className="text-center text-sm text-gray-400">
            No budgets created
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-white/10">
              <tr>
                <th className="text-left py-2">Category</th>
                <th className="text-right">Limit</th>
                <th className="text-right">Spent</th>
                <th className="text-left">Progress</th>
                <th className="text-right">Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {budgets.map((b) => {
                const limit = Number(b.amountLimit || 0);
                const spent = Math.abs(Number(b.spent || 0));
                const percent =
                  limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
                const exceeded = spent > limit;

                return (
                  <tr key={b.budgetId} className="border-b border-white/5">
                    <td className="py-2">{getCategoryName(b.categoryId)}</td>
                    <td className="text-right">₹{limit}</td>
                    <td className="text-right">₹{spent}</td>

                    <td className="w-56">
                      <div className="bg-white/10 h-2 rounded-full">
                        <div
                          className={`h-2 rounded-full ${
                            exceeded ? "bg-red-500" : "bg-green-500"
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <p className="text-xs mt-1 text-right">
                        {percent.toFixed(0)}%
                      </p>
                    </td>

                    <td
                      className={`text-right font-medium ${
                        exceeded ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      {exceeded ? "Exceeded" : "Within"}
                    </td>

                    <td className="text-right flex gap-2 justify-end">
                      <button
                        onClick={() => setEditBudget(b)}
                        className="text-indigo-400 hover:text-indigo-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => setDeleteBudgetId(b.budgetId)}
                        className="text-red-400 hover:text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* ✏️ Edit Modal */}
      {editBudget && (
        <EditBudgetModal
          budget={editBudget}
          close={() => setEditBudget(null)}
          refresh={load}
        />
      )}

      {/* ❌ Delete Modal */}
      {deleteBudgetId && (
        <ConfirmDeleteModal
          title="Delete Budget"
          message="Are you sure you want to delete this budget? This action cannot be undone."
          onCancel={() => setDeleteBudgetId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Budgets;
