import React, { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { 
  BookOpen, 
  LayoutDashboard, 
  Trophy, 
  User, 
  Briefcase, 
  ClipboardCheck, 
  ChevronRight,
  Zap
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    }
  }, [token, user, navigate]);

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-indigo-600 dark:bg-indigo-900/50 clip-path-slant -z-10" />

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* ================= USER HEADER ================= */}
        <header className="relative bg-white/70 dark:bg-slate-800/50 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-xl p-8 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <LayoutDashboard size={120} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
            {/* Avatar with Ring */}
            <div className="relative">
              <div className="w-32 h-32 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-5xl font-bold text-white shadow-2xl transform -rotate-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800"></div>
            </div>

            <div className="text-center md:text-left flex-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <h1 className="text-4xl font-extrabold tracking-tight">
                  Welcome back, {user.name.split(' ')[0]}!
                </h1>
                <span className="px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-lg bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  {user.role}
                </span>
              </div>
              
              <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
                {user.email}
              </p>

              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                 <p className="text-sm font-medium flex items-center gap-2 text-slate-600 dark:text-slate-300">
                   <Zap size={16} className="text-amber-500" /> 
                   Keep up the 5-day streak!
                 </p>
              </div>
            </div>
          </div>
        </header>

        {/* ================= QUICK STATS ================= */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard 
            title="Quizzes Available" 
            value="12" 
            icon={<ClipboardCheck className="text-blue-500" />}
            trend="+2 New"
          />
          <StatCard 
            title="Prep Level" 
            value="Advanced" 
            icon={<Trophy className="text-amber-500" />}
            trend="Top 10%"
          />
          <StatCard 
            title="Resources" 
            value="24" 
            icon={<BookOpen className="text-emerald-500" />}
            trend="8 Unread"
          />
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-tight">Quick Actions</h2>
            <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800 mx-6 hidden sm:block"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <QuickLink to="/mocktest" label="Mock Test" icon={<Zap />} desc="Test your skills" color="indigo" />
          <QuickLink to="/subject" label="Resources" icon={<BookOpen />} desc="Study materials" color="emerald" />
          <QuickLink to="/companies" label="Companies" icon={<Briefcase />} desc="Career paths" color="violet" />
          <QuickLink to="/profile" label="Settings" icon={<User />} desc="Your account" color="rose" />
        </div>

        {/* ================= MOTIVATION FOOTER ================= */}
        <footer className="mt-16 relative overflow-hidden bg-slate-900 dark:bg-indigo-950 rounded-3xl p-8 text-center text-white shadow-2xl">
          <div className="relative z-10">
            <h3 className="text-xl font-semibold mb-2 italic">"Success is not final; failure is not fatal: It is the courage to continue that counts."</h3>
            <p className="text-indigo-300 font-medium">🚀 Placify • Your Roadmap to the Future</p>
          </div>
          {/* Decorative blur */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-indigo-500/20 blur-[100px] rounded-full"></div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .clip-path-slant {
          clip-path: polygon(0 0, 100% 0, 100% 70%, 0 100%);
        }
      `}} />
    </main>
  );
};

/* ================= REFINED COMPONENTS ================= */

const QuickLink = ({ to, label, icon, desc, color }) => {
  const colors = {
    indigo: "hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border-indigo-100 dark:border-indigo-900/50 text-indigo-600",
    emerald: "hover:bg-emerald-50 dark:hover:bg-emerald-900/20 border-emerald-100 dark:border-emerald-900/50 text-emerald-600",
    violet: "hover:bg-violet-50 dark:hover:bg-violet-900/20 border-violet-100 dark:border-violet-900/50 text-violet-600",
    rose: "hover:bg-rose-50 dark:hover:bg-rose-900/20 border-rose-100 dark:border-rose-900/50 text-rose-600",
  };

  return (
    <NavLink
      to={to}
      className={`group bg-white dark:bg-slate-800 p-6 rounded-3xl border shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${colors[color]}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-700/50 group-hover:scale-110 transition-transform">
          {React.cloneElement(icon, { size: 24 })}
        </div>
        <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0" />
      </div>
      <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{label}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </NavLink>
  );
};

const StatCard = ({ title, value, icon, trend }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700/50">
        {icon}
      </div>
      <span className="text-xs font-bold text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-1 rounded-md">
        {trend}
      </span>
    </div>
    <div>
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
    </div>
  </div>
);

export default Dashboard;