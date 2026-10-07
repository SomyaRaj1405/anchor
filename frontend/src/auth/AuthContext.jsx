import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "anchor-auth-session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).user ?? null : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    if (typeof window === "undefined") return null;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored).token ?? null : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!user && !token) {
      window.localStorage.removeItem(STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }));
  }, [user, token]);

  const signIn = (nextUser, nextToken) => {
    setUser(nextUser);
    setToken(nextToken);
  };

  const signOut = () => {
    setUser(null);
    setToken(null);
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(user && token),
      signIn,
      signOut,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
