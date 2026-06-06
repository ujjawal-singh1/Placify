import { useLoaderData, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Building2, Plus, Trash2, ExternalLink, Briefcase, Info } from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AdminCompany() {
  const companies = useLoaderData();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [overview, setOverview] = useState("");
  const [career, setCareer] = useState("");

  const refresh = () => navigate(0);

  const addCompany = async () => {
    if (!name.trim() || !overview.trim() || !career.trim()) {
      alert("All fields are required!");
      return;
    }

    await fetch(`${API_BASE_URL}/company/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, overview, career }),
    });

    setName("");
    setOverview("");
    setCareer("");
    refresh();
  };

  const deleteCompany = async (id) => {
    if (!window.confirm("Are you sure to delete this company?")) return;

    await fetch(`${API_BASE_URL}/company/${id}`, {
      method: "DELETE",
    });

    refresh();
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div className="p-3 bg-indigo-600 rounded-2xl text-white">
          <Building2 size={24} />
        </div>
        <div>
          {/* Main Title: Black on White, White on Dark */}
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Manage Companies</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Add or remove recruiting partners from the directory.</p>
        </div>
      </div>

      {/* ADD COMPANY FORM CARD */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700 shadow-sm transition-colors duration-300">
        <h3 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-900 dark:text-white">
            <Plus size={18} className="text-indigo-600" /> Register New Company
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Company Name</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900 dark:text-slate-100"
                placeholder="e.g. Google"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Brief Overview</label>
            <div className="relative">
              <Info className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900 dark:text-slate-100"
                placeholder="Tech giant..."
                value={overview}
                onChange={(e) => setOverview(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">Career URL</label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm text-slate-900 dark:text-slate-100"
                placeholder="https://google.com/careers"
                value={career}
                onChange={(e) => setCareer(e.target.value)}
              />
            </div>
          </div>

        </div>

        <button
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3.5 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
          onClick={addCompany}
        >
          <Plus size={18} strokeWidth={3} /> Add Company
        </button>
      </div>

      {/* DATA TABLE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors duration-300">
        {companies.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Company Identity</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Description</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Resource</th>
                  <th className="px-6 py-5 text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {companies.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 flex items-center justify-center font-bold">
                          {c.name.charAt(0)}
                        </div>
                        <span className="font-bold text-slate-900 dark:text-slate-100 transition-colors">{c.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xs">{c.overview}</p>
                    </td>
                    <td className="px-6 py-5">
                      <a
                        href={c.career}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300"
                      >
                        Career Portal <ExternalLink size={14} />
                      </a>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button
                        className="p-2.5 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        onClick={() => deleteCompany(c.id)}
                        title="Delete Company"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-20">
             <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-full inline-block mb-4 transition-colors">
                <Building2 size={40} className="text-slate-300 dark:text-slate-600" />
             </div>
             <p className="text-slate-500 dark:text-slate-400 font-medium">The company directory is currently empty.</p>
          </div>
        )}
      </div>
    </div>
  );
}