import React from 'react';
import { Landmark, ExternalLink, Shield, AlertTriangle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-black/40 border-t border-white/5 pt-20 pb-10 px-8">
      <div className="max-w-7xl mx-auto">
        {/* Government Disclaimer - Mandatory */}
        <div className="mb-16 p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-start gap-4">
          <AlertTriangle className="text-red-500 flex-shrink-0" size={24} />
          <div>
            <h4 className="text-red-500 font-black uppercase text-xs tracking-widest mb-1">Government Disclaimer</h4>
            <p className="text-gray-400 text-sm font-medium leading-relaxed">
              VoterAI Assistant is an independent AI-powered informational tool. It is <strong>NOT an official government website</strong> and is not affiliated with the Election Commission of India (ECI). Users are encouraged to verify all information on the official ECI portal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-16 mb-20">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                <Landmark size={20} color="white" />
              </div>
              <span className="text-xl font-black tracking-tighter uppercase text-white">VoterAI</span>
            </div>
            <p className="text-gray-400 font-medium max-w-sm mb-8 leading-relaxed">
              Simplifying the democratic process through secure AI guidance. Registered with Render Infrastructure and MongoDB Atlas for data integrity.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500">
                <Shield size={12} className="text-blue-500" /> AES-256 Encrypted
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/5 text-[10px] font-bold text-gray-500">
                <Shield size={12} className="text-green-500" /> Atlas Verified
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Official Portals</h4>
            <ul className="space-y-4">
              {[
                { name: 'ECI Official Site', url: 'https://eci.gov.in' },
                { name: 'Voter Service Portal', url: 'https://voters.eci.gov.in' },
                { name: 'NVSP Portal', url: 'https://www.nvsp.in' },
                { name: 'Voter Helpline App', url: 'https://play.google.com/store/apps/details?id=com.eci.citizen' }
              ].map(link => (
                <li key={link.name}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 text-sm font-medium flex items-center gap-2 transition-colors">
                    {link.name} <ExternalLink size={12} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase text-xs tracking-widest mb-8">Navigation</h4>
            <ul className="space-y-4">
              {['Home', 'Eligibility', 'Register', 'Resources'].map(item => (
                <li key={item}>
                  <span className="text-gray-500 hover:text-white text-sm font-medium cursor-pointer transition-colors">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            © 2026 VoterAI Infrastructure. Built for the Electorate of India.
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
