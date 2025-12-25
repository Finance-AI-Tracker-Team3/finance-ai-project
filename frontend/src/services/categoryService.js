import api from "./apiService";

export const getCategories = () => api.get("/api/categories");
