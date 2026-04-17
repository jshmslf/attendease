"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogIn, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      await login(email);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          AttendEase
        </h1>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 p-8 shadow-xl">
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-[var(--radius)] flex items-center justify-center mx-auto mb-4 text-blue-600 dark:text-blue-400">
              <LogIn className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Welcome Back</h2>
            <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@school.edu, teacher@school.edu, or student@school.edu"
                className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-[var(--radius)] focus:ring-2 focus:ring-blue-500 outline-none transition-all text-zinc-900 dark:text-zinc-50"
              />
              <p className="text-[10px] text-zinc-500 mt-2 px-1 italic">
                Tip: Include 'admin' or 'teacher' in the email to test different roles.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800/50 text-white font-semibold rounded-[var(--radius)] transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Authenticating...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Admin accounts are managed by school developers. 1 admin per school.
            </p>
          </div>
        </div>
      </main>

      <footer className="p-8 text-center text-zinc-400 text-xs">
        &copy; 2026 AttendEase. Secure & Ethical Biometric Attendance.
      </footer>
    </div>
  );
}
