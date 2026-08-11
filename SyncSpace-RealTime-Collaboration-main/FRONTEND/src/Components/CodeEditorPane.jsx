import React, { useEffect, useRef, useState, useCallback } from 'react';
import { MoreVertical, Wifi, WifiOff } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { connectSocket, getSocket } from '../socket';
import { useAuth } from '../context/AuthContext';

const CURSOR_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#ec4899', '#a855f7', '#eab308'];

function colorForId(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return CURSOR_COLORS[hash % CURSOR_COLORS.length];
}

function formatTime(dateLike) {
  if (!dateLike) return '—';
  const d = new Date(dateLike);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function CodeEditorPane({ roomId }) {
  const { user } = useAuth();

  const [code, setCode] = useState('');
  const [lastSaved, setLastSaved] = useState(null);
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState([]);

  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const socketRef = useRef(null);

  const isRemoteEditRef = useRef(false); // guards against re-emitting a change we just applied ourselves
  const hasLoadedOnceRef = useRef(false); // only apply the server's saved code on the very first join
  const lastCursorEmitRef = useRef(0);

  const cursorWidgetsRef = useRef({}); // socketId -> { widget, node }

  // ---- Remote cursor rendering (Monaco content widgets) ----
  const removeCursorWidget = useCallback((socketId) => {
    const editor = editorRef.current;
    const entry = cursorWidgetsRef.current[socketId];
    if (editor && entry) {
      editor.removeContentWidget(entry.widget);
    }
    delete cursorWidgetsRef.current[socketId];
  }, []);

  const upsertCursorWidget = useCallback((socketId, name, position) => {
    const editor = editorRef.current;
    if (!editor) return;

    let entry = cursorWidgetsRef.current[socketId];

    if (!entry) {
      const node = document.createElement('div');
      const color = colorForId(socketId);
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
      node.textContent = name || 'Guest';

      const widget = {
        getId: () => `remote-cursor-${socketId}`,
        getDomNode: () => node,
        getPosition: () => ({
          position: entry.lastPosition,
          preference: [0], // ContentWidgetPositionPreference.EXACT
        }),
      };

      entry = { widget, node, lastPosition: position };
      cursorWidgetsRef.current[socketId] = entry;
      editor.addContentWidget(widget);
    } else {
      entry.node.textContent = name || 'Guest';
      entry.lastPosition = position;
    }

    editor.layoutContentWidget(entry.widget);
  }, []);

  // ---- Socket wiring ----
  useEffect(() => {
    if (!roomId) return;

    const socket = connectSocket();
    socketRef.current = socket;
    hasLoadedOnceRef.current = false;

    const joinRoom = () => {
      socket.emit('joinEditor', { roomId });
    };

    const handleConnect = () => {
      setConnected(true);
      joinRoom();

      // Reconnection recovery: if we'd already loaded once, don't let a
      // stale server copy clobber whatever the user has typed locally.
      // Instead push our current buffer so the server/DB and other
      // clients catch back up.
      if (hasLoadedOnceRef.current && editorRef.current) {
        socket.emit('codeChange', {
          roomId,
          code: editorRef.current.getValue(),
          language: 'javascript',
        });
      }
    };

    const handleDisconnect = () => setConnected(false);

    const handleCodeLoaded = ({ code: savedCode, lastSaved: savedAt }) => {
      if (!hasLoadedOnceRef.current) {
        isRemoteEditRef.current = true;
        setCode(savedCode || '');
        if (editorRef.current) {
          editorRef.current.setValue(savedCode || '');
        }
        isRemoteEditRef.current = false;
        hasLoadedOnceRef.current = true;
      }
      setLastSaved(savedAt);
    };

    const handleCodeUpdate = ({ code: incoming, senderId }) => {
      if (senderId === socket.id) return; // ignore our own echo
      const editor = editorRef.current;
      if (!editor) return;

      const model = editor.getModel();
      if (!model) return;
      if (model.getValue() === incoming) return;

      // Preserve the local user's cursor/scroll position while applying
      // a remote change.
      const savedPosition = editor.getPosition();
      const savedScrollTop = editor.getScrollTop();

      isRemoteEditRef.current = true;
      const fullRange = model.getFullModelRange();
      editor.executeEdits('remote-update', [{ range: fullRange, text: incoming }]);
      isRemoteEditRef.current = false;

      setCode(incoming);

      if (savedPosition) {
        const lineCount = model.getLineCount();
        const clampedLine = Math.min(savedPosition.lineNumber, lineCount);
        const clampedColumn = Math.min(
          savedPosition.column,
          model.getLineMaxColumn(clampedLine)
        );
        editor.setPosition({ lineNumber: clampedLine, column: clampedColumn });
      }
      editor.setScrollTop(savedScrollTop);
    };

    const handleCodeSaved = ({ lastSaved: savedAt }) => setLastSaved(savedAt);

    const handleCursorUpdate = ({ socketId, name, position }) => {
      upsertCursorWidget(socketId, name, position);
    };

    const handleCursorLeft = ({ socketId }) => removeCursorWidget(socketId);

    const handleEditorUsers = (list) => setUsers(list);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('codeLoaded', handleCodeLoaded);
    socket.on('codeUpdate', handleCodeUpdate);
    socket.on('codeSaved', handleCodeSaved);
    socket.on('cursorUpdate', handleCursorUpdate);
    socket.on('cursorLeft', handleCursorLeft);
    socket.on('editorUsers', handleEditorUsers);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.emit('leaveEditor', { roomId });
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('codeLoaded', handleCodeLoaded);
      socket.off('codeUpdate', handleCodeUpdate);
      socket.off('codeSaved', handleCodeSaved);
      socket.off('cursorUpdate', handleCursorUpdate);
      socket.off('cursorLeft', handleCursorLeft);
      socket.off('editorUsers', handleEditorUsers);

      Object.keys(cursorWidgetsRef.current).forEach(removeCursorWidget);
    };
  }, [roomId, removeCursorWidget, upsertCursorWidget]);

  // ---- Monaco lifecycle ----
  const handleEditorMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    editor.onDidChangeCursorPosition((e) => {
      const now = Date.now();
      if (now - lastCursorEmitRef.current < 100) return; // light throttle
      lastCursorEmitRef.current = now;

      const socket = socketRef.current;
      if (socket && roomId) {
        socket.emit('cursorMove', {
          roomId,
          position: { lineNumber: e.position.lineNumber, column: e.position.column },
        });
      }
    });
  };

  const handleChange = (value) => {
    setCode(value ?? '');

    if (isRemoteEditRef.current) return; // don't re-broadcast a change we just applied from a remote update

    const socket = socketRef.current;
    if (socket && roomId) {
      socket.emit('codeChange', { roomId, code: value ?? '', language: 'javascript' });
    }
  };

  const otherUsers = users.filter((u) => u.socketId !== socketRef.current?.id);

  return (
    <div className="flex-1 flex flex-col relative text-gray-300 bg-[#1E1E1E]">
      {/* Header */}
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
          {/* Connected users */}
          <div className="flex -space-x-2">
            {otherUsers.slice(0, 5).map((u) => (
              <div
                key={u.socketId}
                title={u.name}
                className="w-6 h-6 rounded-full border-2 border-[#252526] flex items-center justify-center text-[10px] font-bold text-white"
                style={{ backgroundColor: colorForId(u.socketId) }}
              >
                {(u.name || '?').charAt(0).toUpperCase()}
              </div>
            ))}
          </div>
          {otherUsers.length > 0 && (
            <span className="text-[11px] text-gray-400">
              {otherUsers.length} editing
            </span>
          )}

          <select
            className="bg-[#333333] border border-gray-700 text-xs rounded px-2 py-1 outline-none"
            defaultValue="JavaScript"
          >
            <option>JavaScript</option>
            <option disabled>TypeScript (soon)</option>
          </select>
          <button className="text-gray-400 hover:text-white">
            <MoreVertical size={16} />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 relative">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          theme="vs-dark"
          value={code}
          onMount={handleEditorMount}
          onChange={handleChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            padding: { top: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Footer */}
      <div className="h-6 bg-[#007ACC] text-white flex items-center justify-between px-4 text-xs font-sans shrink-0">
        <span>Last saved: {formatTime(lastSaved)}</span>
        <div className="flex items-center gap-4">
          <span>UTF-8</span>
          <span>JavaScript</span>
        </div>
      </div>
    </div>
  );
}
