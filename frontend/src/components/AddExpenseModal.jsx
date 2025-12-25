import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  getAccounts,
  getCategories,
  addExpenseApi,
} from "../services/apiService";

const AddExpenseModal = ({ close, refresh }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("EXPENSE");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadMeta();
  }, []);

  const loadMeta = async () => {
    try {
      const [accRes, catRes] = await Promise.all([
        getAccounts(),
        getCategories(),
      ]);
      setAccounts(accRes.data || []);
      setCategories(catRes.data || []);
    } catch (err) {
      console.error("Failed to load meta", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!accountId || !categoryId || !amount) {
      alert("Please fill all required fields");
      return;
    }

    try {
      setLoading(true);

      await addExpenseApi({
        accountId: Number(accountId),
        categoryId: Number(categoryId),
        type,
        amount: Number(amount),
        description: description || "",
      });

      refresh();
      close();
    } catch (err) {
      console.error("Failed to add expense", err);
      alert("Failed to add transaction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-6 rounded-xl w-96 text-white"
      >
        <div className="flex justify-between mb-4">
          <h3 className="text-lg font-semibold">Add Transaction</h3>
          <FiX onClick={close} className="cursor-pointer" />
        </div>

        {/* Account */}
        <label className="text-sm">Account *</label>
        <select
          value={accountId}
          onChange={(e) => setAccountId(e.target.value)}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
          required
        >
          <option value="">Select account</option>
          {accounts.map((a) => (
            <option key={a.accountId} value={a.accountId}>
              {a.accountName} ({a.currency})
            </option>
          ))}
        </select>

        {/* Category */}
        <label className="text-sm">Category *</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
          required
        >
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        {/* Description */}
        <label className="text-sm">Description</label>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
          placeholder="Optional"
        />

        {/* Amount */}
        <label className="text-sm">Amount *</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
          required
        />

        {/* Type */}
        <label className="text-sm">Type *</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full mb-4 p-2 bg-slate-700 rounded"
        >
          <option value="EXPENSE">Expense</option>
          <option value="INCOME">Income</option>
        </select>

        <button
          disabled={loading}
          className="w-full bg-indigo-500 py-2 rounded font-semibold disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Transaction"}
        </button>
      </form>
    </div>
  );
};

export default AddExpenseModal;
