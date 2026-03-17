import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Activity, UserCircle, Menu, X, Layers } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ isAdmin }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard', testId: 'sidebar-admin-dashboard' },
    { to: '/user-management', icon: Users, label: 'User Management', testId: 'sidebar-user-management' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', testId: 'sidebar-analytics' },
    { to: '/recent-activity', icon: Activity, label: 'Activity Logs', testId: 'sidebar-recent-activity' },
  ];

  const userLinks = [
    { to: '/user-dashboard', icon: LayoutDashboard, label: 'Dashboard', testId: 'sidebar-user-dashboard' },
    { to: '/user-profile', icon: UserCircle, label: 'My Profile', testId: 'sidebar-user-profile' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const SidebarContent = () => (
    <div className="flex flex-col gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            data-testid={link.testId}
            onClick={() => setIsMobileMenuOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
              isActive
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
            <span className="text-sm">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        data-testid="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 bg-white p-3 rounded-lg shadow-md border border-slate-200"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -10, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden lg:block w-64 bg-white border-r border-slate-200 p-6 min-h-screen"
      >
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">AdminHub</h1>
          </div>
          <p className="text-xs text-slate-500 ml-11">Management Platform</p>
        </div>
        <SidebarContent />
      </motion.aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 30 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-64 bg-white z-50 p-6 overflow-y-auto shadow-xl border-r border-slate-200"
            >
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <Layers className="w-4 h-4 text-white" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-xl font-bold text-slate-900">AdminHub</h1>
                </div>
                <p className="text-xs text-slate-500 ml-11">Management Platform</p>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
