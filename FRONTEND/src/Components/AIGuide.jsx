import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sparkles, X, Send, Bot, User, Lightbulb } from 'lucide-react';
import { answerGuideQuestion, CONTEXT_TIPS, ENTRIES } from '../lib/guideKnowledge';

function contextKeyFor(pathname) {
  if (pathname.startsWith('/workspace')) return 'workspace';
  if (pathname === '/' || pathname.startsWith('/rooms')) return 'dashboard';
  return null;
}

const SUGGESTED_QUESTIONS = ENTRIES.slice(0, 4).map((e) => e.question);

export default function AIGuide({ open, onOpenChange }) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const location = useLocation();
  const scrollRef = useRef(null);
  const contextKey = contextKeyFor(location.pathname);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open]);

  const ask = (question) => {
    const answer = answerGuideQuestion(question);
    setMessages((prev) => [...prev, { role: 'user', text: question }, { role: 'guide', text: answer }]);
    setInput('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    ask(input.trim());
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => onOpenChange(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white pl-3.5 pr-4 py-3 shadow-lg shadow-violet-600/30 hover:shadow-violet-600/50 hover:brightness-110 transition-all"
          title="Open the SyncSpace guide"
        >
          <Sparkles size={18} />
          <span className="text-sm font-semibold hidden sm:inline">Guide</span>
        </button>
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white dark:bg-gray-900 border-l border-slate-200 dark:border-gray-800 shadow-2xl transition-transform duration-300 flex flex-col ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
              <Sparkles size={15} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-sm text-slate-900 dark:text-white">SyncSpace Guide</div>
              <div className="text-[11px] text-slate-500 dark:text-gray-400">Built-in assistant, no setup needed</div>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-gray-800"
          >
            <X size={16} />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {contextKey && CONTEXT_TIPS[contextKey] && (
            <div className="rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 px-4 py-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-violet-700 dark:text-violet-300 mb-1.5">
                <Lightbulb size={13} /> Tips for this page
              </div>
              <ul className="space-y-1 text-xs text-violet-900/80 dark:text-violet-200/80 list-disc list-inside">
                {CONTEXT_TIPS[contextKey].map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          )}

          {messages.length === 0 && (
            <div>
              <p className="text-xs text-slate-500 dark:text-gray-400 mb-2">Try asking:</p>
              <div className="flex flex-col gap-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => ask(q)}
                    className="text-left text-xs px-3 py-2 rounded-lg border border-slate-200 dark:border-gray-700 text-slate-600 dark:text-gray-300 hover:border-violet-300 hover:text-violet-700 dark:hover:text-violet-300 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                  m.role === 'user'
                    ? 'bg-slate-200 dark:bg-gray-700 text-slate-600 dark:text-gray-300'
                    : 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white'
                }`}
              >
                {m.role === 'user' ? <User size={12} /> : <Bot size={12} />}
              </div>
              <div
                className={`max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-violet-600 text-white rounded-tr-sm'
                    : 'bg-slate-100 dark:bg-gray-800 text-slate-700 dark:text-gray-200 rounded-tl-sm'
                }`}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-gray-800 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask how something works…"
            className="flex-1 h-10 rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 text-xs text-slate-800 dark:text-gray-100 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 placeholder:text-slate-400"
          />
          <button
            type="submit"
            className="w-10 h-10 shrink-0 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-white flex items-center justify-center hover:brightness-110 transition"
          >
            <Send size={14} />
          </button>
        </form>
      </div>

      {open && (
        <div
          onClick={() => onOpenChange(false)}
          className="fixed inset-0 z-40 bg-black/20 sm:hidden"
        />
      )}
    </>
  );
}
