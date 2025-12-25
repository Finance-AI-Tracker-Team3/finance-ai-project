import api from "./apiService";

export const getReminders = () => api.get("/api/reminders");
