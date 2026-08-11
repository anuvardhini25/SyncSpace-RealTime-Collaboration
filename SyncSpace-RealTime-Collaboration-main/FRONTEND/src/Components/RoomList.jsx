import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Plus, LogIn, LogOut, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createRoom, joinRoomByCode, getMyRooms } from '../api/roomService';

export default function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const loadRooms = async () => {
    try {
      const data = await getMyRooms();
      setRooms(data.rooms);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load rooms');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const data = await createRoom(roomName.trim());
      setRoomName('');
      navigate(`/workspace/${data.room._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (!joinCode.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      const data = await joinRoomByCode(joinCode.trim().toUpperCase());
      setJoinCode('');
      navigate(`/workspace/${data.room._id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join room');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-md">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900">SyncSpace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {error && (
          <div className="mb-6 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <form
            onSubmit={handleCreateRoom}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
          >
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Plus size={18} className="text-indigo-600" /> Create a Room
            </h3>
            <input
              type="text"
              placeholder="Room name (e.g. Engineering Team)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              Create Room
            </button>
          </form>

          <form
            onSubmit={handleJoinRoom}
            className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4"
          >
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <LogIn size={18} className="text-indigo-600" /> Join a Room
            </h3>
            <input
              type="text"
              placeholder="Enter room code (e.g. AB12CD)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="block w-full rounded-lg border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm uppercase"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
            >
              Join Room
            </button>
          </form>
        </div>

        <h3 className="font-semibold text-gray-900 mb-4">Your Rooms</h3>

        {loadingRooms ? (
          <p className="text-sm text-gray-500">Loading rooms...</p>
        ) : rooms.length === 0 ? (
          <p className="text-sm text-gray-500">
            You haven't joined any rooms yet. Create or join one above.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <button
                key={room._id}
                onClick={() => navigate(`/workspace/${room._id}`)}
                className="text-left bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
              >
                <div className="font-semibold text-gray-900">{room.name}</div>
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <Users size={12} /> {room.members?.length || 0} member(s)
                </div>
                <div className="mt-2 inline-block text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {room.roomCode}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}