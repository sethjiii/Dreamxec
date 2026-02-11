import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StarDecoration } from './icons';
// --- Icons ---
const Icons = {
  Dashboard: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>
  ),
  Users: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
  ),
  Clubs: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18v-8a2 2 0 0 0-2-2h-2.5l-3.5-6-3.5 6H5a2 2 0 0 0-2 2v8z" /></svg>
  ),
  Verify: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
  ),
  Referrals: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
  ),
  Logout: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
  ),
  ChevronLeft: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6" /></svg>
  ),
  ChevronRight: ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6" /></svg>
  ),
};

export default function AdminSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { label: 'Command Center', path: '/admin/dashboard', icon: <Icons.Dashboard /> },
    { label: 'User Management', path: '/admin/users', icon: <Icons.Users /> },
    { label: 'Club Management', path: '/admin/clubs', icon: <Icons.Clubs /> },
    { label: 'Verifications', path: '/admin/verifications', icon: <Icons.Verify /> },
    { label: 'Referrals', path: '/admin/referrals', icon: <Icons.Referrals /> },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <aside 
      className={`bg-dreamxec-navy min-h-screen sticky top-0 z-50 flex flex-col border-r-4 border-dreamxec-orange shadow-2xl transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}
    >
      {/* Header / Logo */}
      <div className={`p-6 border-b border-white/10 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
        <StarDecoration className="w-8 h-8 flex-shrink-0" color="#FF7F00" />
        {!isCollapsed && (
          <div className="overflow-hidden whitespace-nowrap">
            <h1 className="text-2xl font-bold text-dreamxec-orange font-display tracking-wide">Admin</h1>
            <p className="text-xs text-dreamxec-cream/70 font-sans tracking-widest uppercase">Console</p>
          </div>
        )}
      </div>

      {/* Toggle Button */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-20 bg-dreamxec-orange text-white p-1 rounded-full border-2 border-dreamxec-navy shadow-md hover:scale-110 transition-transform z-50"
      >
        {isCollapsed ? <Icons.ChevronRight className="w-4 h-4" /> : <Icons.ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Navigation Links */}
      <nav className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            title={isCollapsed ? item.label : ''}
            className={`w-full flex items-center rounded-xl transition-all duration-200 group relative overflow-hidden ${
              isCollapsed ? 'justify-center p-3' : 'gap-4 px-4 py-3'
            } ${
              isActive(item.path)
                ? 'bg-dreamxec-orange text-white shadow-lg'
                : 'text-dreamxec-cream hover:bg-white/10'
            }`}
          >
            <span className={`transition-colors flex-shrink-0 ${isActive(item.path) ? 'text-white' : 'text-dreamxec-orange group-hover:text-white'}`}>
              {React.cloneElement(item.icon as any, { className: "w-6 h-6" })}
            </span>
            
            {!isCollapsed && (
              <span className="font-bold font-display tracking-wide text-sm whitespace-nowrap">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/10">
        <button 
          className={`w-full flex items-center rounded-lg border-2 border-red-500/50 text-red-300 hover:bg-red-500/20 hover:text-white transition-all font-bold text-sm ${
            isCollapsed ? 'justify-center p-3' : 'justify-center gap-2 px-4 py-3'
          }`}
        >
          <Icons.Logout className="w-5 h-5" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}