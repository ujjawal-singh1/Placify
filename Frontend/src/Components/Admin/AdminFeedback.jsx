import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Clock, Inbox, MessageSquareQuote } from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/feedback/all`)
      .then((res) => res.json())
      .then((data) => {
        setFeedbacks(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-transparent transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="mb-10 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase tracking-[0.2em] mb-2">
            <Inbox size={14} /> Community Insights
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            User Feedback
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Review thoughts and suggestions submitted by Placify users.
          </p>
        </div>
        
        <div className="hidden md:block px-5 py-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Entries</p>
            <p className="text-xl font-black text-indigo-600 dark:text-indigo-400">{feedbacks.length}</p>
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 w-full bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          ))}
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && feedbacks.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
           <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6">
              <MessageSquareQuote size={40} className="text-slate-300 dark:text-slate-600" />
           </div>
           <h3 className="text-xl font-bold text-slate-900 dark:text-white">Inbox is empty</h3>
           <p className="text-slate-500 dark:text-slate-400">No feedback has been received yet.</p>
        </div>
      )}

      {/* FEEDBACK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {feedbacks.map((f, index) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 p-8 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative Quote Mark */}
              <div className="absolute top-4 right-6 text-slate-100 dark:text-slate-700 group-hover:text-indigo-500/10 transition-colors">
                  <MessageSquareQuote size={60} />
              </div>

              {/* USER INFO */}
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white leading-tight">
                    {f.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 flex items-center gap-1.5 mt-1">
                    <Mail size={12} /> {f.email}
                  </p>
                </div>
              </div>

              {/* MESSAGE BODY */}
              <div className="relative z-10">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium mb-6 italic">
                  "{f.message}"
                </p>
              </div>

              {/* TIMESTAMP */}
              <div className="flex items-center gap-2 pt-6 border-t border-slate-100 dark:border-slate-700 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest relative z-10">
                <Clock size={12} /> {new Date(f.createdAt).toLocaleString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminFeedback;