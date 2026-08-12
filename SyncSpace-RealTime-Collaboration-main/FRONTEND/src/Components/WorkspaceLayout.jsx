import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Workspace from './Workspace';

export default function WorkspaceLayout() {
  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-1 flex-col h-full w-full">
        <Topbar />
        <Workspace />
      </div>
    </div>
  );
}