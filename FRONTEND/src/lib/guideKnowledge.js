// A small rule-based "assistant" for the in-app guide panel.
//
// SyncSpace's stack has no LLM provider wired up (no API key, no model
// host), so instead of bolting on a third-party AI service, the guide
// answers from a curated knowledge base of the product's own features.
// It's fast, works offline, costs nothing, and never hallucinates
// something SyncSpace doesn't actually do.
//
// The matching is deliberately simple (keyword scoring) rather than a
// hardcoded FAQ menu - it can respond to varied phrasing of the same
// question, which is what makes it feel like "assistance" rather than
// a static help page. If a real LLM is added later, `answerGuideQuestion`
// is the single function to swap for a network call - everything that
// renders it (AIGuide.jsx) stays the same.

export const ENTRIES = [
  {
    keywords: ['room', 'create room', 'new room', 'start room', 'workspace'],
    question: 'How do I create a room?',
    answer:
      'From the dashboard, use the "Create a room" card, give it a name, and you\'ll be dropped straight into a new workspace with a live whiteboard and code editor.',
  },
  {
    keywords: ['join', 'invite', 'code', 'room code', 'link'],
    question: 'How does someone else join my room?',
    answer:
      'Share your room code (shown on the room card) or hit "Copy Invite Link" in the workspace topbar - anyone with either can join instantly.',
  },
  {
    keywords: ['run', 'execute', 'compile', 'output', 'console', 'stdout'],
    question: 'How do I run my code?',
    answer:
      'Click the green Run button above the code editor, or press Ctrl/Cmd+Enter. Output, errors, and the exit code show up in the console panel underneath. JavaScript, TypeScript, Python, Java, and C++ are supported.',
  },
  {
    keywords: ['stdin', 'input'],
    question: 'Can I give my program input?',
    answer:
      'Yes - open the "stdin" dropdown above the console and type whatever your program should read from standard input before hitting Run.',
  },
  {
    keywords: ['whiteboard', 'draw', 'pencil', 'shape', 'canvas'],
    question: 'What can I do on the whiteboard?',
    answer:
      'The whiteboard supports freehand drawing, rectangles, circles, lines, and text - all synced live to everyone in the room. Use Undo/Redo or Clear if you need a fresh canvas, and Download to save it as an image.',
  },
  {
    keywords: ['sync', 'real-time', 'realtime', 'collaborat', 'live'],
    question: 'How does the real-time sync work?',
    answer:
      "Every keystroke and stroke is merged with a CRDT (Yjs) and broadcast over WebSockets, so multiple people can edit the same line of code or draw on the same canvas at once without conflicts.",
  },
  {
    keywords: ['replay', 'history', 'session', 'scrub', 'rewind'],
    question: 'Can I replay a session?',
    answer:
      'Yes - the Replay button in the topbar lets you scrub back through the room\'s history to see how the whiteboard and code evolved during the session.',
  },
  {
    keywords: ['save', 'snapshot', 'download', 'export'],
    question: 'How do I save my work?',
    answer:
      'Use Save in the code editor toolbar to persist the current file, or Snapshot to capture a point-in-time copy you can come back to later.',
  },
  {
    keywords: ['theme', 'dark', 'light', 'mode', 'appearance'],
    question: 'How do I switch between light and dark mode?',
    answer:
      'Click the sun/moon icon in the sidebar to toggle the theme - your choice is remembered next time you open SyncSpace.',
  },
  {
    keywords: ['shortcut', 'hotkey', 'keyboard', 'command', 'palette'],
    question: 'Are there keyboard shortcuts?',
    answer:
      'Press Ctrl/Cmd+K anywhere to open the command palette and jump to any action - create a room, run code, toggle the theme, copy the invite link, and more.',
  },
  {
    keywords: ['reaction', 'emoji', 'react'],
    question: 'What are the live reactions?',
    answer:
      'The emoji button in the workspace topbar lets you send a quick reaction that floats up on everyone\'s screen in real time - handy for pair sessions and interviews without breaking focus to type chat.',
  },
  {
    keywords: ['leave', 'exit', 'quit'],
    question: 'How do I leave a room?',
    answer: 'Click "Leave Room" in the top-right of the workspace to head back to your dashboard.',
  },
];

const FALLBACK =
  "I don't have an answer for that yet - I can help with rooms, the whiteboard, running code, replay, themes, and shortcuts. Try asking about one of those!";

function score(entry, query) {
  const q = query.toLowerCase();
  return entry.keywords.reduce((total, kw) => (q.includes(kw) ? total + kw.length : total), 0);
}

export function answerGuideQuestion(query) {
  if (!query || !query.trim()) return FALLBACK;
  const ranked = ENTRIES.map((entry) => ({ entry, s: score(entry, query) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);

  return ranked.length > 0 ? ranked[0].entry.answer : FALLBACK;
}

// Tips shown per-route when the guide is first opened, before the
// person has asked anything.
export const CONTEXT_TIPS = {
  dashboard: [
    'Create a room to get a shareable code instantly.',
    'Click any room card to jump back into it.',
  ],
  workspace: [
    'Ctrl/Cmd+Enter runs the current file without leaving the keyboard.',
    'Everything on the whiteboard and editor syncs live - try opening the room in a second tab.',
  ],
};
