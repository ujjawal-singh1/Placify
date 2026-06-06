import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaArrowLeft } from "react-icons/fa";
import { Loader2, KeyRound, ShieldCheck } from "lucide-react";
import { API_BASE_URL } from "../../config";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        setErrorMsg("❌ Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await res.json();

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("user", JSON.stringify(data));

      if (data.role === "ADMIN") navigate("/admin");
      else navigate("/dashboard");
    } catch {
      setErrorMsg("⚠️ Something went wrong!");
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-4 relative overflow-hidden">
      
      {/* Abstract Background Accents */}
      <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-500/10 blur-[100px] rounded-full" />
      <div className="absolute bottom-[-5%] left-[-5%] w-[30%] h-[30%] bg-blue-500/10 blur-[100px] rounded-full" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Navigation Link */}
        <button
          onClick={() => navigate("/")}
          className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-indigo-600 transition-colors mb-8"
        >
          <div className="p-2 rounded-lg bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 group-hover:bg-indigo-600 group-hover:text-white transition-all">
            <FaArrowLeft />
          </div>
          Back to Home
        </button>

        {/* Login Card */}
        <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] rounded-[2.5rem] p-8 md:p-10 border border-white dark:border-slate-700/50">
          
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-500/30 mb-6">
              <KeyRound size={28} />
            </div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
              Ready to continue your preparation?
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-100 dark:border-rose-500/20 rounded-2xl text-rose-600 dark:text-rose-400 text-sm font-bold flex items-center gap-2">
              <ShieldCheck size={16} /> {errorMsg}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative group">
                <FaEnvelope className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <Link to="/forgot-password" size={14} className="text-xs font-bold text-purple-600 hover:text-purple-500 transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative group">
                <FaLock className="absolute top-1/2 left-4 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-600 transition-colors" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none transition-all font-medium"
                />
              </div>
            </div>

            <button
              disabled={loading}
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-purple-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Authenticating...
                </>
              ) : "Sign In"}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-100 dark:border-slate-700 text-center">
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">
              New to the platform?{" "}
              <Link to="/signup" className="text-purple-600 dark:text-purple-400 hover:underline">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;