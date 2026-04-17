"use client";

import Link from "next/link";
import { useAuth } from "@/components/auth-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { useClock } from "@/hooks/use-clock";
import { 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  LogOut, 
  ChevronLeft, 
  BookOpen, 
  MapPin, 
  Loader2,
  TrendingUp
} from "lucide-react";

export default function StudentPage() {
  const { user, logout, isLoading } = useAuth();
  const clock = useClock();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!user || user.role !== "STUDENT") {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950 font-sans">
      {/* Sidebar / Nav */}
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hidden md:flex flex-col p-6 sticky top-0 h-screen">
          <div className="flex items-center gap-2 mb-10">
            <div className="w-8 h-8 bg-emerald-600 rounded-[var(--radius)] flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
               <BookOpen className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-zinc-900 dark:text-zinc-50">AttendEase</span>
          </div>

          <nav className="space-y-1 flex-1">
            <Link href="/student" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-[var(--radius)] font-medium">
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </Link>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Calendar className="w-5 h-5" />
              Schedule
            </a>
            <a href="#" className="flex items-center gap-3 px-4 py-3 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-[var(--radius)] font-medium transition-colors">
              <Clock className="w-5 h-5" />
              Attendance Logs
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

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-10 overflow-y-auto">
          <header className="flex justify-between items-start mb-8">
            <div>
              <h2 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">Welcome back, {user.name.split(' ')[0]}!</h2>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Here's your attendance overview for this semester.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-full border border-zinc-200 dark:border-zinc-700">
                <Clock className="w-3 h-3 text-zinc-400" />
                <span className="text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-300">{clock}</span>
              </div>
              <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden border-2 border-white dark:border-zinc-700 shadow-md">
                <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="Avatar" />
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-4 uppercase tracking-widest">Attendance Rate</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">94.2%</div>
                <div className="text-emerald-500 text-sm font-bold mb-1 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  +2.1%
                </div>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-4 uppercase tracking-widest">Punctuality Score</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">88/100</div>
                <div className="text-amber-500 text-sm font-bold mb-1">Stable</div>
              </div>
            </div>
            <div className="p-6 bg-white dark:bg-zinc-900 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="text-zinc-500 dark:text-zinc-400 text-xs font-bold mb-4 uppercase tracking-widest">Classes Today</div>
              <div className="flex items-end gap-3">
                <div className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50">4</div>
                <div className="text-zinc-400 text-sm font-bold mb-1">2 completed</div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Schedule Section */}
            <div className="lg:col-span-2">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Today's Schedule</h3>
                <button className="text-emerald-600 dark:text-emerald-400 text-sm font-bold hover:underline">View Full Calendar</button>
              </div>
              <div className="space-y-4">
                {[
                  { time: "09:00 AM", subject: "Advanced Mathematics", room: "Room 402", status: "Present", color: "emerald" },
                  { time: "11:00 AM", subject: "Data Structures & Algorithms", room: "Lab 02", status: "Present", color: "emerald" },
                  { time: "01:30 PM", subject: "Operating Systems", room: "Hall B", status: "Upcoming", color: "zinc" },
                  { time: "03:30 PM", subject: "Software Engineering", room: "Room 201", status: "Upcoming", color: "zinc" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-5 bg-white dark:bg-zinc-900 rounded-[var(--radius)] border border-zinc-100 dark:border-zinc-800 hover:border-emerald-500/30 transition-all group">
                    <div className="w-20 text-sm font-bold text-zinc-400 dark:text-zinc-500">{item.time}</div>
                    <div className="flex-1">
                       <div className="font-bold text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.subject}</div>
                       <div className="flex items-center gap-1 text-xs text-zinc-500 mt-1">
                          <MapPin className="w-3 h-3" />
                          {item.room}
                       </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                      ${item.status === 'Present' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' 
                        : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}`}
                    >
                       {item.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Participation Trends */}
            <div className="lg:col-span-1">
               <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-6">Punctuality Trends</h3>
               <div className="p-8 bg-white dark:bg-zinc-900/50 rounded-[calc(var(--radius)+4px)] border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-white shadow-xl shadow-black/5 dark:shadow-black/20">
                  <div className="flex items-center justify-between mb-8">
                    <span className="text-sm text-zinc-500 dark:text-zinc-400">Past 7 Days</span>
                    <span className="text-emerald-600 dark:text-emerald-400 text-xs font-bold">+12% vs last week</span>
                  </div>
                  
                  {/* Mock Chart */}
                  <div className="flex items-end justify-between h-32 gap-2 px-2">
                    {[60, 80, 45, 90, 100, 70, 85].map((h, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                        <div className="w-full bg-emerald-500/10 rounded-t-sm relative h-full">
                           <div 
                             className="absolute bottom-0 left-0 w-full bg-emerald-500 rounded-t-sm transition-all group-hover:bg-emerald-400" 
                             style={{ height: `${h}%` }}
                           />
                        </div>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
                          {["M", "T", "W", "T", "F", "S", "S"][i]}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 pt-6 border-t border-zinc-100 dark:border-white/5 space-y-4">
                     <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Average Arrival</span>
                        <span className="font-bold">08:52 AM</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-zinc-500 dark:text-zinc-400 font-medium">Late Days</span>
                        <span className="font-bold text-amber-600 dark:text-amber-400">1 (This month)</span>
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
