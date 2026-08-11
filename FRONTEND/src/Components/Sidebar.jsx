import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getMyRooms } from '../api/roomService';

export default function Sidebar({ activeRoomId }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    let cancelled = false;

    getMyRooms()
      .then((data) => {
        if (!cancelled) setRooms(data.rooms || []);
      })
      .catch(() => {
        if (!cancelled) setRooms([]);
      });

    return () => {
      cancelled = true;
    };
    // Re-fetch whenever we navigate into a different room, so a room
    // created elsewhere shows up here without a full page reload.
  }, [activeRoomId]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-72 bg-[#111827] text-gray-300 flex flex-col justify-between h-full border-r border-gray-800">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center px-6 py-6 border-b border-gray-800">
          <div className="bg-indigo-600 p-1.5 rounded-md mr-3">
            <LayoutDashboard size={18} className="text-white" />
          </div>

          <span className="text-white font-bold text-lg tracking-wide">
            SyncSpace
          </span>
        </div>

        <div className="px-5 py-7">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="All Rooms"
            onClick={() => navigate('/')}
          />

          <div className="mt-8 mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Your Rooms
          </div>

          <div className="space-y-1">
            {rooms.length === 0 && (
              <p className="px-3 text-xs text-gray-500">
                No rooms yet
              </p>
            )}

            {rooms.map((room) => (
              <NavItem
                key={room._id}
                icon={<Users size={18} />}
                label={room.name}
                active={room._id === activeRoomId}
                onClick={() => navigate(`/workspace/${room._id}`)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${
                    user?.name || 'User'
                  }`}
                  alt="User"
                />
              </div>

              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111827] rounded-full"></div>
            </div>

            <div>
              <div className="text-sm font-medium text-white">
                {user?.name}
              </div>

              <div className="text-xs text-gray-500">
                Online
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-gray-500 hover:text-red-400 transition-colors"
            title="Logout"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors truncate ${
        active
          ? 'bg-indigo-600/10 text-indigo-400'
          : 'hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}

      <span className="text-sm font-medium truncate">
        {label}
      </span>
    </div>
  );
}
