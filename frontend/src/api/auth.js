import api from "./axios";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (email, password) =>
  api.post("/auth/register", { email, password });

export const proUser = () =>
  api.put("/auth/pro", { role: "pro" });


export const logoutUser = () => api.post("/auth/logout");



export const getCurrentUser = () => api.get("/auth/me");