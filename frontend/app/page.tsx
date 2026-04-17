"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClock } from "@/hooks/use-clock";
import { LogOut, User, Camera, BookOpen, Users, LayoutDashboard, Loader2, Clock } from "lucide-react";

export default function Home() {
  const { user, logout, isLoading } = useAuth();
  const clock = useClock();

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <header className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-center bg-white dark:bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-[var(--radius)] flex items-center justify-center text-white">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            AttendEase
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">{clock}</span>
          </div>
          <ThemeToggle />
          {user ? (
            <div className="flex items-center gap-4 pl-4 border-l border-zinc-200 dark:border-zinc-800">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 leading-none">{user.name}</p>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">{user.role}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 text-zinc-500 hover:text-red-500 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded-[var(--radius)] text-sm font-semibold hover:bg-blue-700 transition-all">
              Sign In
            </Link>
          )}
        </div>
      </header>
      
      <main className="flex-1 flex flex-col items-center justify-center p-6 max-w-5xl mx-auto w-full">
        {!user ? (
          <div className="text-center py-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-4xl md:text-5xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight mb-4">
              Attendance, Simplified.
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg mb-10">
              A contact-free, automated attendance system using Computer Vision and AI to streamline classroom entry and engagement.
            </p>
            <Link 
              href="/login" 
              className="px-8 py-4 bg-blue-600 text-white rounded-[var(--radius)] text-lg font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
            >
              Get Started
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full animate-in fade-in duration-500">
            {/* Face Scanning Portal (Admin only) */}
            {(user.role === "ADMIN") && (
              <Link 
                href="/scan"
                className="group flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-[var(--radius)] flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Camera className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50 group-hover:text-blue-500 transition-colors">Face Scanning</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Automated attendance scanning station for classroom or gate entry.</p>
                <div className="mt-auto pt-6 flex items-center text-[10px] font-bold text-blue-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Open Scanner →
                </div>
              </Link>
            )}

            {/* Admin Portal (Admin only) */}
            {user.role === "ADMIN" && (
              <Link 
                href="/admin"
                className="group flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 hover:border-amber-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-amber-100 dark:bg-amber-900/30 rounded-[var(--radius)] flex items-center justify-center mb-6 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform">
                  <LayoutDashboard className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50 group-hover:text-amber-500 transition-colors">Admin Console</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">High-level view of campus-wide attendance health and system management.</p>
                <div className="mt-auto pt-6 flex items-center text-[10px] font-bold text-amber-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage System →
                </div>
              </Link>
            )}

            {/* Student Portal (Student only) */}
            {user.role === "STUDENT" && (
              <Link 
                href="/student"
                className="group flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-[var(--radius)] flex items-center justify-center mb-6 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform">
                  <User className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-500 transition-colors">My Attendance</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Personal dashboard to track attendance trends, schedule, and participation scores.</p>
                <div className="mt-auto pt-6 flex items-center text-[10px] font-bold text-emerald-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  View My Stats →
                </div>
              </Link>
            )}

            {/* Teacher Portal (Teacher only) */}
            {user.role === "TEACHER" && (
              <Link 
                href="/teacher"
                className="group flex flex-col p-8 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 hover:border-purple-500 transition-all hover:shadow-xl shadow-sm"
              >
                <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-[var(--radius)] flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                  <Users className="w-7 h-7" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-50 group-hover:text-purple-500 transition-colors">Class Management</h2>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">Manage class attendance, view engagement reports, and track absenteeism patterns.</p>
                <div className="mt-auto pt-6 flex items-center text-[10px] font-bold text-purple-500 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  Manage Classes →
                </div>
              </Link>
            )}
          </div>
        )}
      </main>

      <footer className="p-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-zinc-400 text-xs">
        &copy; 2026 AttendEase. Real-Time Facial Recognition & Analytics.
      </footer>
    </div>
  );
}
