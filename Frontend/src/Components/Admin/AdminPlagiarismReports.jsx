import React, { useState, useEffect } from "react";
import {
  ShieldAlert,
  Search,
  ChevronDown,
  ChevronUp,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  X,
  Loader2,
  Inbox,
  BarChart3,
  Play,
  Eye,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminPlagiarismReports = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedQuiz, setExpandedQuiz] = useState(null);
  const [analyzing, setAnalyzing] = useState(null); // quizId being analyzed
  const [comparisonModal, setComparisonModal] = useState(null);
  const [quizzes, setQuizzes] = useState([]);

  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  // fetch all plagiarism results + quiz list for the "analyze" feature
  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/api/plagiarism/flagged`, { headers }).then((r) =>
        r.ok ? r.json() : []
      ),
      fetch(`${API_BASE_URL}/quiz/all`).then((r) => r.json()),
    ])
      .then(([flagged, allQuizzes]) => {
        setResults(Array.isArray(flagged) ? flagged : []);
        setQuizzes(Array.isArray(allQuizzes) ? allQuizzes : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // trigger plagiarism analysis for a specific quiz
  const handleAnalyze = async (quizId) => {
    setAnalyzing(quizId);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/plagiarism/analyze/${quizId}`,
        { method: "POST", headers }
      );
      if (res.ok) {
        // re-fetch results after analysis
        const updated = await fetch(`${API_BASE_URL}/api/plagiarism/flagged`, {
          headers,
        }).then((r) => r.json());
        setResults(Array.isArray(updated) ? updated : []);
      }
    } catch (err) {
      console.error("Analysis failed:", err);
    }
    setAnalyzing(null);
  };

  // group results by quizId
  const grouped = results.reduce((acc, r) => {
    if (!acc[r.quizId]) acc[r.quizId] = [];
    acc[r.quizId].push(r);
    return acc;
  }, {});

  // build quiz groups with names
  const quizGroups = Object.entries(grouped)
    .map(([quizId, pairs]) => {
      const quiz = quizzes.find((q) => q.id === quizId);
      const title = quiz?.title || quizId;
      return { quizId, title, pairs };
    })
    .filter((g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  // stats
  const totalFlagged = results.filter((r) => r.flagged).length;
  const avgSimilarity =
    results.length > 0
      ? (
          results.reduce((sum, r) => sum + r.similarityScore, 0) /
          results.length
        ).toFixed(2)
      : "0.00";

  const getSimilarityColor = (score) => {
    if (score >= 0.9)
      return {
        text: "text-rose-500",
        bg: "bg-rose-500",
        label: "Critical",
        bgLight: "bg-rose-500/10",
        border: "border-rose-500/20",
      };
    if (score >= 0.8)
      return {
        text: "text-amber-500",
        bg: "bg-amber-500",
        label: "High",
        bgLight: "bg-amber-500/10",
        border: "border-amber-500/20",
      };
    return {
      text: "text-emerald-500",
      bg: "bg-emerald-500",
      label: "Low",
      bgLight: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    };
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
          <div className="p-2.5 bg-violet-600 rounded-xl text-white">
            <ShieldAlert size={22} strokeWidth={2.5} />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Plagiarism Reports
          </h1>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 ml-14">
          Analyze answer patterns across quiz submissions to identify potential
          copying.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            Total Quizzes Analyzed
          </p>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {Object.keys(grouped).length}
          </p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">
            Flagged Pairs
          </p>
          <p className="text-2xl font-black text-rose-500">{totalFlagged}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700">
          <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">
            Avg Similarity
          </p>
          <p className="text-2xl font-black text-amber-500">
            {(avgSimilarity * 100).toFixed(0)}%
          </p>
        </div>
      </div>

      {/* SEARCH + ANALYZE ALL */}
      <div className="flex gap-4 mb-8">
        <div className="relative flex-1">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search by quiz title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* QUIZ LIST WITH ANALYZE BUTTONS */}
      <div className="mb-8">
        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
          Available Quizzes
        </h3>
        <div className="flex flex-wrap gap-2">
          {quizzes.slice(0, 12).map((quiz) => (
            <button
              key={quiz.id}
              onClick={() => handleAnalyze(quiz.id)}
              disabled={analyzing === quiz.id}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:border-violet-500 hover:text-violet-600 dark:hover:text-violet-400 transition-all disabled:opacity-50"
            >
              {analyzing === quiz.id ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                <Play size={12} />
              )}
              {quiz.title}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTS */}
      {quizGroups.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-slate-800/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
          <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 text-slate-400">
            <Inbox size={48} />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">
            No flagged pairs found
          </h3>
          <p className="text-slate-500">
            Run analysis on a quiz above to check for plagiarism.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {quizGroups.map((group) => {
            const isExpanded = expandedQuiz === group.quizId;
            const flaggedCount = group.pairs.filter((p) => p.flagged).length;

            return (
              <div
                key={group.quizId}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              >
                {/* Quiz Header */}
                <button
                  onClick={() =>
                    setExpandedQuiz(isExpanded ? null : group.quizId)
                  }
                  className="w-full flex items-center justify-between p-6 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors text-left"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-2.5 rounded-xl ${flaggedCount > 0 ? "bg-rose-500/10 text-rose-500" : "bg-emerald-500/10 text-emerald-500"}`}
                    >
                      {flaggedCount > 0 ? (
                        <AlertTriangle size={20} />
                      ) : (
                        <CheckCircle2 size={20} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 dark:text-white capitalize">
                        {group.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {group.pairs.length} pair
                        {group.pairs.length !== 1 ? "s" : ""} analyzed
                        {flaggedCount > 0 && (
                          <span className="text-rose-500 font-bold">
                            {" "}
                            • {flaggedCount} flagged
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {flaggedCount > 0 && (
                      <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-500 text-xs font-bold border border-rose-500/20">
                        {flaggedCount} Match
                        {flaggedCount !== 1 ? "es" : ""}
                      </span>
                    )}
                    {isExpanded ? (
                      <ChevronUp size={18} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-400" />
                    )}
                  </div>
                </button>

                {/* Expanded Pairs */}
                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-slate-50 dark:bg-slate-900/50">
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Student 1
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Student 2
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Similarity
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Matched
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Status
                            </th>
                            <th className="px-6 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                              Analyzed
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                          {group.pairs.map((pair, i) => {
                            const simColor = getSimilarityColor(
                              pair.similarityScore
                            );
                            return (
                              <tr
                                key={pair.id || i}
                                className="hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors"
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <Users
                                      size={14}
                                      className="text-slate-400"
                                    />
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                                      {pair.userId1}
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 truncate max-w-[180px]">
                                    {pair.userId2}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-20 h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full ${simColor.bg} rounded-full transition-all`}
                                        style={{
                                          width: `${pair.similarityScore * 100}%`,
                                        }}
                                      />
                                    </div>
                                    <span
                                      className={`text-sm font-bold ${simColor.text}`}
                                    >
                                      {(pair.similarityScore * 100).toFixed(0)}%
                                    </span>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <span className="text-sm font-bold text-slate-900 dark:text-white">
                                    {pair.matchedAnswers}/
                                    {pair.totalQuestions}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <span
                                    className={`px-2.5 py-1 rounded-lg text-xs font-bold ${simColor.bgLight} ${simColor.text} border ${simColor.border}`}
                                  >
                                    {simColor.label}
                                  </span>
                                </td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                                    <Clock size={12} />
                                    {pair.analyzedAt
                                      ? new Date(
                                          pair.analyzedAt
                                        ).toLocaleDateString()
                                      : "N/A"}
                                  </div>
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
    </div>
  );
};

export default AdminPlagiarismReports;
