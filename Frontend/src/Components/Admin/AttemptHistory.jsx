import React, { useEffect, useMemo, useState } from "react";
import { Award, Download, Eye, Loader2, Search, X } from "lucide-react";
import { API_BASE_URL } from "../../config";

const AttemptHistory = ({ quizId }) => {
  const [attempts, setAttempts] = useState([]);
  const [selectedAttempt, setSelectedAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const backend = API_BASE_URL;
  const token = localStorage.getItem("token");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);

  useEffect(() => {
    const endpoint = quizId ? `/quiz-attempt/quiz/${quizId}` : "/quiz-attempt/all";

    setLoading(true);
    fetch(`${backend}${endpoint}`, { headers })
      .then((r) => {
        if (!r.ok) throw new Error("Unable to load marks");
        return r.json();
      })
      .then((data) => setAttempts(Array.isArray(data) ? data : []))
      .catch((error) => {
        console.error(error);
        setAttempts([]);
      })
      .finally(() => setLoading(false));
  }, [backend, headers, quizId]);

  const filteredAttempts = attempts.filter((attempt) => {
    const query = searchQuery.toLowerCase();
    return [attempt.userId, attempt.quizTitle, attempt.quizId]
      .filter(Boolean)
      .some((value) => value.toLowerCase().includes(query));
  });

  const averageScore = attempts.length
    ? Math.round(
        attempts.reduce((sum, attempt) => {
          if (!attempt.totalMarks) return sum;
          return sum + (attempt.score * 100) / attempt.totalMarks;
        }, 0) / attempts.length
      )
    : 0;

  const csvEscape = (value) => {
    const text = value == null ? "" : String(value);
    return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  const downloadResults = () => {
    const columns = [
      "Student",
      "Quiz Title",
      "Quiz ID",
      "Score",
      "Total Marks",
      "Percentage",
      "Cheat Count",
      "Submitted At",
    ];

    const rows = attempts.map((attempt) => {
      const percentage = attempt.totalMarks > 0 ? Math.round((attempt.score * 100) / attempt.totalMarks) : 0;
      return [
        attempt.userId,
        attempt.quizTitle || "Unknown Quiz",
        attempt.quizId,
        attempt.score,
        attempt.totalMarks,
        `${percentage}%`,
        attempt.cheatCount || 0,
        attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "N/A",
      ];
    });

    const csv = [columns, ...rows].map((row) => row.map(csvEscape).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `placify-results-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const openProctorLogs = (attempt) => {
    fetch(`${backend}/quiz/proctor/attempt/${attempt.id}`, { headers })
      .then((r) => r.json())
      .then((logs) => {
        setSelectedAttempt({ attempt, logs: Array.isArray(logs) ? logs : [] });
      })
      .catch(() => setSelectedAttempt({ attempt, logs: [] }));
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
      <div className="mb-10 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white">
              <Award size={22} strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Marks
            </h1>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 ml-14">
            Review student scores and submitted quiz attempts.
          </p>
        </div>

        <button
          type="button"
          onClick={downloadResults}
          disabled={attempts.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-black text-white shadow-lg shadow-indigo-500/20 transition-all hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none dark:disabled:bg-slate-700"
        >
          <Download size={16} />
          Download Everyone's Results
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Attempts</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">{attempts.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">Average Score</p>
          <p className="text-2xl font-black text-emerald-500">{averageScore}%</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Flagged Attempts</p>
          <p className="text-2xl font-black text-amber-500">{attempts.filter((a) => (a.cheatCount || 0) > 0).length}</p>
        </div>
      </div>

      <div className="relative mb-8">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by student, quiz title, or quiz ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
        />
      </div>

      <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
        <table className="w-full">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50">
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Student</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Quiz</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Marks</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Percentage</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Submitted</th>
              <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
            {filteredAttempts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-16 text-center text-sm font-semibold text-slate-500">
                  No marks found.
                </td>
              </tr>
            ) : (
              filteredAttempts.map((attempt) => {
                const percentage = attempt.totalMarks > 0 ? Math.round((attempt.score * 100) / attempt.totalMarks) : 0;
                return (
                  <tr key={attempt.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-slate-700 dark:text-slate-300">{attempt.userId}</td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-black text-slate-900 dark:text-white">{attempt.quizTitle || "Unknown Quiz"}</div>
                      <div className="text-xs text-slate-500">{attempt.quizId}</div>
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-900 dark:text-white">
                      {attempt.score}/{attempt.totalMarks}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        {percentage}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {attempt.submittedAt ? new Date(attempt.submittedAt).toLocaleString() : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        type="button"
                        onClick={() => openProctorLogs(attempt)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all border border-indigo-100 dark:border-indigo-500/20"
                      >
                        <Eye size={13} />
                        View Proctor
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedAttempt && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow max-w-2xl w-full border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white">Proctor Logs - {selectedAttempt.attempt.userId}</h3>
              <button
                type="button"
                onClick={() => setSelectedAttempt(null)}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-500"
              >
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-[60vh] overflow-auto">
              {selectedAttempt.logs.length === 0 ? (
                <div className="col-span-2 py-12 text-center text-sm font-semibold text-slate-500">
                  No proctor logs recorded for this attempt.
                </div>
              ) : (
                selectedAttempt.logs.map((log) => {
                  const imgSrc = log.imageUrl
                    ? log.imageUrl
                    : log.imageBase64
                      ? log.imageBase64.startsWith("data:")
                        ? log.imageBase64
                        : `data:image/png;base64,${log.imageBase64}`
                      : null;
                  return (
                    <div key={log.id} className="p-2 border border-slate-200 dark:border-slate-700 rounded-xl">
                      {imgSrc ? (
                        <img src={imgSrc} alt="snap" className="w-full rounded" />
                      ) : (
                        <div className="text-sm text-gray-500">{log.issue}</div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : "N/A"}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttemptHistory;
