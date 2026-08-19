import { useCallback, useEffect, useRef, useState } from 'react';
import { connectSocket } from '../socket';

const REACTION_EMOJIS = ['👍', '🎉', '😂', '👀', '🔥', '❤️'];
const FLOAT_DURATION_MS = 2600;

/**
 * Renders as a fixed, click-through overlay so it can sit above the
 * whiteboard/editor split without interfering with either. Mount once
 * per workspace.
 */
export function ReactionLayer({ roomId }) {
  const [floaters, setFloaters] = useState([]);

  useEffect(() => {
    if (!roomId) return undefined;
    const socket = connectSocket();

    const handleReaction = ({ emoji, name, id } = {}) => {
      if (!emoji) return;
      const left = 8 + Math.random() * 84; // vw, keep off the very edges
      const floater = { id: id || `${Date.now()}-${Math.random()}`, emoji, name, left };
      setFloaters((prev) => [...prev, floater]);
      setTimeout(() => {
        setFloaters((prev) => prev.filter((f) => f.id !== floater.id));
      }, FLOAT_DURATION_MS);
    };

    socket.on('room:reaction', handleReaction);
    return () => socket.off('room:reaction', handleReaction);
  }, [roomId]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-16 top-14 z-30 overflow-hidden">
      {floaters.map((f) => (
        <div
          key={f.id}
          className="absolute bottom-0 flex flex-col items-center animate-[float-up_2.6s_ease-out_forwards]"
          style={{ left: `${f.left}vw` }}
        >
          <span className="text-3xl drop-shadow-md">{f.emoji}</span>
          {f.name && (
            <span className="mt-1 text-[10px] font-medium text-white bg-black/60 rounded-full px-2 py-0.5 whitespace-nowrap">
              {f.name}
            </span>
          )}
        </div>
      ))}
      <style>{`
        @keyframes float-up {
          0% { transform: translateY(0) scale(0.6); opacity: 0; }
          15% { transform: translateY(-40px) scale(1); opacity: 1; }
          100% { transform: translateY(-320px) scale(1); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

/** Compact emoji picker button, meant for the workspace topbar. */
export function ReactionPicker({ roomId }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const send = useCallback(
    (emoji) => {
      if (!roomId) return;
      const socket = connectSocket();
      socket.emit('room:reaction', { roomId, emoji });
      setOpen(false);
    },
    [roomId]
  );

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Send a reaction"
        className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-base"
      >
        🙂
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-40 bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-700 rounded-xl shadow-xl px-2 py-1.5 flex gap-1">
          {REACTION_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => send(emoji)}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 dark:hover:bg-gray-800 text-lg transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
