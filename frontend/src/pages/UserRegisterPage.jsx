import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/api';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, User } from 'lucide-react';

export default function UserRegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.register(formData);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Registration failed');
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
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Join us and get started today</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 border border-slate-100"
            style={{ boxShadow: '0 10px 30px rgba(167, 199, 231, 0.2)' }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" data-testid="register-form">
              <div>
                <Label htmlFor="name" className="text-slate-700">Full Name</Label>
                <div className="relative mt-2">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    id="name"
                    data-testid="register-name-input"
                    type="text"
                    placeholder="John Doe"
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
                    data-testid="register-email-input"
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
                    data-testid="register-password-input"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-11 h-12 rounded-xl border-slate-200 focus:border-pastel-blue focus:ring-4 focus:ring-pastel-blue/20 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role" className="text-slate-700">Role</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger
                    data-testid="register-role-select"
                    className="mt-2 h-12 rounded-xl border-slate-200 bg-slate-50/50"
                  >
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user" data-testid="role-option-user">User</SelectItem>
                    <SelectItem value="admin" data-testid="role-option-admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                data-testid="register-submit-button"
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-slate-900 text-white hover:bg-slate-800 rounded-full shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-95 font-medium"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-slate-900 font-medium hover:underline" data-testid="login-link">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>

      <div
        className="hidden lg:flex flex-1 bg-gradient-to-br from-pastel-blue via-pastel-purple to-pastel-mint items-center justify-center p-8"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="text-center text-white max-w-md">
          <h2 className="text-5xl font-bold mb-4">Welcome!</h2>
          <p className="text-xl opacity-90">Join our community and manage your account with ease</p>
        </div>
      </div>
    </div>
  );
}
