import React, { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import {
  getAccounts,
  getCategories,
  updateExpenseApi,
} from "../services/apiService";

const EditExpenseModal = ({ transaction, close, refresh }) => {
  const [accounts, setAccounts] = useState([]);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    accountId: "",
    categoryId: "",
    description: "",
    amount: "",
    type: "EXPENSE",
  });

  useEffect(() => {
    getAccounts().then((r) => setAccounts(r.data));
    getCategories().then((r) => setCategories(r.data));

    setForm({
      accountId: transaction.accountId,
      categoryId: transaction.categoryId,
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      type: transaction.type,
    });
  }, [transaction]);

  const submit = async (e) => {
    e.preventDefault();

    await updateExpenseApi(transaction.transactionId, {
      ...form,
      amount: Number(form.amount),
    });

    refresh();
    close();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <form onSubmit={submit} className="bg-slate-800 p-6 rounded-xl w-96">
        <div className="flex justify-between mb-4">
          <h3>Edit Transaction</h3>
          <FiX onClick={close} className="cursor-pointer" />
        </div>

        <select
          value={form.accountId}
          onChange={(e) => setForm({ ...form, accountId: e.target.value })}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
        >
          {accounts.map((a) => (
            <option key={a.accountId} value={a.accountId}>
              {a.accountName}
            </option>
          ))}
        </select>

        <select
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
        >
          {categories.map((c) => (
            <option key={c.categoryId} value={c.categoryId}>
              {c.categoryName}
            </option>
          ))}
        </select>

        <input
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full mb-3 p-2 bg-slate-700 rounded"
        />

        <input
          type="number"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          className="w-full mb-4 p-2 bg-slate-700 rounded"
        />

        <button className="w-full bg-indigo-500 py-2 rounded">
          Update Transaction
        </button>
      </form>
    </div>
  );
};

export default EditExpenseModal;
