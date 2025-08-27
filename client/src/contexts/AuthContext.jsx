import React, { createContext, useContext, useState, useEffect, useMemo } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

// Join base + path safely (avoids double // and missing /)
const joinUrl = (base, path) => {
  if (!base) return path; // allow absolute URLs to pass through
  const b = base.endsWith("/") ? base.slice(0, -1) : base;
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${b}${p}`;
};

// Safe JSON parse (handles empty bodies / 204)
const safeJson = async (res) => {
  try {
    return await res.json();
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  // IMPORTANT: Vite injects at build time
  const API_BASE_URL =
    import.meta.env.VITE_API_URL ||
    ""; // do NOT hard-code localhost in production

  // Fail fast if missing (prevents silent bad builds)
  if (!API_BASE_URL) {
    // You can comment this throw in dev if needed.
    // eslint-disable-next-line no-console
    console.error("❌ VITE_API_URL is missing. Set it in the client env and rebuild.");
    // throw new Error("Missing VITE_API_URL"); // uncomment to hard-fail
  }

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
  };

  // Auth-aware fetch you can reuse everywhere
  const authFetch = useMemo(
    () => async (url, options = {}) => {
      const currentToken = token || localStorage.getItem("token");

      const headers = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };
      if (currentToken) headers.Authorization = `Bearer ${currentToken}`;

      // Allow absolute URLs; otherwise prefix with API base
      const fetchUrl = url.startsWith("http") ? url : joinUrl(API_BASE_URL, url);

      const res = await fetch(fetchUrl, { ...options, headers });

      // Auto-logout on auth failures
      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error("Unauthorized");
      }
      return res;
    },
    [API_BASE_URL, token]
  );

  const login = async (email, password) => {
    try {
      const res = await fetch(joinUrl(API_BASE_URL, "/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await safeJson(res);

      if (res.ok && data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user ?? null);
        return { success: true, data };
      }
      return { success: false, error: data?.message || "Login failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch(joinUrl(API_BASE_URL, "/auth/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await safeJson(res);

      if (res.ok && data?.token) {
        localStorage.setItem("token", data.token);
        setToken(data.token);
        setUser(data.user ?? null);
        return { success: true, data };
      }
      return { success: false, error: data?.message || "Registration failed" };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const getCurrentUser = async () => {
    const currentToken = token || localStorage.getItem("token");
    if (!currentToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await authFetch("/auth/me");
      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await safeJson(res);
      setUser(data?.user ?? null);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error("Error getting current user:", e);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On initial mount, hydrate user if we already have a token
    if (localStorage.getItem("token")) getCurrentUser();
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { user, token, loading, login, register, logout, authFetch };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
