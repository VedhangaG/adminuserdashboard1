import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { userService } from '../services/api';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Save, Mail, User as UserIcon } from 'lucide-react';

export default function UserProfilePage() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await userService.getProfile(userId);
      setProfile(response.data);
      setFormData({ name: response.data.name, email: response.data.email });
    } catch (error) {
      toast.error('Failed to fetch profile');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await userService.updateProfile(userId, formData);
      localStorage.setItem('userName', formData.name);
      toast.success('Profile updated successfully!');
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setLoading(false);
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
    <div className="min-h-screen flex" data-testid="user-profile-page">
      <Sidebar isAdmin={false} />
      <div className="flex-1">
        <Navbar userName={userName} isAdmin={false} />
        <main className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">My Profile</h1>
            <p className="text-slate-500">Manage your account information</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl bg-white rounded-2xl p-8 border border-slate-100"
            style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-6" data-testid="profile-form">
              <div>
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <div className="relative mt-2">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    data-testid="profile-name-input"
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-blue focus:ring-4 focus:ring-pastel-blue/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    data-testid="profile-email-input"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-blue focus:ring-4 focus:ring-pastel-blue/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button
                  data-testid="profile-save-button"
                  type="submit"
                  disabled={loading}
                  className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-95 font-medium"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Account ID:</span>
                  <span className="text-slate-900 font-medium">{profile.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Member Since:</span>
                  <span className="text-slate-900 font-medium">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account Role:</span>
                  <span className="text-slate-900 font-medium capitalize">{profile.role}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
