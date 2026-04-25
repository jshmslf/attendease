"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { Camera, LogOut, Loader2, ArrowLeft, Clock } from "lucide-react";
import { useClock } from "@/hooks/use-clock";

const API = "http://localhost:8000";

interface AttendanceLog {
  Name: string;
  Birthdate: string;
  Time: string;
  Date: string;
  Type: string;
}

export default function ScanPage() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [logs, setLogs] = useState<AttendanceLog[]>([]);
  const [streamReady, setStreamReady] = useState(false);
  const [streamError, setStreamError] = useState(false);
  const clock = useClock();

  // Start scanner on mount
  useEffect(() => {
    fetch(`${API}/start-scan`, { method: "POST" }).catch(() => {});
  }, []);

  // Poll attendance every 3s
  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch(`${API}/attendance/recent`);
        const data: AttendanceLog[] = await res.json();
        setLogs(data);
      } catch {}
    };

    poll();
    const interval = setInterval(poll, 3000);
    return () => clearInterval(interval);
  }, []);

  if (authLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--accent-color)]" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 font-sans overflow-hidden">
      {/* Header */}
      <header className="px-4 py-3 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-[var(--radius)] transition-colors mr-1">
            <ArrowLeft className="w-5 h-5 text-zinc-400" />
          </Link>
          <Image src="/logo/logo-1x1-black.png" alt="AttendEase" width={32} height={32} className="rounded-[var(--radius)] block dark:hidden" />
          <Image src="/logo/logo-1x1.png" alt="AttendEase" width={32} height={32} className="rounded-[var(--radius)] hidden dark:block" />
          <div>
            <h1 className="font-bold tracking-tight text-sm leading-none">AttendEase GATEWAY</h1>
            <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Speed Scan Mode Active</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">System Online</span>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-100 dark:bg-zinc-900 rounded-full border border-zinc-200 dark:border-zinc-800">
            <Clock className="w-3 h-3 text-zinc-400" />
            <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">{clock}</span>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-zinc-200 dark:border-zinc-800">
            <ThemeToggle />
            <button onClick={logout} className="p-2 text-zinc-500 hover:text-red-500 transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Camera Stream */}
        <section className="flex-[3] relative bg-black flex items-center justify-center overflow-hidden border-r border-zinc-200 dark:border-zinc-800">
          {!streamError ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`${API}/stream`}
              alt="Live camera feed"
              className="w-full h-full object-contain"
              onLoad={() => setStreamReady(true)}
              onError={() => setStreamError(true)}
            />
          ) : (
            <div className="text-center text-zinc-500 p-8">
              <Camera className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm font-medium">Camera stream unavailable</p>
              <p className="text-xs mt-1 opacity-60">Make sure the backend is running</p>
            </div>
          )}

          {!streamReady && !streamError && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-3">
                <div className="w-10 h-10 border-2 border-zinc-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-tighter">Connecting to camera...</span>
              </div>
            </div>
          )}

          {/* Corner label */}
          <div className="absolute top-4 left-4 space-y-1 pointer-events-none">
            <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">Camera Source</div>
            <div className="text-sm font-mono flex items-center gap-2 text-white">
              <div className={`w-1.5 h-1.5 rounded-full ${streamReady ? "bg-emerald-500" : "bg-red-500"}`} />
              GATEWAY_CAM_01
            </div>
          </div>
        </section>

        {/* Attendance Logs */}
        <aside className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex flex-col min-w-[350px] border-l border-zinc-200 dark:border-zinc-800">
          <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 flex justify-between items-end">
            <div>
              <h2 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Live Attendance Feed</h2>
              <p className="text-xl font-bold mt-1 text-zinc-900 dark:text-zinc-50">Recent Scans</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-[var(--accent-color)]">{logs.length}</span>
              <p className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">Captured</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {logs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center opacity-20 py-12">
                <Camera className="w-12 h-12" />
                <p className="text-sm mt-4 font-medium italic">Waiting for detection...</p>
              </div>
            ) : (
              logs.map((log, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 p-4 rounded-[var(--radius)] shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center font-bold text-[var(--accent-color)] border border-zinc-200 dark:border-zinc-700 text-sm shrink-0">
                        {log.Name ? log.Name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() : "??"}
                      </div>
                      <div>
                        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{log.Name || "Unknown"}</h3>
                        <p className="text-[10px] text-zinc-400 font-mono">ID: —</p>
                      </div>
                    </div>
                    <div className={`text-[10px] font-bold uppercase tracking-tighter px-2 py-1 rounded-full ${
                      log.Type === "entry"
                        ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
                        : "bg-amber-100 dark:bg-amber-900/30 text-amber-600"
                    }`}>
                      {log.Type}
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">{log.Date}</span>
                    <span className="text-sm font-bold font-mono text-zinc-700 dark:text-zinc-300">{log.Time}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="p-4 bg-zinc-50 dark:bg-zinc-900/30 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
              <span>Auto-refreshing every 3s</span>
              <span>v0.1.0-stable</span>
            </div>
          </div>
        </aside>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </div>
  );
}
