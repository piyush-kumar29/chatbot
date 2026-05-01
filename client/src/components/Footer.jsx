import React from 'react';
import { Cpu, Github, Twitter, Linkedin, Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative z-10 border-t border-white/5 bg-black/40 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <Cpu size={20} color="white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase">VoterAI</span>
            </div>
            <p className="text-gray-500 font-medium text-sm leading-relaxed">
              Advancing the boundaries of electoral intelligence through neural networks and expert systems. Empowering the global democratic process.
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Protocol</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Neural Core</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Distributed Ledger</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Data Sovereignty</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">API Access</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Resources</h4>
            <ul className="space-y-4 text-sm font-medium text-gray-500">
              <li className="hover:text-blue-400 cursor-pointer transition-colors">ECI Documentation</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Legislative Graph</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Form Assistance</li>
              <li className="hover:text-blue-400 cursor-pointer transition-colors">Constituency Maps</li>
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-white mb-8">Connectivity</h4>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                <Twitter size={18} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                <Github size={18} />
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-blue-600 transition-all cursor-pointer">
                <Linkedin size={18} />
              </div>
            </div>
            <div className="mt-8 flex items-center gap-3 px-4 py-3 rounded-xl bg-green-500/5 border border-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest">
              <Shield size={14} /> System Verified
            </div>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            © 2026 VoterAI Infrastructure. All rights reserved.
          </p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-gray-600">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Protocol</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Security Audit</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
