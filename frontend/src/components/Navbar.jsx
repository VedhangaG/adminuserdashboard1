import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, Bell, Search, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = ({ userName, isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-slate-200 sticky top-0 z-50"
      style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-semibold text-sm">
                {userName?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">{userName}</h2>
                <p className="text-xs text-slate-500">{isAdmin ? 'Administrator' : 'User Account'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <Button
              data-testid="logout-button"
              onClick={handleLogout}
              variant="ghost"
              className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};
