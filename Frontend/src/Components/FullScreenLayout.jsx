import React from "react";
import { Outlet } from "react-router-dom";

const FullScreenLayout = () => {
  return (
    /* We use h-screen and overflow-hidden here to ensure that 
       components like the IDE (Compiler) or the Quiz portal 
       can manage their own internal scrolling.
    */
    <div className="h-screen w-full bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 selection:bg-indigo-100 dark:selection:bg-indigo-500/30 overflow-hidden">
      
      {/* This Layout acts as a clean slate. 
          The 'Outlet' here will render the Quiz, MockTestRules, or Compiler.
      */}
      <div className="relative h-full w-full flex flex-col">
        <Outlet />
      </div>

      {/* Optional: A very subtle security indicator for proctored sessions 
          that stays constant across the FullScreen flow.
      */}
      <div className="fixed bottom-4 right-6 pointer-events-none opacity-20 dark:opacity-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] rotate-90 origin-right">
          Placify Secure Session
        </p>
      </div>
    </div>
  );
};

export default FullScreenLayout;