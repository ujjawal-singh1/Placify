import React, { useState, useEffect, useRef } from "react";
import { API_BASE_URL } from "../../config";
import * as tf from "@tensorflow/tfjs";
import * as blazeface from "@tensorflow-models/blazeface";
import { useParams, useNavigate } from "react-router-dom";
import {
  Timer,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  Lock,
  Flag
} from "lucide-react";

const Quiz = () => {
  const { category, quizId } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [userResponses, setUserResponses] = useState({});
  const [score, setScore] = useState(null);

  const [timeLeft, setTimeLeft] = useState(60);
  const [cheatCount, setCheatCount] = useState(0);
  const [autoSubmitted, setAutoSubmitted] = useState(false);

  // Proctoring states
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const modelRef = useRef(null);
  const detectIntervalRef = useRef(null);
  const [proctoringMsg, setProctoringMsg] = useState("Initializing ML Proctoring...");
  const [isModelReady, setIsModelReady] = useState(false);

  /* ================= UI HELPERS ================= */
  const formatTime = (secs) => {
    const m = String(Math.floor(secs / 60)).padStart(2, "0");
    const s = String(secs % 60).padStart(2, "0");
    return `${m}:${s}`;
  };

  /* ================= FETCH LOGIC (Logic preserved) ================= */
  useEffect(() => {
    fetch(`${API_BASE_URL}/quiz/details/${quizId}`)
      .then((res) => res.json())
      .then((info) => {
        if (info?.duration) setTimeLeft(info.duration * 60);
      });

    fetch(`${API_BASE_URL}/quiz/get/${quizId}`)
      .then((res) => res.json())
      .then(setQuestions)
      .catch(console.error);
  }, [quizId]);

  /* ================= TIMER & PROCTORING (Logic preserved) ================= */
  useEffect(() => {
    if (!questions.length || score !== null) return;
    if (timeLeft <= 0) {
      submitQuiz();
      return;
    }
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, questions, score]);

  const warn = () => {
    setCheatCount((prev) => {
      const next = prev + 1;
      if (next === 1) alert("⚠ Cheating detected!\n\nAfter 5 violations your quiz will auto-submit.");
      return next;
    });
  };

  // Send proctor log to backend
  const sendProctorLog = (issue) => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    fetch(`${API_BASE_URL}/quiz/proctor/upload`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.email || "anonymous",
        issue,
        attemptId: quizId, // Use quizId as a reference until actual attemptId is available
      }),
    }).catch(() => {});
  };

  useEffect(() => {
    if (cheatCount >= 5 && score === null && !autoSubmitted) {
      setAutoSubmitted(true);
      setTimeout(() => {
        alert("❌ Too many violations. Quiz auto-submitted.");
        submitQuiz();
      }, 0);
    }
  }, [cheatCount]);

  useEffect(() => {
    const blur = () => { warn(); sendProctorLog("window_blur"); };
    const vis = () => { if (document.hidden) { warn(); sendProctorLog("tab_switch"); } };
    const block = (e) => { e.preventDefault(); warn(); sendProctorLog("context_menu"); };
    const copyPaste = (e) => { e.preventDefault(); warn(); sendProctorLog("copy_paste"); };
    const keys = (e) => {
      if ((e.ctrlKey || e.metaKey) && ["c", "v", "x", "a", "s"].includes(e.key.toLowerCase())) {
        e.preventDefault(); warn(); sendProctorLog("keyboard_shortcut");
      }
      if (e.key === "F12") { e.preventDefault(); warn(); sendProctorLog("devtools_attempt"); }
    };
    const fsChange = () => {
      if (!document.fullscreenElement) {
        warn(); sendProctorLog("fullscreen_exit");
      }
    };

    window.addEventListener("blur", blur);
    document.addEventListener("visibilitychange", vis);
    document.addEventListener("contextmenu", block);
    document.addEventListener("copy", copyPaste);
    document.addEventListener("paste", copyPaste);
    document.addEventListener("keydown", keys);
    document.addEventListener("fullscreenchange", fsChange);

    return () => {
      window.removeEventListener("blur", blur);
      document.removeEventListener("visibilitychange", vis);
      document.removeEventListener("contextmenu", block);
      document.removeEventListener("copy", copyPaste);
      document.removeEventListener("paste", copyPaste);
      document.removeEventListener("keydown", keys);
      document.removeEventListener("fullscreenchange", fsChange);
    };
  }, []);

  /* ================= ML PROCTORING ================= */
  useEffect(() => {
    let active = true;
    const startProctoring = async () => {
      try {
        // 1. Get user media
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        if (!active) return;
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        // Add track listeners for disabled devices
        stream.getTracks().forEach(track => {
          track.onended = () => {
             alert("⚠ Device disconnected! Resuming could log a violation.");
             warn(); sendProctorLog("device_disconnected");
          };
        });

        // 2. Load Blazeface model
        await tf.ready();
        const model = await blazeface.load();
        if (!active) return;
        modelRef.current = model;
        setIsModelReady(true);
        setProctoringMsg("Proctoring Active - Monitoring Started");

        // 3. Start face detection loop
        detectIntervalRef.current = setInterval(async () => {
          if (!videoRef.current || !modelRef.current) return;
          // Ensure video is ready
          if (videoRef.current.readyState !== 4) return;
          
          const predictions = await modelRef.current.estimateFaces(videoRef.current, false);
          
          if (predictions.length === 0) {
            setProctoringMsg("⚠ Warning: No face detected!");
            // warn(); // We could call warn() but it might trigger too fast, keep it visual for now or use a debounce.
          } else if (predictions.length > 1) {
            setProctoringMsg("⚠ Warning: Multiple faces detected!");
            warn(); sendProctorLog("multiple_faces"); // Definite violation
          } else {
            setProctoringMsg("Status: Normal");
          }
        }, 3000); // Check every 3 seconds
        
      } catch (err) {
        console.error("Proctoring Error:", err);
        if (active) setProctoringMsg("❌ Error: Device permission missing!");
      }
    };

    if (!score && !autoSubmitted) {
      startProctoring();
    }

    return () => {
      active = false;
      if (detectIntervalRef.current) clearInterval(detectIntervalRef.current);
      if (streamRef.current) {
         streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [score, autoSubmitted]);

  /* ================= ACTION HANDLERS ================= */
  const handleOptionSelect = (idx) => {
    setSelected(idx);
    setUserResponses((p) => ({ ...p, [currentQ]: idx }));
  };

  const handleNext = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(userResponses[currentQ + 1] ?? null);
    } else {
      submitQuiz();
    }
  };

  const submitQuiz = async () => {
    if (score !== null) return;
    const payload = questions.map((q, i) => ({
      questionId: q.id,
      response: userResponses[i] != null ? [q.option1, q.option2, q.option3, q.option4][userResponses[i]] : null,
    }));

    try {
      const res = await fetch(`${API_BASE_URL}/quiz/submit/${quizId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const finalScore = await res.json();
      setScore(finalScore);

      await fetch(`${API_BASE_URL}/quiz-attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ quizId, quizTitle: category, score: finalScore, totalMarks: questions.length, cheatCount }),
      });
    } catch (err) { console.error("Submit error", err); }
  };

  /* ================= LOADING STATE ================= */
  if (!questions.length) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950">
      <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-500 font-medium animate-pulse">Preparing your assessment...</p>
    </div>
  );

  /* ================= RESULT SCREEN ================= */
  if (score !== null) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] p-6">
      <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-[2.5rem] p-10 text-center shadow-2xl border border-slate-100 dark:border-slate-700">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={48} />
        </div>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Assessment Complete!</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Great job on finishing the {category} quiz.</p>

        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 mb-8 border border-slate-100 dark:border-slate-700">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Final Score</p>
          <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400">
            {score} <span className="text-2xl text-slate-400">/ {questions.length}</span>
          </div>
        </div>

        <button
          onClick={() => navigate("/dashboard")}
          className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-lg shadow-indigo-500/30 transition-all active:scale-95"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );

  const q = questions[currentQ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#f8fafc] dark:bg-[#0f172a]">

      {/* SIDEBAR NAVIGATION */}
      <aside className="lg:w-80 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 p-8 flex flex-col">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <LayoutGrid size={20} />
          </div>
          <h3 className="font-black tracking-tight text-slate-800 dark:text-white uppercase text-sm">Question Map</h3>
        </div>

        <div className="grid grid-cols-5 gap-3 mb-8">
          {questions.map((_, i) => {
            const isAnswered = userResponses[i] != null;
            const isCurrent = i === currentQ;
            return (
              <button
                key={i}
                onClick={() => { setCurrentQ(i); setSelected(userResponses[i] ?? null); }}
                className={`h-10 w-10 rounded-xl text-xs font-bold transition-all ${isCurrent
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/40 ring-4 ring-indigo-500/10"
                    : isAnswered
                      ? "bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-200"
                  }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>

        <div className="mt-auto space-y-4">
          
          {/* CAMERA FEED & PROCTORING */}
          <div className="p-4 rounded-2xl bg-slate-900/5 dark:bg-slate-900 border border-slate-200 dark:border-slate-700/50 shadow-inner relative overflow-hidden">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex justify-between items-center">
              <span>Proctoring Feed</span>
              {isModelReady && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></div>}
            </div>
            <div className="aspect-video w-full bg-slate-950 rounded-xl overflow-hidden relative">
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                className="w-full h-full object-cover transform scale-x-[-1]"
              />
            </div>
            <p className={`text-[10px] sm:text-xs font-semibold mt-2 text-center transition-colors ${proctoringMsg.includes("Warning") || proctoringMsg.includes("Error") ? "text-rose-500" : "text-emerald-500"}`}>
              {proctoringMsg}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-900/30">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <AlertTriangle size={16} />
              <span className="text-xs font-bold uppercase tracking-wider">Security Log</span>
            </div>
            <p className="text-sm font-semibold text-amber-700 dark:text-amber-300">
              Violations: {cheatCount} / 5
            </p>
          </div>
          
          <div className="flex items-center gap-2 p-3 text-slate-400 text-xs font-medium italic">
            <Lock size={12} />
            Secure Examination Mode Active
          </div>
        </div>
      </aside>

      {/* MAIN EXAM AREA */}
      <main className="flex-1 flex flex-col">
        {/* TOP BAR */}
        <header className="bg-white dark:bg-slate-800 lg:bg-transparent border-b border-slate-200 dark:border-slate-700 lg:border-none p-6 lg:px-12 lg:pt-12 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-[0.2em] mb-1">{category}</h2>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">Professional Assessment</h1>
          </div>

          <div className={`flex items-center gap-3 px-6 py-3 rounded-2xl shadow-sm border transition-colors ${timeLeft < 60
              ? "bg-rose-50 border-rose-100 text-rose-600 dark:bg-rose-500/10 dark:border-rose-500/20 dark:text-rose-400 animate-pulse"
              : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200"
            }`}>
            <Timer size={20} />
            <span className="font-mono text-xl font-bold">{formatTime(timeLeft)}</span>
          </div>
        </header>

        {/* QUESTION CARD */}
        <section className="flex-1 px-6 py-6 lg:px-12 lg:py-10 max-w-4xl">
          <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 lg:p-12 shadow-sm border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-xs font-bold rounded-lg">
                Question {currentQ + 1}
              </span>
              <div className="h-px flex-1 bg-slate-100 dark:bg-slate-700"></div>
            </div>

            <h3 className="text-xl lg:text-2xl font-bold text-slate-900 dark:text-white leading-snug mb-10">
              {q.quetionTitle}
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {[q.option1, q.option2, q.option3, q.option4].map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`group flex items-center justify-between p-5 rounded-2xl border-2 text-left transition-all duration-200 ${selected === idx
                      ? "bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 ring-4 ring-indigo-500/5 shadow-md"
                      : "bg-transparent border-slate-100 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-500"
                    }`}
                >
                  <span className={`font-semibold ${selected === idx ? "text-indigo-700 dark:text-indigo-300" : "text-slate-600 dark:text-slate-400"}`}>
                    {opt}
                  </span>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${selected === idx ? "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-500/40" : "border-slate-200 dark:border-slate-600"
                    }`}>
                    {selected === idx && <div className="w-2 h-2 bg-white rounded-full"></div>}
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleNext}
                className="flex-1 py-4 bg-slate-900 dark:bg-indigo-600 text-white rounded-[1.5rem] font-bold text-lg hover:shadow-xl hover:shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group active:scale-95"
              >
                {currentQ + 1 === questions.length ? "Finalize & Submit" : "Next Question"}
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <button className="px-6 py-4 text-slate-400 hover:text-rose-500 font-bold transition-colors flex items-center justify-center gap-2">
                <Flag size={18} />
                <span className="hidden sm:inline">Report Issue</span>
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Quiz;