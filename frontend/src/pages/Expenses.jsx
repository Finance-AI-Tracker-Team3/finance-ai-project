import React, { useEffect, useState } from "react";
import { FiTrash2, FiEdit } from "react-icons/fi";
import AddExpenseModal from "../components/AddExpenseModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import EditExpenseModal from "../components/EditExpenseModal";
import { getExpenses, deleteExpenseApi } from "../services/apiService";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [search, setSearch] = useState("");
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const res = await getExpenses();
      setExpenses(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const confirmDelete = async () => {
    try {
      await deleteExpenseApi(selected.transactionId);
      setExpenses((prev) =>
        prev.filter((e) => e.transactionId !== selected.transactionId)
      );
    } catch (err) {
      console.error(err);
    } finally {
      setOpenDelete(false);
      setSelected(null);
    }
  };

  const filtered = expenses.filter((e) =>
    e.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 text-white">
      <div className="flex justify-between mb-6">
        <h1 className="text-xl font-semibold">Expenses</h1>
        <button
          onClick={() => setOpenAdd(true)}
          className="bg-indigo-500 px-4 py-2 rounded-xl"
        >
          + Add Expense
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search expenses..."
        className="mb-4 w-full px-4 py-2 rounded bg-white/10"
      />

      <div className="bg-white/5 rounded-xl p-4">
        {loading ? (
          <p>Loading...</p>
        ) : filtered.length === 0 ? (
          <p>No transactions</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th>Description</th>
                <th>Category</th>
                <th className="text-right">Amount</th>
                <th className="text-right">Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((e) => (
                <tr key={e.transactionId}>
                  <td>{e.description}</td>
                  <td>{e.category?.categoryName}</td>
                  <td className="text-right">₹{Math.abs(e.amount)}</td>
                  <td className="text-right">
                    {new Date(e.transactionDate).toLocaleDateString()}
                  </td>
                  <td className="flex justify-end gap-3">
                    <FiEdit
                      className="cursor-pointer text-blue-400"
                      onClick={() => {
                        setSelected(e);
                        setOpenEdit(true);
                      }}
                    />
                    <FiTrash2
                      className="cursor-pointer text-rose-400"
                      onClick={() => {
                        setSelected(e);
                        setOpenDelete(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {openAdd && (
        <AddExpenseModal
          close={() => setOpenAdd(false)}
          refresh={loadExpenses}
        />
      )}

      {openEdit && (
        <EditExpenseModal
          transaction={selected}
          close={() => setOpenEdit(false)}
          refresh={loadExpenses}
        />
      )}

      {openDelete && (
        <ConfirmDeleteModal
          title="Delete Transaction"
          message="Are you sure you want to delete this transaction?"
          onCancel={() => setOpenDelete(false)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
};

export default Expenses;
