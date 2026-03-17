import { motion } from 'framer-motion';

export const ChartCard = ({ title, children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1 }}
      className="bg-white rounded-2xl p-6 border border-slate-100"
      style={{ boxShadow: '0 2px 20px rgba(0,0,0,0.04)' }}
      data-testid={`chart-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <h3 className="text-xl font-semibold text-slate-900 mb-6">{title}</h3>
      <div>{children}</div>
    </motion.div>
  );
};
