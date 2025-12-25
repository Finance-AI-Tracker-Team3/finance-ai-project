import api from "./apiService";

export const login = (data) => api.post("/auth/login", data);

export const signup = (data) => api.post("/auth/signup", data);

export const forgotPassword = (data) => api.post("/auth/forgot-password", data);
