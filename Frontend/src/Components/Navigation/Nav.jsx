import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';

const Nav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  // Apply theme to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded-md hover:text-blue-600 dark:hover:text-blue-400 ${
      isActive
        ? 'text-blue-600 dark:text-blue-400 font-semibold'
        : 'text-black dark:text-gray-200'
    }`;

  return (
    <nav className="bg-gradient-to-r from-pink-400 via-white to-orange-300 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo + Name */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-black dark:text-white">
              Placify
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            <NavLink to="/" className={linkClass}>Home</NavLink>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/resource" className={linkClass}>Resource</NavLink>
            <NavLink to="/mocktest" className={linkClass}>Mock Test</NavLink>
            <NavLink to="/companies" className={linkClass}>Companies</NavLink>
            <NavLink to="/profile" className={linkClass}>Profile</NavLink>
            <NavLink to="/about" className={linkClass}>About</NavLink>
            <NavLink to="/login" className={linkClass}>Login</NavLink>
            <NavLink to="/signup" className={linkClass}>Signup</NavLink>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="ml-4 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden text-black dark:text-white focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Dropdown */}
        {isOpen && (
          <div className="md:hidden flex flex-col space-y-2 pb-4">
            <NavLink to="/" className={linkClass} onClick={() => setIsOpen(false)}>Home</NavLink>
            <NavLink to="/dashboard" className={linkClass} onClick={() => setIsOpen(false)}>Dashboard</NavLink>
            <NavLink to="/resource" className={linkClass} onClick={() => setIsOpen(false)}>Resource</NavLink>
            <NavLink to="/mocktest" className={linkClass} onClick={() => setIsOpen(false)}>Mock Test</NavLink>
            <NavLink to="/companies" className={linkClass} onClick={() => setIsOpen(false)}>Companies</NavLink>
            <NavLink to="/profile" className={linkClass} onClick={() => setIsOpen(false)}>Profile</NavLink>
            <NavLink to="/about" className={linkClass} onClick={() => setIsOpen(false)}>About</NavLink>
            <NavLink to="/login" className={linkClass} onClick={() => setIsOpen(false)}>Login</NavLink>
            <NavLink to="/signup" className={linkClass} onClick={() => setIsOpen(false)}>Signup</NavLink>

            {/* Dark Mode Toggle in Mobile */}
            <button
              onClick={() => { setDarkMode(!darkMode); setIsOpen(false); }}
              className="mt-2 px-3 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-sm text-black dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
