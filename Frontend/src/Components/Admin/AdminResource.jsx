import { useLoaderData, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Video, 
  FileText, 
  HardDrive, 
  Link2, 
  BookOpen, 
  AlertCircle,
  ExternalLink 
} from "lucide-react";
import { API_BASE_URL } from "../../config";

export default function AdminResource() {
  const resources = useLoaderData();
  const navigate = useNavigate();
  const { subjectId } = useParams();

  const [topicName, setTopicName] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [pdfLink, setPdfLink] = useState("");
  const [driveLink, setDriveLink] = useState("");
  const [error, setError] = useState("");

  const refresh = () => navigate(0);

  const addResource = async () => {
    setError("");

    if (!topicName.trim()) return setError("Topic Name is required.");
    if (!videoLink && !pdfLink && !driveLink)
      return setError("Enter at least one link (Video / PDF / Drive)");

    try {
      await fetch(`${API_BASE_URL}/resource/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subjectId,
          topicName,
          materialType: "MIXED",
          videoLink: videoLink || null,
          pdfLink: pdfLink || null,
          driveLink: driveLink || null,
        }),
      });

      setTopicName("");
      setVideoLink("");
      setPdfLink("");
      setDriveLink("");
      refresh();
    } catch (err) {
      setError("Failed to add resource. Please try again.");
    }
  };

  const deleteResource = async (id) => {
    if (!window.confirm("Are you sure you want to delete this resource?")) return;
    await fetch(`${API_BASE_URL}/resource/${id}`, { method: "DELETE" });
    refresh();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER AREA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <BookOpen size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Resource Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Add links, videos, and documents to this subject.</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/subjects")}
          className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
        >
          <ArrowLeft size={18} /> Back to Subjects
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ADD RESOURCE FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 border border-slate-200 dark:border-slate-700/50 shadow-sm sticky top-24">
            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" /> New Material
            </h3>

            {error && (
              <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-xs font-bold animate-pulse">
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Topic Name</label>
                <input
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-medium"
                  placeholder="e.g. Introduction to DBMS"
                  value={topicName}
                  onChange={(e) => setTopicName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">YouTube Link</label>
                <div className="relative group">
                  <Video className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-500 transition-colors" size={16} />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    placeholder="https://youtube.com/..."
                    value={videoLink}
                    onChange={(e) => setVideoLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">PDF Document URL</label>
                <div className="relative group">
                  <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={16} />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    placeholder="https://drive.com/file.pdf"
                    value={pdfLink}
                    onChange={(e) => setPdfLink(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Cloud Drive Folder</label>
                <div className="relative group">
                  <HardDrive className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                  <input
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                    placeholder="External drive link"
                    value={driveLink}
                    onChange={(e) => setDriveLink(e.target.value)}
                  />
                </div>
              </div>

              <button
                onClick={addResource}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <Link2 size={18} strokeWidth={3} /> Save Resource
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RESOURCE TABLE */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Topic Title</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Attachments</th>
                  <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-center">Manage</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {resources.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="text-center py-20 text-slate-400 font-medium">
                      <div className="flex flex-col items-center gap-3">
                        <Link2 size={40} className="opacity-20" />
                        No study materials uploaded for this subject yet.
                      </div>
                    </td>
                  </tr>
                ) : (
                  resources.map((r) => (
                    <tr key={r.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-6 py-6">
                        <span className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                          {r.topicName}
                        </span>
                      </td>

                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          {r.videoLink && <ResourceBadge href={r.videoLink} icon={<Video size={12}/>} color="rose" />}
                          {r.pdfLink && <ResourceBadge href={r.pdfLink} icon={<FileText size={12}/>} color="blue" />}
                          {r.driveLink && <ResourceBadge href={r.driveLink} icon={<HardDrive size={12}/>} color="emerald" />}
                        </div>
                      </td>

                      <td className="px-6 py-6 text-center">
                        <button
                          onClick={() => deleteResource(r.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- HELPER SUB-COMPONENTS --- */

const ResourceBadge = ({ href, icon, color }) => {
  const colors = {
    rose: "text-rose-600 bg-rose-50 dark:bg-rose-500/10 border-rose-100 dark:border-rose-500/20 hover:bg-rose-600",
    blue: "text-blue-600 bg-blue-50 dark:bg-blue-500/10 border-blue-100 dark:border-blue-500/20 hover:bg-blue-600",
    emerald: "text-emerald-600 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600"
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`p-2 rounded-lg border transition-all hover:text-white hover:scale-110 ${colors[color]}`}
    >
      {icon}
    </a>
  );
};