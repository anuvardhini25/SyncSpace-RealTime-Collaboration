import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Workspace from "./Workspace";
import ReplayPanel from "./ReplayPanel";
import useRoomPresence from "../hooks/useRoomPresence";
import { getRoomById } from "../api/roomService";

export default function WorkspaceLayout() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [replayOpen, setReplayOpen] = useState(false);

  const { users, connected, notifications } = useRoomPresence(roomId);

  useEffect(() => {
    let cancelled = false;

    if (!roomId) return undefined;

    getRoomById(roomId)
      .then((data) => {
        if (!cancelled) setRoom(data.room);
      })
      .catch(() => {
        // Topbar falls back to a generic label if the room can't be fetched
        if (!cancelled) setRoom(null);
      });

    return () => {
      cancelled = true;
    };
  }, [roomId]);

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
      <Sidebar activeRoomId={roomId} />
      <div className="flex flex-1 flex-col h-full w-full relative">
        <Topbar room={room} users={users} connected={connected} onOpenReplay={() => setReplayOpen(true)} />
        <Workspace />

        {replayOpen && <ReplayPanel roomId={roomId} onClose={() => setReplayOpen(false)} />}

        {/* Join/leave toast notifications */}
        <div className="absolute top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-gray-900 text-white text-sm px-4 py-2 rounded-lg shadow-lg animate-[fadeIn_0.2s_ease-out]"
            >
              {n.message}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
