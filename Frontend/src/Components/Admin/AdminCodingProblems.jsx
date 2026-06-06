import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Plus,
  Search,
  Trash2,
  Edit3,
  Save,
  X,
  AlertCircle,
  CheckCircle2,
  Code2,
  Layers,
  Hash,
  FileText,
  Eye,
  EyeOff,
  Zap,
  Flame,
  Trophy,
  ChevronDown,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const backendUrl = API_BASE_URL;

const emptyProblem = {
  title: "",
  description: "",
  difficulty: "Easy",
  category: "",
  constraints: "",
  sampleInput: "",
  sampleOutput: "",
  testCases: [{ input: "", expectedOutput: "", isHidden: false }],
  starterCode: { javascript: "", python: "", cpp: "", java: "" },
};

const diffColors = {
  Easy: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20",
  Medium: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-100 dark:border-amber-500/20",
  Hard: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20",
};

const AdminCodingProblems = () => {
  const [problems, setProblems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ ...emptyProblem });
  const [starterLang, setStarterLang] = useState("javascript");

  // Delete modal
  const [deleteModal, setDeleteModal] = useState({ open: false, id: null });

  useEffect(() => {
    fetchProblems();
    fetchCategories();
  }, []);

  const fetchProblems = () => {
    fetch(`${backendUrl}/api/coding/problems`)
      .then((r) => r.json())
      .then((d) => setProblems(Array.isArray(d) ? d : []))
      .catch(console.error);
  };

  const fetchCategories = () => {
    fetch(`${backendUrl}/api/coding/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(Array.isArray(d) ? d : []))
      .catch(console.error);
  };

  const flash = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  /* ── Open form ── */
  const openCreate = () => {
    setEditingId(null);
    setForm(JSON.parse(JSON.stringify(emptyProblem)));
    setStarterLang("javascript");
    setShowForm(true);
  };

  const openEdit = (p) => {
    setEditingId(p.id);
    setForm({
      title: p.title || "",
      description: p.description || "",
      difficulty: p.difficulty || "Easy",
      category: p.category || "",
      constraints: p.constraints || "",
      sampleInput: p.sampleInput || "",
      sampleOutput: p.sampleOutput || "",
      testCases: p.testCases && p.testCases.length > 0
        ? p.testCases.map((tc) => ({ ...tc }))
        : [{ input: "", expectedOutput: "", isHidden: false }],
      starterCode: p.starterCode
        ? { javascript: "", python: "", cpp: "", java: "", ...p.starterCode }
        : { javascript: "", python: "", cpp: "", java: "" },
    });
    setStarterLang("javascript");
    setShowForm(true);
  };

  /* ── Save ── */
  const handleSave = async () => {
    if (!form.title.trim() || !form.category.trim()) {
      alert("Title and Category are required.");
      return;
    }

    const body = { ...form };
    const url = editingId
      ? `${backendUrl}/api/coding/problems/${editingId}`
      : `${backendUrl}/api/coding/problems`;
    const method = editingId ? "PUT" : "POST";

    try {
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      flash(editingId ? "Problem updated 🎉" : "Problem created 🎉");
      setShowForm(false);
      setEditingId(null);
      fetchProblems();
      fetchCategories();
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Delete ── */
  const handleDelete = async () => {
    try {
      await fetch(`${backendUrl}/api/coding/problems/${deleteModal.id}`, {
        method: "DELETE",
      });
      setDeleteModal({ open: false, id: null });
      fetchProblems();
    } catch (err) {
      console.error(err);
    }
  };

  /* ── Test case helpers ── */
  const addTestCase = () => {
    setForm({
      ...form,
      testCases: [...form.testCases, { input: "", expectedOutput: "", isHidden: false }],
    });
  };

  const removeTestCase = (index) => {
    setForm({
      ...form,
      testCases: form.testCases.filter((_, i) => i !== index),
    });
  };

  const updateTestCase = (index, field, value) => {
    const updated = [...form.testCases];
    updated[index] = { ...updated[index], [field]: value };
    setForm({ ...form, testCases: updated });
  };

  const updateStarterCode = (lang, value) => {
    setForm({
      ...form,
      starterCode: { ...form.starterCode, [lang]: value },
    });
  };

  const inputClass =
    "w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-sm";

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] p-6 lg:p-12 transition-colors duration-300">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Coding Problems
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Create and manage coding challenges with test cases and starter code.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl border border-indigo-100 dark:border-indigo-500/20 text-sm font-bold">
            <Code2 size={18} /> Total: {problems.length} Problems
          </div>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            <Plus size={18} /> Create Problem
          </button>
        </div>
      </div>

      {/* SUCCESS MESSAGE */}
      {message && (
        <div className="max-w-6xl mx-auto mb-8 p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-600 dark:text-emerald-400 text-sm font-bold">
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* ═══════════ CREATE / EDIT FORM ═══════════ */}
      {showForm && (
        <div className="max-w-5xl mx-auto mb-16">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-slate-200 dark:border-slate-700/50">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
                  {editingId ? <Edit3 size={24} /> : <Plus size={24} />}
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  {editingId ? "Edit Problem" : "Create New Problem"}
                </h2>
              </div>
              <button
                onClick={() => { setShowForm(false); setEditingId(null); }}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            {/* Basic Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                  <Hash size={14} /> Title
                </label>
                <input
                  className={inputClass}
                  placeholder="e.g. Two Sum"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <Layers size={14} /> Category
                  </label>
                  <input
                    className={inputClass}
                    placeholder="e.g. Arrays"
                    list="categories-list"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                  />
                  <datalist id="categories-list">
                    {categories.map((c) => (
                      <option key={c} value={c} />
                    ))}
                  </datalist>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                    <Zap size={14} /> Difficulty
                  </label>
                  <select
                    className={inputClass + " font-bold"}
                    value={form.difficulty}
                    onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1 flex items-center gap-2">
                <FileText size={14} /> Description
              </label>
              <textarea
                className={inputClass + " min-h-[160px] resize-y"}
                placeholder="Write the problem description..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            {/* Constraints */}
            <div className="space-y-2 mb-6">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                Constraints
              </label>
              <textarea
                className={inputClass + " min-h-[80px] resize-y font-mono"}
                placeholder="e.g. 1 <= n <= 10^5"
                value={form.constraints}
                onChange={(e) => setForm({ ...form, constraints: e.target.value })}
              />
            </div>

            {/* Sample I/O */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Sample Input
                </label>
                <textarea
                  className={inputClass + " min-h-[80px] resize-y font-mono"}
                  placeholder="1 2 3"
                  value={form.sampleInput}
                  onChange={(e) => setForm({ ...form, sampleInput: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-1">
                  Sample Output
                </label>
                <textarea
                  className={inputClass + " min-h-[80px] resize-y font-mono"}
                  placeholder="6"
                  value={form.sampleOutput}
                  onChange={(e) => setForm({ ...form, sampleOutput: e.target.value })}
                />
              </div>
            </div>

            {/* ── TEST CASES ── */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <Code2 size={14} /> Test Cases ({form.testCases.length})
                </label>
                <button
                  onClick={addTestCase}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-xl text-xs font-bold border border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              </div>

              <div className="space-y-4">
                {form.testCases.map((tc, i) => (
                  <div
                    key={i}
                    className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-700 relative"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                        Test Case {i + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateTestCase(i, "isHidden", !tc.isHidden)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border transition-colors ${
                            tc.isHidden
                              ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700"
                          }`}
                        >
                          {tc.isHidden ? <EyeOff size={12} /> : <Eye size={12} />}
                          {tc.isHidden ? "Hidden" : "Visible"}
                        </button>
                        {form.testCases.length > 1 && (
                          <button
                            onClick={() => removeTestCase(i)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Input</label>
                        <textarea
                          className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-mono outline-none focus:border-indigo-500 transition-colors min-h-[70px] resize-y"
                          value={tc.input}
                          onChange={(e) => updateTestCase(i, "input", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block">Expected Output</label>
                        <textarea
                          className="w-full p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-xl text-sm font-mono outline-none focus:border-indigo-500 transition-colors min-h-[70px] resize-y"
                          value={tc.expectedOutput}
                          onChange={(e) => updateTestCase(i, "expectedOutput", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── STARTER CODE ── */}
            <div className="mb-8">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
                <Code2 size={14} /> Starter Code (Optional)
              </label>

              <div className="flex gap-1 mb-3">
                {["javascript", "python", "cpp", "java"].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setStarterLang(lang)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors capitalize ${
                      starterLang === lang
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700"
                    }`}
                  >
                    {lang === "cpp" ? "C++" : lang}
                  </button>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                <Editor
                  height="200px"
                  theme="vs-dark"
                  language={starterLang}
                  value={form.starterCode[starterLang] || ""}
                  onChange={(v) => updateStarterCode(starterLang, v || "")}
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    scrollBeyondLastLine: false,
                    padding: { top: 12 },
                  }}
                />
              </div>
            </div>

            {/* SAVE */}
            <button
              onClick={handleSave}
              className="w-full bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save size={18} /> {editingId ? "Update Problem" : "Create Problem"}
            </button>
          </div>
        </div>
      )}

      {/* ═══════════ PROBLEMS TABLE ═══════════ */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Problem Library</h2>
          <div className="relative w-full md:w-80 group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors"
              size={18}
            />
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
          {problems.length === 0 ? (
            <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-900/50">
              <Code2 size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
              <p className="text-slate-500 font-medium">
                No coding problems yet. Create your first one!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                      Title
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                      Difficulty
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400">
                      Category
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                      Tests
                    </th>
                    <th className="px-8 py-5 text-xs font-black uppercase tracking-widest text-slate-400 text-center">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {problems
                    .filter((p) =>
                      p.title?.toLowerCase().includes(search.toLowerCase())
                    )
                    .map((p) => (
                      <tr
                        key={p.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group"
                      >
                        <td className="px-8 py-6">
                          <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                            {p.title}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${
                              diffColors[p.difficulty] || diffColors.Easy
                            }`}
                          >
                            {p.difficulty === "Easy" && <Zap size={12} />}
                            {p.difficulty === "Medium" && <Flame size={12} />}
                            {p.difficulty === "Hard" && <Trophy size={12} />}
                            {p.difficulty}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold border border-indigo-100 dark:border-indigo-900/50 capitalize">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-center">
                          <span className="text-sm font-bold text-slate-500">
                            {p.testCases?.length || 0}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => openEdit(p)}
                              className="p-2.5 text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 rounded-xl transition-all"
                              title="Edit"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteModal({ open: true, id: p.id })
                              }
                              className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ═══════════ DELETE MODAL ═══════════ */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-950/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-sm border border-slate-100 dark:border-slate-700 text-center">
            <div className="w-16 h-16 bg-rose-50 dark:bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={32} />
            </div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Delete Problem?
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 leading-relaxed">
              This will permanently remove this coding problem and all its test
              cases. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleDelete}
                className="flex-1 py-4 bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-500/20 active:scale-95"
              >
                Delete
              </button>
              <button
                onClick={() => setDeleteModal({ open: false, id: null })}
                className="flex-1 py-4 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCodingProblems;
