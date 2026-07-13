import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  UserCircle2, 
  Activity,
  UserCog
} from "lucide-react";

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [actionFilter, setActionFilter] = useState("");
  const [adminFilter, setAdminFilter] = useState("");

  const token = localStorage.getItem("token");

  const fetchLogs = () => {
    setLoading(true);
    const params = new URLSearchParams({
      page,
      size: 10,
      action: actionFilter,
      admin: adminFilter,
    });

    fetch(`${API_BASE_URL}/api/admin/audit-logs?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setLogs(data.content || []);
        setTotalPages(data.totalPages || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [page, actionFilter, adminFilter]);

  const getActionStyles = (action) => {
    const act = action.toUpperCase();
    if (act.includes("DELETE")) return "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20";
    if (act.includes("BLOCK") || act.includes("LOCK")) return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20";
    if (act.includes("CREATE") || act.includes("ADD")) return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20";
    return "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/20";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-slate-900 dark:bg-indigo-600 rounded-2xl text-white shadow-xl shadow-indigo-500/20">
            <ShieldAlert size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">System Audit Logs</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Track all administrative actions and security events.</p>
          </div>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="relative group">
          <Activity className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Action (DELETE, BLOCK...)"
            value={actionFilter}
            onChange={(e) => { setPage(0); setActionFilter(e.target.value); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>

        <div className="relative group">
          <UserCog className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input
            type="text"
            placeholder="Admin Email"
            value={adminFilter}
            onChange={(e) => { setPage(0); setAdminFilter(e.target.value); }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
          />
        </div>
        
        <div className="hidden lg:flex items-center justify-end px-2">
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Filter size={14} /> Global System Filter
            </div>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Ref</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Administrator</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Action Type</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Target Entity</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Scanning Logs...</p>
                    </div>
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium">
                    No matching audit events found.
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {logs.map((log, index) => (
                    <motion.tr
                      key={log.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-6 py-5 text-xs font-bold text-slate-400">
                        {page * 10 + index + 1}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-200">
                          <UserCircle2 size={16} className="text-slate-400" />
                          {log.adminEmail}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border ${getActionStyles(log.action)}`}>
                          {log.action}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium text-slate-500 dark:text-slate-400">
                        {log.targetUserEmail || "System Target"}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-400 group-hover:text-indigo-600 transition-colors">
                          <Clock size={14} />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white dark:bg-slate-800 p-6 rounded-[1.5rem] border border-slate-200 dark:border-slate-700">
        <p className="text-sm font-bold text-slate-400">
          Page <span className="text-slate-900 dark:text-white">{page + 1}</span> of <span className="text-slate-900 dark:text-white">{totalPages}</span>
        </p>

        <div className="flex items-center gap-3">
          <button
            disabled={page === 0}
            onClick={() => setPage((p) => p - 1)}
            className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="p-2.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl disabled:opacity-30 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuditLogs;