import api from "./apiService";

export const getExpenses = () => api.get("/api/transactions");

export const addExpense = (data) => api.post("/api/transactions", data);

export const deleteExpense = (id) => api.delete(`/api/transactions/${id}`);
