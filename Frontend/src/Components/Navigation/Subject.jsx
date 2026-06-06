import { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { Link } from "react-router-dom";
import { Book, ChevronRight, GraduationCap, Layers, Lightbulb, Search } from "lucide-react";

export default function Subject() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/subject/all`)
      .then((res) => res.json())
      .then((data) => setSubjects(data))
      .catch((err) => console.error(err));
  }, []);

  
  // Professional gradient pairs for a more modern look
  const gradients = [
    "from-blue-500 to-cyan-500",
    "from-emerald-500 to-teal-600",
    "from-violet-500 to-purple-600",
    "from-rose-500 to-pink-600",
    "from-amber-500 to-orange-600",
  ];

  // Helper to assign a random-ish icon based on index
  const getIcon = (index) => {
    const icons = [<Book />, <GraduationCap />, <Layers />, <Lightbulb />];
    return icons[index % icons.length];
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-6 py-12 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Background Blob */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-indigo-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full -z-10" />

      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Explore Subjects
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Select a category to dive into curated study resources.
            </p>
          </div>

          {/* Optional Search Bar (UI Only) */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search subjects..." 
              className="pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-full md:w-64 transition-all"
            />
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {subjects.map((subject, index) => (
            <Link
              key={subject.id}
              to={`/resources/${subject.id}`}
              className="group relative"
            >
              {/* Card Container */}
              <div className="relative h-48 w-full bg-white dark:bg-slate-800 rounded-[2rem] p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 overflow-hidden transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-indigo-500/10">
                
                {/* Background Accent Gradient */}
                <div className={`absolute top-0 left-0 w-2 h-full bg-gradient-to-b ${gradients[index % gradients.length]}`} />

                <div className="flex flex-col h-full justify-between">
                  <div className="flex justify-between items-start">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${gradients[index % gradients.length]} text-white shadow-lg transform transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                      {getIcon(index)}
                    </div>
                    <ChevronRight className="text-slate-300 dark:text-slate-600 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {subject.name}
                    </h3>
                    <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {10 + index}+ Resources
                    </p>
                  </div>
                </div>

                {/* Decorative Pattern in Card Background */}
                <div className="absolute -bottom-4 -right-4 opacity-[0.03] dark:opacity-[0.05] group-hover:opacity-10 transition-opacity">
                   {getIcon(index)}
                   <div className="scale-[4] transform-gpu">{getIcon(index)}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State (If no subjects found) */}
        {subjects.length === 0 && (
          <div className="text-center py-20 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-4">
               <Layers size={40} className="text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200">No subjects loaded</h3>
            <p className="text-slate-500">Checking the archives for you...</p>
          </div>
        )}
      </div>
    </div>
  );
}