import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Home,
  BookOpen,
  FolderKanban,
  Newspaper,
  HeartHandshake,
  DollarSign,
  Users,
  MessageSquare,
  Image,
  FileText,
  UserCog,
  ShieldAlert,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Quote,
  Building2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { addToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    addToast('Logged out of admin dashboard', 'info');
    navigate('/admin/login');
  };

  const navSections = [
    {
      title: 'Core Management',
      items: [
        { name: 'Dashboard Overview', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      title: 'Content CMS',
      items: [
        { name: 'Homepage Banner & Stats', path: '/admin/homepage', icon: Home },
        { name: 'About & Mission', path: '/admin/about', icon: BookOpen },
        { name: 'Programs', path: '/admin/programs', icon: FolderKanban },
        { name: 'Projects', path: '/admin/projects', icon: FolderKanban },
        { name: 'News & Blog', path: '/admin/news', icon: Newspaper },
        { name: 'Impact Stories', path: '/admin/stories', icon: HeartHandshake },
        { name: 'Testimonials', path: '/admin/testimonials', icon: Quote },
        { name: 'Partners', path: '/admin/partners', icon: Building2 },
        { name: 'FAQ Manager', path: '/admin/faq', icon: HelpCircle },
      ],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Donations & Finance', path: '/admin/donations', icon: DollarSign },
        { name: 'Volunteer Applications', path: '/admin/volunteers', icon: Users },
        { name: 'Contact Messages', path: '/admin/messages', icon: MessageSquare },
        { name: 'Document Reports', path: '/admin/documents', icon: FileText },
      ],
    },
    {
      title: 'Media & System',
      items: [
        { name: 'Media Library', path: '/admin/media', icon: Image },
        { name: 'Administrator Users', path: '/admin/users', icon: UserCog, roles: ['SUPER_ADMIN'] },
        { name: 'Audit Logs', path: '/admin/audit-logs', icon: ShieldAlert, roles: ['SUPER_ADMIN'] },
        { name: 'Global Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex flex-col w-72 bg-slate-950 border-r border-slate-800 shrink-0 select-none">
        {/* Brand */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center font-black text-white text-lg shadow-md">
              HS
            </div>
            <div>
              <span className="block text-base font-extrabold text-white leading-none">ADMIN PORTAL</span>
              <span className="text-[11px] font-semibold text-teal-400 block mt-1">Hope Somalia Foundation</span>
            </div>
          </Link>
        </div>

        {/* User Info Card */}
        <div className="p-4 mx-4 my-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-3">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
            alt="Avatar"
            className="w-10 h-10 rounded-full object-cover border border-teal-500/50"
          />
          <div className="overflow-hidden">
            <h4 className="text-sm font-bold text-white truncate">{user?.fullName || 'Administrator'}</h4>
            <span className="inline-block px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-teal-950 text-teal-300 border border-teal-800/60 uppercase tracking-wider">
              {user?.role?.replace('_', ' ') || 'SUPER ADMIN'}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-6 custom-scrollbar">
          {navSections.map((sec, idx) => {
            const filteredItems = sec.items.filter((item) => !item.roles || item.roles.includes(user?.role));
            if (filteredItems.length === 0) return null;

            return (
              <div key={idx} className="space-y-1">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 block mb-1">
                  {sec.title}
                </span>
                {filteredItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active
                          ? 'bg-teal-600 text-white shadow-md shadow-teal-900/40'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                        <span>{item.name}</span>
                      </div>
                      {active && <ChevronRight className="w-3.5 h-3.5" />}
                    </Link>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-900 transition-colors"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-teal-400" />
              View Public Website
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </a>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:bg-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
              Hope Somalia NGO Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
              Public Site
            </a>
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                alt="Avatar"
                className="w-8 h-8 rounded-full object-cover border border-teal-500"
              />
              <span className="hidden md:inline text-xs font-semibold text-slate-200">{user?.fullName}</span>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-900 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative flex-1 max-w-xs w-full bg-slate-950 p-6 flex flex-col overflow-y-auto z-10">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <span className="font-extrabold text-white text-base">ADMIN NAVIGATION</span>
              <button onClick={() => setSidebarOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 space-y-6">
              {navSections.map((sec, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                    {sec.title}
                  </span>
                  {sec.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                          isActive(item.path) ? 'bg-teal-600 text-white' : 'text-slate-400 hover:bg-slate-900'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="pt-6 border-t border-slate-800 space-y-2">
              <button
                onClick={() => {
                  setSidebarOpen(false);
                  handleLogout();
                }}
                className="flex items-center gap-2 w-full px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/40"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
