import { motion } from 'framer-motion';

export const StatCard = ({ title, value, icon: Icon, color, index }) => {
  const colorClasses = {
    blue: { bg: 'from-pastel-blue/20 to-pastel-blue/5', iconBg: 'bg-pastel-blue', ring: 'ring-pastel-blue/30' },
    purple: { bg: 'from-pastel-purple/20 to-pastel-purple/5', iconBg: 'bg-pastel-purple', ring: 'ring-pastel-purple/30' },
    mint: { bg: 'from-pastel-mint/20 to-pastel-mint/5', iconBg: 'bg-pastel-mint', ring: 'ring-pastel-mint/30' },
    peach: { bg: 'from-pastel-peach/20 to-pastel-peach/5', iconBg: 'bg-pastel-peach', ring: 'ring-pastel-peach/30' },
  };

  const colors = colorClasses[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, transition: { duration: 0.3 } }}
      className="group relative bg-white rounded-3xl p-8 border border-slate-100/50 overflow-hidden"
      style={{ 
        boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.04)',
      }}
      data-testid={`stat-card-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      {/* Background gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Content */}
      <div className="relative flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">{title}</p>
          <h3 className="text-5xl font-bold text-slate-900 mb-1" style={{ letterSpacing: '-0.02em' }}>{value}</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className={`h-1 w-12 rounded-full ${colors.iconBg}`} />
            <span className="text-xs text-slate-400">Live data</span>
          </div>
        </div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ duration: 0.3 }}
          className={`${colors.iconBg} w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ring-4 ${colors.ring}`}
        >
          <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
        </motion.div>
      </div>
      
      {/* Decorative corner accent */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 ${colors.iconBg} rounded-full opacity-5 blur-2xl`} />
    </motion.div>
  );
};
