import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function UserLoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authService.login(formData);
      const { token, userId, role, name } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', name);

      toast.success(`Welcome back, ${name}!`);

      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else {
        navigate('/user-dashboard');
      }
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-pastel-blue to-pastel-purple mx-auto mb-4 flex items-center justify-center">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Welcome Back</h1>
            <p className="text-slate-500">Sign in to your account</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 border border-slate-100"
            style={{ boxShadow: '0 10px 30px rgba(167, 199, 231, 0.2)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="user-login-form">
              <div>
                <Label htmlFor="email" className="text-slate-700">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="email"
                    data-testid="user-login-email-input"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-blue focus:ring-4 focus:ring-pastel-blue/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">Password</Label>
                <div className="relative mt-2">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="password"
                    data-testid="user-login-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-blue focus:ring-4 focus:ring-pastel-blue/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <Button
                data-testid="user-login-submit-button"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-95 font-medium"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-slate-900 font-medium hover:underline" data-testid="register-link">
                  Create one
                </Link>
              </p>
              <p className="text-sm text-slate-500">
                <Link to="/admin-login" className="text-slate-900 font-medium hover:underline" data-testid="admin-login-link">
                  Admin Login
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-pastel-mint via-pastel-peach to-pastel-purple items-center justify-center p-8"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="text-center text-white max-w-md">
          <h2 className="text-5xl font-bold mb-4">Hello Again!</h2>
          <p className="text-xl opacity-90">Access your dashboard and manage everything in one place</p>
        </div>
      </div>
    </div>
  );
}
