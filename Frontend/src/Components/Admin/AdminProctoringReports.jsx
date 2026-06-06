import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  ChevronDown,
  ChevronUp,
  User,
  Clock,
  FileWarning,
  X,
  Loader2,
  Inbox,
  Camera,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const backendUrl = API_BASE_URL;

const AdminProctoringReports = () => {
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [proctorModal, setProctorModal] = useState(null); // { attemptId, logs, loading }

  useEffect(() => {
    fetch(`${backendUrl}/quiz-attempt/all`)
      .then((r) => r.json())
      .then((data) => {
        setAttempts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Group attempts by quizTitle
  const grouped = attempts.reduce((acc, a) => {
    const key = a.quizTitle || "Unknown Quiz";
    if (!acc[key]) acc[key] = { quizTitle: key, quizId: a.quizId, attempts: [] };
    acc[key].attempts.push(a);
    return acc;
  }, {});

  const quizGroups = Object.values(grouped).filter((g) =>
    g.quizTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openProctorLogs = async (attemptId) => {
    setProctorModal({ attemptId, logs: [], loading: true });
    try {
      const res = await fetch(`${backendUrl}/quiz/proctor/attempt/${attemptId}`);
      const logs = await res.json();
      setProctorModal({ attemptId, logs: Array.isArray(logs) ? logs : [], loading: false });
    } catch {
      setProctorModal({ attemptId, logs: [], loading: false });
    }
  };

  const getSeverity = (count) => {
    if (count === 0) return { label: "Clean", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" };
    if (count <= 2) return { label: "Low", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" };
    return { label: "High", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div>
      {/* HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
            <ShieldCheck size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Proctoring Reports
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-14">
          Monitor exam integrity and view violation reports across all assessments.
        </p>
      </div>

      {/* STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Attempts</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{attempts.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Flagged Attempts</p>
          <p className="text-2xl font-black text-amber-500">{attempts.filter((a) => (a.cheatCount || 0) > 0).length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Clean Attempts</p>
          <p className="text-2xl font-black text-emerald-500">{attempts.filter((a) => (a.cheatCount || 0) === 0).length}</p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by quiz title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      {/* QUIZ GROUPS */}
      {quizGroups.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-800/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 text-slate-400">
            <Inbox size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No reports found</h3>
          <p className="text-slate-500">No quiz attempts match your search criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizGroups.map((group) => {
            const flagged = group.attempts.filter((a) => (a.cheatCount || 0) > 0).length;
            const isExpanded = expandedQuiz === group.quizTitle;

            return (
              <div
                key={group.quizTitle}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all"
              >
                {/* Quiz Header Row */}
                <button
                  onClick={() => setExpandedQuiz(isExpanded ? null : group.quizTitle)}
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl ${flagged > 0 ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"}`}>
                      {flagged > 0 ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white capitalize">{group.quizTitle}</h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {group.attempts.length} attempt{group.attempts.length !== 1 ? "s" : ""}
                        {flagged > 0 && <span className="text-amber-500 font-bold"> • {flagged} flagged</span>}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {flagged > 0 && (
                      <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-500 text-xs font-bold border border-amber-500/20">
                        {flagged} Violation{flagged !== 1 ? "s" : ""}
                      </span>
                    )}
                    {isExpanded ? <ChevronUp size={18} className="text-slate-400" /> : <ChevronDown size={18} className="text-slate-400" />}
                  </div>
                </button>

                {/* Expanded Attempts */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">User</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Score</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Violations</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Severity</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {group.attempts.map((attempt) => {
                            const sev = getSeverity(attempt.cheatCount || 0);
                            return (
                              <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <User size={14} className="text-slate-400" />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                                      {attempt.userId}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {attempt.score}/{attempt.totalMarks}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`text-sm font-bold ${sev.color}`}>
                                    {attempt.cheatCount || 0}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${sev.bg} ${sev.color} border ${sev.border}`}>
                                    {sev.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock size={12} />
                                    {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "N/A"}
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <button
                                    onClick={() => openProctorLogs(attempt.id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100 dark:border-indigo-500/20"
                                  >
                                    <Eye size={13} />
                                    View Logs
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* PROCTOR LOG MODAL */}
      {proctorModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] w-full max-w-2xl max-h-[80vh] overflow-hidden border border-slate-200 dark:border-slate-700 shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-500/10 rounded-xl text-indigo-500">
                  <Camera size={18} />
                </div>
                <div>
                  <h3 className="font-black text-slate-900 dark:text-white">Proctor Logs</h3>
                  <p className="text-xs text-slate-500">Attempt: {proctorModal.attemptId}</p>
                </div>
              </div>
              <button
                onClick={() => setProctorModal(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-500"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh] custom-scrollbar">
              {proctorModal.loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin text-indigo-500" size={30} />
                </div>
              ) : proctorModal.logs.length === 0 ? (
                <div className="text-center py-12">
                  <FileWarning size={40} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 font-medium">No proctor logs recorded for this attempt.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {proctorModal.logs.map((log, i) => (
                    <div
                      key={log.id || i}
                      className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="flex items-center gap-2 text-sm font-bold text-rose-500">
                          <AlertTriangle size={14} />
                          {log.issue || "Unknown Issue"}
                        </span>
                        <span className="text-xs text-slate-500">
                          {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                        </span>
                      </div>
                      {log.imageBase64 && (
                        <img
                          src={log.imageBase64.startsWith("data:") ? log.imageBase64 : `data:image/png;base64,${log.imageBase64}`}
                          alt="Proctor Screenshot"
                          className="w-full max-h-48 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
      `}} />
    </div>
  );
};

export default AdminProctoringReports;
