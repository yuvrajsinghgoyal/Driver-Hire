import { createContext, useEffect, useState } from "react";
import API from "../api/axiosConfig";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("dc_token");

    if (!token) {
      setLoading(false);
      return;
    }

    // Ensure axios includes the token on all requests
    API.defaults.headers.common.Authorization = `Bearer ${token}`;

    API.get("/auth/me")
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
