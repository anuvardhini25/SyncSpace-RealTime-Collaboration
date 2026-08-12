import { useRef, useState, useEffect, useCallback } from "react";
import Toolbar from "./Toolbar";
import useCanvas from "./useCanvas";
import { renderStroke, applyStrokeStyle } from "./canvasUtils";
import { connectSocket } from "../../socket";

export default function DrawingCanvas({ roomId }) {
  const canvasRef = useRef(null);

  // States
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);
  const [connected, setConnected] = useState(false);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Tracks other users' strokes that are still in progress (between their
  // startDrawing and endDrawing events) so we can render each incoming
  // point immediately instead of waiting for the whole stroke to finish.
  const remoteStrokesRef = useRef(new Map());

  const getContext = () => canvasRef.current?.getContext("2d");

  // Save Canvas State
  const saveCanvasState = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  }, []);

  // ---- Real-time sync -----------------------------------------------
  useEffect(() => {
    if (!roomId) return undefined;

    const socket = connectSocket();

    const handleConnect = () => {
      setConnected(true);
      socket.emit("whiteboard:join", { roomId });
    };
    const handleDisconnect = () => setConnected(false);

    const handleState = ({ roomId: incomingRoomId, strokes } = {}) => {
      if (incomingRoomId !== roomId) return;
      const ctx = getContext();
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      (strokes || []).forEach((stroke) => renderStroke(ctx, stroke));
      saveCanvasState();
    };

    const handleRemoteStart = (stroke) => {
      const ctx = getContext();
      if (!ctx || !stroke) return;
      remoteStrokesRef.current.set(stroke.id, { last: { x: stroke.x, y: stroke.y }, stroke });
    };

    const handleRemotePoint = (point) => {
      const ctx = getContext();
      const entry = remoteStrokesRef.current.get(point?.id);
      if (!ctx || !entry) return;

      applyStrokeStyle(ctx, entry.stroke);
      ctx.beginPath();
      ctx.moveTo(entry.last.x, entry.last.y);
      ctx.lineTo(point.x, point.y);
      ctx.stroke();
      entry.last = { x: point.x, y: point.y };
    };

    const handleRemoteEnd = (stroke) => {
      const ctx = getContext();
      if (!ctx || !stroke) return;

      remoteStrokesRef.current.delete(stroke.id);

      // Shapes/text arrive whole; pencil/eraser strokes were already
      // drawn incrementally via handleRemotePoint, so just re-render
      // them from the authoritative point list to avoid drift.
      if (stroke.tool === "rectangle" || stroke.tool === "circle" || stroke.tool === "line" || stroke.tool === "text") {
        renderStroke(ctx, stroke);
      }
      saveCanvasState();
    };

    const handleClear = () => {
      const ctx = getContext();
      const canvas = canvasRef.current;
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      saveCanvasState();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("whiteboard:state", handleState);
    socket.on("whiteboard:startDrawing", handleRemoteStart);
    socket.on("whiteboard:drawing", handleRemotePoint);
    socket.on("whiteboard:endDrawing", handleRemoteEnd);
    socket.on("whiteboard:clear", handleClear);

    if (socket.connected) handleConnect();

    return () => {
      socket.emit("whiteboard:leave", { roomId });
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("whiteboard:state", handleState);
      socket.off("whiteboard:startDrawing", handleRemoteStart);
      socket.off("whiteboard:drawing", handleRemotePoint);
      socket.off("whiteboard:endDrawing", handleRemoteEnd);
      socket.off("whiteboard:clear", handleClear);
    };
  }, [roomId, saveCanvasState]);

  // ---- Local drawing -> broadcast ------------------------------------
  const onStrokeStart = useCallback(
    (stroke) => {
      if (!roomId) return;
      connectSocket().emit("whiteboard:startDrawing", { roomId, stroke });
    },
    [roomId]
  );

  const onStrokePoint = useCallback(
    (point) => {
      if (!roomId) return;
      connectSocket().emit("whiteboard:drawing", { roomId, point });
    },
    [roomId]
  );

  const onStrokeEnd = useCallback(
    (stroke) => {
      if (!roomId) return;
      connectSocket().emit("whiteboard:endDrawing", { roomId, stroke });
    },
    [roomId]
  );

  // Canvas Hook
  useCanvas(canvasRef, tool, color, brushSize, saveCanvasState, {
    onStrokeStart,
    onStrokePoint,
    onStrokeEnd,
  });

  // Save blank canvas once (fallback if no room state arrives, e.g. solo use)
  useEffect(() => {
    if (!roomId) saveCanvasState();
  }, [roomId, saveCanvasState]);

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    saveCanvasState();

    if (roomId) {
      connectSocket().emit("whiteboard:clear", { roomId });
    }
  };

  const downloadCanvas = () => {
    const canvas = canvasRef.current;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Undo / Redo are local-only (per-user) - they don't rewrite the
  // shared stroke history on the server, so other users keep whatever
  // was last broadcast. This matches how most collaborative whiteboards
  // scope undo to "my last action" rather than a globally shared stack.
  const undo = () => {
    if (history.length <= 1) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const current = history[history.length - 1];
    const previous = history[history.length - 2];

    setRedoStack((prev) => [...prev, current]);
    setHistory((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = previous;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const next = redoStack[redoStack.length - 1];

    setHistory((prev) => [...prev, next]);
    setRedoStack((prev) => prev.slice(0, -1));

    const img = new Image();
    img.src = next;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <Toolbar
        setTool={setTool}
        setColor={setColor}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        downloadCanvas={downloadCanvas}
        connected={connected}
      />

      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        className="border border-gray-400 bg-white max-w-full h-auto"
      />
    </div>
  );
}
