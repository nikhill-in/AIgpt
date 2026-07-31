import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. http://localhost:5000/api
  withCredentials: true, // sends cookies automatically — same job as fetch's credentials: "include"
});

export default api;