import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, BarChart3, Activity, UserCircle, Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const Sidebar = ({ isAdmin }) => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminLinks = [
    { to: '/admin-dashboard', icon: LayoutDashboard, label: 'Dashboard', testId: 'sidebar-admin-dashboard' },
    { to: '/user-management', icon: Users, label: 'User Management', testId: 'sidebar-user-management' },
    { to: '/analytics', icon: BarChart3, label: 'Analytics', testId: 'sidebar-analytics' },
    { to: '/recent-activity', icon: Activity, label: 'Recent Activity', testId: 'sidebar-recent-activity' },
  ];

  const userLinks = [
    { to: '/user-dashboard', icon: LayoutDashboard, label: 'Dashboard', testId: 'sidebar-user-dashboard' },
    { to: '/user-profile', icon: UserCircle, label: 'Profile', testId: 'sidebar-user-profile' },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  const SidebarContent = () => (
    <div className="flex flex-col gap-3">
      {links.map((link) => {
        const Icon = link.icon;
        const isActive = location.pathname === link.to;
        return (
          <Link
            key={link.to}
            to={link.to}
            data-testid={link.testId}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-semibold transition-all relative overflow-hidden group ${
                isActive
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/30'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-slate-900 rounded-2xl"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon className={`w-5 h-5 relative z-10 ${
                isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'
              }`} strokeWidth={2.5} />
              <span className="relative z-10">{link.label}</span>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="ml-auto w-2 h-2 bg-green-400 rounded-full relative z-10"
                />
              )}
            </motion.div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        data-testid="mobile-menu-toggle"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-24 left-6 z-50 bg-white p-4 rounded-2xl shadow-lg ring-1 ring-slate-100"
      >
        {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </motion.button>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="hidden lg:block w-80 bg-white/50 backdrop-blur-xl border-r border-slate-100/50 p-8 min-h-screen"
        style={{ boxShadow: '1px 0 3px rgba(0,0,0,0.02)' }}
      >
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center shadow-lg">
              <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold text-slate-900" style={{ letterSpacing: '-0.02em' }}>Admin Hub</h1>
          </div>
          <p className="text-sm text-slate-500 font-medium ml-13">Management Portal</p>
          <div className="h-1 w-20 bg-gradient-to-r from-pastel-blue to-pastel-purple rounded-full mt-3 ml-13" />
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
              className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white z-50 p-8 overflow-y-auto shadow-2xl"
            >
              <div className="mb-10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center shadow-lg">
                    <Sparkles className="w-5 h-5 text-white" strokeWidth={2.5} />
                  </div>
                  <h1 className="text-3xl font-bold text-slate-900" style={{ letterSpacing: '-0.02em' }}>Admin Hub</h1>
                </div>
                <p className="text-sm text-slate-500 font-medium ml-13">Management Portal</p>
                <div className="h-1 w-20 bg-gradient-to-r from-pastel-blue to-pastel-purple rounded-full mt-3 ml-13" />
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
