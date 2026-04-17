"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClock } from "@/hooks/use-clock";
import { 
  Users, 
  Shield, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  LayoutDashboard, 
  Activity, 
  Database,
  Loader2,
  Building,
  CheckCircle2,
  Info,
  Scan,
  Clock
} from "lucide-react";

export default function AdminPage() {
  const { user, logout, isLoading } = useAuth();
  const clock = useClock();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-amber-600 rounded-[var(--radius)] flex items-center justify-center text-white font-extrabold shadow-lg shadow-amber-500/20">
               A
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">AttendEase</span>
          </div>

          <nav className="space-y-1 flex-1">
            <Link href="/admin" className="flex items-center gap-3 px-4 py-3 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-[var(--radius)] font-medium">
               <LayoutDashboard className="w-5 h-5" />
              Overview
            </Link>
            <Link href="/scan" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Scan className="w-5 h-5" />
              Scan Attendance
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Users className="w-5 h-5" />
              User Management
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
               <Shield className="w-5 h-5" />
              Security Settings
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Settings className="w-5 h-5" />
              System Config
            </a>
          </nav>

          <div className="mt-auto space-y-4 pt-6 border-t border-zinc-100 dark:border-zinc-800">
             <div className="flex items-center justify-between px-2">
                <ThemeToggle />
                <button 
                  onClick={logout}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
             </div>
             <Link href="/" className="flex items-center gap-2 px-4 py-3 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors text-sm font-medium">
                <ChevronLeft className="w-4 h-4" />
                Exit Portal
             </Link>
          </div>
        </aside>

        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Campus Administration</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">High-level view of campus-wide attendance health.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                 <Clock className="w-3 h-3 text-zinc-400" />
                 <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">{clock}</span>
               </div>
               <div className="px-4 py-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[var(--radius)] text-xs font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  SYSTEM ACTIVE
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Active Nodes", value: "24", sub: "Cameras & Scanners", icon: Activity, color: "blue" },
              { label: "Total Students", value: "2,840", sub: "98% Registered", icon: Users, color: "purple" },
              { label: "Daily Scans", value: "8,122", sub: "+4% vs yesterday", icon: Database, color: "amber" },
              { label: "Alerts", value: "0", sub: "No critical issues", icon: CheckCircle2, color: "emerald" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                  <stat.icon className={`w-4 h-4 text-${stat.color}-500`} />
                </div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
                <div className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 mt-2 uppercase tracking-tight">{stat.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-8 flex justify-between items-center">
                 Attendance Health
                 <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest bg-zinc-50 dark:bg-zinc-800 px-2 py-1 rounded">Dept. Metrics</span>
              </h3>
              <div className="space-y-8">
                 {[
                   { name: "Computer Science", value: 96, color: "emerald" },
                   { name: "Business School", value: 88, color: "blue" },
                   { name: "Fine Arts", value: 82, color: "amber" },
                   { name: "Engineering", value: 94, color: "emerald" },
                 ].map((dept, i) => (
                   <div key={i} className="space-y-3">
                      <div className="flex justify-between text-sm">
                         <span className="font-bold text-zinc-700 dark:text-zinc-300">{dept.name}</span>
                         <span className="font-extrabold text-zinc-900 dark:text-zinc-50">{dept.value}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                         <div className={`h-full bg-${dept.color}-500 rounded-full transition-all duration-1000`} style={{ width: `${dept.value}%` }} />
                      </div>
                   </div>
                 ))}
              </div>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm p-8">
               <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50 mb-8">Security & Compliance</h3>
               <div className="space-y-4">
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-[var(--radius)] border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/20 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-[var(--radius)] flex items-center justify-center text-emerald-600">
                           <Shield className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Biometric Encryption</div>
                           <div className="text-xs text-zinc-500 mt-1 font-medium">AES-256 Protocol Active</div>
                        </div>
                        <div className="px-2 py-1 bg-emerald-500/10 text-emerald-600 text-[9px] font-bold rounded-[calc(var(--radius)-2px)] uppercase tracking-tight">Active</div>
                     </div>
                  </div>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-[var(--radius)] border border-zinc-100 dark:border-zinc-800 hover:border-blue-500/20 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-[var(--radius)] flex items-center justify-center text-blue-600">
                           <Info className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Ethical Data Policy</div>
                           <div className="text-xs text-zinc-500 mt-1 font-medium">Automatic Purge Configured</div>
                        </div>
                        <div className="px-2 py-1 bg-blue-500/10 text-blue-600 text-[9px] font-bold rounded-[calc(var(--radius)-2px)] uppercase tracking-tight">Verified</div>
                     </div>
                  </div>
                  <div className="p-5 bg-zinc-50 dark:bg-zinc-800/30 rounded-[var(--radius)] border border-zinc-100 dark:border-zinc-800 hover:border-amber-500/20 transition-colors">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-[var(--radius)] flex items-center justify-center text-amber-600">
                           <Building className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                           <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">Campus-Wide Nodes</div>
                           <div className="text-xs text-zinc-500 mt-1 font-medium">24 active scanners online</div>
                        </div>
                        <div className="px-2 py-1 bg-amber-500/10 text-amber-600 text-[9px] font-bold rounded-[calc(var(--radius)-2px)] uppercase tracking-tight">Stable</div>
                     </div>
                  </div>
               </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
