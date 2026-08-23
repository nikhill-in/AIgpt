import api from "./axios";

export const loginUser = (email, password) =>
  api.post("/auth/login", { email, password });

export const registerUser = (email, password) =>
  api.post("/auth/register", { email, password });

export const proUser = () =>
  api.put("/auth/update", {
    role: "pro",
    proExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

export const getTokenOptions = () => api.get("/auth/token-options");

export const logoutUser = () => api.post("/auth/logout");

export const getCurrentUser = () => api.get("/auth/me");
