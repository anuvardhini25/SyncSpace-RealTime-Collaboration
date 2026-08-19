import DrawingCanvas from "./whiteboard/DrawingCanvas";

export default function WhiteboardPane({ roomId }) {
  return (
    <div className="flex-1 bg-white flex flex-col relative">
      {/* Header */}
      <div className="h-10 border-b border-gray-200 flex items-center px-4 shrink-0">
        <span className="text-sm font-semibold text-gray-700">
          Whiteboard
        </span>
      </div>

      {/* Whiteboard */}
      <div
        className="flex-1 relative overflow-hidden bg-white"
        style={{
          backgroundImage:
            "radial-gradient(#e5e7eb 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <DrawingCanvas roomId={roomId} />
      </div>
    </div>
  );
}