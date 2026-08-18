// Lightweight wrapper around the public Piston execution engine
// (https://github.com/engineer-man/piston). Piston is free, requires no
// API key, and runs untrusted code in isolated containers - which makes
// it a reasonable "compile & run" backend for a collaborative editor
// without standing up our own sandboxed execution service.
//
// If you later want first-party code execution (e.g. to keep everything
// inside your own infra), swap PISTON_URL for a call to your own backend
// and keep the same runCode({ language, source, stdin }) contract so
// CodeEditorPane doesn't need to change.

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";
const RUNTIMES_URL = "https://emkc.org/api/v2/piston/runtimes";

// Map the languages offered in the editor's language picker to the
// Piston runtime "language" identifier + a version selector.
// "*" tells pickVersion() to just take the newest available build.
export const RUNNABLE_LANGUAGES = {
  javascript: { piston: "javascript", version: "*" },
  typescript: { piston: "typescript", version: "*" },
  python: { piston: "python", version: "*" },
  java: { piston: "java", version: "*" },
  cpp: { piston: "cpp", version: "*" },
};

let runtimeCache = null;

async function loadRuntimes() {
  if (runtimeCache) return runtimeCache;
  const res = await fetch(RUNTIMES_URL);
  if (!res.ok) throw new Error("Could not reach the code execution service");
  runtimeCache = await res.json();
  return runtimeCache;
}

async function pickVersion(pistonLanguage) {
  try {
    const runtimes = await loadRuntimes();
    const match = runtimes.find((r) => r.language === pistonLanguage);
    return match?.version || "*";
  } catch {
    return "*";
  }
}

const FILE_NAMES = {
  javascript: "main.js",
  typescript: "main.ts",
  python: "main.py",
  java: "Main.java",
  cpp: "main.cpp",
};

export function isRunnable(language) {
  return Boolean(RUNNABLE_LANGUAGES[language]);
}

/**
 * Executes `source` remotely and resolves with a normalized result.
 * Never throws for compiler/runtime errors - those come back in the
 * result payload so the UI can render them in the console. It only
 * throws for network/service failures.
 */
export async function runCode({ language, source, stdin = "" }) {
  const runnable = RUNNABLE_LANGUAGES[language];
  if (!runnable) {
    throw new Error(`Running ${language} code isn't supported yet.`);
  }

  const version = await pickVersion(runnable.piston);

  const res = await fetch(PISTON_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: runnable.piston,
      version,
      files: [{ name: FILE_NAMES[language] || "main.txt", content: source }],
      stdin,
    }),
  });

  if (!res.ok) {
    throw new Error(`Execution service responded with ${res.status}`);
  }

  const data = await res.json();
  const compile = data.compile || null;
  const run = data.run || {};

  return {
    stdout: run.stdout || "",
    stderr: [compile?.stderr, run.stderr].filter(Boolean).join("\n"),
    exitCode: run.code,
    signal: run.signal || null,
    compileFailed: Boolean(compile && compile.code !== 0),
    version,
  };
}
