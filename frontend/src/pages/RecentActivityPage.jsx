import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { userService } from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Activity, User as UserIcon, Clock } from 'lucide-react';

export default function RecentActivityPage() {
  const [users, setUsers] = useState([]);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await userService.getAll();
      const sortedUsers = response.data.sort((a, b) => {
        const dateA = a.last_login ? new Date(a.last_login) : new Date(0);
        const dateB = b.last_login ? new Date(b.last_login) : new Date(0);
        return dateB - dateA;
      });
      setUsers(sortedUsers);
    } catch (error) {
      toast.error('Failed to fetch activity data');
    }
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  return (
    <div className="min-h-screen flex" data-testid="recent-activity-page">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <Navbar userName={userName} isAdmin={true} />
        <main className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Recent Activity</h1>
            <p className="text-slate-500">Track user logins and activities</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
          >
            <div className="p-6">
              <div className="space-y-4">
                {users.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                    data-testid={`activity-item-${user.id}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple flex items-center justify-center">
                        <UserIcon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                        <p className="text-sm text-slate-500">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-900 flex items-center gap-2">
                          <Activity className="w-4 h-4 text-pastel-mint" />
                          {user.last_login ? 'Active' : 'Inactive'}
                        </p>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                          <Clock className="w-3 h-3" />
                          {getTimeAgo(user.last_login)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          user.role === 'admin'
                            ? 'bg-pastel-purple text-slate-900'
                            : 'bg-pastel-blue text-slate-900'
                        }`}
                      >
                        {user.role}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
