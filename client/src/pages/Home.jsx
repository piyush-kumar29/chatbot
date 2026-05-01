import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, ArrowRight, Shield, Zap, Search, Globe, ChevronRight, CheckCircle2, UserPlus, FileText, Landmark } from 'lucide-react';
import FeatureCard from '../components/FeatureCard';

const Home = ({ onOpenChat, setPage }) => {
  const [query, setQuery] = useState('');

  const stats = [
    { label: 'Registered Voters', val: '968M+', color: 'text-blue-500' },
    { label: 'Processing Centers', val: '1.2M+', color: 'text-purple-500' },
    { label: 'States/UTs Covered', val: '36', color: 'text-green-400' },
    { label: 'AI Accuracy', val: '99.9%', color: 'text-blue-400' },
  ];

  const steps = [
    { icon: <UserPlus className="text-blue-500" />, title: "Check Eligibility", desc: "Verify if you meet the age and residency requirements for Indian elections." },
    { icon: <FileText className="text-purple-500" />, title: "Prepare Documents", desc: "Get your ID and address proofs ready as per ECI guidelines." },
    { icon: <MessageSquare className="text-green-400" />, title: "Ask VoterAI", desc: "Get step-by-step guidance on filling Form 6, Form 8, or tracking status." },
    { icon: <Landmark className="text-orange-500" />, title: "Official Submission", desc: "Follow our direct links to the official Voter Service Portal to finish." },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-8 pt-32 pb-40"
    >
      <div className="grid lg:grid-cols-2 gap-24 items-center mb-32">
        {/* Hero Left */}
        <div className="relative">
          <motion.div 
            initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}
          >
            <div className="absolute -top-10 -right-5 w-400 h-400 bg-blue-500-5 blur-3xl animate-spin-slow" />
            <div className="relative">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500-10 border border-blue-500-20 text-blue-400 text-10 font-black uppercase tracking-02 mb-8">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                Your AI-Powered Voter Registration Assistant
              </div>
              <h1 className="text-80 font-black leading-none tracking-tighter mb-10">
                Empowering <br />
                India's <br />
                <span className="gradient-text">Electorate.</span>
              </h1>
              <p className="text-xl text-gray-400 font-medium max-w-xl mb-12 leading-relaxed">
                Simplified guidance for voter registration, address updates, and electoral roll verification. Powered by AI to make democracy accessible to everyone.
              </p>
              
              <div className="flex flex-wrap gap-6">
                <button onClick={onOpenChat} className="btn-primary px-10 py-5 text-lg shadow-xl shadow-blue-600-20">
                  <MessageSquare size={24} />
                  Ask Registration Assistant
                </button>
                <button className="glass px-8 py-5 text-lg font-bold flex items-center gap-2 hover:bg-white-5 group transition-all" onClick={() => setPage('eci')}>
                  Guided Registration <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Live Stats */}
              <div className="mt-20 grid grid-cols-2 sm:grid-cols-4 gap-12">
                {stats.map((s, i) => (
                  <div key={i} className="flex flex-col">
                    <span className={`text-3xl font-black ${s.color} tracking-tighter`}>{s.val}</span>
                    <span className="text-10 font-bold uppercase tracking-widest text-gray-600 mt-2">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Right: Search Module */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="glass p-12 relative overflow-hidden group shadow-hero"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Globe size={180} className="rotate-12 group-hover:rotate-0 transition-transform duration-1000" />
          </div>
          
          <h3 className="text-3xl font-black mb-4">Quick Check</h3>
          <p className="text-gray-400 font-medium text-sm mb-10">Instant answers to your voter registration queries.</p>

          <div className="space-y-6">
            <div className="relative">
              <Search className="absolute left-5 top-1-2 translate-y-m1-2 text-gray-500" size={20} />
              <input 
                type="text" value={query} onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. How to apply for a new voter ID?"
                className="w-full bg-black-40 border border-white-10 rounded-2xl py-5 pl-14 pr-6 text-sm text-white font-medium focus:border-blue-500-50 transition-all outline-none"
                onKeyPress={(e) => e.key === 'Enter' && onOpenChat()}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {['New Registration', 'Address Change', 'Age Proof', 'Track Status'].map(t => (
                <button key={t} className="px-4 py-2 rounded-xl bg-white-5 border border-white-5 text-11 font-bold text-gray-500 hover:text-white hover:border-blue-500-30 transition-all">
                  {t}
                </button>
              ))}
            </div>
            <button 
              onClick={onOpenChat}
              className="w-full py-5 rounded-2xl bg-blue-600-10 border border-blue-500-30 text-blue-400 font-bold hover:bg-blue-600-20 transition-all flex items-center justify-center gap-2 mt-6"
            >
              Analyze Query <Zap size={18} />
            </button>
          </div>
        </motion.div>
      </div>

      {/* How it Works Section */}
      <div className="mb-40">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-black mb-4">How It Works</h2>
          <p className="text-gray-400 font-medium">Simple steps to becoming a registered voter in India.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass p-8 rounded-3xl border border-white-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white-5 flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
          {["Form 6 Guide", "Eligibility Checker", "Booth Locator", "EPIC Download"].map((item) => (
            <div key={item} className="glass p-6 rounded-2xl border border-white-5 flex items-center gap-4 hover:bg-white-5 transition-all cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-blue-600-10 flex items-center justify-center text-blue-400">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-bold text-sm">{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Eligibility Section */}
      <div className="grid lg:grid-cols-2 gap-20 items-center mb-40">
        <div>
          <h2 className="text-4xl font-black mb-8">Are You Eligible?</h2>
          <div className="space-y-6">
            {[
              "Must be an Indian Citizen.",
              "Must have attained the age of 18 years on the qualifying date.",
              "Must be ordinarily resident in the constituency.",
              "Must not be disqualified to be enrolled as an elector."
            ].map((text, i) => (
              <div key={i} className="flex gap-4 items-start">
                <CheckCircle2 className="text-blue-500 mt-1 flex-shrink-0" size={24} />
                <p className="text-gray-300 font-medium">{text}</p>
              </div>
            ))}
          </div>
          <button onClick={() => setPage('features')} className="mt-10 px-8 py-4 rounded-xl bg-blue-600-20 border border-blue-500-30 text-blue-400 font-bold hover:bg-blue-600-30 transition-all">
            Check Your Eligibility Now
          </button>
        </div>
        <div className="glass p-12 rounded-40 border border-white-5 relative overflow-hidden">
          <div className="absolute top-m10 right-m10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl"></div>
          <h3 className="text-2xl font-black mb-6">Required Documents</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white-5">
              <span className="text-10 font-black uppercase text-blue-400 tracking-widest block mb-2">Age Proof</span>
              <p className="text-sm text-gray-400">Birth Certificate, Passport, PAN Card, Driving License, etc.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white-5">
              <span className="text-10 font-black uppercase text-purple-400 tracking-widest block mb-2">Address Proof</span>
              <p className="text-sm text-gray-400">Utility Bills, Ration Card, Bank Passbook, etc.</p>
            </div>
          </div>
          <p className="mt-8 text-xs text-gray-500 italic">Note: Document requirements may vary slightly by state. Ask VoterAI for specific details.</p>
        </div>
      </div>

      {/* Trust Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={<Shield size={32} className="text-blue-500" />}
          title="Secure Guidance"
          desc="We provide official information from Election Commission of India guidelines without collecting sensitive data."
          delay={0.1}
        />
        <FeatureCard 
          icon={<Zap size={32} className="text-purple-500" />}
          title="Instant Support"
          desc="Get immediate clarity on Form 6 (New Voter), Form 8 (Corrections), and tracking your EPIC status."
          delay={0.2}
        />
        <FeatureCard 
          icon={<Globe size={32} className="text-green-400" />}
          title="All Regions"
          desc="Supporting registrations across all 28 States and 8 Union Territories of India with regional expertise."
          delay={0.3}
        />
      </div>
    </motion.div>
  );
};

export default Home;
