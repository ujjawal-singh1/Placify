import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { 
  ClipboardList, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  BarChart3, 
  ChevronRight 
} from "lucide-react";

const MockTest = () => {
  const [categories, setCategories] = useState([]);
  const [quizMap, setQuizMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/quiz/all`)
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;

        const cats = [...new Set(data.map((q) => q.category))];
        const map = {};

        cats.forEach((cat) => {
          map[cat] = data.filter((q) => q.category === cat);
        });

        setCategories(cats);
        setQuizMap(map);
      })
      .catch((err) => console.log(err));
  }, []);

  const openTitlesPage = (category) => {
    navigate(`/titles/${category}`);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] transition-colors duration-300 relative overflow-hidden">
      
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
            <Sparkles size={14} />
            Assessment Portal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tight mb-6">
            Sharpen Your Skills with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Mock Tests.</span>
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed">
            Select a specialized category to start your evaluation. Our tests are designed 
            to simulate real-world interview conditions and technical assessments.
          </p>
        </div>

        {/* CATEGORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((cat, index) => {
            const quizzes = quizMap[cat] || [];
            const quizCount = quizzes.length;

            return (
              <div
                key={cat}
                onClick={() => openTitlesPage(cat)}
                className="group cursor-pointer relative bg-white dark:bg-slate-800/50 backdrop-blur-sm rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                {/* ICON & BADGE */}
                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500">
                    <ClipboardList size={28} />
                  </div>
                  <div className="px-4 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {quizCount} Modules
                  </div>
                </div>

                {/* CONTENT */}
                <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mb-3">
                  {cat}
                </h2>

                <div className="space-y-3 mb-8">
                  {quizzes[0] && (
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                      <Clock size={14} className="text-blue-500" />
                      <span>Latest: <span className="text-slate-700 dark:text-slate-200 font-medium">{quizzes[0].title}</span></span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <BarChart3 size={14} className="text-indigo-500" />
                    <span>Multiple difficulty levels</span>
                  </div>
                </div>

                {/* ACTION FOOTER */}
                <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-4 transition-all">
                  <span>Explore Tests</span>
                  <ArrowRight size={18} />
                </div>

                {/* DECORATIVE CORNER ELEMENT */}
                <div className="absolute top-0 right-0 p-6 opacity-0 group-hover:opacity-10 transition-opacity">
                   <ChevronRight size={80} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {categories.length === 0 && (
          <div className="text-center py-20">
            <div className="animate-pulse text-slate-300 dark:text-slate-700">
               <ClipboardList size={80} className="mx-auto mb-4" />
            </div>
            <p className="text-slate-500">Fetching available test modules...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MockTest;