import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../config";
import { useNavigate, useParams } from "react-router-dom";
import {
  ShieldCheck,
  Info,
  Monitor,
  AlertCircle,
  Play,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Lock
} from "lucide-react";

const MockTestRules = () => {
  const navigate = useNavigate();
  const { category, quizId } = useParams();
  const token = localStorage.getItem("token");

  const [alreadyAttempted, setAlreadyAttempted] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check if quiz was already attempted
  useEffect(() => {
    if (!token) { setChecking(false); return; }
    fetch(`${API_BASE_URL}/quiz-attempt/check/${quizId}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        setAlreadyAttempted(data.attempted === true);
        setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [quizId]);

  const startFullScreen = async () => {
    if (alreadyAttempted) return;
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      navigate(`/quiz/${category}/${quizId}`);
    } catch (err) {
      // Fallback if fullscreen is blocked by browser settings
      navigate(`/quiz/${category}/${quizId}`);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#0f172a] text-slate-200 flex items-center justify-center px-6 py-12 relative overflow-hidden">

      {/* Background Glows */}
      <div className="absolute top-0 -left-20 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full" />

      <div className="max-w-4xl w-full bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10">

        {/* HEADER BAR */}
        <div className="bg-slate-800/50 p-6 border-b border-slate-700 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors font-medium text-sm"
          >
            <ArrowLeft size={18} />
            Back to Quizzes
          </button>
          <div className="px-4 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            {category}
          </div>
        </div>

        <div className="p-8 md:p-12">
          {/* ALREADY ATTEMPTED BANNER */}
          {alreadyAttempted && (
            <div className="mb-8 p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 text-center">
              <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} className="text-emerald-400" />
              </div>
              <h2 className="text-xl font-black text-emerald-400 mb-2">Quiz Already Attempted</h2>
              <p className="text-sm text-slate-400 max-w-md mx-auto">
                You have already completed this assessment. Each quiz can only be attempted once to maintain academic integrity.
              </p>
            </div>
          )}

          {/* MAIN TITLE */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Test Instructions
            </h1>
            <p className="text-slate-400 max-w-lg mx-auto">
              Please read the following guidelines carefully. This test environment is strictly monitored to ensure academic integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* LEFT COLUMN: Overview & Guidelines */}
            <div className="space-y-8">
              <section>
                <div className="flex items-center gap-3 mb-4 text-blue-400">
                  <Info size={22} />
                  <h2 className="text-xl font-bold text-white">General Info</h2>
                </div>
                <ul className="space-y-3">
                  <RuleItem text="Start in Fullscreen mode" />
                  <RuleItem text="Single-choice objective questions" />
                  <RuleItem text="Auto-save responses" />
                  <RuleItem text="Non-pausable timer" />
                  <RuleItem text="One attempt per quiz only" />
                </ul>
              </section>

              <section>
                <div className="flex items-center gap-3 mb-4 text-emerald-400">
                  <CheckCircle2 size={22} />
                  <h2 className="text-xl font-bold text-white">Submission</h2>
                </div>
                <ul className="space-y-3">
                  <RuleItem text="Auto-submit on time expiry" />
                  <RuleItem text="Manual submission allowed anytime" />
                  <RuleItem text="Final responses are non-editable" />
                </ul>
              </section>
            </div>

            {/* RIGHT COLUMN: Proctoring (Crucial Section) */}
            <div className="bg-slate-800/30 rounded-[2rem] p-8 border border-slate-700/50 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <ShieldCheck size={100} />
              </div>

              <div className="flex items-center gap-3 mb-6 text-rose-400">
                <ShieldCheck size={22} />
                <h2 className="text-xl font-bold text-white">Security Policy</h2>
              </div>

              <div className="space-y-5 relative z-10">
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>No Tab Switching:</b> Navigating away from the window will log a violation.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><Monitor size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Fullscreen Mode:</b> Exiting fullscreen will trigger an automatic warning.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>AI Face Monitoring:</b> Custom ML models track your face throughout the exam. Absence or multiple faces will be flagged.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Phone &amp; Object Detection:</b> AI-powered detection identifies mobile phones and prohibited materials in real time.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Gaze Tracking:</b> Head pose estimation monitors where you are looking. Sustained distraction is logged.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Violation Screenshots:</b> A webcam snapshot is automatically captured and stored for every violation.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Plagiarism Analysis:</b> Answer patterns are analyzed across all submissions to detect copying.</p>
                </div>
                <div className="flex gap-4">
                  <div className="mt-1"><AlertCircle size={18} className="text-rose-500" /></div>
                  <p className="text-sm text-slate-300"><b>Auto-Submission:</b> Reaching 5 violations will result in immediate termination.</p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION SECTION */}
          <div className="mt-16 pt-8 border-t border-slate-800 text-center">
            {alreadyAttempted ? (
              <>
                <button
                  disabled
                  className="group relative inline-flex items-center justify-center gap-3 bg-slate-700 text-slate-400 px-12 py-5 rounded-2xl text-xl font-bold cursor-not-allowed opacity-60"
                >
                  <Lock size={20} />
                  Assessment Locked
                </button>
                <p className="mt-4 text-sm text-slate-500">This quiz has already been attempted.</p>
                <button
                  onClick={() => navigate("/dashboard")}
                  className="mt-4 px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all"
                >
                  Return to Dashboard
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={startFullScreen}
                  className="group relative inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-12 py-5 rounded-2xl text-xl font-bold transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.4)] active:scale-95"
                >
                  Start Assessment
                  <Play size={20} className="fill-current group-hover:translate-x-1 transition-transform" />
                </button>
                <p className="mt-6 text-xs text-slate-500 uppercase tracking-widest font-semibold">
                  By starting, you agree to the integrity policy
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- Helper Component --- */
const RuleItem = ({ text }) => (
  <li className="flex items-center gap-3 text-slate-400 text-sm">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
    {text}
  </li>
);

export default MockTestRules;