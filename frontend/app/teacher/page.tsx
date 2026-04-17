"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClock } from "@/hooks/use-clock";
import { 
  Users, 
  BarChart3, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  LayoutDashboard, 
  Search, 
  MoreHorizontal,
  Loader2,
  GraduationCap,
  Clock
} from "lucide-react";

export default function TeacherPage() {
  const { user, logout, isLoading } = useAuth();
  const clock = useClock();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!user || user.role !== "TEACHER") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-purple-600 rounded-[var(--radius)] flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
               <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">AttendEase</span>
          </div>

          <nav className="space-y-1 flex-1">
            <Link href="/teacher" className="flex items-center gap-3 px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-[var(--radius)] font-medium">
               <LayoutDashboard className="w-5 h-5" />
              Class Overview
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <BarChart3 className="w-5 h-5" />
              Analytics
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Settings className="w-5 h-5" />
              Settings
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
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Instructor Dashboard</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your classes and monitor student engagement.</p>
            </div>
            <div className="flex items-center gap-3">
               <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                 <Clock className="w-3 h-3 text-zinc-400" />
                 <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">{clock}</span>
               </div>
               <div className="text-right hidden sm:block">
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-50">{user.name}</div>
                  <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Computer Science Dept.</div>
               </div>
               <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 font-bold border-2 border-white dark:border-zinc-800 shadow-md">
                  {user.name.split(' ').map((n: string) => n[0]).join('')}
               </div>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { label: "Total Students", value: "142", trend: "Active", color: "blue" },
              { label: "Avg. Attendance", value: "89%", trend: "-2% this week", color: "amber" },
              { label: "On-Time Rate", value: "92%", trend: "+5% improve", color: "emerald" },
              { label: "Alerts", value: "3", trend: "Requires action", color: "red" },
            ].map((stat, i) => (
              <div key={i} className="p-6 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-4">{stat.label}</div>
                <div className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50">{stat.value}</div>
                <div className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full inline-block
                  ${stat.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 
                    stat.color === 'amber' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 
                    stat.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 
                    'bg-red-100 dark:bg-red-900/30 text-red-600'}`}
                >
                  {stat.trend}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-zinc-100 dark:border-zinc-800 flex justify-between items-center">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-zinc-50">Active Classes</h3>
              <div className="flex gap-2">
                 <button className="px-4 py-2 text-xs font-bold bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 rounded-[var(--radius)] transition-colors">Today</button>
                 <button className="px-4 py-2 text-xs font-bold text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Weekly View</button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-zinc-50/50 dark:bg-zinc-800/50 text-zinc-500 dark:text-zinc-400 text-[10px] font-bold uppercase tracking-widest border-b border-zinc-100 dark:border-zinc-800">
                    <th className="px-6 py-5">Class Name</th>
                    <th className="px-6 py-5">Time Window</th>
                    <th className="px-6 py-5">Room</th>
                    <th className="px-6 py-5 text-center">Present</th>
                    <th className="px-6 py-5">Status</th>
                    <th className="px-6 py-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {[
                    { name: "CS101: Intro to Programming", time: "09:00 - 10:30", room: "Lab 01", present: "28/30", status: "Completed", color: "emerald" },
                    { name: "CS302: Database Systems", time: "11:00 - 12:30", room: "Hall A", present: "42/45", status: "In Progress", color: "blue" },
                    { name: "CS404: Artificial Intelligence", time: "02:00 - 03:30", room: "Room 402", present: "-", status: "Upcoming", color: "zinc" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30 transition-colors group">
                      <td className="px-6 py-5 font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">{row.name}</td>
                      <td className="px-6 py-5 text-sm text-zinc-500 font-medium">{row.time}</td>
                      <td className="px-6 py-5 text-sm text-zinc-500 font-medium">{row.room}</td>
                      <td className="px-6 py-5 text-sm font-mono text-center font-bold text-zinc-700 dark:text-zinc-300">{row.present}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                          ${row.color === 'emerald' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600' : 
                            row.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : 
                            'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                        >
                           <span className={`w-1.5 h-1.5 rounded-full ${row.color === 'emerald' ? 'bg-emerald-500' : row.color === 'blue' ? 'bg-blue-500 animate-pulse' : 'bg-zinc-400'}`} />
                           {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                         <button className="p-2 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors">
                            <MoreHorizontal className="w-5 h-5" />
                         </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-zinc-50/50 dark:bg-zinc-800/20 text-center border-t border-zinc-100 dark:border-zinc-800">
               <button className="text-sm font-bold text-purple-600 dark:text-purple-400 hover:underline">Launch Attendance Session</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
