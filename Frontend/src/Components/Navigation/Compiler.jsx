import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import {
  Save, Play, Folder, Bot, FileText, Plus,
  Sun, Moon, Code2, Loader2, X,
  Terminal, Trash2, Send, Sparkles
} from "lucide-react";
import { API_BASE_URL } from "../../config";

const getUser = () => JSON.parse(localStorage.getItem("user"))?.email || "anonymous";

export default function Compiler() {

  const [isDark, setIsDark] = useState(true);
  const [language, setLanguage] = useState("javascript");
  const [code, setCode] = useState("// Start coding...");
  const [output, setOutput] = useState("System ready...");
  const [isRunning, setIsRunning] = useState(false);

  const [files, setFiles] = useState([]);
  const [openTabs, setOpenTabs] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  const [showExplorer, setShowExplorer] = useState(true);
  const [showAI, setShowAI] = useState(false);

  /* ================= BACKEND ================= */

  const loadFiles = async () => {
    const res = await fetch(`${API_BASE_URL}/api/files/user/${getUser()}`);
    setFiles(await res.json());
  };

  useEffect(() => { loadFiles(); }, []);

  const saveFile = async () => {
    if (!activeFile) return;
    await fetch(`${API_BASE_URL}/api/files/save`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: getUser(), filename: activeFile, language, code })
    });

    setOpenTabs(openTabs.map(t =>
      t.filename === activeFile ? { ...t, code } : t
    ));

    loadFiles();
  };

  const deleteFile = async (e, filename) => {
    e.stopPropagation();
    if (!window.confirm("Delete file?")) return;

    await fetch(`${API_BASE_URL}/api/files/delete?userId=${getUser()}&filename=${filename}`, {
      method: "DELETE"
    });

    setFiles(files.filter(f => f.filename !== filename));
    closeTab(e, filename);
  };

  const runCode = async () => {
    setIsRunning(true);
    setOutput("⚙️ Executing...");

    try {
      const res = await fetch(`${API_BASE_URL}/api/compiler/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code })
      });
      setOutput(await res.text());
    } catch {
      setOutput("❌ Backend offline");
    }

    setIsRunning(false);
  };

  /* ================= FILE LOGIC ================= */

  const getLang = (name) => {
    const ext = name.split('.').pop();
    return { js:"javascript", py:"python", cpp:"cpp", java:"java" }[ext] || "javascript";
  };

  const openFile = async (filename) => {
    const existing = openTabs.find(t => t.filename === filename);

    if (!existing) {
      const res = await fetch(
        `${API_BASE_URL}/api/files/load?userId=${getUser()}&filename=${filename}`
      );
      const data = await res.json();
      setOpenTabs([...openTabs, data]);
      setCode(data.code);
    } else {
      setCode(existing.code);
    }

    setLanguage(getLang(filename));
    setActiveFile(filename);
  };

  const closeTab = (e, filename) => {
    e?.stopPropagation();
    const left = openTabs.filter(t => t.filename !== filename);
    setOpenTabs(left);

    if (activeFile === filename) {
      if (left.length) {
        setActiveFile(left[left.length - 1].filename);
        setCode(left[left.length - 1].code);
      } else {
        setActiveFile(null);
        setCode("");
      }
    }
  };

  const createFile = () => {
    const name = prompt("Filename (main.cpp, app.py etc)");
    if (!name) return;

    const file = { filename: name, code: "", language: getLang(name) };

    setFiles([...files, { ...file, id: Date.now() }]);
    setOpenTabs([...openTabs, file]);
    setActiveFile(name);
    setLanguage(getLang(name));
    setCode("");
  };

  return (
    <div className={`h-screen flex flex-col ${isDark ? "bg-[#0d1117] text-slate-300" : "bg-white text-black"}`}>

      {/* HEADER */}
      <header className="h-12 bg-[#161b22] flex justify-between px-4 items-center border-b border-white/5">
        <div className="flex gap-2 font-bold text-indigo-400">
          <Sparkles size={18}/> NEO IDE
        </div>

        <div className="flex gap-3 items-center">
          <button onClick={runCode} className="bg-indigo-600 px-4 py-1.5 text-xs rounded font-bold flex gap-2">
            {isRunning ? <Loader2 size={14} className="animate-spin"/> : <Play size={14} fill="currentColor"/>}
            RUN
          </button>

          <button onClick={saveFile}><Save size={18}/></button>
          <button onClick={() => setIsDark(!isDark)}>
            {isDark ? <Sun size={18}/> : <Moon size={18}/>}
          </button>
        </div>
      </header>

      <div className="flex flex-1">

        {/* SIDEBAR */}
        <aside className="w-12 bg-[#0d1117] border-r flex flex-col items-center py-4 gap-6">
          <button onClick={() => setShowExplorer(!showExplorer)}><Folder size={22}/></button>
          <button onClick={() => setShowAI(!showAI)}><Bot size={22}/></button>
          <div className="flex-1"/>
          <Code2 size={18} className="opacity-40"/>
        </aside>

        {/* EXPLORER */}
        {showExplorer && (
          <aside className="w-64 bg-[#0d1117]/70 border-r">

            <div className="p-4 flex justify-between text-xs font-bold opacity-40">
              FILES
              <Plus size={14} onClick={createFile} className="cursor-pointer"/>
            </div>

            {files.map(f => (
              <div key={f.id}
                onClick={() => openFile(f.filename)}
                className={`group flex gap-2 px-4 py-2 text-sm cursor-pointer
                ${activeFile === f.filename ? "bg-indigo-500/10 text-indigo-400" : "hover:bg-white/5"}`}>

                <FileText size={14}/>
                <span className="flex-1">{f.filename}</span>

                <Trash2 size={12}
                  onClick={(e)=>deleteFile(e,f.filename)}
                  className="opacity-0 group-hover:opacity-100 hover:text-red-400"/>
              </div>
            ))}
          </aside>
        )}

        {/* MAIN */}
        <main className="flex-1 flex flex-col">

          {/* TABS */}
          <div className="flex bg-[#161b22] border-b border-white/5 overflow-x-auto">
            {openTabs.map(t => (
              <div key={t.filename}
                onClick={() => openFile(t.filename)}
                className={`px-4 py-2 text-xs flex gap-2 cursor-pointer min-w-[130px]
                ${activeFile === t.filename ? "bg-[#0d1117] border-b-2 border-indigo-500" : "text-slate-500"}`}>

                {t.filename}
                <X size={12} onClick={(e)=>closeTab(e,t.filename)}/>
              </div>
            ))}
          </div>

          {/* EDITOR */}
          <div className="flex-1">
            <Editor
              height="100%"
              theme={isDark ? "vs-dark" : "light"}
              language={language}
              value={code}
              onChange={v => setCode(v || "")}
              options={{ minimap:{enabled:false}, fontSize:14 }}
            />
          </div>

          {/* TERMINAL */}
          <div className="h-36 bg-[#0d1117] border-t">
            <div className="bg-[#161b22] px-4 py-1 text-xs opacity-60 flex gap-2">
              <Terminal size={12}/> OUTPUT
            </div>
            <div className="p-3 font-mono text-xs text-emerald-400 overflow-auto">
              {output}
            </div>
          </div>
        </main>

        {/* AI PANEL */}
        {showAI && (
          <aside className="w-80 bg-[#0d1117] border-l p-4">
            <div className="font-bold text-indigo-400 mb-3">AI Assistant</div>
            <div className="bg-white/5 p-3 rounded text-xs">
              Ask about your code here...
            </div>
            <div className="flex mt-3 bg-[#161b22] p-2 rounded">
              <input className="bg-transparent flex-1 outline-none text-xs"/>
              <Send size={14}/>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}