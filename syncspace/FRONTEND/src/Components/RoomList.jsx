import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Plus,
  LogIn,
  LogOut,
  Users,
  Link as LinkIcon,
  Check,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { createRoom, joinRoomByCode, getMyRooms } from '../api/roomService';

function CopyInviteButton({ roomCode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (!roomCode) return;
    const inviteLink = `${window.location.origin}/join/${roomCode}`;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can fail silently in insecure contexts.
    }
  };

  return (
    <button
      onClick={handleCopy}
      title="Copy invitation link"
      className="inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700"
    >
      {copied ? <Check size={12} /> : <LinkIcon size={12} />}
      {copied ? 'Copied' : 'Copy link'}
    </button>
  );
}

const AVATAR_GRADIENTS = [
  'from-violet-500 to-indigo-500',
  'from-sky-500 to-cyan-400',
  'from-amber-500 to-orange-500',
  'from-emerald-500 to-teal-500',
  'from-pink-500 to-rose-500',
  'from-indigo-500 to-blue-500',
];

function gradientForRoom(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return AVATAR_GRADIENTS[hash % AVATAR_GRADIENTS.length];
}

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
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Top nav */}
      <div className="bg-white/80 backdrop-blur border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-2 rounded-xl shadow-sm shadow-violet-600/20">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="font-bold text-lg text-slate-900 tracking-tight">SyncSpace</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-2 text-sm text-slate-600">
            <span className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-white text-xs font-bold flex items-center justify-center">
              {(user?.name || '?').charAt(0).toUpperCase()}
            </span>
            {user?.name}
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-red-600 transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden bg-[#0b0d3d]">
        <div className="absolute -left-24 -top-24 w-96 h-96 bg-violet-600/30 rounded-full blur-3xl" />
        <div className="absolute right-0 -bottom-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
        <div className="relative max-w-5xl mx-auto px-6 py-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-violet-300 text-xs font-medium mb-5">
            <Sparkles size={13} /> Real-time whiteboard & code editor
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
          </h1>
          <p className="mt-3 text-slate-300 max-w-xl">
            Jump into a room to keep collaborating, or spin up a new workspace for your team in seconds.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 pb-14">
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 px-4 py-2.5 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-12">
          <form
            onSubmit={handleCreateRoom}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-100 flex items-center justify-center shrink-0">
                <Plus size={18} className="text-violet-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Create a room</h3>
                <p className="text-xs text-slate-500">Start a fresh collaborative workspace</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Room name (e.g. Engineering Team)"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm transition"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:brightness-110 text-white px-4 py-3 rounded-xl text-sm font-semibold shadow-md shadow-violet-600/20 transition disabled:opacity-60"
            >
              Create Room <ArrowRight size={15} />
            </button>
          </form>

          <form
            onSubmit={handleJoinRoom}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-lg shadow-slate-200/50 space-y-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                <LogIn size={18} className="text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">Join a room</h3>
                <p className="text-xs text-slate-500">Have an invite code? Drop it in here</p>
              </div>
            </div>
            <input
              type="text"
              placeholder="Enter room code (e.g. AB12CD)"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 px-4 py-3 placeholder-slate-400 focus:border-violet-500 focus:outline-none focus:ring-4 focus:ring-violet-500/10 sm:text-sm uppercase tracking-wider transition"
            />
            <button
              type="submit"
              disabled={submitting}
              className="w-full flex items-center justify-center gap-2 border border-slate-200 hover:bg-slate-50 text-slate-700 px-4 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60"
            >
              Join Room
            </button>
          </form>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-900">Your rooms</h3>
          {!loadingRooms && rooms.length > 0 && (
            <span className="text-xs text-slate-500">{rooms.length} room{rooms.length === 1 ? '' : 's'}</span>
          )}
        </div>

        {loadingRooms ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-32 rounded-2xl border border-slate-200 bg-white animate-pulse" />
            ))}
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white/60 px-6 py-14 text-center">
            <div className="w-12 h-12 mx-auto rounded-xl bg-violet-100 flex items-center justify-center mb-4">
              <Users size={20} className="text-violet-600" />
            </div>
            <p className="text-sm font-medium text-slate-700">You haven't joined any rooms yet</p>
            <p className="text-sm text-slate-500 mt-1">Create one above, or join with a code from a teammate.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <button
                key={room._id}
                onClick={() => navigate(`/workspace/${room._id}`)}
                className="text-left bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 hover:border-violet-300 hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradientForRoom(room._id)} flex items-center justify-center text-white font-bold mb-3`}>
                  {(room.name || '?').charAt(0).toUpperCase()}
                </div>
                <div className="font-semibold text-slate-900 truncate">{room.name}</div>
                <div className="mt-1 text-xs text-slate-500 flex items-center gap-1">
                  <Users size={12} /> {room.members?.length || 0} member(s)
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="inline-block text-xs font-mono bg-slate-100 px-2 py-1 rounded-md text-slate-600 tracking-wider">
                    {room.roomCode}
                  </span>
                  <CopyInviteButton roomCode={room.roomCode} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
