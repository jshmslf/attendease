"use client";

import { useState } from "react";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";

type Tab = "ADMIN" | "STUDENT";

const HINTS: Record<Tab, { identifier: string; password: string }> = {
  ADMIN: { identifier: "admin", password: "admin" },
  STUDENT: { identifier: "student", password: "student" },
};

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Tab>("STUDENT");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, isLoading } = useAuth();

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setError(null);
    setIdentifier("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (identifier && password) {
      const err = await login(identifier, password, activeTab);
      if (err) setError(err);
    }
  };

  const fillDemo = () => {
    const hint = HINTS[activeTab];
    setIdentifier(hint.identifier);
    setPassword(hint.password);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--accent-color)]/5 dark:bg-zinc-950">
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+8px)] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">

          {/* Logo header */}
          <div className="px-8 pt-8 pb-6 flex justify-center border-b border-zinc-100 dark:border-zinc-800">
            <Image
              src="/logo/logo-with-text-black.png"
              alt="AttendEase"
              width={200}
              height={60}
              className="object-contain block dark:hidden"
              priority
            />
            <Image
              src="/logo/logo-with-text.png"
              alt="AttendEase"
              width={200}
              height={60}
              className="object-contain hidden dark:block"
              priority
            />
          </div>

          <div className="px-8 pt-6 pb-8">
            {/* Tabs */}
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-[var(--radius)] mb-6">
              {(["STUDENT", "ADMIN"] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => handleTabChange(tab)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-[calc(var(--radius)-2px)] transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-[var(--accent-color)] text-white shadow-sm"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300"
                  }`}
                >
                  {tab === "STUDENT" ? "Student" : "Admin"}
                </button>
              ))}
            </div>

            {/* Demo credentials hint */}
            <div className="mb-5 p-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[var(--radius)] flex items-center justify-between gap-3">
              <div className="text-xs text-zinc-500 dark:text-zinc-400">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Demo account: </span>
                <span className="font-mono">{HINTS[activeTab].identifier}</span>
                {" / "}
                <span className="font-mono">{HINTS[activeTab].password}</span>
              </div>
              <button
                type="button"
                onClick={fillDemo}
                className="text-xs text-[var(--accent-color)] font-semibold hover:underline cursor-pointer whitespace-nowrap"
              >
                Use this
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-[var(--radius)] flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  {activeTab === "ADMIN" ? "Username" : "Username or Student ID"}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => { setIdentifier(e.target.value); setError(null); }}
                  placeholder={activeTab === "ADMIN" ? "Enter your username" : "Enter your username or student ID"}
                  className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm cursor-text"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(null); }}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 pr-11 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[var(--radius)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-color)] transition-all text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 text-sm cursor-text"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[var(--accent-color)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-[var(--radius)] transition-all flex items-center justify-center gap-2 text-sm mt-2 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            <div className="mt-5 text-center">
              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                Trouble signing in?{" "}
                <a
                  href="mailto:support@attendease.com"
                  className="text-[var(--accent-color)] hover:underline font-medium cursor-pointer"
                >
                  Contact Support
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-6 text-center text-zinc-400 dark:text-zinc-600 text-xs">
        &copy; 2026 AttendEase. Secure &amp; Ethical Biometric Attendance.
      </footer>
    </div>
  );
}
