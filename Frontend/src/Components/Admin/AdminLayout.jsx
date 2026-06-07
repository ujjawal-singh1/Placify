import React, { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { 
  Home, 
  Building2, 
  BookMarked, 
  ClipboardList, 
  HelpCircle, 
  Users as UsersIcon, 
  History, 
  MessageSquare, 
  LogOut, 
  Sun, 
  Moon,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  Code2
} from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => localStorage.getItem("theme") || "light");

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin User",
    role: "ADMIN",
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLink = (path, label, icon) => (
    <Link
      to={path}
      className={`group flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${
        isActive(path)
          ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50 hover:text-indigo-600 dark:hover:text-indigo-400"
      }`}
    >
      <div className="flex items-center gap-3">
        {React.cloneElement(icon, { size: 18, strokeWidth: isActive(path) ? 2.5 : 2 })}
        {label}
      </div>
      {isActive(path) && <ChevronRight size={14} className="opacity-70" />}
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500 font-sans">

      {/* SIDEBAR */}
      <aside className="w-72 bg-white dark:bg-[#111827] border-r border-slate-200 dark:border-slate-800 flex flex-col fixed h-full z-50 transition-colors duration-500">
        
        {/* BRAND SECTION */}
        <div className="px-8 py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
                <ShieldCheck size={20} strokeWidth={2.5} />
            </div>
            {/* BRAND TEXT: FLIPS BETWEEN DARK SLATE AND WHITE */}
            <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white uppercase transition-colors">
              Placify <span className="text-indigo-600">Pro</span>
            </span>
          </div>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-12 transition-colors">
            Admin Command Center
          </p>
        </div>

        {/* NAVIGATION WRAPPER */}
        <nav className="flex-1 px-4 py-4 space-y-6 overflow-y-auto custom-scrollbar">
          
          <div>
            <SectionHeader label="Core Dashboard" />
            {navLink("/admin", "Home", <Home />)}
          </div>

          <div>
            <SectionHeader label="Directory Management" />
            <div className="space-y-1">
                {navLink("/admin/companies", "Companies", <Building2 />)}
                {navLink("/admin/subjects", "Subjects", <BookMarked />)}
            </div>
          </div>

          <div>
            <SectionHeader label="Assessment Engine" />
            <div className="space-y-1">
                {navLink("/admin/quiz", "Quizzes", <ClipboardList />)}
                {navLink("/admin/questions", "Questions", <HelpCircle />)}
                {navLink("/admin/coding-problems", "Coding Problems", <Code2 />)}
            </div>
          </div>

          <div>
            <SectionHeader label="System & Security" />
            <div className="space-y-1">
                {navLink("/admin/users", "User Registry", <UsersIcon />)}
                {navLink("/admin/auditlogs", "Audit Logs", <History />)}
                {navLink("/admin/feedback", "User Feedback", <MessageSquare />)}
                {navLink("/admin/proctoring", "Proctoring Reports", <ShieldCheck />)}
                {navLink("/admin/plagiarism", "Plagiarism Reports", <ShieldAlert />)}
            </div>
          </div>
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-colors">
          
          {/* PROFILE CARD */}
          <div className="flex items-center gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mb-4 transition-all">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center font-bold text-sm">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              {/* USER NAME: FLIPS AUTOMATICALLY */}
              <p className="text-xs font-black text-slate-900 dark:text-white truncate uppercase tracking-tighter transition-colors">
                {user.name}
              </p>
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest transition-colors">
                {user.role}
              </p>
            </div>
          </div>

          {/* UTILITY BUTTONS */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all border border-transparent dark:border-slate-700"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
              <span className="text-[10px] font-black uppercase tracking-widest">Theme</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 ml-72 p-8 md:p-12 min-h-screen text-slate-900 dark:text-slate-100 transition-colors">
        <div className="max-w-6xl mx-auto">
            <Outlet />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; }
      `}} />
    </div>
  );
};

const SectionHeader = ({ label }) => (
    <p className="px-4 mb-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 transition-colors">
        {label}
    </p>
);

export default AdminLayout;