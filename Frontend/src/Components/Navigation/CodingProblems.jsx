import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  Search,
  Filter,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Circle,
  Flame,
  Zap,
  Trophy,
  Layers,
  BarChart3,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const difficultyConfig = {
  Easy: {
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
    icon: <Zap size={12} />,
  },
  Medium: {
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-500/10",
    border: "border-amber-100 dark:border-amber-500/20",
    icon: <Flame size={12} />,
  },
  Hard: {
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-50 dark:bg-rose-500/10",
    border: "border-rose-100 dark:border-rose-500/20",
    icon: <Trophy size={12} />,
  },
};

const CodingProblems = () => {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [solvedSet, setSolvedSet] = useState(new Set());
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const navigate = useNavigate();

  // Defensive parsing of localStorage
  const user = React.useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    // Concurrently grab fundamental data
    Promise.all([
      fetch(`${API_BASE_URL}/api/coding/problems`).then((r) => r.json()),
      fetch(`${API_BASE_URL}/api/coding/categories`).then((r) => r.json()),
    ])
      .then(([problemsData, categoriesData]) => {
        if (!isMounted) return;
        setProblems(Array.isArray(problemsData) ? problemsData : []);
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      })
      .catch(console.error);

    if (user.email) {
      fetch(`${API_BASE_URL}/api/coding/submissions/user/${user.email}`)
        .then((r) => r.json())
        .then((data) => {
          if (!isMounted) return;
          if (Array.isArray(data)) {
            const solved = new Set(
              data.filter((s) => s.status === "ACCEPTED").map((s) => s.problemId)
            );
            setSolvedSet(solved);
          }
        })
        .catch(console.error);
    }

    return () => {
      isMounted = false;
    };
  }, [user.email]);

  const filtered = problems.filter((p) => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    const matchCat = categoryFilter === "All" || p.category === categoryFilter;
    return matchSearch && matchDiff && matchCat;
  });

  const solvedCount = problems.filter((p) => solvedSet.has(p.id)).length;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 relative overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-0 right-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-indigo-500/5 blur-[100px] md:blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-blue-500/5 blur-[90px] md:blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 md:py-12 relative z-10">
        {/* HERO HEADER */}
        <div className="max-w-3xl mb-8 md:mb-12 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Coding Challenges
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-4 md:mb-6">
            Master the{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">
              Code.
            </span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Solve curated coding challenges across multiple categories and difficulty levels.
            Sharpen your problem-solving skills for technical interviews.
          </p>
        </div>

        {/* STATS BAR */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 md:mb-10">
          {[
            {
              label: "Total Problems",
              value: problems.length,
              icon: <Code2 size={20} />,
              color: "from-indigo-600 to-blue-600",
            },
            {
              label: "Solved",
              value: `${solvedCount} / ${problems.length}`,
              icon: <CheckCircle2 size={20} />,
              color: "from-emerald-600 to-teal-600",
            },
            {
              label: "Categories",
              value: categories.length,
              icon: <Layers size={20} />,
              color: "from-violet-600 to-purple-600",
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-5 border border-slate-200 dark:border-slate-700/50 flex items-center gap-4 shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-md flex-shrink-0`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{stat.value}</p>
                <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FILTER BAR */}
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 border border-slate-200 dark:border-slate-700/50 mb-6 md:mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium text-slate-800 dark:text-slate-100"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-3 w-full sm:w-auto">
            <select
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold min-w-[130px] text-slate-700 dark:text-slate-300"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="All">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              className="flex-1 sm:flex-none px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold min-w-[130px] text-slate-700 dark:text-slate-300"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* COMPACT/RESPONSIVE CONTAINERS */}
        {filtered.length === 0 ? (
          <div className="bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700/50 text-center py-16">
            <Filter size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3" />
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">No problems match your filters.</p>
          </div>
        ) : (
          <>
            {/* 🖥️ DESKTOP VIEWPORT: Structured Grid Table */}
            <div className="hidden md:block bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700/50 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 w-14">#</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 w-24">Status</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Title</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Difficulty</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  <AnimatePresence>
                    {filtered.map((problem, index) => {
                      const isSolved = solvedSet.has(problem.id);
                      const dc = difficultyConfig[problem.difficulty] || difficultyConfig.Easy;

                      return (
                        <motion.tr
                          key={problem.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => navigate(`/coding/${problem.id}`)}
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-5 text-sm font-bold text-slate-400">{index + 1}</td>
                          <td className="px-6 py-5">
                            {isSolved ? (
                              <CheckCircle2 size={19} className="text-emerald-500" />
                            ) : (
                              <Circle size={19} className="text-slate-300 dark:text-slate-600" />
                            )}
                          </td>
                          <td className="px-6 py-5">
                            <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {problem.title}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${dc.bg} ${dc.color} ${dc.border} border text-xs font-bold`}>
                              {dc.icon} {problem.difficulty}
                            </span>
                          </td>
                          <td className="px-6 py-5">
                            <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-900/30">
                              {problem.category}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-1 text-indigo-600 dark:text-indigo-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                              Solve <ChevronRight size={16} />
                            </div>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>

            {/* 📱 MOBILE VIEWPORT: High-Performance Card Stack */}
            <div className="grid grid-cols-1 gap-3 md:hidden">
              <AnimatePresence>
                {filtered.map((problem, index) => {
                  const isSolved = solvedSet.has(problem.id);
                  const dc = difficultyConfig[problem.difficulty] || difficultyConfig.Easy;

                  return (
                    <motion.div
                      key={problem.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      onClick={() => navigate(`/coding/${problem.id}`)}
                      className="bg-white dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/50 flex flex-col gap-3 active:scale-[0.99] transition-transform"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                          {isSolved ? (
                            <CheckCircle2 size={18} className="text-emerald-500 flex-shrink-0" />
                          ) : (
                            <Circle size={18} className="text-slate-300 dark:text-slate-600 flex-shrink-0" />
                          )}
                          <span className="font-bold text-slate-800 dark:text-slate-100 text-sm line-clamp-1">
                            {problem.title}
                          </span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">#{index + 1}</span>
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md ${dc.bg} ${dc.color} ${dc.border} border text-[11px] font-bold`}>
                            {problem.difficulty}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold border border-indigo-100 dark:border-indigo-900/30">
                            {problem.category}
                          </span>
                        </div>
                        <div className="text-indigo-600 dark:text-indigo-400 flex items-center gap-0.5 text-xs font-bold">
                          Solve <ChevronRight size={14} />
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* BOTTOM STATS METRICS */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs md:text-sm text-slate-400 px-1">
          <span>
            Showing {filtered.length} of {problems.length} problems
          </span>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <BarChart3 size={14} /> {solvedCount} solved
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodingProblems;