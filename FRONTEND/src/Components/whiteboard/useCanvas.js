import { useEffect, useRef } from "react";
import { applyStrokeStyle, drawShape, drawText, generateStrokeId } from "./canvasUtils";

// Handles local mouse/touch input on the canvas: draws immediately for
// the local user (so it always feels instant, regardless of network
// latency) and reports what happened via three callbacks so the parent
// component can broadcast it over the socket:
//
//   onStrokeStart(stroke)  - pointer went down, drawing began
//   onStrokePoint(point)   - pointer moved while drawing (pencil/eraser only)
//   onStrokeEnd(stroke)    - pointer went up / stroke is complete
export default function useCanvas(
  canvasRef,
  tool,
  color,
  brushSize,
  saveCanvasState,
  { onStrokeStart, onStrokePoint, onStrokeEnd } = {}
) {
  const callbacksRef = useRef({});
  callbacksRef.current = { onStrokeStart, onStrokePoint, onStrokeEnd };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    let drawing = false;
    let startX = 0;
    let startY = 0;
    let strokeId = null;
    let points = [];

    const start = (e) => {
      if (e.button !==0) return;
      drawing = true;
      strokeId = generateStrokeId();

      // Text Tool
      if (tool === "text") {
        const text = prompt("Enter Text");
        drawing = false;

        if (text) {
          const stroke = {
            id: strokeId,
            tool: "text",
            color,
            brushSize,
            x: e.offsetX,
            y: e.offsetY,
            text,
          };
          drawText(ctx, stroke);
          callbacksRef.current.onStrokeEnd?.(stroke);
          saveCanvasState?.();
        }
        return;
      }

      startX = e.offsetX;
      startY = e.offsetY;
      points = [{ x: startX, y: startY }];

      applyStrokeStyle(ctx, { tool, color, brushSize });

      if (tool === "pencil" || tool === "eraser") {
        ctx.beginPath();
        ctx.moveTo(startX, startY);

        callbacksRef.current.onStrokeStart?.({
          id: strokeId,
          tool,
          color,
          brushSize,
          x: startX,
          y: startY,
        });
      }
    };

    const draw = (e) => {
      if (!drawing) return;
      if (tool !== "pencil" && tool !== "eraser") return;

      const x = e.offsetX;
      const y = e.offsetY;

      ctx.lineTo(x, y);
      ctx.stroke();
      points.push({ x, y });

      callbacksRef.current.onStrokePoint?.({ id: strokeId, x, y });
    };

    const stop = (e) => {
      if (!drawing) return;
      drawing = false;

      if (tool === "pencil" || tool === "eraser") {
        ctx.closePath();
        callbacksRef.current.onStrokeEnd?.({
          id: strokeId,
          tool,
          color,
          brushSize,
          points,
        });
        saveCanvasState?.();
        return;
      }

      // Shapes are only drawn once, at the end.
      const stroke = {
        id: strokeId,
        tool,
        color,
        brushSize,
        startX,
        startY,
        endX: e.offsetX,
        endY: e.offsetY,
      };

      if (tool === "rectangle" || tool === "circle" || tool === "line") {
        drawShape(ctx, stroke);
        callbacksRef.current.onStrokeEnd?.(stroke);
        saveCanvasState?.();
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
