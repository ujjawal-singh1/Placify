import React, { useState, useRef, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import {
  FaRocket,
  FaUsers,
  FaChartLine,
  FaLightbulb,
  FaLaptopCode,
  FaGlobe,
  FaAward,
  FaHandsHelping,
  FaLinkedin,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Mail, MessageSquare, User, Send, CheckCircle, AlertCircle } from "lucide-react";

const About = () => {
  /* ================= FEEDBACK STATE ================= */
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  /* ================= DATA ================= */
  const stats = [
    { value: "10,000+", label: "Active Learners", color: "from-blue-600 to-indigo-600" },
    { value: "500+", label: "Curated Resources", color: "from-indigo-600 to-violet-600" },
    { value: "98%", label: "Success Rate", color: "from-violet-600 to-purple-600" },
    { value: "24/7", label: "AI Assistance", color: "from-purple-600 to-pink-600" },
  ];

  const features = [
    { icon: <FaRocket />, title: "Innovative Learning", desc: "AI-powered placement simulation." },
    { icon: <FaUsers />, title: "Community Focused", desc: "Collaborative growth with peers." },
    { icon: <FaChartLine />, title: "Data Driven", desc: "Track progress with analytics." },
    { icon: <FaLightbulb />, title: "Industry Trends", desc: "Always stay ahead of the curve." },
    { icon: <FaLaptopCode />, title: "Coding Sandbox", desc: "In-browser IDE and mock tests." },
    { icon: <FaGlobe />, title: "Universal Access", desc: "Learning without boundaries." },
    { icon: <FaAward />, title: "Company Specific", desc: "Prepare for Top Tech giants." },
    { icon: <FaHandsHelping />, title: "Expert Support", desc: "Guidance when you need it." },
  ];

  /* ================= TEAM ================= */
  const mentor = {
    name: "Mr. Tapas Pal",
    designation: "Project Mentor, Department of IT",
    img: "/TapasSir.jpg",
    linkedin: "https://www.linkedin.com/in/tapas-pal-35476521a/",
  };

  const team = [
    { name: "Rohit Soni", designation: "Final Year B.Tech (IT)", img: "/rohit.jpg", linkedin: "https://www.linkedin.com/in/rohit-soni3084/" },
    { name: "Shubham Sharma", designation: "Final Year B.Tech (IT)", img: "/shubham.jpg", linkedin: "https://www.linkedin.com/in/shubham-sharma-680767245/" },
    { name: "Ujjawal Kumar", designation: "Final Year B.Tech (IT)", img: "/Ujjawal.jpg", linkedin: "https://www.linkedin.com/in/ujjawal-kumar-singh" },
    { name: "Mana Panda", designation: "Final Year B.Tech (IT)", img: "/Mana.jpg", linkedin: "https://www.linkedin.com/in/manapanda/" }
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
  };

  /* ================= HANDLERS ================= */
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const submitFeedback = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!formData.name || !formData.email || !formData.message) {
      setError("Please fill in all fields."); return;
    }
    try {
      setLoading(true);
      await fetch(`${API_BASE_URL}/feedback/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      setSuccess("Your feedback has been received. Thank you!");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative overflow-hidden">
      
      {/* BACKGROUND DECORATION */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-500/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        
        {/* ================= HERO ================= */}
        <motion.div 
          className="text-center mb-24 max-w-4xl mx-auto"
          initial="hidden" animate="visible" variants={fadeUp}
        >
          <div className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
            Our Story
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-500">
            Empowering the Next <br className="hidden md:block"/> Generation of Tech.
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Placify is more than a tool; it’s a mission to bridge the gap between academic learning and industry expectations.
          </p>
        </motion.div>

        {/* ================= STATS ================= */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((s, i) => (
            <motion.div
              key={i} variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="bg-white dark:bg-slate-800 rounded-[2rem] p-8 text-center border border-slate-100 dark:border-slate-700/50 shadow-sm"
            >
              <h2 className={`text-4xl font-black mb-2 bg-gradient-to-r ${s.color} bg-clip-text text-transparent`}>
                {s.value}
              </h2>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">{s.label}</p>
            </motion.div>
          ))}
        </section>

        {/* ================= FEATURES GRID ================= */}
        <section className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black mb-4">Why Placify Stands Out</h2>
            <div className="w-16 h-1 bg-indigo-500 mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((f, i) => (
              <motion.div
                key={i} whileHover={{ y: -10 }}
                className="group bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-extrabold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  {f.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= THE TEAM ================= */}
        <section className="mb-32">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black mb-4 tracking-tight">The Minds Behind Placify</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Department of IT • Asansol Engineering College
            </p>
          </div>

          {/* Mentor Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="max-w-2xl mx-auto mb-20 relative bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 border border-indigo-100 dark:border-indigo-900/50 shadow-2xl flex flex-col md:flex-row items-center gap-10 text-center md:text-left"
          >
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <FaAward size={100} />
            </div>
            <img
              src={mentor.img} alt={mentor.name}
              className="w-40 h-40 rounded-3xl object-cover border-4 border-indigo-600 shadow-xl"
              onError={(e) => (e.target.src = "/avatar.png")}
            />
            <div>
              <span className="text-xs font-black uppercase text-indigo-500 tracking-widest mb-2 block">Project Mentor</span>
              <h4 className="text-3xl font-black mb-2">{mentor.name}</h4>
              <p className="text-slate-500 dark:text-slate-400 mb-6 font-medium leading-relaxed">{mentor.designation}</p>
              <a href={mentor.linkedin} target="_blank" className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors">
                <FaLinkedin size={18} /> Profile
              </a>
            </div>
          </motion.div>

          {/* Student Team Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((t, i) => (
              <motion.div
                key={i} whileHover={{ y: -5 }}
                className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700/50 shadow-sm text-center group"
              >
                <div className="relative inline-block mb-6">
                   <img
                    src={t.img} alt={t.name}
                    className="w-28 h-28 rounded-[2rem] object-cover mx-auto grayscale group-hover:grayscale-0 transition-all duration-500"
                    onError={(e) => (e.target.src = "/avatar.png")}
                  />
                  <div className="absolute -bottom-2 -right-2 p-2 bg-blue-600 text-white rounded-xl shadow-lg border-4 border-white dark:border-slate-800">
                    <FaLinkedin size={12} />
                  </div>
                </div>
                <h4 className="font-black text-slate-800 dark:text-white mb-1 tracking-tight">{t.name}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-6">{t.designation}</p>
                <a href={t.linkedin} target="_blank" className="text-xs font-bold text-indigo-500 hover:text-indigo-400 transition-colors uppercase tracking-widest">Connect →</a>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= FEEDBACK FORM ================= */}
        <section className="max-w-4xl mx-auto">
          <div className="bg-indigo-600 dark:bg-indigo-900/40 rounded-[3rem] p-8 md:p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-[-10%] left-[-5%] w-64 h-64 bg-white/5 blur-3xl rounded-full" />
            
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-black text-white mb-6">Let’s Make it Better.</h2>
                <p className="text-indigo-100/70 text-lg leading-relaxed mb-8">
                  Your feedback shapes the future of Placify. If you have suggestions or found a bug, we're all ears.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 text-indigo-100/90 text-sm font-bold">
                     <Mail size={18} /> feedback@placify.edu
                   </div>
                   <div className="flex items-center gap-4 text-indigo-100/90 text-sm font-bold">
                     <MessageSquare size={18} /> Active Response Team
                   </div>
                </div>
              </div>

              <form onSubmit={submitFeedback} className="space-y-4">
                <div className="relative">
                   <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input
                    name="name" value={formData.name} onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 dark:bg-slate-900 border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-white/20 transition-all shadow-xl"
                  />
                </div>
                <div className="relative">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                   <input
                    name="email" type="email" value={formData.email} onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/90 dark:bg-slate-900 border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-white/20 transition-all shadow-xl"
                  />
                </div>
                <textarea
                  name="message" value={formData.message} onChange={handleChange}
                  rows="3" placeholder="Tell us what's on your mind..."
                  className="w-full p-6 rounded-2xl bg-white/90 dark:bg-slate-900 border-none outline-none text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-4 focus:ring-white/20 transition-all shadow-xl resize-none"
                />

                {error && <div className="flex items-center gap-2 text-rose-200 text-xs font-bold"><AlertCircle size={14}/> {error}</div>}
                {success && <div className="flex items-center gap-2 text-emerald-200 text-xs font-bold"><CheckCircle size={14}/> {success}</div>}

                <button
                  disabled={loading}
                  className="w-full py-5 bg-slate-950 dark:bg-white dark:text-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-900 transition-all active:scale-95 flex items-center justify-center gap-3"
                >
                  {loading ? "Transmitting..." : <>Send Message <Send size={16} /></>}
                </button>
              </form>
            </div>
          </div>
        </section>

        <footer className="mt-24 text-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-600">
                Placify Secure Scalable Platform v1.0 • 2026
            </p>
        </footer>
      </div>
    </div>
  );
};

export default About;