import { useParams } from "react-router-dom";
import WhiteboardPane from "./WhiteboardPane";
import CodeEditorPane from "./CodeEditorPane";
import { Plus } from "lucide-react";

export default function Workspace() {
  const { roomId } = useParams();

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-200 gap-0.5">
      <WhiteboardPane roomId={roomId} />

      <div className="w-1 bg-gray-300 hover:bg-indigo-400 cursor-col-resize flex items-center justify-center relative group">
        <div className="absolute w-6 h-6 bg-indigo-600 rounded-full text-white flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Plus size={14} />
        </div>
      </div>

      <CodeEditorPane roomId={roomId} />
    </div>
  );
}