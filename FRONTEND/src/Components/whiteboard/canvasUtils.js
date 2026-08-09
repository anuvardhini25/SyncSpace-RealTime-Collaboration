// canvasUtils.js
//
// Pure drawing helpers shared between:
//  - useCanvas.js (drawing the local user's own live strokes)
//  - DrawingCanvas.jsx (replaying remote strokes / hydrated room state)
//
// Keeping this logic in one place means a stroke drawn locally and a
// stroke drawn because of a socket event always render identically.

export function applyStrokeStyle(ctx, { tool, color, brushSize }) {
  ctx.lineWidth = brushSize;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
}

// Draws one segment of a freehand pencil/eraser stroke, from (x1,y1) to (x2,y2).
export function drawSegment(ctx, { tool, color, brushSize, x1, y1, x2, y2 }) {
  applyStrokeStyle(ctx, { tool, color, brushSize });
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

// Draws a finished shape (rectangle / circle / line).
export function drawShape(ctx, { tool, color, brushSize, startX, startY, endX, endY }) {
  applyStrokeStyle(ctx, { tool, color, brushSize });

  if (tool === "rectangle") {
    ctx.strokeRect(startX, startY, endX - startX, endY - startY);
    return;
  }

  if (tool === "circle") {
    const dx = endX - startX;
    const dy = endY - startY;
    const radius = Math.sqrt(dx * dx + dy * dy);
    ctx.beginPath();
    ctx.arc(startX, startY, radius, 0, Math.PI * 2);
    ctx.stroke();
    return;
  }

  if (tool === "line") {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
}

export function drawText(ctx, { color, brushSize, x, y, text }) {
  ctx.fillStyle = color;
  ctx.font = `${brushSize * 8}px Arial`;
  ctx.fillText(text, x, y);
}

// Replays a single finished stroke object (as stored/broadcast by the
// backend) onto a canvas context. Used for hydrating a freshly-joined
// client and for rendering a shape/text stroke that arrives in one shot.
export function renderStroke(ctx, stroke) {
  if (!stroke) return;

  if (stroke.tool === "text") {
    drawText(ctx, stroke);
    return;
  }

  if (stroke.tool === "rectangle" || stroke.tool === "circle" || stroke.tool === "line") {
    drawShape(ctx, stroke);
    return;
  }

  // pencil / eraser: array of points
  if (Array.isArray(stroke.points) && stroke.points.length > 1) {
    for (let i = 1; i < stroke.points.length; i += 1) {
      drawSegment(ctx, {
        tool: stroke.tool,
        color: stroke.color,
        brushSize: stroke.brushSize,
        x1: stroke.points[i - 1].x,
        y1: stroke.points[i - 1].y,
        x2: stroke.points[i].x,
        y2: stroke.points[i].y,
      });
    }
  }
}

export function generateStrokeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
