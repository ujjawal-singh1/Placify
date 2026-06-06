import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { 
  BookMarked, 
  Plus, 
  Trash2, 
  ExternalLink, 
  Layers, 
  GraduationCap,
  LayoutGrid
} from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AdminSubject() {
  const subjects = useLoaderData();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [semester, setSemester] = useState("");

  const addSubject = async () => {
    if (!name.trim() || !semester.trim()) {
      alert("Please enter both Subject Name and Semester.");
      return;
    }

    await fetch(`${API_BASE_URL}/subject/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, semester }),
    });
    setName("");
    setSemester("");
    navigate(0); // Refresh
  };

  const deleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject? All associated resources may be affected.")) return;
    await fetch(`${API_BASE_URL}/subject/${id}`, { method: "DELETE" });
    navigate(0);
  };

  const goToResources = (id) => {
    navigate(`/admin/resources/${id}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
          <BookMarked size={28} />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Academic Subjects</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Create and organize the curriculum for students.</p>
        </div>
      </div>

      {/* QUICK ADD SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-200 dark:border-slate-700/50 flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 space-y-2 w-full">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Subject Title</label>
          <div className="relative group">
            <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
              placeholder="e.g. Data Structures & Algorithms"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full md:w-48 space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Semester</label>
          <div className="relative group">
            <Layers className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-bold"
              placeholder="e.g. 5th"
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
            />
          </div>
        </div>

        <button 
          onClick={addSubject}
          className="w-full md:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Plus size={18} strokeWidth={3} /> Add Subject
        </button>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Subject Details</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Academic Period</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Resources</th>
              <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-20 text-center text-slate-400 font-medium italic">
                  No subjects registered. Start by adding one above.
                </td>
              </tr>
            ) : (
              subjects.map((s) => (
                <tr key={s.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 flex items-center justify-center">
                        <LayoutGrid size={20} />
                      </div>
                      <span className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                        {s.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs font-bold uppercase tracking-tighter">
                      Semester {s.semester}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-center">
                    <button
                      onClick={() => goToResources(s.id)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-black border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                    >
                      Configure Materials <ExternalLink size={14} />
                    </button>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button
                      onClick={() => deleteSubject(s.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                      title="Delete Subject"
                    >
                      <Trash2 size={20} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <footer className="pt-10 flex justify-center">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400">
          Academic Management Module v1.0
        </p>
      </footer>
    </div>
  );
}