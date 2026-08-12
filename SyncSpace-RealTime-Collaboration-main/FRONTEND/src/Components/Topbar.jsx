import { Menu, Users, Plus, Share2 } from 'lucide-react';

export default function TopBar() {
  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-gray-100 rounded-md text-gray-600">
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-gray-800 text-lg">Engineering Team</h1>
          <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md text-xs font-medium text-gray-600">
            <Users size={14} />
            <span>4</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Plus size={16} /> Invite
        </button>
        
        <div className="flex -space-x-2">
          {['Aman', 'Priya', 'Rohit', 'Megha'].map((name, i) => (
            <img key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200" src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`} alt={name} />
          ))}
        </div>

        <div className="h-6 w-px bg-gray-300 mx-2"></div>

        <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          <Share2 size={16} /> Share
        </button>
        <button className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
          Leave Room
        </button>
      </div>
    </div>
  );
}