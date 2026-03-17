import { motion } from 'framer-motion';

export const ChartCard = ({ title, children, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 + index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-3xl p-8 border border-slate-100/50 relative overflow-hidden"
      style={{ 
        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)',
      }}
      data-testid={`chart-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 to-transparent pointer-events-none" />
      
      <div className="relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-900" style={{ letterSpacing: '-0.01em' }}>{title}</h3>
            <div className="h-1 w-16 bg-gradient-to-r from-pastel-blue to-pastel-purple rounded-full mt-2" />
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-slate-400 font-medium">Real-time</span>
          </div>
        </div>
        <div>{children}</div>
      </div>
    </motion.div>
  );
};
