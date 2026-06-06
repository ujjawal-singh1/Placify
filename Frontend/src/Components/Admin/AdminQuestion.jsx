import React, { useEffect, useState, useRef } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  Edit3, 
  Type, 
  Layers, 
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Filter
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const AdminQuestions = () => {
  const backend = API_BASE_URL;

  // STATES (Preserved)
  const [questions, setQuestions] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;
  const [editing, setEditing] = useState(null);
  const [useRich, setUseRich] = useState(false);
  const richRef = useRef(null);
  const [form, setForm] = useState({
    quetionTitle: "",
    option1: "",
    option2: "",
    option3: "",
    option4: "",
    rightAnswer: "",
    difficultyLevel: "Easy",
    category: ""
  });
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });
  const [fadeOutIds, setFadeOutIds] = useState(new Set());

  // Logic Functions (Preserved)
  const fetchAll = () => {
    fetch(`${backend}/question`)
      .then((res) => res.json())
      .then((data) => {
        setQuestions(Array.isArray(data) ? data : []);
        const cats = [...new Set((data || []).map((q) => q.category).filter(Boolean))];
        setAllCategories(cats);
      })
      .catch(console.error);
  };

  useEffect(() => fetchAll(), []);

  const filtered = questions
    .filter((q) => (filterCategory === "All" ? true : q.category === filterCategory))
    .filter((q) =>
      searchText.trim() === ""
        ? true
        : (q.quetionTitle || "").toLowerCase().includes(searchText.toLowerCase())
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const resetForm = () => {
    setForm({ quetionTitle: "", option1: "", option2: "", option3: "", option4: "", rightAnswer: "", difficultyLevel: "Easy", category: "" });
    setEditing(null);
    setUseRich(false);
    if (richRef.current) richRef.current.innerHTML = "";
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const finalForm = { ...form };
    if (useRich && richRef.current) finalForm.quetionTitle = richRef.current.innerHTML;
    const id = editing?.id || editing?._id;
    const url = editing ? `${backend}/question/${id}` : `${backend}/question/add`;
    await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(finalForm)
    });
    resetForm();
    fetchAll();
  };

  const handleEdit = (q) => {
    setEditing(q);
    setForm({
      quetionTitle: q.quetionTitle || "",
      option1: q.option1 || "",
      option2: q.option2 || "",
      option3: q.option3 || "",
      option4: q.option4 || "",
      rightAnswer: q.rightAnswer || "",
      difficultyLevel: q.difficultyLevel || "Easy",
      category: q.category || ""
    });
    const isHTML = /<[a-z][\s\S]*>/i.test(q.quetionTitle);
    setUseRich(isHTML);
    setTimeout(() => { if (isHTML && richRef.current) richRef.current.innerHTML = q.quetionTitle; }, 50);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const startFadeDelete = (id) => {
    const s = new Set(fadeOutIds);
    s.add(id);
    setFadeOutIds(s);
    setTimeout(() => setDeleteModal({ open: true, id }), 250);
  };

  const handleDelete = async () => {
    await fetch(`${backend}/question/remove/${deleteModal.id}`, { method: "DELETE" });
    setDeleteModal({ open: false, id: null });
    fetchAll();
  };

  const toggleSelect = (id) => {
    const s = new Set(selectedIds);
    s.has(id) ? s.delete(id) : s.add(id);
    setSelectedIds(s);
  };

  const toggleSelectAllPage = () => {
    const s = new Set(selectedIds);
    const ids = pageItems.map((q) => q.id || q._id);
    const selectAll = ids.every((id) => s.has(id));
    if (selectAll) ids.forEach((id) => s.delete(id));
    else ids.forEach((id) => s.add(id));
    setSelectedIds(s);
  };

  const exportCSV = () => {
    const headers = ["quetionTitle", "option1", "option2", "option3", "option4", "rightAnswer", "category", "difficultyLevel"];
    const rows = questions.map((q) => headers.map((h) => `"${(q[h] || "").replace(/"/g, '""')}"`).join(","));
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_bank.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0f172a] p-4 lg:p-8 transition-colors duration-300">
      
      {/* ➕ EDITOR SECTION */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="bg-slate-50 dark:bg-slate-900/50 px-8 py-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-xl font-black flex items-center gap-2">
              {editing ? <Edit3 size={20} className="text-indigo-500" /> : <Plus size={20} className="text-indigo-500" />}
              {editing ? "Edit Question" : "Create New Question"}
            </h2>
            <button 
              onClick={() => setUseRich(!useRich)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${useRich ? 'bg-indigo-600 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}
            >
              <Type size={14} /> Rich Editor: {useRich ? "ON" : "OFF"}
            </button>
          </div>

          <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">Question Content</label>
              {useRich ? (
                <div ref={richRef} contentEditable className="min-h-[120px] p-4 border-2 border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 rounded-2xl focus:border-indigo-500 outline-none transition-all" />
              ) : (
                <textarea 
                  required
                  rows="3"
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:border-indigo-500 transition-all font-medium"
                  placeholder="Enter the question text here..."
                  value={form.quetionTitle}
                  onChange={(e) => setForm({ ...form, quetionTitle: e.target.value })}
                />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {["option1", "option2", "option3", "option4"].map((opt, i) => (
                <div key={opt} className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 group-focus-within:text-indigo-500">{i + 1}</span>
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium"
                    placeholder={`Option ${i + 1}`}
                    required={i < 2}
                    value={form[opt]}
                    onChange={(e) => setForm({ ...form, [opt]: e.target.value })}
                  />
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Correct Answer</label>
                <input
                  required
                  className="w-full px-4 py-3 bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/20 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-600"
                  placeholder="Exact string match..."
                  value={form.rightAnswer}
                  onChange={(e) => setForm({ ...form, rightAnswer: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Category</label>
                <input
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
                  placeholder="e.g. Java, DBMS"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Difficulty</label>
                <select
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-bold"
                  value={form.difficultyLevel}
                  onChange={(e) => setForm({ ...form, difficultyLevel: e.target.value })}
                >
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button className="flex-1 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
                {editing ? "Update Record" : "Publish Question"}
              </button>
              {editing && (
                <button type="button" onClick={resetForm} className="px-8 py-4 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 rounded-2xl font-bold text-sm transition-all hover:bg-slate-200">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* 🔍 FILTER & BULK ACTIONS */}
      <div className="max-w-6xl mx-auto mb-8 bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] border border-slate-200 dark:border-slate-700 flex flex-wrap items-center gap-4 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
            placeholder="Search questions library..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={16} className="text-slate-400" />
          <select
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-xl text-xs font-bold outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="All">All Categories</option>
            {allCategories.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700 mx-2 hidden sm:block" />

        <button 
          className="flex items-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-black border border-rose-100 dark:border-rose-500/20 hover:bg-rose-600 hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
          disabled={selectedIds.size === 0}
        >
          <Trash2 size={14} /> Bulk Delete ({selectedIds.size})
        </button>

        <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-700 transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* 📋 LIST VIEW */}
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex items-center gap-2 px-6 py-2">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
            onChange={toggleSelectAllPage} 
          />
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Select Page</span>
        </div>

        {pageItems.map((q) => {
          const id = q.id || q._id;
          const fading = fadeOutIds.has(id);
          const levelColors = {
            Easy: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border-emerald-100 dark:border-emerald-500/20",
            Medium: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 border-amber-100 dark:border-amber-500/20",
            Hard: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border-rose-100 dark:border-rose-500/20"
          };

          return (
            <div
              key={id}
              className={`group bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-indigo-500/30 ${fading ? "opacity-0 scale-95" : "opacity-100"}`}
            >
              <div className="flex justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg border ${levelColors[q.difficultyLevel]}`}>
                      {q.difficultyLevel}
                    </span>
                    <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-500">
                      {q.category}
                    </span>
                  </div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100 leading-snug group-hover:text-indigo-600 transition-colors" dangerouslySetInnerHTML={{ __html: q.quetionTitle }} />
                </div>

                <div className="flex flex-col items-end gap-4">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(q)} className="p-2 text-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <Edit3 size={18} />
                    </button>
                    <button onClick={() => startFadeDelete(id)} className="p-2 text-rose-600 bg-rose-50 dark:bg-rose-500/10 rounded-xl hover:bg-rose-600 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.has(id)}
                    onChange={() => toggleSelect(id)}
                    className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🔢 PAGINATION */}
      <div className="max-w-6xl mx-auto mt-12 flex items-center justify-between">
        <p className="text-sm font-bold text-slate-400">Page {page} of {totalPages}</p>
        <div className="flex gap-2">
          <button
            disabled={page === 1}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft size={20} />
          </button>
          <button
            disabled={page === totalPages}
            className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl disabled:opacity-30 hover:bg-slate-50 transition-all"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* 🗑️ DELETE MODAL */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
               <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black mb-2">Confirm Delete</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">This action is permanent and will remove the question from the database.</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-3.5 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 active:scale-95">Delete</button>
              <button onClick={() => setDeleteModal({ open: false, id: null })} className="flex-1 py-3.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;