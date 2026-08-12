import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, MessageSquare, PenTool, Calendar, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-[#111827] text-gray-300 flex flex-col justify-between h-full border-r border-gray-800">
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center px-6 py-5 border-b border-gray-800">
          <div className="bg-indigo-600 p-1.5 rounded-md mr-3">
            <LayoutDashboard size={18} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-wide">SyncSpace</span>
        </div>

        <div className="px-4 py-6">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="All Rooms"
            onClick={() => navigate('/rooms')}
          />

          <div className="mt-8 mb-4 px-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Rooms
          </div>

          <div className="space-y-1">
            <NavItem icon={<Users size={18} />} label="Engineering Team" active />
            <NavItem icon={<MessageSquare size={18} />} label="Backend Discussion" />
            <NavItem icon={<PenTool size={18} />} label="UI/UX Planning" />
            <NavItem icon={<Calendar size={18} />} label="Interview Room A" />
          </div>
        </div>
      </div>

      <div className="shrink-0 border-t border-gray-800">
        <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-800 transition-colors">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-8 h-8 bg-gray-600 rounded-full overflow-hidden">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || 'User'}`}
                  alt="User"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#111827] rounded-full"></div>
            </div>
            <div>
              <div className="text-sm font-medium text-white">{user?.name}</div>
              <div className="text-xs text-gray-500">Online</div>
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
      className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors ${
        active ? 'bg-indigo-600/10 text-indigo-400' : 'hover:bg-gray-800 hover:text-white'
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </div>
  );
}