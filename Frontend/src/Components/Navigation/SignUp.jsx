import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../../config";

const SignUp = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      setError("⚠️ Please fill all fields.");
      return;
    }
    if (password.length < 6) {
      setError("⚠️ Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("⚠️ Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        setError("⚠️ Email already exists or server error.");
        setLoading(false);
        return;
      }

      await res.json();

      navigate("/login", {
        state: { msg: "Account created successfully! Please login." },
      });

    } catch (err) {
      setError("⚠️ Something went wrong. Try again!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-4 relative overflow-hidden">
      
      {/* Dynamic Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        
        {/* 🔙 Navigation Header */}
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => navigate("/")}
            className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
               <FaArrowLeft />
            </div>
            Back to Home
          </button>
          
          <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-200 dark:border-emerald-500/20">
            <ShieldCheck size={12} /> Secure Portal
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-[2.5rem] p-8 md:p-12 border border-white dark:border-slate-700/50">
          
          <div className="text-center mb-10">
            <div className="inline-flex p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30 mb-4">
               <Sparkles size={24} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Join Placify
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Start your journey toward a better career today.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl flex items-center gap-3 text-rose-600 dark:text-rose-400 text-sm font-bold animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <InputField 
                label="Full Name" 
                icon={<FaUser />} 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="John Doe" 
              />
              
              {/* Email */}
              <InputField 
                label="Email" 
                icon={<FaEnvelope />} 
                name="email" 
                type="email"
                value={formData.email} 
                onChange={handleChange} 
                placeholder="example@mail.com" 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Password */}
              <InputField 
                label="Password" 
                icon={<FaLock />} 
                name="password" 
                type="password"
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••" 
              />

              {/* Confirm Password */}
              <InputField 
                label="Confirm Password" 
                icon={<FaLock />} 
                name="confirmPassword" 
                type="password"
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••" 
              />
            </div>

            <button
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : "Create Account"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              Already a member?{" "}
              <Link to="/login" className="text-indigo-600 dark:text-indigo-400 hover:underline">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Component for Inputs --- */
const InputField = ({ label, icon, name, value, onChange, placeholder, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
        {icon}
      </div>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all"
      />
    </div>
  </div>
);

export default SignUp;