
import { LayoutDashboard, FileText, Send,  AlertTriangle, LogOut, Crown } from 'lucide-react';
// import { LayoutDashboard, FileText, Send, BarChart2, AlertTriangle, LogOut, Crown } from 'lucide-react';

interface SidebarProps {
  activeItem?: string;
  onItemClick?: (item: string) => void;
}

const Sidebar = ({ activeItem = 'problems', onItemClick }: SidebarProps) => {
  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard
    },
    {
      id: 'problems',
      label: 'Problems',
      icon: FileText
    },
    {
      id: 'submissions',
      label: 'Submissions',
      icon: Send
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: AlertTriangle
    },
    {
      id: 'super-admin',
      label: 'Super Admin',
      icon: Crown
    }
  ];

  return (
    <div className="h-full bg-slate-900 w-64 flex flex-col border-r border-slate-800">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold text-white">Admin Panel</h1>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onItemClick?.(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                    isActive
                      ? 'bg-purple-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-slate-800">
        <button className="w-full flex items-center px-4 py-3 text-slate-300 hover:bg-slate-800 hover:text-white rounded-lg transition-colors">
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
