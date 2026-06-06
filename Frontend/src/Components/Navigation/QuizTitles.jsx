import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Clock, 
  PlayCircle, 
  BookOpen, 
  ChevronRight,
  Inbox,
  CheckCircle2,
  Lock
} from "lucide-react";

const QuizTitles = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [quizzes, setQuizzes] = useState([]);
  const [attemptedMap, setAttemptedMap] = useState({});

  useEffect(() => {
    fetch(`${API_BASE_URL}/quiz/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setQuizzes(data);
        }
      })
      .catch((err) => console.log(err));
  }, [category]);

  // Check which quizzes have been attempted
  useEffect(() => {
    if (!quizzes.length || !token) return;
    quizzes.forEach((quiz) => {
      fetch(`${API_BASE_URL}/quiz-attempt/check/${quiz.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.attempted) {
            setAttemptedMap((prev) => ({ ...prev, [quiz.id]: true }));
          }
        })
        .catch(() => {});
    });
  }, [quizzes]);

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
              title="Go Back"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight flex items-center gap-2 capitalize">
                <BookOpen className="text-indigo-500" size={24} />
                {category} Challenges
              </h1>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Pick your battle
              </p>
            </div>
          </div>

          <div className="hidden sm:block">
            <span className="px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-bold border border-indigo-100 dark:border-indigo-900/50">
              {quizzes.length} Quizzes Found
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* QUIZ GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {quizzes.map((quiz) => {
            const isAttempted = attemptedMap[quiz.id];

            return (
              <div
                key={quiz.id}
                onClick={() => !isAttempted && navigate(`/rules/${quiz.category}/${quiz.id}`)}
                className={`group relative bg-white dark:bg-slate-800 rounded-[2rem] p-8 border shadow-sm transition-all duration-300 overflow-hidden ${
                  isAttempted
                    ? "border-emerald-200 dark:border-emerald-500/20 cursor-not-allowed opacity-70"
                    : "border-slate-200 dark:border-slate-700/50 cursor-pointer hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2"
                }`}
              >
                {/* Decorative Background Icon */}
                <div className={`absolute -right-4 -bottom-4 transition-colors transform ${
                  isAttempted
                    ? "text-emerald-100 dark:text-emerald-900/20"
                    : "text-slate-100 dark:text-slate-700/30 group-hover:text-indigo-500/10 group-hover:scale-110"
                }`}>
                  {isAttempted ? <CheckCircle2 size={140} /> : <PlayCircle size={140} />}
                </div>

                {/* Already Attempted Banner */}
                {isAttempted && (
                  <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={14} />
                    <span className="text-[10px] font-black uppercase tracking-wider">Completed</span>
                  </div>
                )}

                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-6">
                    <div className={`p-3 rounded-2xl transition-all ${
                      isAttempted
                        ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                        : "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white"
                    }`}>
                      {isAttempted ? <Lock size={24} /> : <PlayCircle size={24} />}
                    </div>
                    {!isAttempted && <ChevronRight className="text-slate-300 group-hover:translate-x-1 transition-transform" />}
                  </div>

                  <h2 className={`text-xl font-extrabold mb-4 line-clamp-2 min-h-[3.5rem] transition-colors ${
                    isAttempted
                      ? "text-slate-600 dark:text-slate-400"
                      : "text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }`}>
                    {quiz.title}
                  </h2>

                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-8">
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
                      <Clock size={14} className="text-amber-500" />
                      <span className="font-semibold">{quiz.duration} mins</span>
                    </div>
                  </div>

                  <div className="mt-auto flex items-center justify-between">
                    {isAttempted ? (
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 size={16} />
                        Already Attempted
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                        Attempt Now
                      </span>
                    )}
                    {!isAttempted && (
                      <div className="h-1 w-12 bg-indigo-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-indigo-500 w-0 group-hover:w-full transition-all duration-500" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* EMPTY STATE */}
        {quizzes.length === 0 && (
          <div className="text-center py-32 bg-white dark:bg-slate-800/40 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-6 text-slate-400">
              <Inbox size={48} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">No quizzes found</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
              We couldn't find any active quizzes for the <span className="font-bold text-indigo-500">{category}</span> category. Check back later!
            </p>
            <button 
              onClick={() => navigate(-1)}
              className="mt-8 px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
            >
              Back to Categories
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizTitles;