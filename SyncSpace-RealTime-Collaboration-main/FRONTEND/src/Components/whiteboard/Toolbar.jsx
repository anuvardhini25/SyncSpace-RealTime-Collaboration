export default function Toolbar({
  setTool,
  setColor,
  setBrushSize,
  clearCanvas,
  undo,
  redo,
  downloadCanvas,
}) {
  return (
    <div className="flex items-center gap-3 p-3 bg-gray-200 border-b">

      <button
  onClick={() => {
    console.log("Pencil selected");
    setTool("pencil");
  }}
  className="px-3 py-1 bg-blue-500 text-white rounded"
>
  ✏ Pencil
</button>

      <button
        onClick={() => setTool("eraser")}
        className="px-3 py-1 bg-red-500 text-white rounded"
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