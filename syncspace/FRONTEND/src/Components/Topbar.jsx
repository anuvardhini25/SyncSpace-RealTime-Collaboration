import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Users, Link as LinkIcon, Check, Wifi, WifiOff, History } from "lucide-react";
import { disconnectSocket } from "../socket";

export default function TopBar({ room, users = [], connected, onOpenReplay }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const roomName = room?.name || "Untitled Room";
  const roomCode = room?.roomCode;

  const handleCopyInvite = async () => {
    if (!roomCode) return;
    const inviteLink = `${window.location.origin}/join/${roomCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail (e.g. insecure context) - fall back silently.
    }
  };

  const handleLeaveRoom = () => {
    disconnectSocket();
    navigate("/");
  };

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-gray-800 text-lg">{roomName}</h1>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium text-gray-600">
            <Users size={14} />
            <span>{users.length}</span>
          </div>
          <div
            className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              connected ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
            }`}
            title={connected ? "Connected" : "Disconnected - reconnecting..."}
          >
            {connected ? <Wifi size={13} /> : <WifiOff size={13} />}
            <span>{connected ? "Connected" : "Reconnecting"}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {users.slice(0, 5).map((u) => (
            <img
              key={u.socketId}
              className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${u.name || u.socketId}`}
              alt={u.name}
              title={u.name}
            />
          ))}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button
          onClick={onOpenReplay}
          title="Replay this session"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          <History size={16} />
          Replay
        </button>

        <button
          onClick={handleCopyInvite}
          disabled={!roomCode}
          className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition disabled:opacity-50 shadow-sm shadow-violet-600/20"
        >
          {copied ? <Check size={16} /> : <LinkIcon size={16} />}
          {copied ? "Copied!" : "Copy Invite Link"}
        </button>
        <button
          onClick={handleLeaveRoom}
          className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
