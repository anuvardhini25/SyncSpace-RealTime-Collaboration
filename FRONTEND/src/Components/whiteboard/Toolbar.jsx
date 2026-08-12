export default function Toolbar({
  setTool,
  setColor,
  setBrushSize,
  clearCanvas,
  undo,
  redo,
  downloadCanvas,
  connected,
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-200 border-b shadow-sm flex-wrap">

      <span
        className={`flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded ${
          connected ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
        }`}
        title={connected ? "Connected - drawing is syncing live" : "Disconnected - reconnecting..."}
      >
        <span className={`w-2 h-2 rounded-full ${connected ? "bg-green-500" : "bg-red-500"}`} />
        {connected ? "Live" : "Offline"}
      </span>

      <button
  onClick={() => {
    console.log("Pencil selected");
    setTool("pencil");
  }}
  title="Draw with pencil"
  className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
>
  ✏ Pencil
</button>
      <button
        onClick={() => setTool("eraser")}
        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        🧽 Eraser
      </button>

      <input
        type="color"
        defaultValue="#000000"
        onChange={(e) => setColor(e.target.value)}
      />

      <input
        type="range"
        min="1"
        max="20"
        defaultValue="3"
        onChange={(e) => setBrushSize(Number(e.target.value))}
      />

      <button
        onClick={clearCanvas}
        className="px-3 py-1 bg-green-500 text-white rounded"
      >
        🗑 Clear
      </button>

      <button
  onClick={undo}
  className="px-3 py-1 bg-yellow-500 text-white rounded"
>
  ↩ Undo
</button>

<button
  onClick={redo}
  className="px-3 py-1 bg-indigo-500 text-white rounded"
>
  ↪ Redo
</button>

      <button
  onClick={() => setTool("rectangle")}
  className="px-3 py-1 bg-purple-500 text-white rounded"
>
  ⬜ Rectangle
</button>

<button
  onClick={() => {
    console.log("Circle selected");
    setTool("circle");
  }}
  className="px-3 py-1 bg-pink-500 text-white rounded"
>
  ⭕ Circle
</button>

<button
  onClick={() => setTool("line")}
  className="px-3 py-1 bg-yellow-500 text-white rounded"
>
  📏 Line
</button>

<button
  onClick={() => setTool("text")}
  className="px-3 py-1 bg-orange-500 text-white rounded"
>
  📝 Text
</button>

<button
  onClick={downloadCanvas}
  className="px-3 py-1 bg-cyan-600 text-white rounded"
>
  📥 Download
</button>

    </div>
  );
}