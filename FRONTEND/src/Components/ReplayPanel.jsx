import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Editor from "@monaco-editor/react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { getRoomReplay } from "../api/roomService";
import { renderStroke } from "./whiteboard/canvasUtils";

const SPEEDS = [0.5, 1, 2];
const TICK_MS = 600; // base ms per event step at 1x playback

function formatClock(ms) {
  if (!Number.isFinite(ms) || ms < 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

function describeAction(evt) {
  if (!evt) return "";
  if (evt.type === "WHITEBOARD_CHANGE") {
    if (evt.action === "CLEAR") return "Cleared the whiteboard";
    const tool = evt.data?.stroke?.tool || "shape";
    const label = tool.charAt(0).toUpperCase() + tool.slice(1);
    return `Drew a ${label}`;
  }
  if (evt.type === "CODE_CHANGE") return "Updated the code";
  if (evt.type === "USER_JOINED") return "Joined the workspace";
  if (evt.type === "USER_LEFT") return "Left the workspace";
  return evt.action || evt.type;
}

// Full-featured Week 4 Replay panel. Renders on top of the existing
// workspace as a modal/drawer - it never touches the live Whiteboard
// canvas, the live Yjs code doc, or the socket connection those use.
// Everything here is a *separate*, temporary, read-only reconstruction
// built purely from the recorded ReplayEvent history.
export default function ReplayPanel({ roomId, onClose }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cursor, setCursor] = useState(0); // number of events "applied" so far
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [complete, setComplete] = useState(false);

  const canvasRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;
    let cancelled = false;
    setLoading(true);
    getRoomReplay(roomId)
      .then((data) => {
        if (cancelled) return;
        setEvents(data.events || []);
        setError(null);
      })
      .catch(() => {
        if (!cancelled) setError("Unable to load replay history right now.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [roomId]);

  const startedAt = events[0]?.timestamp ?? null;
  const endedAt = events[events.length - 1]?.timestamp ?? null;
  const totalDurationMs = startedAt && endedAt ? endedAt - startedAt : 0;

  const currentEvent = events[Math.max(cursor - 1, 0)];
  const elapsedMs = startedAt && currentEvent ? currentEvent.timestamp - startedAt : 0;

  const visibleEvents = useMemo(() => events.slice(0, cursor), [events, cursor]);

  const latestCode = useMemo(() => {
    for (let i = visibleEvents.length - 1; i >= 0; i -= 1) {
      if (visibleEvents[i].type === "CODE_CHANGE" && visibleEvents[i].data?.code !== undefined) {
        return visibleEvents[i].data;
      }
    }
    return null;
  }, [visibleEvents]);

  // Rebuild the whiteboard canvas from scratch based on every
  // WHITEBOARD_CHANGE event up to the cursor. Simple and correct: replay
  // history sizes are small relative to redraw cost.
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const evt of visibleEvents) {
      if (evt.type !== "WHITEBOARD_CHANGE") continue;
      if (evt.action === "CLEAR") {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      } else if (evt.data?.stroke) {
        renderStroke(ctx, evt.data.stroke);
      }
    }
  }, [visibleEvents]);

  useEffect(() => {
    redrawCanvas();
  }, [redrawCanvas]);

  // Playback loop.
  useEffect(() => {
    if (!playing) {
      clearInterval(timerRef.current);
      return undefined;
    }
    timerRef.current = setInterval(() => {
      setCursor((prev) => {
        if (prev >= events.length) return prev;
        const next = prev + 1;
        if (next >= events.length) {
          setPlaying(false);
          setComplete(true);
        }
        return next;
      });
    }, TICK_MS / speed);

    return () => clearInterval(timerRef.current);
  }, [playing, speed, events.length]);

  const handlePlayPause = () => {
    if (cursor >= events.length) {
      setCursor(0);
      setComplete(false);
    }
    setComplete(false);
    setPlaying((p) => !p);
  };

  const handleRestart = () => {
    setPlaying(false);
    setComplete(false);
    setCursor(0);
  };

  const handlePrev = () => {
    setPlaying(false);
    setComplete(false);
    setCursor((c) => Math.max(0, c - 1));
  };

  const handleNext = () => {
    setPlaying(false);
    setCursor((c) => {
      const next = Math.min(events.length, c + 1);
      if (next >= events.length) setComplete(true);
      return next;
    });
  };

  const handleScrub = (e) => {
    setPlaying(false);
    setComplete(false);
    setCursor(Number(e.target.value));
  };

  return (
    <div className="fixed inset-0 z-[95] bg-black/60 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[92vh] bg-white border border-gray-200 rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <h2 className="font-semibold text-gray-800">Replay</h2>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              REPLAY MODE
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            <X size={15} />
            Exit Replay
          </button>
        </div>

        {loading && (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 py-20">
            Loading replay history...
          </div>
        )}

        {!loading && error && (
          <div className="flex-1 flex items-center justify-center text-sm text-red-500 py-20">
            {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-sm text-gray-500 py-20">
            No replay history available yet.
          </div>
        )}

        {!loading && !error && events.length > 0 && (
          <>
            {/* Historical whiteboard + code, side by side, mirroring the live layout */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 min-h-0 overflow-hidden">
              <div className="flex flex-col border-r border-gray-200 min-h-0">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Whiteboard (historical)
                </div>
                <div className="flex-1 overflow-auto bg-gray-100 p-3 flex items-start justify-center">
                  <canvas
                    ref={canvasRef}
                    width={1000}
                    height={500}
                    className="bg-white border border-gray-300 max-w-full h-auto"
                  />
                </div>
              </div>

              <div className="flex flex-col min-h-0">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Code Editor (historical, read-only)
                </div>
                <div className="flex-1 min-h-[240px]">
                  <Editor
                    height="100%"
                    language={latestCode?.language || "javascript"}
                    theme="vs-dark"
                    value={latestCode?.code || "// No code changes recorded yet"}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      scrollBeyondLastLine: false,
                      domReadOnly: true,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* User awareness for current event */}
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50 flex items-center gap-6 text-sm">
              <div>
                <span className="text-gray-400 mr-1.5">User:</span>
                <span className="font-medium text-gray-800">{currentEvent?.userName || "—"}</span>
              </div>
              <div>
                <span className="text-gray-400 mr-1.5">Action:</span>
                <span className="font-medium text-gray-800">{describeAction(currentEvent)}</span>
              </div>
              <div>
                <span className="text-gray-400 mr-1.5">Time:</span>
                <span className="font-medium text-gray-800">
                  {currentEvent ? new Date(currentEvent.timestamp).toLocaleTimeString() : "—"}
                </span>
              </div>
              {complete && (
                <span className="ml-auto text-xs font-semibold text-indigo-600">
                  Replay Complete
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="border-t border-gray-200 px-4 py-3 space-y-2">
              <input
                type="range"
                min={0}
                max={events.length}
                value={cursor}
                onChange={handleScrub}
                className="w-full accent-indigo-600"
              />
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handlePrev}
                    title="Previous event"
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <SkipBack size={16} />
                  </button>
                  <button
                    onClick={handlePlayPause}
                    title={playing ? "Pause" : "Play"}
                    className="p-2.5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    onClick={handleNext}
                    title="Next event"
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <SkipForward size={16} />
                  </button>
                  <button
                    onClick={handleRestart}
                    title="Restart"
                    className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>

                <div className="text-xs text-gray-500 tabular-nums">
                  {formatClock(elapsedMs)} / {formatClock(totalDurationMs)}
                  <span className="mx-2 text-gray-300">|</span>
                  Event {cursor} / {events.length}
                </div>

                <div className="flex items-center gap-1">
                  {SPEEDS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSpeed(s)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium ${
                        speed === s
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
