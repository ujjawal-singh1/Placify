import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../../config";
import { 
  Camera, 
  Mail, 
  User as UserIcon, 
  LogOut, 
  Edit3, 
  Save, 
  X, 
  Trophy, 
  Target, 
  CheckCircle 
} from "lucide-react";

const Profile = () => {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");
  const parsedUser = storedUser ? JSON.parse(storedUser) : {};
  const token = localStorage.getItem("token");

  const [user, setUser] = useState({
    name: parsedUser.name || "Student",
    email: parsedUser.email || "student@example.com",
    avatar: parsedUser.profileImage || "https://i.pravatar.cc/150?img=4",
    totalExams: 12,
    completed: 8,
    averageScore: "78%",
  });

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSave = async () => {
    // Read the latest user from localStorage to avoid stale data
    const latestUser = JSON.parse(localStorage.getItem("user") || "{}");

    // Update name/email in localStorage
    const updatedStorage = {
      ...latestUser,
      name: formData.name,
      email: formData.email,
    };
    localStorage.setItem("user", JSON.stringify(updatedStorage));

    if (imageFile) {
      const form = new FormData();
      form.append("image", imageFile);

      try {
        const res = await axios.post(
          `${API_BASE_URL}/api/admin/users/profile-image`,
          form,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const newImageUrl = res.data.profileImage;
        // Update both state and localStorage with the new image
        setUser((prev) => ({ ...prev, ...formData, avatar: newImageUrl }));
        const freshUser = JSON.parse(localStorage.getItem("user") || "{}");
        localStorage.setItem(
          "user",
          JSON.stringify({ ...freshUser, profileImage: newImageUrl })
        );
        setImageFile(null);
      } catch (err) {
        console.error("Image upload failed", err);
      }
    } else {
      // No image change — just update name/email in state
      setUser((prev) => ({ ...prev, ...formData }));
    }
    setEditMode(false);
  };

  const handleCancel = () => {
    setFormData({ ...user });
    setEditMode(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-6 py-12 transition-colors duration-300">
      <div className="max-w-4xl mx-auto">
        
        {/* PAGE TITLE */}
        <div className="flex items-center gap-4 mb-10">
            <div className="h-12 w-2 bg-indigo-600 rounded-full"></div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Account Profile</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: IDENTITY CARD */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 shadow-xl border border-slate-100 dark:border-slate-700/50 text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-10"></div>
              
              {/* Profile Image with Upload Trigger */}
              <div className="relative inline-block mb-6 z-10">
                <div className="w-32 h-32 rounded-3xl overflow-hidden ring-4 ring-white dark:ring-slate-700 shadow-2xl transition-transform hover:scale-105">
                  <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                </div>
                {editMode && (
                  <label className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2 rounded-xl cursor-pointer shadow-lg hover:bg-indigo-700 transition-colors">
                    <Camera size={18} />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Name & Email */}
              <div className="space-y-2 mb-8">
                {editMode ? (
                  <div className="space-y-3">
                    <div className="relative">
                        <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="text" name="name" value={formData.name} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Full Name"
                        />
                    </div>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                        <input
                            type="email" name="email" value={formData.email} onChange={handleChange}
                            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                            placeholder="Email Address"
                        />
                    </div>
                  </div>
                ) : (
                  <>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{user.name}</h2>
                    <p className="text-slate-500 font-medium text-sm flex items-center justify-center gap-2">
                        <Mail size={14} /> {user.email}
                    </p>
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                {editMode ? (
                  <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-indigo-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
                      <Save size={16} /> Save
                    </button>
                    <button onClick={handleCancel} className="flex-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-slate-200 transition-all">
                      <X size={16} /> Cancel
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setEditMode(true)} className="w-full bg-slate-900 dark:bg-slate-700 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:shadow-xl transition-all">
                    <Edit3 size={16} /> Edit Profile
                  </button>
                )}
                
                <button onClick={handleLogout} className="w-full border-2 border-rose-100 dark:border-rose-900/30 text-rose-600 dark:text-rose-400 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-rose-50 dark:hover:bg-rose-900/10 transition-all">
                  <LogOut size={16} /> Logout
                </button>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: STATS & OVERVIEW */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* PERFORMANCE GRID */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <ProfileStat icon={<Trophy className="text-amber-500" />} label="Total Exams" value={user.totalExams} />
              <ProfileStat icon={<CheckCircle className="text-emerald-500" />} label="Completed" value={user.completed} />
              <ProfileStat icon={<Target className="text-blue-500" />} label="Avg. Score" value={user.averageScore} />
            </div>

            {/* ACTIVITY PLACEHOLDER (Attractive UI filler) */}
            <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                  <Edit3 size={18} className="text-indigo-500" /> Recent Progress
              </h3>
              <div className="space-y-6">
                 <ProgressItem label="Mock Tests" percent={65} color="bg-indigo-500" />
                 <ProgressItem label="Subject Resources" percent={40} color="bg-emerald-500" />
                 <ProgressItem label="Company Profiles" percent={85} color="bg-amber-500" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

/* --- MINI COMPONENTS --- */

const ProfileStat = ({ icon, label, value }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm transition-transform hover:-translate-y-1">
    <div className="bg-slate-50 dark:bg-slate-900 w-12 h-12 rounded-2xl flex items-center justify-center mb-4">
      {icon}
    </div>
    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-black text-slate-900 dark:text-white">{value}</p>
  </div>
);

const ProgressItem = ({ label, percent, color }) => (
    <div>
        <div className="flex justify-between text-sm font-bold mb-2">
            <span className="text-slate-600 dark:text-slate-300">{label}</span>
            <span className="text-indigo-600">{percent}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className={`h-full ${color} rounded-full`} style={{ width: `${percent}%` }}></div>
        </div>
    </div>
);

export default Profile;