import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { StatCard } from '../components/StatCard';
import { ChartCard } from '../components/ChartCard';
import { analyticsService } from '../services/api';
import { Users, Shield, Activity, UserPlus } from 'lucide-react';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [userGrowth, setUserGrowth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, growthRes, roleRes, activityRes] = await Promise.all([
        analyticsService.getStats(),
        analyticsService.getUserGrowth(),
        analyticsService.getRoleDistribution(),
        analyticsService.getWeeklyActivity(),
      ]);

      setStats(statsRes.data);
      setUserGrowth(growthRes.data);
      setRoleDistribution(roleRes.data);
      setWeeklyActivity(activityRes.data);
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    }
  };

  const COLORS = ['#A7C7E7', '#CDB4DB', '#B7E4C7', '#FFD6A5'];

  return (
    <div className="min-h-screen flex bg-slate-50" data-testid="admin-dashboard">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <Navbar userName={userName} isAdmin={true} />
        <main className="w-full max-w-[1600px] mx-auto p-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-slate-900 mb-1">
              Dashboard Overview
            </h1>
            <p className="text-slate-600 text-sm">Monitor your system metrics and user analytics</p>
          </motion.div>

          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.total_users} icon={Users} color="blue" index={0} />
              <StatCard title="Total Admins" value={stats.total_admins} icon={Shield} color="purple" index={1} />
              <StatCard title="Active Users" value={stats.active_users} icon={Activity} color="mint" index={2} />
              <StatCard title="New Today" value={stats.new_users_today} icon={UserPlus} color="peach" index={3} />
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="User Growth" index={0}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#A7C7E7" strokeWidth={3} dot={{ fill: '#A7C7E7' }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <ChartCard title="Role Distribution" index={1}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, count }) => `${role}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {roleDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Weekly Activity" index={2}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px' }}
                />
                <Legend />
                <Bar dataKey="logins" fill="#B7E4C7" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </main>
      </div>
    </div>
  );
}
