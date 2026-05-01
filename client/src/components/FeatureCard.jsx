import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc, delay = 0 }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="glass p-10 group hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_20px_40px_-10px_rgba(59,130,246,0.2)]"
    >
      <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-blue-600/10 transition-all duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4 tracking-tighter">{title}</h3>
      <p className="text-gray-500 font-medium text-sm leading-relaxed group-hover:text-gray-300 transition-colors">
        {desc}
      </p>
      <div className="mt-8 w-8 h-1 bg-white/10 group-hover:w-full group-hover:bg-blue-500 transition-all duration-500 rounded-full"></div>
    </motion.div>
  );
};

export default FeatureCard;
