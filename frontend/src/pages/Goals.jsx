import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import {
  getGoals,
  createGoal,
  deleteGoal,
  transferToGoal,
} from "../services/goalService";
import { getAccounts } from "../services/apiService";

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [transferGoal, setTransferGoal] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");

  const load = async () => {
    const [g, a] = await Promise.all([getGoals(), getAccounts()]);
    setGoals(g.data || []);
    setAccounts(a.data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    await createGoal({ goalName, targetAmount });
    setGoalName("");
    setTargetAmount("");
    load();
  };

  const transfer = async () => {
    await transferToGoal(transferGoal.goalId, accountId, amount);
    setTransferGoal(null);
    setAccountId("");
    setAmount("");
    load();
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-xl font-semibold mb-6">Savings Goals</h1>

      <div className="flex gap-3 mb-6">
        <input
          placeholder="Goal name"
          value={goalName}
          onChange={(e) => setGoalName(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        />
        <input
          type="number"
          placeholder="Target amount"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          className="bg-slate-700 p-2 rounded"
        />
        <button onClick={submit} className="bg-indigo-500 px-4 py-2 rounded">
          Add Goal
        </button>
      </div>

      <div className="space-y-4">
        {goals.map((g) => {
          const percent = Math.min(
            (g.currentAmount / g.targetAmount) * 100,
            100
          );
          const completed = g.currentAmount >= g.targetAmount;

          return (
            <div key={g.goalId} className="bg-white/5 p-4 rounded-xl relative">
              {completed && <Confetti recycle={false} numberOfPieces={200} />}

              <div className="flex justify-between mb-2">
                <h3 className="font-semibold">
                  {g.goalName}
                  {completed && (
                    <span className="text-green-400 ml-2">🎉 Achieved</span>
                  )}
                </h3>
                <span>
                  ₹{g.currentAmount} / ₹{g.targetAmount}
                </span>
              </div>

              <div className="bg-white/10 h-2 rounded-full mb-3">
                <div
                  className={`h-2 rounded-full ${
                    completed ? "bg-green-400 animate-pulse" : "bg-indigo-500"
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <div className="flex justify-end gap-4 text-sm">
                <button
                  onClick={() => setTransferGoal(g)}
                  className="text-indigo-400"
                >
                  Transfer
                </button>
                <button
                  onClick={() => deleteGoal(g.goalId).then(load)}
                  className="text-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {transferGoal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
          <div className="bg-slate-800 p-6 rounded-xl w-96">
            <h3 className="mb-4 font-semibold">Transfer to Goal</h3>

            <select
              value={accountId}
              onChange={(e) => setAccountId(e.target.value)}
              className="w-full bg-slate-700 p-2 mb-3 rounded"
            >
              <option value="">Select Account</option>
              {accounts.map((a) => (
                <option key={a.accountId} value={a.accountId}>
                  {a.accountName} (₹{a.balance})
                </option>
              ))}
            </select>

            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-slate-700 p-2 mb-4 rounded"
            />

            <div className="flex justify-end gap-3">
              <button onClick={() => setTransferGoal(null)}>Cancel</button>
              <button
                onClick={transfer}
                className="bg-indigo-500 px-4 py-2 rounded"
              >
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
