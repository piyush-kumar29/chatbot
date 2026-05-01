import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Cpu, Database, Network, Activity, Wind } from 'lucide-react';

const Intelligence = () => {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-8 pt-40 pb-20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass p-20 relative overflow-hidden"
      >
        {/* Visual Decoration */}
        <div className="absolute top-m10p right-m5p w-400 h-400 bg-blue-500-5 rounded-full blur-[100px] animate-pulse"></div>
        
        <div className="relative z-10 grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <h1 className="text-7xl font-black mb-8 tracking-tighter">Neural <br /> <span className="gradient-text">Diagnostics.</span></h1>
            <p className="text-lg text-gray-400 font-medium leading-relaxed mb-12">
              Deep-dive into the architectural framework of our Voter Assistance Core. Our systems utilize a combination of Large Language Models and deterministic expert rules to provide 100% accurate regulatory guidance.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: <Cpu />, label: "Processing Core", val: "NVIDIA H100 Optimized" },
                { icon: <Database />, label: "Knowledge Graph", val: "5M+ Electoral Rules" },
                { icon: <Network />, label: "Neural Layers", val: "96 Layer Transformer" },
                { icon: <Activity />, label: "Inference Latency", val: "22ms Global Avg" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white-5 border border-white-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-500-10 flex items-center justify-center text-blue-500">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-10 font-black uppercase tracking-widest text-gray-500">{item.label}</div>
                    <div className="text-lg font-bold text-white">{item.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full border-2 border-white-5 rounded-full animate-spin-slow"></div>
              <div className="absolute w-80p h-80p border-2 border-blue-500/10 rounded-full animate-spin-slow" style={{ animationDirection: 'reverse' }}></div>
              <div className="absolute w-60p h-60p border-2 border-purple-500-10 rounded-full animate-spin-slow"></div>
              
              <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl flex items-center justify-center">
                <Brain size={60} color="white" className="animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Intelligence;
