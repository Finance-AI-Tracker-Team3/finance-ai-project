import axios from "axios";

const AI_BASE_URL = "http://localhost:5001";

const aiClient = axios.create({
  baseURL: AI_BASE_URL,
  timeout: 30000,
});

/* ================== AI ENDPOINTS ================== */

export const getFullInsights = (userId) =>
  aiClient.get(`/api/analyze/full-insights/${userId}`);

export const getCategoryTrends = (userId) =>
  aiClient.get(`/api/analyze/categories/${userId}`);

export const getPeakDays = (userId) =>
  aiClient.get(`/api/analyze/peak-days/${userId}`);

export const getMonthlyForecast = (userId) =>
  aiClient.get(`/api/analyze/forecast/${userId}`);

export const getBudgetRecommendations = (userId) =>
  aiClient.get(`/api/analyze/budget-recommendations/${userId}`);

export const getAnomalies = (userId) =>
  aiClient.get(`/api/analyze/anomalies/${userId}`);

export const getHealthScore = (userId, income) =>
  aiClient.get(`/api/analyze/health-score/${userId}`, {
    params: { income },
  });
