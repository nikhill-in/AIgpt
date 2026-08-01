import { createContext, useContext, useState } from "react";
import { loginUser, logoutUser } from "../api/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState(null);

  const login = async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await loginUser(email, password);
      setUser(res.data.user); 
    } catch (err) {
      setAuthError(err.response?.data?.message || "Login failed");
      throw err; 
    } finally {
      setAuthLoading(false);
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoggedIn: !!user, login, logout, authLoading, authError }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);