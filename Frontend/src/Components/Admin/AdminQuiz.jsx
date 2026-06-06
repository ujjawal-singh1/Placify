import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  ClipboardList, 
  Clock, 
  Hash, 
  Layers, 
  AlertCircle,
  X,
  CheckCircle2,
  Filter
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminQuiz = () => {
  const [categories, setCategories] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [quizTitle, setQuizTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(5);
  const [duration, setDuration] = useState(10);
  const [message, setMessage] = useState("");

  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  const backendUrl = API_BASE_URL;

  useEffect(() => {
    fetch(`${backendUrl}/quiz/category`)
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(console.error);
    fetchQuizzes();
  }, []);

  const fetchQuizzes = () => {
    fetch(`${backendUrl}/quiz/all`)
      .then((res) => res.json())
      .then((data) => setQuizzes(Array.isArray(data) ? data : []))
      .catch(console.error);
  };

  const handleCreateQuiz = () => {
    if (!selectedCategory || !quizTitle.trim()) {
      alert("Please fill all fields!");
      return;
    }

    fetch(
      `${backendUrl}/quiz/create?category=${selectedCategory}&numQ=${numQuestions}&title=${quizTitle}&duration=${duration}`,
      { method: "POST" }
    )
      .then((res) => res.text())
      .then(() => {
        setMessage("Quiz created successfully 🎉");
        setTimeout(() => setMessage(""), 3000);
        setSelectedCategory("");
        setQuizTitle("");
        setNumQuestions(5);
        setDuration(10);
        fetchQuizzes();
      })
      .catch(console.error);
  };

  const handleDeleteQuiz = () => {
    fetch(`${backendUrl}/quiz/remove/${deleteModal.id}`, { method: "DELETE" })
      .then((res) => res.text())
      .then(() => {
        setDeleteModal({ open: false, id: null });
        fetchQuizzes();
      })
      .catch(console.error);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-6 lg:p-12 transition-colors duration-300">
      
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Quiz Management
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Configure automated assessments and monitor the quiz library.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-sm font-bold">
          <ClipboardList size={18} /> Total: {quizzes.length} Quizzes
        </div>
      </div>

      {/* CREATE QUIZ SECTION */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700/50">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
              <Plus size={24} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Create New Assessment</h2>
          </div>

          {message && (
            <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              <CheckCircle2 size={18} /> {message}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Layers size={14} /> Category
              </label>
              <select
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">-- Choose Category --</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Hash size={14} /> Quiz Title
              </label>
              <input
                type="text"
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm"
                placeholder="e.g. Operating Systems Final"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
              />
            </div>

            {/* Questions */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <ClipboardList size={14} /> No. of Questions
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
              />
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <Clock size={14} /> Duration (Mins)
              </label>
              <input
                type="number"
                min="1"
                className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold text-sm"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handleCreateQuiz}
            className="mt-10 w-full bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            Deploy Assessment
          </button>
        </div>
      </div>

      {/* QUIZ LIBRARY */}
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Active Library</h2>
          
          <div className="relative w-full md:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
              placeholder="Filter by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
          {quizzes.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50">
                <Filter size={40} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-500 font-medium tracking-tight">No quizzes matching your library criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Title</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">Category</th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quizzes
                    .filter((q) => q.title?.toLowerCase().includes(search.toLowerCase()))
                    .map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">{quiz.title}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-900/50 capitalize">
                            {quiz.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <button
                            onClick={() => setDeleteModal({ open: true, id: quiz.id })}
                            className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                            title="Delete Quiz"
                          >
                            <Trash2 size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Delete Quiz?</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">This will permanently remove this assessment. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDeleteQuiz} className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 active:scale-95">Delete</button>
              <button onClick={() => setDeleteModal({ open: false, id: null })} className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuiz;