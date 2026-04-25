"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export type Role = "ADMIN" | "TEACHER" | "STUDENT";

interface User {
  email: string;
  role: Role;
  name: string;
  expiresAt: number;
}

interface AuthContextType {
  user: User | null;
  login: (identifier: string, password: string, role: "ADMIN" | "STUDENT") => Promise<string | null>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check localStorage on mount
    const storedUserStr = localStorage.getItem("attendease_user");
    if (storedUserStr) {
      try {
        const storedUser = JSON.parse(storedUserStr) as User;
        const now = new Date().getTime();
        
        // Check if token expired
        if (storedUser.expiresAt && now > storedUser.expiresAt) {
          localStorage.removeItem("attendease_user");
          setUser(null);
        } else {
          setUser(storedUser);
        }
      } catch (e) {
        localStorage.removeItem("attendease_user");
      }
    }
    setIsLoading(false);
  }, []);

  const TEMP_ACCOUNTS = {
    ADMIN: { identifier: "admin", password: "admin" },
    STUDENT: { identifier: "student", password: "student" },
  };

  const login = async (identifier: string, password: string, role: "ADMIN" | "STUDENT"): Promise<string | null> => {
    setIsLoading(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        const account = TEMP_ACCOUNTS[role];
        if (identifier !== account.identifier || password !== account.password) {
          setIsLoading(false);
          resolve("Invalid credentials. Please try again.");
          return;
        }
        const name = role === "ADMIN" ? "School Administrator" : "Student User";
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        const newUser: User = { email: identifier, role, name, expiresAt };
        setUser(newUser);
        localStorage.setItem("attendease_user", JSON.stringify(newUser));
        if (role === "ADMIN") router.push("/admin");
        else router.push("/student");
        setIsLoading(false);
        resolve(null);
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("attendease_user");
    router.push("/login");
  };

  // Basic route protection logic
  useEffect(() => {
    if (isLoading) return;

    const publicPaths = ["/login", "/"];
    const isPublicPath = publicPaths.includes(pathname);

    if (!user && !isPublicPath) {
      router.push("/login");
    } else if (user) {
      // Role-based restrictions
      if (pathname.startsWith("/admin") && user.role !== "ADMIN") {
        router.push("/");
      } else if (pathname.startsWith("/teacher") && user.role !== "TEACHER") {
        router.push("/");
      } else if (pathname.startsWith("/student") && user.role !== "STUDENT") {
        router.push("/");
      } else if (pathname.startsWith("/scan") && user.role !== "ADMIN") {
        // Admin also has access to scan
        router.push("/");
      }
    }
  }, [user, pathname, isLoading, router]);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
