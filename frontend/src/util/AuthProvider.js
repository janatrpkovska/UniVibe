import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const TOKEN_KEY = "auth_token";

function parseJwt(token) {
  try {
    const base64Payload = token.split(".")[1];
    return JSON.parse(atob(base64Payload));
  } catch {
    return null;
  }
}

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    const payload = stored ? parseJwt(stored) : null;
    if (payload && payload.exp * 1000 < Date.now()) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return payload;
  });

  const login = useCallback((jwt) => {
    const payload = parseJwt(jwt);
    if (!payload) return;

    localStorage.setItem(TOKEN_KEY, jwt);
    setToken(jwt);
    setUser(payload);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    if (!token) return;
    const payload = parseJwt(token);
    if (!payload || payload.exp * 1000 < Date.now()) {
      logout();
    }
  }, [token, logout]);

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
};
