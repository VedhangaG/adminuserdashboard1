import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, color, index }) => {
  const colorClasses = {
    blue: 'from-pastel-blue to-blue-200',
    purple: 'from-pastel-purple to-purple-200',
    mint: 'from-pastel-mint to-green-200',
    peach: 'from-pastel-peach to-orange-200',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-6 border border-slate-100"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-500 uppercase tracking-wider mb-2">{title}</p>
          <h3 className="text-4xl font-bold text-slate-900">{value}</h3>
        </div>
        <div
          className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}
        >
          <Icon className="w-7 h-7 text-white" />
        </div>
      </div>
    </motion.div>
  );
};
