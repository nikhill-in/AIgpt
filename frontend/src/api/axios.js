import axios from "axios";
import { notifyUnauthorized } from "../utils/authEvents";
import servers from "../environment";

const api = axios.create({
  baseURL: servers,
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    const isUnauthorized = status === 401;
    const isAuthCheck = url.includes("/auth/me");
    const isLogin = url.includes("/auth/login");
    const isRegister = url.includes("/auth/register");

    if (isUnauthorized && !isAuthCheck && !isLogin && !isRegister) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    if (error.response?.status === 401) {
      notifyUnauthorized();
    }

    return Promise.reject(error);
  },
);

export default api;
