import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon, title, desc, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="glass p-10 rounded-40 border border-white-5 hover:border-blue-500-20 transition-all group"
    >
      <div className="w-16 h-16 rounded-2xl bg-white-5 flex items-center justify-center mb-8 group-hover:bg-blue-500-10 transition-colors">
        {icon}
      </div>
      <h3 className="text-2xl font-black mb-4">{title}</h3>
      <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
};

export default FeatureCard;
