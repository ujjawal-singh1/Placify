import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../config";
import { 
  Users as UsersIcon, 
  ShieldCheck, 
  UserMinus, 
  Ban, 
  Unlock, 
  Mail, 
  Fingerprint,
  MoreVertical,
  Search
} from "lucide-react";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const adminEmail = JSON.parse(localStorage.getItem("user"))?.email || "admin@unknown.com";
  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/admin/users`, { headers: authHeaders })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else if (Array.isArray(data.content)) setUsers(data.content);
        else setUsers([]);
        setLoading(false);
      })
      .catch(() => {
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const deleteUser = (user) => {
    if (user.role === "ADMIN") {
      alert("Admin users cannot be deleted.");
      return;
    }
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;

    fetch(`${API_BASE_URL}/api/admin/users/${user.id}?adminEmail=${adminEmail}`, { method: "DELETE", headers: authHeaders })
      .then(() => setUsers((prev) => prev.filter((u) => u.id !== user.id)));
  };

  const changeRole = (id, newRole) => {
    fetch(`${API_BASE_URL}/api/admin/users/${id}/role?role=${newRole}&adminEmail=${adminEmail}`, { method: "PUT", headers: authHeaders })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      });
  };

  const toggleBlock = (id) => {
    fetch(`${API_BASE_URL}/api/admin/users/${id}/block?adminEmail=${adminEmail}`, { method: "PUT", headers: authHeaders })
      .then((res) => res.json())
      .then((updatedUser) => {
        setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
      });
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Synchronizing Directory...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/20">
            <UsersIcon size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">User Registry</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Manage access control and account status for all members.</p>
          </div>
        </div>

        <div className="relative group w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-4 focus:ring-indigo-500/10 text-sm font-medium text-slate-900 dark:text-slate-100"
          />
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Member</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Authorization</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Method</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500">Account Status</th>
                <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-500 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-20 text-center text-slate-400 font-medium italic">
                    No users matching the current criteria.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        {u.profileImage ? (
                          <img
                            src={u.profileImage}
                            alt={u.name}
                            className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 dark:ring-slate-700"
                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                          />
                        ) : null}
                        <div
                          className="w-10 h-10 rounded-xl bg-gradient-to-tr from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-black text-slate-500 dark:text-slate-300"
                          style={{ display: u.profileImage ? 'none' : 'flex' }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 dark:text-white leading-none">{u.name}</p>
                          <p className="text-xs text-slate-500 dark:text-slate-500 mt-1 flex items-center gap-1">
                            <Mail size={12} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      <select
                        value={u.role}
                        disabled={u.role === "ADMIN"}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all outline-none 
                          ${u.role === "ADMIN" 
                            ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 border-indigo-100 dark:border-indigo-500/20" 
                            : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 focus:border-indigo-500"
                          }`}
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>

                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400">
                        <Fingerprint size={14} className="text-slate-300" />
                        {u.provider || "Standard"}
                      </div>
                    </td>

                    <td className="px-6 py-5">
                      {u.role === "ADMIN" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck size={12} /> Protected
                        </span>
                      ) : (
                        <button
                          onClick={() => toggleBlock(u.id)}
                          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all
                            ${u.blocked 
                              ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 border border-rose-100 dark:border-rose-500/20 hover:bg-rose-600 hover:text-white" 
                              : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600 hover:text-white"
                            }`}
                        >
                          {u.blocked ? <Ban size={12} /> : <Unlock size={12} />}
                          {u.blocked ? "Blocked" : "Active"}
                        </button>
                      )}
                    </td>

                    <td className="px-6 py-5 text-right">
                      {u.role === "ADMIN" ? (
                        <div className="p-2 text-slate-300 dark:text-slate-700">
                          <MoreVertical size={18} />
                        </div>
                      ) : (
                        <button
                          onClick={() => deleteUser(u)}
                          className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Delete User"
                        >
                          <UserMinus size={18} />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;