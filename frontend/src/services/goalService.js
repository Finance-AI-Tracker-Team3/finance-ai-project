import api from "./apiService";

export const getGoals = () => api.get("/api/goals");

export const createGoal = (data) => api.post("/api/goals", data);

export const deleteGoal = (goalId) => api.delete(`/api/goals/${goalId}`);

export const transferToGoal = (goalId, accountId, amount) =>
  api.patch(`/api/goals/${goalId}/transfer`, null, {
    params: { accountId, amount },
  });
