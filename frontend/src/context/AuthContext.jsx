import { createContext, useContext, useEffect, useState } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("oase_admin_token"));
  const [username, setUsername] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (!token) {
      setChecking(false);
      return;
    }
    fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("invalid session");
        return res.json();
      })
      .then((data) => setUsername(data.username))
      .catch(() => {
        localStorage.removeItem("oase_admin_token");
        setToken(null);
      })
      .finally(() => setChecking(false));
  }, [token]);

  async function login(usernameInput, password) {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: usernameInput, password }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || "Login gagal.");
    }

    const data = await res.json();
    localStorage.setItem("oase_admin_token", data.token);
    setToken(data.token);
    setUsername(data.username);
    return data;
  }

  function logout() {
    localStorage.removeItem("oase_admin_token");
    setToken(null);
    setUsername(null);
  }

  return (
    <AuthContext.Provider
      value={{ token, username, isAuthenticated: !!token, checking, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
