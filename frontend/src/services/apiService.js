import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

/* ---------- REQUEST INTERCEPTOR ---------- */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ---------- RESPONSE INTERCEPTOR ---------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

/* ---------- AUTH ---------- */
export const loginUser = (data) => api.post("/auth/login", data);
export const signupUser = (data) => api.post("/auth/signup", data);
export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
export const resetPassword = (data) => api.post("/auth/reset-password", data);

/* ---------- TRANSACTIONS ---------- */
export const getExpenses = () => api.get("/api/transactions");
export const addExpenseApi = (data) => api.post("/api/transactions", data);
export const updateExpenseApi = (id, data) =>api.put(`/api/transactions/${id}`, data);
export const deleteExpenseApi = (id) => api.delete(`/api/transactions/${id}`);

/* ---------- CATEGORIES ---------- */
export const getCategories = () => api.get("/api/categories");

/* ---------- BUDGETS ---------- */
export const getBudgets = () => api.get("/api/budgets");
export const addBudgetApi = (data) => api.post("/api/budgets", data);
export const deleteBudgetApi = (id) => api.delete(`/api/budgets/${id}`);

/* ---------- GOALS ---------- */
export const getGoals = () => api.get("/api/goals");
export const addGoalApi = (data) => api.post("/api/goals", data);
export const deleteGoalApi = (id) => api.delete(`/api/goals/${id}`);

/* ---------- REMINDERS ---------- */
export const getReminders = () => api.get("/api/reminders");
export const getUpcomingReminders = () => api.get("/api/reminders/upcoming");

/* ---------- ACCOUNTS ---------- */
export const getAccounts = () => api.get("/api/accounts");

export default api;
