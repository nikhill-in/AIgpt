import axios from "axios";
import { notifyUnauthorized } from "../utils/authEvents";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
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

// import axios from "axios";

// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_URL,
//   withCredentials: true, // sends cookies automatically — same job as fetch's credentials: "include"
// });

// api.interceptors.response.use(
//   (response) => response, // pass successful responses through unchanged
//   (error) => {
//     if (error.response?.status === 401) {
//       console.log("Unauthorized...");
//     }
//     return Promise.reject(error); // still let individual .catch() blocks run for other error types
//   }
// );

// export default api;
