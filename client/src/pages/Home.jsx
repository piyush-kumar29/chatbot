import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Shield, Zap, Search, Globe, ChevronRight } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Home = ({ onOpenChat }) => {
  const [query, setQuery] = useState('');

  const stats = [
    { label: 'Active Voters', val: '968M+', color: 'text-blue-500' },
    { label: 'AI Responses', val: '2.4M', color: 'text-purple-500' },
    { label: 'Constituencies', val: '543', color: 'text-green-400' },
    { label: 'System Latency', val: '18ms', color: 'text-blue-400' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 pt-32 pb-40"
    >
      <div className="grid lg:grid-cols-2 gap-24 items-center">
        {/* Hero Left */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Voter Neural Network V3.5 Active
            </div>
            <h1 className="text-[100px] font-black leading-[0.85] tracking-tighter mb-10">
              Verify. <br />
              Register. <br />
              <span className="gradient-text">Execute.</span>
            </h1>
            <p className="text-xl text-gray-400 font-medium max-w-xl mb-12 leading-relaxed">
              Navigate the complex landscape of Indian electoral laws with our advanced expert system. Instant eligibility checks, form assistance, and constituency mapping.
            </p>
            
            <div className="flex flex-wrap gap-6">
              <button onClick={onOpenChat} className="btn-primary px-10 py-5 text-lg shadow-xl shadow-blue-600/20">
                <MessageSquare size={24} />
                Initialize AI Assistant
              </button>
              <button className="glass px-8 py-5 text-lg font-bold flex items-center gap-2 hover:bg-white/5 group transition-all" onClick={onOpenChat}>
                Constituency Maps <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Live Stats */}
            <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-12">
              {stats.map((s, i) => (
                <div key={i} className="flex flex-col">
                  <span className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.val}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 mt-2">{s.label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Hero Right: Search Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass p-12 relative overflow-hidden group shadow-[0_48px_96px_-24px_rgba(0,0,0,0.6)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe size={180} className="rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
          
          <h3 className="text-3xl font-black mb-4">Constituency Sync</h3>
          <p className="text-gray-400 font-medium text-sm mb-10">Query the national database using natural language processing.</p>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. Can I vote in Maharashtra if I'm 17?"
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white font-medium focus:border-blue-500/50 transition-all outline-none"
                onKeyPress={(e) => e.key === 'Enter' && onOpenChat()}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['Voter ID Sync', 'Form 6 Guide', 'Address Update', 'Age Eligibility'].map(t => (
                <button key={t} className="px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[11px] font-bold text-gray-500 hover:text-white hover:border-blue-500/30 transition-all">
                  {t}
                </button>
              ))}
            </div>
            <button 
              onClick={onOpenChat}
              className="w-full py-5 rounded-2xl bg-blue-600/10 border border-blue-500/30 text-blue-400 font-bold hover:bg-blue-600/20 transition-all flex items-center justify-center gap-2 mt-6"
            >
              Analyze via Neural Core <Zap size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* Trust Grid */}
      <div className="mt-60 grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Shield size={32} className="text-blue-500" />}
          title="Encrypted Verification"
          desc="Distributed ledger technology ensuring the integrity of every eligibility verification cycle."
          delay={0.1}
        />
        <FeatureCard 
          icon={<Zap size={32} className="text-purple-500" />}
          title="Instant Guidance"
          desc="Real-time access to the latest Election Commission of India guidelines and legislative updates."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Globe size={32} className="text-green-400" />}
          title="Universal Access"
          desc="Designed for the next billion voters, supporting all regional contexts and state-specific rules."
          delay={0.3}
        />
      </div>
    </motion.div>
  );
};

export default Home;
