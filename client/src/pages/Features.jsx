import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap, Globe, BarChart3, Info, Lock } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Features = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-8 pt-40 pb-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-32"
      >
        <h1 className="text-8xl font-black mb-8 tracking-tighter">System <span className="gradient-text">Capabilities.</span></h1>
        <p className="text-xl text-gray-500 max-w-3xl mx-auto font-medium leading-relaxed">
          The VoterAI infrastructure is built on a distributed neural core, designed to handle the scale and complexity of the world's largest democracy.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        <FeatureCard 
          icon={<Lock size={32} className="text-blue-500" />}
          title="Data Sovereignty"
          desc="Proprietary encryption protocols ensuring that user demographic data never leaves the encrypted local session."
          delay={0.1}
        />
        <FeatureCard 
          icon={<Zap size={32} className="text-purple-500" />}
          title="Neural Processing"
          desc="Heuristic intent detection algorithms that understand the nuance of regional electoral queries."
          delay={0.2}
        />
        <FeatureCard 
          icon={<BarChart3 size={32} className="text-green-400" />}
          title="Constituency Mapping"
          desc="Live data synchronization with national constituency boundaries and representative data."
          delay={0.3}
        />
        <FeatureCard 
          icon={<Shield size={32} className="text-blue-400" />}
          title="Eligibility Firewall"
          desc="Expert-system-driven rules engine that validates age, citizenship, and residency status instantly."
          delay={0.4}
        />
        <FeatureCard 
          icon={<Globe size={32} className="text-purple-400" />}
          title="Regional Awareness"
          desc="Context-aware engine that adjusts advice based on state-specific election cycle nuances."
          delay={0.5}
        />
        <FeatureCard 
          icon={<Info size={32} className="text-gray-400" />}
          title="ECI Compliance"
          desc="Constantly updated Knowledge Base synchronized with the latest Election Commission directives."
          delay={0.6}
        />
      </div>
    </div>
  );
};

export default Features;
