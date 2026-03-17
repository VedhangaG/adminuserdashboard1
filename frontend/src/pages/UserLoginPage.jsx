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
    <div className="min-h-screen flex bg-gradient-to-br from-slate-50 via-white to-pastel-blue/10">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center mb-10"
          >
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-mint mx-auto mb-6 flex items-center justify-center shadow-xl ring-4 ring-pastel-blue/20"
            >
              <LogIn className="w-10 h-10 text-white" strokeWidth={2.5} />
            </motion.div>
            <h1 className="text-5xl font-bold text-slate-900 mb-3" style={{ letterSpacing: '-0.02em' }}>Welcome Back</h1>
            <p className="text-slate-500 text-lg">Sign in to continue your journey</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-10 border border-slate-100/50 relative overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(167, 199, 231, 0.15), 0 2px 8px rgba(0,0,0,0.04)' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-pastel-blue/5 to-transparent pointer-events-none" />
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10" data-testid="user-login-form">
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
                className="w-full h-14 bg-slate-900 text-white hover:bg-slate-800 rounded-2xl shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 transition-all hover:scale-105 active:scale-95 font-bold text-base"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-8 text-center space-y-4 relative z-10">
              <p className="text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/register" className="text-slate-900 font-bold hover:underline" data-testid="register-link">
                  Create one
                </Link>
              </p>
              <p className="text-sm text-slate-500">
                <Link to="/admin-login" className="text-slate-900 font-bold hover:underline" data-testid="admin-login-link">
                  Admin Login →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="hidden lg:flex flex-1 items-center justify-center p-12 relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #A7C7E7 0%, #CDB4DB 50%, #B7E4C7 100%)'
        }}
      >
        <div className="absolute inset-0 opacity-30" 
          style={{ 
            backgroundImage: 'url(https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop)', 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            filter: 'blur(2px)'
          }} 
        />
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="text-center text-white max-w-md relative z-10"
        >
          <h2 className="text-6xl font-bold mb-6" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.1)' }}>
            Hello Again!
          </h2>
          <p className="text-2xl font-medium opacity-95" style={{ textShadow: '0 1px 10px rgba(0,0,0,0.1)' }}>
            Access your dashboard and manage everything in one beautiful place
          </p>
        </motion.div>
      </div>
    </div>
  );
}
