import { useEffect, useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Sidebar } from '../components/Sidebar';
import { ChartCard } from '../components/ChartCard';
import { analyticsService } from '../services/api';
import { LineChart, Line, PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function AnalyticsPage() {
  const [userGrowth, setUserGrowth] = useState([]);
  const [roleDistribution, setRoleDistribution] = useState([]);
  const [weeklyActivity, setWeeklyActivity] = useState([]);
  const userName = localStorage.getItem('userName');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [growthRes, roleRes, activityRes] = await Promise.all([
        analyticsService.getUserGrowth(),
        analyticsService.getRoleDistribution(),
        analyticsService.getWeeklyActivity(),
      ]);

      setUserGrowth(growthRes.data);
      setRoleDistribution(roleRes.data);
      setWeeklyActivity(activityRes.data);
    } catch (error) {
      toast.error('Failed to fetch analytics data');
    }
  };

  const COLORS = ['#A7C7E7', '#CDB4DB', '#B7E4C7', '#FFD6A5'];

  return (
    <div className="min-h-screen flex" data-testid="analytics-page">
      <Sidebar isAdmin={true} />
      <div className="flex-1">
        <Navbar userName={userName} isAdmin={true} />
        <main className="w-full max-w-[1600px] mx-auto p-4 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-2">Analytics</h1>
            <p className="text-slate-500">Detailed insights and metrics</p>
          </motion.div>

          <div className="space-y-6">
            <ChartCard title="User Growth Over Time" index={0}>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '12px' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#A7C7E7" strokeWidth={3} dot={{ fill: '#A7C7E7', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </ChartCard>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartCard title="User Role Distribution" index={1}>
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={roleDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ role, count }) => `${role}: ${count}`}
                      outerRadius={120}
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

              <ChartCard title="Weekly Login Activity" index={2}>
                <ResponsiveContainer width="100%" height={350}>
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
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
