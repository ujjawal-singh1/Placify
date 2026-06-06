import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { useParams, useNavigate } from "react-router-dom";
import { 
  ArrowLeft, 
  Video, 
  FileText, 
  HardDrive, 
  Search, 
  BookOpen, 
  ExternalLink,
  Ghost
} from "lucide-react";

export default function Resource() {
  const { subjectId } = useParams();
  const navigate = useNavigate();
  const [subject, setSubject] = useState(null);
  const [resources, setResources] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/subject/${subjectId}`)
      .then((res) => res.json())
      .then((data) => setSubject(data));

    fetch(`${API_BASE_URL}/resource/subject/${subjectId}`)
      .then((res) => res.json())
      .then((data) => setResources(data));
  }, [subjectId]);

  const filteredResources = resources.filter(r => 
    r.topicName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* HEADER SECTION */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/subject")}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-indigo-600 hover:text-white transition-all duration-300"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
                  <BookOpen className="text-indigo-500" size={24} />
                  {subject?.name || "Loading..."}
                </h1>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  {resources.length} Topics available for study
                </p>
              </div>
            </div>

            {/* In-page Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Find a topic..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-full md:w-64 transition-all"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* EMPTY STATE */}
        {resources.length === 0 ? (
          <div className="text-center py-24 bg-white dark:bg-slate-800/40 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="inline-flex p-6 bg-indigo-50 dark:bg-indigo-500/10 rounded-full mb-4 text-indigo-500">
              <Ghost size={48} />
            </div>
            <h3 className="text-xl font-bold mb-2">No resources found</h3>
            <p className="text-slate-500 dark:text-slate-400">Our team is currently curating materials for this subject.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-800 rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">#</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Topic Title</th>
                    <th className="px-6 py-5 text-xs font-bold uppercase tracking-wider text-slate-500">Available Learning Materials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filteredResources.map((r, index) => (
                    <tr 
                      key={r.id} 
                      className="group hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
                    >
                      <td className="px-6 py-6 font-mono text-sm text-slate-400">
                        {(index + 1).toString().padStart(2, '0')}
                      </td>
                      <td className="px-6 py-6">
                        <span className="text-base font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {r.topicName}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-wrap gap-3">
                          {r.videoLink && (
                            <ResourceLink 
                              href={r.videoLink} 
                              icon={<Video size={14} />} 
                              label="Watch Video" 
                              color="blue" 
                            />
                          )}
                          {r.pdfLink && (
                            <ResourceLink 
                              href={r.pdfLink} 
                              icon={<FileText size={14} />} 
                              label="Read PDF" 
                              color="rose" 
                            />
                          )}
                          {r.driveLink && (
                            <ResourceLink 
                              href={r.driveLink} 
                              icon={<HardDrive size={14} />} 
                              label="Cloud Drive" 
                              color="emerald" 
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ================= HELPER COMPONENTS ================= */

const ResourceLink = ({ href, icon, label, color }) => {
  const styles = {
    blue: "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-600 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20",
    rose: "bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-600 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20",
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all duration-300 hover:text-white hover:-translate-y-1 hover:shadow-lg ${styles[color]}`}
    >
      {icon}
      {label}
      <ExternalLink size={12} className="opacity-50" />
    </a>
  );
};