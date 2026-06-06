import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { Panel, Group, Separator } from "react-resizable-panels";
import {
  ArrowLeft,
  Play,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sun,
  Moon,
  Code2,
  FileText,
  ChevronDown,
  Terminal,
  Sparkles,
  Zap,
  Flame,
  Trophy,
  History,
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const backendUrl = API_BASE_URL;

const defaultStarter = {
  javascript: "// Write your solution here\n\nconst readline = require('readline');\nconst rl = readline.createInterface({ input: process.stdin });\nlet lines = [];\nrl.on('line', (line) => lines.push(line));\nrl.on('close', () => {\n  // Your code here\n  \n});\n",
  python: "# Write your solution here\nimport sys\n\ndef solve():\n    # Read input\n    \n    # Your code here\n    pass\n\nsolve()\n",
  cpp: '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Your code here\n    \n    return 0;\n}\n',
  java: 'import java.util.Scanner;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        // Your code here\n        \n    }\n}\n',
};

const diffBadge = {
  Easy: { color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: <Zap size={12} /> },
  Medium: { color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", icon: <Flame size={12} /> },
  Hard: { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", icon: <Trophy size={12} /> },
};

export default function CodingArena() {
  const { problemId } = useParams();
  const navigate = useNavigate();

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isDark, setIsDark] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Test case state
  const [activeTab, setActiveTab] = useState(0);
  const [testResults, setTestResults] = useState(null);
  const [submitResult, setSubmitResult] = useState(null);
  const [submissions, setSubmissions] = useState([]);

  // UI state
  const [leftTab, setLeftTab] = useState("description");

  /* ─── Load Problem ─── */
  useEffect(() => {
    let isMounted = true;
    fetch(`${backendUrl}/api/coding/problems/${problemId}`)
      .then((r) => r.json())
      .then((data) => {
        if (!isMounted) return;
        setProblem(data);
        const starter = data.starterCode?.[language] || defaultStarter[language] || "";
        setCode(starter);
      })
      .catch(console.error);
      
    return () => { isMounted = false; };
  }, [problemId, language]);

  /* ─── Load Submissions ─── */
  useEffect(() => {
    let isMounted = true;
    if (user.email) {
      fetch(`${backendUrl}/api/coding/submissions/user/${user.email}/problem/${problemId}`)
        .then((r) => r.json())
        .then((data) => {
          if (isMounted) setSubmissions(Array.isArray(data) ? data : []);
        })
        .catch(console.error);
    }
    return () => { isMounted = false; };
  }, [problemId, submitResult, user.email]);

  /* ─── Language switch ─── */
  const switchLanguage = useCallback((lang) => {
    setLanguage(lang);
    if (problem?.starterCode?.[lang]) {
      setCode(problem.starterCode[lang]);
    } else {
      setCode(defaultStarter[lang] || "");
    }
    setTestResults(null);
    setSubmitResult(null);
  }, [problem]);

  /* ─── Run Code ─── */
  const runCode = async () => {
    setIsRunning(true);
    setTestResults(null);
    setSubmitResult(null);
    try {
      const res = await fetch(`${backendUrl}/api/coding/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, language, code }),
      });
      const data = await res.json();
      setTestResults(data);
      setActiveTab(0);
    } catch {
      setTestResults({ passed: 0, total: 0, results: [], error: "Backend offline" });
    } finally {
      setIsRunning(false);
    }
  };

  /* ─── Submit Code ─── */
  const submitCode = async () => {
    setIsSubmitting(true);
    setSubmitResult(null);
    setTestResults(null);
    try {
      const res = await fetch(`${backendUrl}/api/coding/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.email || "anonymous",
          problemId,
          language,
          code,
        }),
      });
      const data = await res.json();
      setSubmitResult(data);
    } catch {
      setSubmitResult({ status: "ERROR", passedTestCases: 0, totalTestCases: 0 });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!problem) {
    return (
      <div className="h-screen bg-[#0d1117] flex items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    );
  }

  const db = diffBadge[problem.difficulty] || diffBadge.Easy;

  // 1️⃣ TOP: PROBLEM STATEMENT
  const renderDescription = () => (
    <div className={`h-full flex flex-col ${isDark ? "bg-[#0d1117]" : "bg-white"}`}>
      <div className={`flex border-b shrink-0 ${isDark ? "border-white/5 bg-[#161b22]" : "border-slate-200 bg-slate-50"}`}>
        <button
          onClick={() => setLeftTab("description")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            leftTab === "description"
              ? `${isDark ? "border-indigo-500 text-indigo-400" : "border-indigo-600 text-indigo-600"}`
              : `border-transparent ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
          }`}
        >
          <FileText size={14} /> Description
        </button>
        <button
          onClick={() => setLeftTab("submissions")}
          className={`px-4 py-2.5 text-xs font-bold flex items-center gap-2 border-b-2 transition-colors ${
            leftTab === "submissions"
              ? `${isDark ? "border-indigo-500 text-indigo-400" : "border-indigo-600 text-indigo-600"}`
              : `border-transparent ${isDark ? "text-slate-500 hover:text-slate-300" : "text-slate-400 hover:text-slate-600"}`
          }`}
        >
          <History size={14} /> Submissions
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
        {leftTab === "description" ? (
          <>
            <h1 className={`text-2xl font-black mb-3 ${isDark ? "text-white" : "text-slate-900"}`}>
              {problem.title}
            </h1>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg ${db.bg} ${db.color} border ${db.border} text-xs font-bold`}>
                {db.icon} {problem.difficulty}
              </span>
              <span className="px-3 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 text-xs font-bold border border-indigo-500/20">
                {problem.category}
              </span>
            </div>

            <div className={`mb-8 leading-relaxed text-sm whitespace-pre-wrap ${isDark ? "text-slate-300" : "text-slate-600"}`}>
              {problem.description}
            </div>

            {problem.constraints && (
              <div className="mb-8">
                <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                  Constraints
                </h3>
                <div className={`p-4 rounded-xl text-sm font-mono whitespace-pre-wrap ${isDark ? "bg-slate-800/50 text-slate-300 border border-slate-700/50" : "bg-slate-100 text-slate-700 border border-slate-200"}`}>
                  {problem.constraints}
                </div>
              </div>
            )}

            <div className="space-y-6">
              {problem.sampleInput && (
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Sample Input
                  </h3>
                  <pre className={`p-4 rounded-xl text-sm font-mono overflow-x-auto custom-scrollbar ${isDark ? "bg-slate-800/50 text-emerald-400 border border-slate-700/50" : "bg-slate-100 text-emerald-700 border border-slate-200"}`}>
                    {problem.sampleInput}
                  </pre>
                </div>
              )}
              {problem.sampleOutput && (
                <div>
                  <h3 className={`text-xs font-black uppercase tracking-widest mb-3 ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                    Sample Output
                  </h3>
                  <pre className={`p-4 rounded-xl text-sm font-mono overflow-x-auto custom-scrollbar ${isDark ? "bg-slate-800/50 text-blue-400 border border-slate-700/50" : "bg-slate-100 text-blue-700 border border-slate-200"}`}>
                    {problem.sampleOutput}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div>
            <h2 className={`text-lg font-black mb-4 ${isDark ? "text-white" : "text-slate-900"}`}>
              Your Submissions
            </h2>
            {submissions.length === 0 ? (
              <p className="text-sm text-slate-500">No submissions yet.</p>
            ) : (
              <div className="space-y-3">
                {submissions.map((sub, i) => (
                  <div
                    key={sub.id || i}
                    className={`p-4 rounded-xl border text-sm ${
                      sub.status === "ACCEPTED"
                        ? isDark ? "bg-emerald-500/5 border-emerald-500/20" : "bg-emerald-50 border-emerald-200"
                        : isDark ? "bg-rose-500/5 border-rose-500/20" : "bg-rose-50 border-rose-200"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <span className={`font-bold flex items-center gap-2 ${sub.status === "ACCEPTED" ? "text-emerald-500" : "text-rose-500"}`}>
                        {sub.status === "ACCEPTED" ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                        {sub.status}
                      </span>
                      <span className="text-xs text-slate-500">
                        {sub.language} • {sub.passedTestCases}/{sub.totalTestCases} passed
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {sub.submittedAt ? new Date(sub.submittedAt).toLocaleString() : ""}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

  // 2️⃣ MIDDLE: COMPILER (EDITOR)
  const renderEditor = () => (
    <div className="h-full flex flex-col relative overflow-hidden min-h-0">
      <div className={`flex items-center px-4 py-2 border-b shrink-0 ${isDark ? "bg-[#161b22] border-white/5" : "bg-slate-50 border-slate-200"}`}>
        <Code2 size={14} className={`mr-2 ${isDark ? "text-slate-500" : "text-slate-400"}`} />
        <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>
          Compiler
        </span>
      </div>
      <Editor
        height="100%"
        theme={isDark ? "vs-dark" : "light"}
        language={language}
        value={code}
        onChange={(v) => setCode(v || "")}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          padding: { top: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          renderLineHighlight: "gutter",
        }}
      />
    </div>
  );

  // 3️⃣ BOTTOM: RESULTS
  const renderResults = () => (
    <div className={`h-full flex flex-col overflow-hidden min-h-0 ${isDark ? "bg-[#0d1117]" : "bg-white"}`}>
      <div className={`flex items-center justify-between px-4 py-2 border-b shrink-0 ${isDark ? "bg-[#161b22] border-white/5" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center gap-1">
          <Terminal size={14} className={isDark ? "text-slate-500" : "text-slate-400"} />
          <span className={`text-xs font-bold uppercase tracking-widest ${isDark ? "text-slate-500" : "text-slate-400"}`}>
            Test Cases & Results
          </span>
        </div>

        {testResults && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
            testResults.passed === testResults.total && testResults.total > 0
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}>
            {testResults.passed}/{testResults.total} passed
          </span>
        )}

        {submitResult && (
          <span className={`text-xs font-bold px-2.5 py-1 rounded-md ${
            submitResult.status === "ACCEPTED"
              ? "bg-emerald-500/10 text-emerald-400"
              : "bg-rose-500/10 text-rose-400"
          }`}>
            {submitResult.status} — {submitResult.passedTestCases}/{submitResult.totalTestCases}
          </span>
        )}
      </div>

      {submitResult && (
        <div className={`px-4 py-3 text-sm font-bold flex items-center gap-3 border-b shrink-0 ${
          submitResult.status === "ACCEPTED"
            ? isDark ? "bg-emerald-500/5 border-emerald-500/10 text-emerald-400" : "bg-emerald-50 border-emerald-200 text-emerald-600"
            : isDark ? "bg-rose-500/5 border-rose-500/10 text-rose-400" : "bg-rose-50 border-rose-200 text-rose-600"
        }`}>
          {submitResult.status === "ACCEPTED" ? (
            <><CheckCircle2 size={18} /> All test cases passed! Solution accepted.</>
          ) : (
            <><AlertTriangle size={18} /> {submitResult.status}: {submitResult.passedTestCases}/{submitResult.totalTestCases} test cases passed.</>
          )}
        </div>
      )}

      {testResults?.results?.length > 0 && (
        <>
          <div className="flex gap-1 px-4 pt-3 shrink-0 overflow-x-auto custom-scrollbar pb-1">
            {testResults.results.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeTab === i
                    ? r.passed
                      ? isDark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      : isDark ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : "bg-rose-50 text-rose-600 border border-rose-200"
                    : isDark ? "text-slate-500 hover:bg-white/5" : "text-slate-400 hover:bg-slate-100"
                }`}
              >
                {r.passed ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                Case {i + 1}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {(() => {
              const tc = testResults.results[activeTab];
              if (!tc) return null;
              return (
                <div className="flex gap-4">
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Input</p>
                      <pre className={`p-3 rounded-lg text-xs font-mono whitespace-pre-wrap ${isDark ? "bg-slate-800/50 text-slate-300" : "bg-slate-100 text-slate-700"}`}>
                        {tc.input || "(empty)"}
                      </pre>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Expected Output</p>
                      <pre className={`p-3 rounded-lg text-xs font-mono whitespace-pre-wrap ${isDark ? "bg-slate-800/50 text-emerald-400" : "bg-slate-100 text-emerald-700"}`}>
                        {tc.expectedOutput}
                      </pre>
                    </div>
                    <div>
                      <p className={`text-xs font-bold uppercase tracking-widest mb-1.5 ${isDark ? "text-slate-500" : "text-slate-400"}`}>Your Output</p>
                      <pre className={`p-3 rounded-lg text-xs font-mono whitespace-pre-wrap border ${
                        tc.passed
                          ? isDark ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" : "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : isDark ? "bg-rose-500/5 text-rose-400 border-rose-500/20" : "bg-rose-50 text-rose-700 border-rose-200"
                      }`}>
                        {tc.actualOutput || "(no output)"}
                      </pre>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        </>
      )}

      {!testResults && !submitResult && !isRunning && !isSubmitting && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Code2 size={40} className={`mx-auto mb-3 ${isDark ? "text-slate-700" : "text-slate-300"}`} />
            <p className={`text-sm font-medium ${isDark ? "text-slate-600" : "text-slate-400"}`}>
              Run your code to see test results
            </p>
          </div>
        </div>
      )}

      {(isRunning || isSubmitting) && !testResults && !submitResult && (
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <Loader2 size={30} className="animate-spin text-indigo-500 mx-auto mb-3" />
            <p className="text-sm text-slate-500 font-medium">
              {isRunning ? "Running test cases..." : "Submitting solution..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className={`h-screen flex flex-col ${isDark ? "bg-[#0d1117] text-slate-300" : "bg-white text-slate-800"}`}>
      {/* ─── HEADER BAR ─── */}
      <header className={`h-14 flex items-center justify-between px-6 border-b shrink-0 ${isDark ? "bg-[#161b22] border-white/5" : "bg-slate-50 border-slate-200"}`}>
        <div className="flex items-center gap-4 min-w-0">
          <button onClick={() => navigate("/coding")} className={`p-2 rounded-lg transition-colors shrink-0 ${isDark ? "hover:bg-white/5" : "hover:bg-slate-200"}`}>
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles size={14} className="text-indigo-400 shrink-0" />
            <span className="font-bold text-sm truncate max-w-[300px]">{problem.title}</span>
          </div>
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${db.bg} ${db.color} border ${db.border}`}>
            {db.icon} {problem.difficulty}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative shrink-0">
            <select
              value={language}
              onChange={(e) => switchLanguage(e.target.value)}
              className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold outline-none cursor-pointer ${
                isDark ? "bg-slate-800 border border-slate-700 text-slate-300" : "bg-white border border-slate-300 text-slate-700"
              }`}
            >
              <option value="javascript">JS</option>
              <option value="python">PY</option>
              <option value="cpp">C++</option>
              <option value="java">Java</option>
            </select>
            <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 opacity-50 pointer-events-none" />
          </div>

          <button onClick={runCode} disabled={isRunning} className="flex items-center gap-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-indigo-500/20">
            {isRunning ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} fill="currentColor" />}
            <span>Run Code</span>
          </button>

          <button onClick={submitCode} disabled={isSubmitting} className="flex items-center gap-2 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-emerald-500/20">
            {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            <span>Submit Solution</span>
          </button>

          <button onClick={() => setIsDark(!isDark)} className={`p-2 rounded-lg transition-colors shrink-0 ${isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-500"}`}>
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </header>

      {/* ─── VERTICAL MAIN CONTENT ─── */}
      <Group direction="vertical" className="flex-1 overflow-hidden">
        {/* Top: Description */}
        <Panel defaultSize={35} minSize={15} className="min-h-0">
          {renderDescription()}
        </Panel>

        <Separator className={`h-1.5 transition-colors hover:bg-indigo-500/50 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
        
        {/* Middle: Editor */}
        <Panel defaultSize={40} minSize={20} className="min-h-0">
          {renderEditor()}
        </Panel>

        <Separator className={`h-1.5 transition-colors hover:bg-indigo-500/50 ${isDark ? "bg-slate-800" : "bg-slate-200"}`} />
        
        {/* Bottom: Results */}
        <Panel defaultSize={25} minSize={15} className="min-h-0">
          {renderResults()}
        </Panel>
      </Group>

      {/* Custom scrollbar styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}