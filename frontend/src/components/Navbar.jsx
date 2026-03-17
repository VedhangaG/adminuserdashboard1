import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, User } from 'lucide-react';
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
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="bg-white border-b border-slate-100 sticky top-0 z-50"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-4 md:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{userName}</h2>
              <p className="text-xs text-slate-500">{isAdmin ? 'Administrator' : 'User'}</p>
            </div>
          </div>
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-full px-6 shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};
