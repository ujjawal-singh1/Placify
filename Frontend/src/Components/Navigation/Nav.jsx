import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, LayoutDashboard, BookOpen, Code2, Braces, GraduationCap, Building2, UserCircle, Info } from 'lucide-react';
import logo from "../../assets/Placifyi.png";

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark'
  );

  const location = useLocation();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const isMockActive =
    location.pathname.startsWith("/mocktest") ||
    location.pathname.startsWith("/titles");

  const linkClass = ({ isActive }) =>
    `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 group ${
      isActive
        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10'
        : 'text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-[100] border-b border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Logo Area */}
          <div className="flex-shrink-0 flex items-center">
            <img
              src={logo}
              alt="Placify Logo"
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-300 cursor-pointer"
              onClick={() => (window.location.href = "/dashboard")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink to="/dashboard" className={linkClass}>
              <LayoutDashboard size={18} /> Dashboard
            </NavLink>
            <NavLink to="/subject" className={linkClass}>
              <BookOpen size={18} /> Resources
            </NavLink>
            <NavLink to="/compiler" className={linkClass}>
              <Code2 size={18} /> Compiler
            </NavLink>
            <NavLink to="/coding" className={linkClass}>
              <Braces size={18} /> Coding
            </NavLink>

            <NavLink
              to="/mocktest"
              className={isMockActive ? linkClass({ isActive: true }) : linkClass({ isActive: false })}
            >
              <GraduationCap size={18} /> Mock Test
            </NavLink>

            <NavLink to="/companies" className={linkClass}>
              <Building2 size={18} /> Companies
            </NavLink>
            <NavLink to="/profile" className={linkClass}>
              <UserCircle size={18} /> Profile
            </NavLink>
            <NavLink to="/about" className={linkClass}>
              <Info size={18} /> About
            </NavLink>

            {/* Vertical Divider */}
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-4"></div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 transition-all duration-300 shadow-sm"
              aria-label="Toggle Theme"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar / Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100 py-6' : 'max-h-0 opacity-0 py-0'
        }`}
      >
        <div className="px-4 space-y-2">
          <MobileLink to="/dashboard" icon={<LayoutDashboard size={20}/>} label="Dashboard" onClick={() => setIsOpen(false)} />
          <MobileLink to="/subject" icon={<BookOpen size={20}/>} label="Resources" onClick={() => setIsOpen(false)} />
          <MobileLink to="/compiler" icon={<Code2 size={20}/>} label="Compiler" onClick={() => setIsOpen(false)} />
          <MobileLink to="/coding" icon={<Braces size={20}/>} label="Coding" onClick={() => setIsOpen(false)} />
          
          <NavLink
              to="/mocktest"
              onClick={() => setIsOpen(false)}
              className={isMockActive ? linkClass({ isActive: true }) : linkClass({ isActive: false })}
          >
              <GraduationCap size={20} /> Mock Test
          </NavLink>

          <MobileLink to="/companies" icon={<Building2 size={20}/>} label="Companies" onClick={() => setIsOpen(false)} />
          <MobileLink to="/profile" icon={<UserCircle size={20}/>} label="Profile" onClick={() => setIsOpen(false)} />
          <MobileLink to="/about" icon={<Info size={20}/>} label="About" onClick={() => setIsOpen(false)} />
        </div>
      </div>
    </nav>
  );
};

/* --- Helper Component for Mobile --- */
const MobileLink = ({ to, icon, label, onClick }) => (
  <NavLink 
    to={to} 
    onClick={onClick}
    className={({ isActive }) => 
      `flex items-center gap-4 px-4 py-3 rounded-2xl text-base font-bold transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`
    }
  >
    {icon} {label}
  </NavLink>
);

export default Nav;