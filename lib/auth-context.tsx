"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

type User = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -----------------------------
  // LOAD USER FROM LOCALSTORAGE
  // -----------------------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      const parsed = JSON.parse(storedUser);

      // Normalize ID
      const normalizedUser: User = {
        id: parsed.userId || parsed.id || parsed._id,
        name: parsed.name,
        email: parsed.email,
      };

      setUser(normalizedUser);
      setIsAuthenticated(true);
    }

    setLoading(false);
  }, []);

  // -----------------------------
  // LOGIN
  // -----------------------------
  const login = async (email: string, password: string) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      }
    );

    if (!res.ok) throw new Error("Invalid login");

    const data = await res.json();

    const normalizedUser: User = {
      id: data.user.userId || data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setUser(normalizedUser);
    setIsAuthenticated(true);
    setLoading(false);
  };

  // -----------------------------
  // REGISTER
  // -----------------------------
  const register = async (email: string, password: string, name: string) => {
    setLoading(true);

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      }
    );

    if (!res.ok) throw new Error("Registration failed");

    const data = await res.json();

    const normalizedUser: User = {
      id: data.user.userId || data.user.id || data.user._id,
      name: data.user.name,
      email: data.user.email,
    };

    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(normalizedUser));

    setUser(normalizedUser);
    setIsAuthenticated(true);
    setLoading(false);
  };

  // -----------------------------
  // LOGOUT
  // -----------------------------
  const logout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    window.location.href = "/";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
