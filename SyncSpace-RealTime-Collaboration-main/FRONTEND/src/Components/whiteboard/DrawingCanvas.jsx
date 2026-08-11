import { useRef, useState, useEffect } from "react";
import Toolbar from "./Toolbar";
import useCanvas from "./useCanvas";

export default function DrawingCanvas() {
  const canvasRef = useRef(null);

  // States
  const [tool, setTool] = useState("pencil");
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(3);

  const [history, setHistory] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  // Save Canvas State
  const saveCanvasState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setHistory((prev) => [...prev, canvas.toDataURL()]);
    setRedoStack([]);
  };

  // Canvas Hook
  useCanvas(
    canvasRef,
    tool,
    color,
    brushSize,
    saveCanvasState
  );

  // Save blank canvas once
  useEffect(() => {
    saveCanvasState();
  }, []);

  // Clear Canvas
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    saveCanvasState();
  };

  const downloadCanvas = () => {
  const canvas = canvasRef.current;

  const link = document.createElement("a");
  link.download = "whiteboard.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

  // Undo
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

  // Redo
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
    <div className="w-full h-full flex flex-col">
      <Toolbar
        setTool={setTool}
        setColor={setColor}
        setBrushSize={setBrushSize}
        clearCanvas={clearCanvas}
        undo={undo}
        redo={redo}
        downloadCanvas={downloadCanvas}
      />

      <canvas
        ref={canvasRef}
        width={1000}
        height={500}
        className="border border-gray-400 bg-white"
      />
    </div>
  );
}