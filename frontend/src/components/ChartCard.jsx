import { motion } from 'framer-motion';
import { MoreVertical } from 'lucide-react';

export const ChartCard = ({ title, children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 + index * 0.08, duration: 0.4 }}
      className="bg-white rounded-xl p-6 border border-slate-200"
      style={{ 
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
      }}
      data-testid={`chart-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
          <p className="text-sm text-slate-500 mt-0.5">Last 30 days</p>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5 text-slate-400" />
        </button>
      </div>
      <div>{children}</div>
    </motion.div>
  );
};
