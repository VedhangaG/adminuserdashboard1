import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

export const StatCard = ({ title, value, icon: Icon, color, index }) => {
  const colorClasses = {
    blue: { 
      gradient: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200'
    },
    purple: { 
      gradient: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50',
      text: 'text-purple-700',
      border: 'border-purple-200'
    },
    mint: { 
      gradient: 'from-emerald-500 to-emerald-600',
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      border: 'border-emerald-200'
    },
    peach: { 
      gradient: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50',
      text: 'text-orange-700',
      border: 'border-orange-200'
    },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="group relative bg-white rounded-xl p-6 border border-slate-200 hover:border-slate-300 transition-all duration-300"
      style={{ 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`${colors.bg} ${colors.border} border p-3 rounded-lg`}>
          <Icon className={`w-5 h-5 ${colors.text}`} strokeWidth={2} />
        </div>
        <div className="flex items-center gap-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="w-3 h-3" />
          <span>+12%</span>
        </div>
      </div>
      
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
      </div>
    </motion.div>
  );
};
