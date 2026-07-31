import { loginUser } from "../api/auth.js";

const login = async (email, password) => {
  const res = await loginUser(email, password);
  setUser(res.data.user);
};