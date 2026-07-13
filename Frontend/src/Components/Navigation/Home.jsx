import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Cpu, 
  BookOpen, 
  Trophy, 
  Users, 
  Code2, 
  Zap, 
  BarChart3,
  ChevronRight,
  ArrowRight,
  Building2 // <--- Add this line
} from "lucide-react";

const Home = () => {
  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-[#0f172a] transition-colors duration-500">

      {/* BACKGROUND GRADIENT ANIMATION */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[500px] h-[500px] bg-indigo-500/20 dark:bg-indigo-600/10 rounded-full blur-[120px] -top-48 -left-24"
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] bg-purple-500/10 dark:bg-purple-600/10 rounded-full blur-[120px] top-1/2 -right-48"
          animate={{
            x: [0, -40, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative max-w-7xl mx-auto px-6 pt-32 pb-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-8 border border-indigo-200 dark:border-indigo-800"
        >
          <Zap size={14} fill="currentColor" /> Powered by AI Proctoring
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Smart Code <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500">Evaluation Portal</span>
        </motion.h1>

        <motion.p
          className="mt-8 text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Secure, intelligent, and real-time evaluation with AI proctoring, auto-scoring,
          study resources, and company preparation all in one platform.
        </motion.p>

        {/* CTA BUTTONS */}
        <motion.div
          className="mt-12 flex flex-wrap justify-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <NavLink
            to="/dashboard"
            className="group px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-2xl shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </NavLink>

          <NavLink
            to="/login"
            className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold shadow-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-all"
          >
            Sign In
          </NavLink>

          <NavLink
            to="/signup"
            className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-2xl font-bold shadow-xl hover:opacity-90 transition-all"
          >
            Sign Up
          </NavLink>
        </motion.div>
      </section>

      {/* OVERVIEW SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
        <div className="bg-white/70 dark:bg-slate-900/50 backdrop-blur-2xl border border-slate-200 dark:border-slate-800 rounded-[3rem] p-8 md:p-16 shadow-2xl overflow-hidden">
          
          <div className="grid lg:grid-cols-2 gap-16">
            {/* LEFT: Overview */}
            <div>
              <div className="inline-block p-3 rounded-2xl bg-indigo-600 text-white mb-6">
                 <Cpu size={32} />
              </div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Platform Overview</h2>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                Placify is a powerful platform designed for coding exams, mock tests,
                and placement preparation with integrated learning resources.
              </p>

              <div className="space-y-6">
                <CapabilityItem text="AI-based proctoring with face tracking" />
                <CapabilityItem text="Safe code execution sandbox using Docker" />
                <CapabilityItem text="MCQ, Coding, Mock Tests for Admins" />
                <CapabilityItem text="Structured Subject-based resources" />
              </div>

              <div className="mt-12">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-6">Core Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {["Spring Boot", "MongoDB", "React", "Docker", "WebRTC", "OpenCV", "JWT"].map((t) => (
                    <span key={t} className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT: Feature Grid */}
            <div className="grid sm:grid-cols-2 gap-4">
               <Feature icon={<BookOpen size={20} />} title="Resources" desc="Curated notes and materials." />
               <Feature icon={<Trophy size={20} />} title="Simulation" desc="Full mock exam environments." />
               <Feature icon={<Building2 size={20} />} title="Career" desc="Company-specific modules." />
               <Feature icon={<ShieldCheck size={20} />} title="AI Security" desc="Anti-cheat proctoring logic." />
               <Feature icon={<BarChart3 size={20} />} title="Grading" desc="Instant test-case feedback." />
               <Feature icon={<Code2 size={20} />} title="Sandbox" desc="Live coding across languages." />
            </div>
          </div>
        </div>
      </section>

      {/* TEAM SECTION */}
      <section className="max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Meet the Developers</h2>
          <p className="text-slate-500 font-medium mt-2">Department of IT • AEC</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Member name="Mana Panda" roll="10800222093" />
          <Member name="Shubham Sharma" roll="10800222081" />
          <Member name="Rohit Soni" roll="10800222029" />
          <Member name="Ujjawal Kumar" roll="10800222083" />
        </div>
      </section>
    </main>
  );
};

/* --- REFINED UI COMPONENTS --- */

const Feature = ({ title, desc, icon }) => (
  <motion.div
    className="p-6 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-[2rem] hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group"
    whileHover={{ y: -5 }}
  >
    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
      {icon}
    </div>
    <h4 className="font-bold text-slate-900 dark:text-white mb-1">{title}</h4>
    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{desc}</p>
  </motion.div>
);

const CapabilityItem = ({ text }) => (
  <div className="flex items-center gap-3">
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center">
      <ChevronRight size={14} strokeWidth={3} />
    </div>
    <span className="text-slate-700 dark:text-slate-300 font-bold text-sm">{text}</span>
  </div>
);

const Member = ({ name, roll }) => (
  <motion.div
    className="relative group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 text-center shadow-sm hover:shadow-2xl transition-all"
    whileHover={{ y: -8 }}
  >
    <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
       <Users size={32} />
    </div>
    <p className="font-black text-slate-900 dark:text-white text-lg tracking-tight">{name}</p>
    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">Roll: {roll}</p>
  </motion.div>
);

export default Home;