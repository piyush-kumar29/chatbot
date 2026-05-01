import React, { useState, useEffect } from 'react';
import { Landmark, Menu, X, MessageSquare } from 'lucide-react';

const Navbar = ({ onOpenChat, setPage, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', id: 'home' },
    { name: 'Eligibility', id: 'features' },
    { name: 'ECI Resources', id: 'intelligence' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 ${scrolled ? 'py-4 bg-black/70 backdrop-blur-xl border-b border-white/5' : 'py-8 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-8 flex justify-between items-center">
        <div onClick={() => setPage('home')} className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-lg group-hover-scale-105 transition-transform">
            <Landmark size={20} color="white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-black tracking-tighter uppercase">VoterAI</span>
            <span className="text-[8px] font-bold text-blue-400 tracking-03 uppercase">Assistant</span>
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <button 
              key={link.id} 
              onClick={() => setPage(link.id)}
              className={`text-[10px] font-black border-none bg-transparent uppercase tracking-[0.2em] transition-all cursor-pointer hover:text-blue-400 ${currentPage === link.id ? 'text-blue-400' : 'text-gray-400'}`}
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={onOpenChat}
            className="px-6 py-3 rounded-xl bg-blue-600-10 border border-blue-500-20 text-10 font-black uppercase tracking-widest hover:bg-blue-600 hover:border-blue-600 transition-all flex items-center gap-2 cursor-pointer text-blue-400 hover:text-white"
          >
            <MessageSquare size={14} /> Ask AI Assistant
          </button>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white bg-transparent border-none" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-3xl border-b border-white-5 p-8 flex flex-col gap-6 animate-fade-in">
          {navLinks.map((link) => (
            <button 
              key={link.id} onClick={() => { setPage(link.id); setMobileMenuOpen(false); }}
              className="text-2xl font-black uppercase tracking-tighter bg-transparent border-none text-white text-left"
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => { onOpenChat(); setMobileMenuOpen(false); }}
            className="mt-4 w-full py-5 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest border-none"
          >
            Ask Assistant
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
