import { useEffect, useRef } from "react";
import {
  applyStrokeStyle,
  drawShape,
  drawText,
  generateStrokeId,
} from "./canvasUtils";

// Handles local mouse input on the canvas.
// Converts displayed canvas coordinates back to the
// canvas's internal 1000 x 500 coordinate system.
export default function useCanvas(
  canvasRef,
  tool,
  color,
  brushSize,
  saveCanvasState,
  { onStrokeStart, onStrokePoint, onStrokeEnd } = {}
) {
  const callbacksRef = useRef({});

  callbacksRef.current = {
    onStrokeStart,
    onStrokePoint,
    onStrokeEnd,
  };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    canvas.style.cursor = "crosshair";

    let drawing = false;
    let startX = 0;
    let startY = 0;
    let strokeId = null;
    let points = [];

    // Convert mouse position from the displayed CSS canvas
    // to the canvas's internal coordinate system.
    const getCanvasPosition = (e) => {
      const rect = canvas.getBoundingClientRect();

      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    };

    const start = (e) => {
      // Only respond to left mouse button
      if (e.button !== 0) return;

      drawing = true;
      strokeId = generateStrokeId();

      const { x, y } = getCanvasPosition(e);

      // --------------------------------------------------
      // Text Tool
      // --------------------------------------------------
      if (tool === "text") {
        const text = prompt("Enter Text")?.trim();

        drawing = false;

        if (text) {
          const stroke = {
            id: strokeId,
            tool: "text",
            color,
            brushSize,
            x,
            y,
            text,
          };

          drawText(ctx, stroke);

          callbacksRef.current.onStrokeEnd?.(stroke);

          saveCanvasState?.();
        }

        return;
      }

      startX = x;
      startY = y;

      points = [
        {
          x: startX,
          y: startY,
        },
      ];

      applyStrokeStyle(ctx, {
        tool,
        color,
        brushSize,
      });

      // --------------------------------------------------
      // Pencil / Eraser
      // --------------------------------------------------
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

      if (tool !== "pencil" && tool !== "eraser") {
        return;
      }

      const { x, y } = getCanvasPosition(e);

      ctx.lineTo(x, y);
      ctx.stroke();

      points.push({
        x,
        y,
      });

      callbacksRef.current.onStrokePoint?.({
        id: strokeId,
        x,
        y,
      });
    };

    const stop = (e) => {
      if (!drawing) return;

      drawing = false;

      // --------------------------------------------------
      // Pencil / Eraser
      // --------------------------------------------------
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

      // Get correctly scaled final position
      const { x, y } = getCanvasPosition(e);

      // --------------------------------------------------
      // Shapes
      // --------------------------------------------------
      const stroke = {
        id: strokeId,
        tool,
        color,
        brushSize,
        startX,
        startY,
        endX: x,
        endY: y,
      };

      if (
        tool === "rectangle" ||
        tool === "circle" ||
        tool === "line"
      ) {
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
  }, [
    canvasRef,
    tool,
    color,
    brushSize,
    saveCanvasState,
  ]);
}