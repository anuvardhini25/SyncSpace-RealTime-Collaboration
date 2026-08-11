import { useEffect } from "react";

export default function useCanvas(
  canvasRef,
  tool,
  color,
  brushSize,
  saveCanvasState
) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let drawing = false;
    let startX = 0;
    let startY = 0;

    const start = (e) => {
      drawing = true;

      // 📝 Text Tool
      if (tool === "text") {
        const text = prompt("Enter Text");

        if (text) {
          ctx.fillStyle = color;
          ctx.font = `${brushSize * 8}px Arial`;
          ctx.fillText(text, e.offsetX, e.offsetY);

          if (saveCanvasState) {
            saveCanvasState();
          }
        }

        drawing = false;
        return;
      }

      startX = e.offsetX;
      startY = e.offsetY;

      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";

      if (tool === "eraser") {
        ctx.strokeStyle = "#FFFFFF";
      } else {
        ctx.strokeStyle = color;
      }

      if (tool === "pencil" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
      }
    };

    const draw = (e) => {
      if (!drawing) return;

      if (tool !== "pencil" && tool !== "eraser") {
        return;
      }

      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stop = (e) => {
      if (!drawing) return;

      if (tool === "rectangle") {
        const width = e.offsetX - startX;
        const height = e.offsetY - startY;

        ctx.strokeRect(startX, startY, width, height);
      }

      if (tool === "circle") {
        const dx = e.offsetX - startX;
        const dy = e.offsetY - startY;

        const radius = Math.sqrt(dx * dx + dy * dy);

        ctx.beginPath();
        ctx.arc(startX, startY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
      }

      drawing = false;
      ctx.closePath();

      if (saveCanvasState) {
        saveCanvasState();
      }
    };

    const leave = () => {
      drawing = false;
    };

    canvas.addEventListener("mousedown", start);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stop);
    canvas.addEventListener("mouseleave", leave);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stop);
      canvas.removeEventListener("mouseleave", leave);
    };
  }, [canvasRef, tool, color, brushSize, saveCanvasState]);
}
