import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // sends cookies automatically — same job as fetch's credentials: "include"
});

api.interceptors.response.use(
  (response) => response, // pass successful responses through unchanged
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid — force back to landing page
      // Full reload (not React Router navigate) ensures AuthContext's
      // state resets completely, not just the URL
      window.location.href = "/";
    }
    return Promise.reject(error); // still let individual .catch() blocks run for other error types
  }
);


export default api;