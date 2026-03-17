import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { ShieldCheck, Mail, Lock } from 'lucide-react';

export default function AdminLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const { token, userId, role, name } = response.data;

      if (role !== 'admin') {
        toast.error('Access denied. Admin credentials required.');
        setLoading(false);
        return;
      }

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', name);

      toast.success(`Welcome back, ${name}!`);
      navigate('/admin-dashboard');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pastel-purple to-pastel-blue mx-auto mb-4 flex items-center justify-center">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Portal</h1>
            <p className="text-slate-500">Secure administrator access</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 border border-slate-100"
            style={{ boxShadow: '0 10px 30px rgba(205, 180, 219, 0.2)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="admin-login-form">
              <div>
                <Label htmlFor="admin-email" className="text-slate-700">Admin Email</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="admin-email"
                    data-testid="admin-login-email-input"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-purple focus:ring-4 focus:ring-pastel-purple/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="admin-password" className="text-slate-700">Admin Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="admin-password"
                    data-testid="admin-login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-purple focus:ring-4 focus:ring-pastel-purple/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <Button
                data-testid="admin-login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-95 font-medium"
              >
                {loading ? 'Signing in...' : 'Admin Sign In'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              <Link to="/login" className="text-slate-900 font-medium hover:underline" data-testid="user-login-link">
                User Login
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700 items-center justify-center p-8"
      >
        <div className="text-center text-white max-w-md">
          <ShieldCheck className="w-24 h-24 mx-auto mb-6 opacity-80" />
          <h2 className="text-5xl font-bold mb-4">Admin Access</h2>
          <p className="text-xl opacity-80">Manage users, analytics, and system settings</p>
        </div>
      </div>
    </div>
  );
}
