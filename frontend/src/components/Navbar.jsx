import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { LogOut, User, ChevronDown } from 'lucide-react';
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
      className="bg-white/80 backdrop-blur-xl border-b border-slate-100/50 sticky top-0 z-50"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}
    >
      <div className="w-full max-w-[1600px] mx-auto px-6 md:px-10 py-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-mint flex items-center justify-center shadow-lg ring-4 ring-pastel-blue/10"
            >
              <User className="w-6 h-6 text-white" strokeWidth={2.5} />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white" />
            </motion.div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{userName}</h2>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  isAdmin ? 'bg-pastel-purple/20 text-purple-700' : 'bg-pastel-blue/20 text-blue-700'
                }`}>
                  {isAdmin ? 'Administrator' : 'User'}
                </span>
              </div>
            </div>
          </div>
          <Button
            data-testid="logout-button"
            onClick={handleLogout}
            className="bg-slate-900 text-white hover:bg-slate-800 rounded-2xl px-8 py-6 font-semibold shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all hover:scale-105 active:scale-95"
          >
            <LogOut className="w-4 h-4 mr-2" strokeWidth={2.5} />
            Sign Out
          </Button>
        </div>
      </div>
    </motion.nav>
  );
};
