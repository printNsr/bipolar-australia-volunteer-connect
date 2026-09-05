import { useEffect, useRef, useCallback } from "react";

const W = 960;
const H = 620;

function drawStroke(ctx, s) {
  if (!s.points?.length) return;
  ctx.save();
  ctx.strokeStyle = s.color;
  ctx.lineWidth = s.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  s.points.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
  ctx.stroke();
  ctx.restore();
}

function drawCube(ctx, it) {
  const s = it.size * 3;
  const d = s * 0.4;
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.fillStyle = it.color;
  ctx.fillRect(0, 0, s, s);
  ctx.globalAlpha = 0.7;
  ctx.beginPath();
  ctx.moveTo(0, 0); ctx.lineTo(d, -d); ctx.lineTo(s + d, -d); ctx.lineTo(s, 0);
  ctx.closePath(); ctx.fill();
  ctx.globalAlpha = 0.45;
  ctx.beginPath();
  ctx.moveTo(s, 0); ctx.lineTo(s + d, -d); ctx.lineTo(s + d, s - d); ctx.lineTo(s, s);
  ctx.closePath(); ctx.fill();
  ctx.restore();
}

export default function CanvasBoard({ canvas, tool, color, size, sticker, onStroke, onItem, canEdit }) {
  const ref = useRef(null);
  const active = useRef(null);
  const images = useRef({});

  const redraw = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, W, H);
    (canvas?.strokes || []).forEach((s) => drawStroke(ctx, s));
    (canvas?.items || []).forEach((it) => {
      if (it.type === "text") {
        ctx.fillStyle = it.color;
        ctx.font = `${it.size * 2}px 'DM Sans', sans-serif`;
        ctx.fillText(it.text || "", it.x, it.y);
      } else if (it.type === "rect") {
        ctx.fillStyle = it.color;
        ctx.fillRect(it.x, it.y, it.size * 4, it.size * 3);
      } else if (it.type === "circle") {
        ctx.fillStyle = it.color;
        ctx.beginPath();
        ctx.arc(it.x, it.y, it.size * 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (it.type === "sticker") {
        ctx.font = `${it.size * 3}px sans-serif`;
        ctx.fillText(it.text || "✨", it.x, it.y);
      } else if (it.type === "cube") {
        drawCube(ctx, it);
      } else if (it.type === "image" && it.url) {
        let img = images.current[it.url];
        if (!img) {
          img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => redraw();
          img.src = it.url;
          images.current[it.url] = img;
        }
        if (img.complete && img.naturalWidth) {
          const w = it.size * 12;
          ctx.drawImage(img, it.x, it.y, w, (w * img.naturalHeight) / img.naturalWidth);
        }
      }
    });
    if (active.current) drawStroke(ctx, active.current);
  }, [canvas]);

  useEffect(() => { redraw(); }, [redraw]);

  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    return [((e.clientX - r.left) / r.width) * W, ((e.clientY - r.top) / r.height) * H];
  };

  const down = (e) => {
    if (!canEdit) return;
    const [x, y] = pos(e);
    if (tool === "brush" || tool === "eraser") {
      active.current = { points: [[x, y]], color: tool === "eraser" ? "#FFFFFF" : color, size: tool === "eraser" ? size * 2 : size };
      return;
    }
    if (tool === "text") {
      const text = window.prompt("Add text to the artwork");
      if (text) onItem({ type: "text", x, y, color, size, text });
      return;
    }
    if (tool === "sticker") { onItem({ type: "sticker", x, y, size, text: sticker }); return; }
    onItem({ type: tool, x, y, color, size });
  };

  const move = (e) => {
    if (!active.current) return;
    active.current.points.push(pos(e));
    redraw();
  };

  const up = () => {
    if (!active.current) return;
    const stroke = active.current;
    active.current = null;
    onStroke(stroke);
  };

  return (
    <canvas
      ref={ref}
      width={W}
      height={H}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      className="w-full touch-none rounded-lg border border-border bg-white shadow-sm"
      style={{ cursor: canEdit ? "crosshair" : "not-allowed" }}
    />
  );
}