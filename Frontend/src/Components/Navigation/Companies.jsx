import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { Search, ExternalLink, Building2, Globe, ArrowUpRight } from "lucide-react";

const Companies = () => {
  const [companyList, setCompanyList] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/company/all`)
      .then((res) => res.json())
      .then((data) => setCompanyList(data))
      .catch((err) => console.error("Error fetching companies:", err));
  }, []);

  const filteredCompanies = companyList.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* Background Decorative Element */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-12 lg:px-12 relative z-10">
        
        {/* HEADER & SEARCH SECTION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="max-w-xl">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
              Explore <span className="text-blue-600">Opportunities</span>
            </h1>
            <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Connect with top-tier hiring companies and jumpstart your career journey.
            </p>
          </div>

          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="text"
              placeholder="Search companies by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 backdrop-blur-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        {/* GRID SECTION */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="group bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-[2rem] p-6 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Brand Identity Header */}
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                    {company.name.charAt(0)}
                  </div>
                  <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-700 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Building2 size={18} />
                  </div>
                </div>

                {/* Company Name & Tag */}
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h3>

                {/* Overview with Line Clamp for neatness */}
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-3 mb-6">
                  {company.overview || "Connecting talent with opportunity through innovation and excellence in the tech industry."}
                </p>
              </div>

              {/* Action Area */}
              <div className="pt-4 border-t border-slate-50 dark:border-slate-700/50">
                <a
                  href={company.career}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 dark:bg-slate-700 hover:bg-blue-600 dark:hover:bg-blue-600 text-white font-bold rounded-xl text-sm transition-all shadow-md active:scale-95 group/btn"
                >
                  Explore Careers
                  <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* EMPTY STATE */}
        {filteredCompanies.length === 0 && (
          <div className="mt-20 flex flex-col items-center justify-center text-center py-16 px-4 bg-white dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
            <div className="p-6 bg-slate-100 dark:bg-slate-700 rounded-full mb-6">
              <Globe size={48} className="text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white">No matches found</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              We couldn't find any companies matching "<span className="text-blue-600 font-bold">{search}</span>". Try a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Companies;