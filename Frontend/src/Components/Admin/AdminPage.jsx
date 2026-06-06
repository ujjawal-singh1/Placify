import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  BarChart3, 
  FolderOpen, 
  MessageSquare, 
  Building2, 
  BookMarked, 
  ClipboardList, 
  Mail,
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const AdminPage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user")) || {
    name: "Admin",
    role: "ADMIN",
  };

  const stats = [
    { label: "Total Users", value: "1,200+", icon: <Users size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Quizzes", value: "85+", icon: <BarChart3 size={24} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Resources", value: "500+", icon: <FolderOpen size={24} />, color: "text-amber-500", bg: "bg-amber-500/10" },
    { label: "Feedback", value: "120+", icon: <MessageSquare size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  const actions = [
    {
      title: "Manage Companies",
      desc: "Add, update and manage recruiting companies.",
      icon: <Building2 className="text-blue-500" />,
      path: "/admin/companies",
    },
    {
      title: "Manage Subjects",
      desc: "Organize subjects and learning resources.",
      icon: <BookMarked className="text-emerald-500" />,
      path: "/admin/subjects",
    },
    {
      title: "Manage Quizzes",
      desc: "Create quizzes and questions for mock tests.",
      icon: <ClipboardList className="text-amber-500" />,
      path: "/admin/quiz",
    },
    {
      title: "User Feedback",
      desc: "Review feedback shared by students.",
      icon: <Mail className="text-purple-500" />,
      path: "/admin/feedback",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900/50 p-6 lg:p-10 transition-colors duration-300">
      
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-widest mb-2">
            <ShieldCheck size={16} /> Admin Command Center
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Welcome back, {user.name} 👋
          </h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400 font-medium">
            Manage the Placify ecosystem and monitor student engagement.
          </p>
        </div>
        
        <div className="px-6 py-3 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 flex items-center gap-4">
           <div className="text-right">
             <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">System Status</p>
             <p className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1.5">
               <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span> Operational
             </p>
           </div>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
        {stats.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700/50 p-6 flex items-center gap-5 transition-all"
          >
            <div className={`w-14 h-14 shrink-0 flex items-center justify-center rounded-2xl ${s.bg} ${s.color}`}>
              {s.icon}
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{s.label}</p>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{s.value}</h2>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SECTION TITLE */}
      <div className="flex items-center gap-4 mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Administrative Tools</h2>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
      </div>

      {/* ACTIONS GRID */}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {actions.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + (index * 0.1) }}
            whileHover={{ y: -8 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(card.path)}
            className="group cursor-pointer bg-white dark:bg-slate-800 rounded-[2rem] p-8 shadow-sm border border-slate-100 dark:border-slate-700/50 transition-all hover:shadow-2xl hover:shadow-indigo-500/10"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">
                {React.cloneElement(card.icon, { size: 32 })}
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 transition-all">
                <ArrowRight size={20} />
              </div>
            </div>

            <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              {card.title}
            </h3>

            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {card.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* SYSTEM LOG FOOTER */}
      <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
            Placify v2.4.0 • Enterprise Edition
          </p>
          <div className="flex items-center gap-6">
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Database: MongoDB Cloud</span>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Engine: Spring Boot 3</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AdminPage;