import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Save,
  Download,
  Wifi,
  WifiOff,
  Play,
  Loader2,
  Terminal,
  X,
  ChevronDown,
  Trash2,
} from "lucide-react";
import Editor from "@monaco-editor/react";
import { MonacoBinding } from "y-monaco";
import { connectSocket } from "../socket";
import { useAuth } from "../context/AuthContext";
import SocketYjsProvider from "../lib/socketYjsProvider";
import useCrossTabVerifier from "../hooks/useCrossTabVerifier";
import { runCode, isRunnable } from "../lib/codeRunner";

const CURSOR_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#ec4899", "#a855f7", "#eab308"];

const LANGUAGE_OPTIONS = [
  { value: "javascript", label: "JavaScript", ext: "js" },
  { value: "typescript", label: "TypeScript", ext: "ts" },
  { value: "python", label: "Python", ext: "py" },
  { value: "java", label: "Java", ext: "java" },
  { value: "cpp", label: "C++", ext: "cpp" },
  { value: "json", label: "JSON", ext: "json" },
  { value: "html", label: "HTML", ext: "html" },
  { value: "css", label: "CSS", ext: "css" },
];

function colorForId(id = "") {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

function formatTime(dateLike) {
  if (!dateLike) return "--";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export default function CodeEditorPane({ roomId }) {
  const { user } = useAuth();
  const { peerTabs, lastPeerSeenAt, crossTabSupported } = useCrossTabVerifier(roomId, user?.id);

  const [lastSaved, setLastSaved] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);
  const [language, setLanguage] = useState("javascript");
  const [saving, setSaving] = useState(false);

  // Run / compile console state
  const [running, setRunning] = useState(false);
  const [consoleOpen, setConsoleOpen] = useState(false);
  const [result, setResult] = useState(null); // { stdout, stderr, exitCode, compileFailed }
  const [stdin, setStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);

  const editorRef = useRef(null);
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const lastCursorEmitRef = useRef(0);
  const cursorWidgetsRef = useRef({});

  const removeCursorWidget = useCallback((clientId) => {
    const editor = editorRef.current;
    const entry = cursorWidgetsRef.current[clientId];
    if (editor && entry) {
      editor.removeContentWidget(entry.widget);
    }
    delete cursorWidgetsRef.current[clientId];
  }, []);

  const upsertCursorWidget = useCallback((clientId, name, color, position) => {
    const editor = editorRef.current;
    if (!editor || !position) return;

    let entry = cursorWidgetsRef.current[clientId];
    if (!entry) {
      const node = document.createElement("div");
      node.style.cssText = `
        background:${color};
        color:#fff;
        font-size:10px;
        font-weight:600;
        padding:1px 6px;
        border-radius:3px;
        white-space:nowrap;
        transform:translateY(-100%);
        pointer-events:none;
        box-shadow:0 1px 3px rgba(0,0,0,0.4);
      `;
      node.textContent = name || "Guest";

      const widget = {
        getId: () => `remote-cursor-${clientId}`,
        getDomNode: () => node,
        getPosition: () => ({
          position: entry.lastPosition,
          preference: [0],
        }),
      };

      entry = { widget, node, lastPosition: position };
      cursorWidgetsRef.current[clientId] = entry;
      editor.addContentWidget(widget);
    } else {
      entry.node.textContent = name || "Guest";
      entry.node.style.background = color;
      entry.lastPosition = position;
    }

    editor.layoutContentWidget(entry.widget);
  }, []);

  useEffect(() => {
    if (!roomId) return undefined;

    const socket = connectSocket();
    const provider = new SocketYjsProvider({
      socket,
      roomId,
      user: {
        id: user?.id || socket.id || "guest",
        name: user?.name || "Guest",
        color: colorForId(`${user?.id || "guest"}:${roomId}`),
      },
      onConnectionChange: setConnected,
      onLastSaved: setLastSaved,
    });
    providerRef.current = provider;

    const syncPresence = () => {
      const awarenessStates = Array.from(provider.awareness.getStates().entries());
      const visibleClientIds = new Set();

      awarenessStates.forEach(([clientId, state]) => {
        if (clientId === provider.doc.clientID || !state?.cursor) return;

        const key = String(clientId);
        visibleClientIds.add(key);
        upsertCursorWidget(
          key,
          state.user?.name || "Guest",
          state.user?.color || colorForId(key),
          state.cursor
        );
      });

      Object.keys(cursorWidgetsRef.current).forEach((key) => {
        if (!visibleClientIds.has(key)) {
          removeCursorWidget(key);
        }
      });
    };

    const handleEditorUsers = (list) => setUsers(Array.isArray(list) ? list : []);
    const handleEditorReady = ({ roomId: incomingRoomId, language: incomingLanguage } = {}) => {
      if (incomingRoomId !== roomId || !incomingLanguage) return;
      setLanguage(incomingLanguage);
    };
    const handleLanguageChange = ({ roomId: incomingRoomId, language: incomingLanguage } = {}) => {
      if (incomingRoomId !== roomId || !incomingLanguage) return;
      setLanguage(incomingLanguage);
    };

    provider.awareness.on("change", syncPresence);
    socket.on("editorUsers", handleEditorUsers);
    socket.on("editorReady", handleEditorReady);
    socket.on("codeLanguageChange", handleLanguageChange);

    if (editorRef.current?.getModel()) {
      bindingRef.current?.destroy();
      bindingRef.current = new MonacoBinding(
        provider.doc.getText("monaco"),
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );
    }

    return () => {
      provider.awareness.off("change", syncPresence);
      socket.off("editorUsers", handleEditorUsers);
      socket.off("editorReady", handleEditorReady);
      socket.off("codeLanguageChange", handleLanguageChange);
      bindingRef.current?.destroy();
      bindingRef.current = null;
      provider.destroy();
      providerRef.current = null;
      Object.keys(cursorWidgetsRef.current).forEach(removeCursorWidget);
    };
  }, [roomId, removeCursorWidget, upsertCursorWidget, user?.id, user?.name]);

  const handleEditorMount = (editor) => {
    editorRef.current = editor;

    const provider = providerRef.current;
    const model = editor.getModel();
    if (provider && model) {
      bindingRef.current?.destroy();
      bindingRef.current = new MonacoBinding(
        provider.doc.getText("monaco"),
        model,
        new Set([editor]),
        provider.awareness
      );
    }

    editor.onDidChangeCursorPosition((event) => {
      const now = Date.now();
      if (now - lastCursorEmitRef.current < 100) return;
      lastCursorEmitRef.current = now;

      providerRef.current?.updateCursor({
        lineNumber: event.position.lineNumber,
        column: event.position.column,
      });
    });

    editor.onDidBlurEditorText(() => {
      providerRef.current?.updateCursor(null);
    });
  };

  const handleLanguageSelect = (e) => {
    const newLanguage = e.target.value;
    setLanguage(newLanguage);
    if (roomId) {
      connectSocket().emit("codeLanguageChange", { roomId, language: newLanguage });
    }
  };

  const handleSaveClick = () => {
    if (!roomId) return;
    setSaving(true);
    connectSocket().emit("codeSave", { roomId });
    // lastSaved updates via the "codeSaved" broadcast (handled in
    // socketYjsProvider), this just gives the button brief feedback.
    setTimeout(() => setSaving(false), 600);
  };

  const handleRun = useCallback(async () => {
    const source = editorRef.current?.getModel()?.getValue() ?? "";
    if (!isRunnable(language)) {
      setResult({
        stdout: "",
        stderr: `Running "${language}" isn't supported. Try JavaScript, TypeScript, Python, Java, or C++.`,
        exitCode: null,
        compileFailed: false,
      });
      setConsoleOpen(true);
      return;
    }
    if (!source.trim()) return;

    setConsoleOpen(true);
    setRunning(true);
    setResult(null);
    try {
      const output = await runCode({ language, source, stdin });
      setResult(output);
    } catch (err) {
      setResult({
        stdout: "",
        stderr: err.message || "Failed to reach the code execution service.",
        exitCode: null,
        compileFailed: false,
      });
    } finally {
      setRunning(false);
    }
  }, [language, stdin]);

  useEffect(() => {
    const onKeyDown = (e) => {
      const isRunShortcut = (e.ctrlKey || e.metaKey) && e.key === "Enter";
      if (isRunShortcut) {
        e.preventDefault();
        handleRun();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleRun]);

  const handleSnapshotDownload = () => {
    const code = editorRef.current?.getModel()?.getValue() ?? "";
    const ext = LANGUAGE_OPTIONS.find((opt) => opt.value === language)?.ext || "txt";
    const blob = new Blob([code], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `snapshot-${roomId || "code"}.${ext}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const currentSocketId = connectSocket().id;
  const otherUsers = users.filter((entry) => entry.socketId !== currentSocketId);
  const multiTabStatus = crossTabSupported
    ? peerTabs > 0
      ? `${peerTabs} sibling tab/window detected`
      : "Open another tab/window to verify sync"
    : "BroadcastChannel unavailable";

  return (
    <div className="flex-1 flex flex-col relative text-gray-300 bg-[#1E1E1E]">
      <div className="h-10 bg-[#252526] border-b border-gray-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-200">Code Editor</span>
          {connected ? (
            <Wifi size={13} className="text-green-500" />
          ) : (
            <WifiOff size={13} className="text-red-500" />
          )}
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`text-[11px] px-2 py-1 rounded border ${
              peerTabs > 0
                ? "text-emerald-300 border-emerald-700 bg-emerald-950/40"
                : "text-gray-400 border-gray-700 bg-[#333333]"
            }`}
            title={
              lastPeerSeenAt
                ? `Last sibling tab/window seen at ${formatTime(lastPeerSeenAt)}`
                : multiTabStatus
            }
          >
            {multiTabStatus}
          </span>

          <div className="flex -space-x-2">
            {otherUsers.slice(0, 5).map((entry) => (
              <div
                key={entry.socketId}
                title={entry.name}
                className="w-6 h-6 rounded-full border-2 border-[#252526] flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: colorForId(entry.socketId) }}
              >
                {(entry.name || "?").charAt(0).toUpperCase()}
              </div>
            ))}
          </div>

          {otherUsers.length > 0 && (
            <span className="text-[11px] text-gray-400">{otherUsers.length} editing</span>
          )}

          <select
            className="bg-[#333333] border border-gray-700 text-xs rounded px-2 py-1 outline-none"
            value={language}
            onChange={handleLanguageSelect}
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <button
            onClick={handleRun}
            disabled={running}
            title={isRunnable(language) ? "Run code (Ctrl+Enter)" : `Running ${language} isn't supported`}
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "Running…" : "Run"}
          </button>

          <button
            onClick={handleSaveClick}
            title="Save now"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-[#333333]"
          >
            <Save size={14} className={saving ? "text-green-400" : undefined} />
            Save
          </button>

          <button
            onClick={handleSnapshotDownload}
            title="Download a code snapshot"
            className="flex items-center gap-1 text-xs text-gray-300 hover:text-white px-2 py-1 rounded hover:bg-[#333333]"
          >
            <Download size={14} />
            Snapshot
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-0">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          onMount={handleEditorMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>

      {consoleOpen && (
        <div className="h-64 shrink-0 border-t border-gray-800 bg-[#181818] flex flex-col">
          <div className="h-9 px-3 flex items-center justify-between border-b border-gray-800 shrink-0">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-300">
              <Terminal size={14} />
              <span>Console</span>
              {result && !running && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    result.compileFailed || (result.exitCode ?? 0) !== 0
                      ? "bg-red-950/60 text-red-300"
                      : "bg-emerald-950/60 text-emerald-300"
                  }`}
                >
                  {result.compileFailed
                    ? "compile error"
                    : `exit code ${result.exitCode ?? "–"}`}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setShowStdin((v) => !v)}
                className={`text-[11px] px-2 py-1 rounded flex items-center gap-1 ${
                  showStdin ? "bg-[#333333] text-white" : "text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                }`}
                title="Toggle stdin input"
              >
                stdin <ChevronDown size={12} className={showStdin ? "rotate-180" : ""} />
              </button>
              <button
                onClick={() => setResult(null)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                title="Clear output"
              >
                <Trash2 size={13} />
              </button>
              <button
                onClick={() => setConsoleOpen(false)}
                className="p-1 rounded text-gray-400 hover:text-white hover:bg-[#2a2a2a]"
                title="Close console"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {showStdin && (
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Program input (stdin), sent when you Run…"
              className="h-16 shrink-0 resize-none bg-[#141414] border-b border-gray-800 px-3 py-2 text-xs font-mono text-gray-300 outline-none placeholder:text-gray-600"
            />
          )}

          <div className="flex-1 overflow-y-auto px-3 py-2 font-mono text-xs leading-relaxed whitespace-pre-wrap">
            {running && (
              <div className="flex items-center gap-2 text-gray-400">
                <Loader2 size={13} className="animate-spin" />
                Compiling & running your {LANGUAGE_OPTIONS.find((o) => o.value === language)?.label || language} code…
              </div>
            )}
            {!running && !result && (
              <div className="text-gray-500">
                Press <span className="text-gray-300">Run</span> (or Ctrl/Cmd+Enter) to execute the code in this file.
              </div>
            )}
            {!running && result && (
              <>
                {result.stdout && <div className="text-gray-200">{result.stdout}</div>}
                {result.stderr && (
                  <div className="text-red-400 mt-1">{result.stderr}</div>
                )}
                {!result.stdout && !result.stderr && (
                  <div className="text-gray-500">Program finished with no output.</div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <div className="h-6 bg-[#007ACC] text-white flex items-center justify-between px-4 text-xs font-sans shrink-0">
        <button
          onClick={() => setConsoleOpen((v) => !v)}
          className="flex items-center gap-1 hover:bg-white/10 px-1.5 h-full"
          title="Toggle console"
        >
          <Terminal size={12} />
          Console
        </button>
        <span>Last saved: {formatTime(lastSaved)}</span>
        <div className="flex items-center gap-4">
          <span>Yjs Sync</span>
          <span>UTF-8</span>
          <span>{LANGUAGE_OPTIONS.find((opt) => opt.value === language)?.label || language}</span>
        </div>
      </div>
    </div>
  );
}
