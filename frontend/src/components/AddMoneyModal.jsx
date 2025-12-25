import React, { useState } from "react";

const AddMoneyModal = ({ goal, onConfirm, onCancel }) => {
  const [amount, setAmount] = useState("");

  const submit = () => {
    if (!amount || Number(amount) <= 0) {
      alert("Enter a valid amount");
      return;
    }
    onConfirm(Number(amount));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-xl w-96 text-white">
        <h3 className="text-lg font-semibold mb-2">
          Add Money to "{goal.goalName}"
        </h3>

        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full bg-slate-700 p-2 rounded mb-4"
        />

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded bg-white/10 hover:bg-white/20"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;
