import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { userService } from '../services/api';
import { motion } from 'framer-motion';
import { Calendar, Mail, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function UserDashboardPage() {
  const [profile, setProfile] = useState(null);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile(userId);
      setProfile(response.data);
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pastel-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-500">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-pastel-mint/5" data-testid="user-dashboard">
      <Sidebar isAdmin={false} />
      <div className="flex-1">
        <Navbar userName={userName} isAdmin={false} />
        <main className="w-full max-w-[1600px] mx-auto p-6 md:p-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="h-12 w-1.5 bg-gradient-to-b from-pastel-mint to-pastel-blue rounded-full" />
              <h1 className="text-5xl md:text-6xl font-bold text-slate-900" style={{ letterSpacing: '-0.03em' }}>
                Welcome back, {profile.name}! 👋
              </h1>
            </div>
            <p className="text-slate-500 text-lg ml-7">Here's your personalized account overview</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-slate-100/50 relative overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)' }}
              data-testid="account-overview-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/5 to-transparent pointer-events-none" />
              <h2 className="text-3xl font-bold text-slate-900 mb-8 relative z-10" style={{ letterSpacing: '-0.01em' }}>Account Overview</h2>
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-blue to-blue-200 flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Full Name</p>
                    <p className="text-lg font-medium text-slate-900">{profile.name}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-purple to-purple-200 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Email Address</p>
                    <p className="text-lg font-medium text-slate-900">{profile.email}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-mint to-green-200 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Account Role</p>
                    <p className="text-lg font-medium text-slate-900 capitalize">{profile.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-slate-100/50 relative overflow-hidden"
              style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)' }}
              data-testid="account-details-card"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pastel-mint/5 to-transparent pointer-events-none" />
              <h2 className="text-3xl font-bold text-slate-900 mb-8 relative z-10" style={{ letterSpacing: '-0.01em' }}>Account Details</h2>
              <div className="space-y-8 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-peach to-orange-200 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Member Since</p>
                    <p className="text-lg font-medium text-slate-900">
                      {new Date(profile.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pastel-blue to-blue-200 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 uppercase tracking-wider mb-1">Last Login</p>
                    <p className="text-lg font-medium text-slate-900">
                      {profile.last_login
                        ? new Date(profile.last_login).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-500 mb-2">Account Status</p>
                  <span className="inline-flex items-center px-4 py-2 rounded-full bg-pastel-mint text-slate-900 font-medium text-sm">
                    ✓ Active
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}
