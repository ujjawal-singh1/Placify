import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../Navigation/Nav";

const Layout = () => {
  return (
    /* Added 'antialiased' for smoother font rendering 
       and explicit text colors to prevent "invisible text" on theme switch.
    */
    <div className="min-h-screen antialiased bg-slate-50 dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-500 ease-in-out flex flex-col font-sans">
      
      {/* Navigation Layer */}
      <Nav />

      {/* Main content wrapper with consistent horizontal padding */}
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300">
        <main className="py-6 h-full">
          {/* The text-inherit ensures child components don't 
              accidentally default to browser-black in dark mode.
          */}
          <div className="text-inherit">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Aesthetic bottom glow */}
      <div className="fixed bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent pointer-events-none" />
    </div>
  );
};

export default Layout;