import { Outlet, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, Info, Tag, Quote, Navigation } from 'lucide-react';
import authService from '../services/authService';

export default function AdminLayout() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin/dashboard' },
    { label: 'Projects', icon: <FolderKanban size={20} />, path: '/admin/projects' },
    { label: 'Services', icon: <Info size={20} />, path: '/admin/services' },
    { label: 'Pricing', icon: <Tag size={20} />, path: '/admin/pricing' },
    { label: 'Testimonials', icon: <Quote size={20} />, path: '/admin/testimonials' },
    { label: 'Inquiries', icon: <MessageSquare size={20} />, path: '/admin/inquiries' },
    { label: 'Routes', icon: <Navigation size={20} />, path: '/admin/route-management' },
    { label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' },
  ];

  return (
    <div className="flex min-h-screen bg-background font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-line fixed h-full z-20 hidden md:block">
        <div className="p-8">
          <h2 className="text-xl font-display font-bold text-primary tracking-tight">Studio Admin</h2>
        </div>
        
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-secondary hover:text-primary hover:bg-background transition-all group"
            >
              <span className="group-hover:text-accent transition-colors">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 w-full px-4">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-500/10 w-full transition-all"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow md:ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold text-primary">Welcome, {user?.fullName || 'Admin'}</h1>
              <p className="text-secondary">Manage your studio execution from here.</p>
            </div>
            <div className="flex items-center gap-4">
               <button className="md:hidden p-2 rounded-xl bg-surface border border-line text-secondary">
                 <LayoutDashboard size={24} />
               </button>
            </div>
          </header>
          
          <div className="bg-surface/50 border border-line rounded-3xl p-8 min-h-[600px] backdrop-blur-sm shadow-xl">
             <Outlet />
          </div>
        </div>
      </main>
    </div>
  );
}
