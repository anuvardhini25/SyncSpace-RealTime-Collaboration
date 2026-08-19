import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  LayoutDashboard,
  Plus,
  LogIn,
  Sun,
  Moon,
  LogOut,
  Sparkles,
  CornerDownLeft,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function CommandPalette({ onOpenGuide }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const onKeyDown = (e) => {
      const isPaletteShortcut = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k';
      if (isPaletteShortcut) {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
    }
  }, [open]);

  const inWorkspace = location.pathname.startsWith('/workspace');

  const actions = useMemo(() => {
    const base = [
      {
        id: 'dashboard',
        label: 'Go to Dashboard',
        icon: LayoutDashboard,
        run: () => navigate('/'),
      },
      {
        id: 'theme',
        label: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
        icon: theme === 'dark' ? Sun : Moon,
        run: toggleTheme,
      },
      {
        id: 'guide',
        label: 'Open the SyncSpace Guide',
        icon: Sparkles,
        run: () => onOpenGuide?.(),
      },
      {
        id: 'logout',
        label: 'Log out',
        icon: LogOut,
        run: () => {
          logout();
          navigate('/login');
        },
      },
    ];

    if (!inWorkspace) {
      base.splice(
        1,
        0,
        { id: 'new-room', label: 'Create a Room', icon: Plus, run: () => navigate('/') },
        { id: 'join-room', label: 'Join a Room', icon: LogIn, run: () => navigate('/') }
      );
    }

    return base;
  }, [inWorkspace, theme, navigate, toggleTheme, logout, onOpenGuide]);

  const filtered = actions.filter((a) => a.label.toLowerCase().includes(query.toLowerCase()));

  const run = (action) => {
    action.run();
    setOpen(false);
  };

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!open) return;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && filtered[activeIndex]) {
        run(filtered[activeIndex]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, filtered, activeIndex]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-gray-800 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 dark:border-gray-800">
          <Search size={16} className="text-slate-400" />
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a command… (create room, dark mode, run code)"
            className="flex-1 bg-transparent outline-none text-sm text-slate-800 dark:text-gray-100 placeholder:text-slate-400"
          />
          <kbd className="hidden sm:inline text-[10px] font-mono text-slate-400 border border-slate-200 dark:border-gray-700 rounded px-1.5 py-0.5">
            Esc
          </kbd>
        </div>
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 && (
            <div className="px-4 py-6 text-center text-sm text-slate-400">No matching commands</div>
          )}
          {filtered.map((action, i) => {
            const Icon = action.icon;
            const active = i === activeIndex;
            return (
              <button
                key={action.id}
                onClick={() => run(action)}
                onMouseEnter={() => setActiveIndex(i)}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm transition-colors ${
                  active
                    ? 'bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300'
                    : 'text-slate-700 dark:text-gray-300'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={15} />
                  {action.label}
                </span>
                {active && <CornerDownLeft size={13} className="text-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
