import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import { Settings, Moon, Sun, Monitor, Maximize, Copy, Check, Trash2, Shield, Zap, ShieldCheck, Globe, Users, FileCheck, BarChart3, MapPin, ArrowRight, Activity, Lock, Award, FileText, Landmark, AlertCircle, ChevronDown, ChevronUp, Mic, MicOff, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rnd } from 'react-rnd';

// Modular Components
import Home from './pages/Home';
import RegistrationForm from './pages/RegistrationForm';
import EligibilityChecker from './components/EligibilityChecker';
import AdminDashboard from './pages/AdminDashboard';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// --- ROBUST CONSOLIDATED APP ---
// Eliminates all external component imports to resolve the white screen issue.

const API_BASE_URL = 'https://chatbot-0g7m.onrender.com';

// Internal components removed - now imported from modular files

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('voter_user')) || null);
  const [token, setToken] = useState(localStorage.getItem('voter_token') || null);
  const [authData, setAuthData] = useState({ username: '', email: '', password: '' });
  const [historyList, setHistoryList] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [appTheme, setAppTheme] = useState(() => localStorage.getItem('voterai-app-theme') || 'system');
  const [chatTheme, setChatTheme] = useState(() => localStorage.getItem('voterai-chat-theme') || 'system');
  const [chatSize, setChatSize] = useState('medium');
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [pendingQuery, setPendingQuery] = useState(null);
  const [chatRndKey, setChatRndKey] = useState(0);
  const [agentMode, setAgentMode] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [sourcesExpanded, setSourcesExpanded] = useState(false);
  const [speechLang, setSpeechLang] = useState('en-US');

  const voiceEnabledRef = useRef(false);
  useEffect(() => { voiceEnabledRef.current = voiceEnabled; }, [voiceEnabled]);

  const speechLangRef = useRef('en-US');
  useEffect(() => { speechLangRef.current = speechLang; }, [speechLang]);

  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);

  // Voice Assistant Functions
  const startListening = () => {
      if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
          alert('Speech recognition not supported in this browser.');
          return;
      }
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = speechLang;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onresult = (event) => setInput(event.results[0][0].transcript);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.start();
  };

  const stopListening = () => {
      if (recognitionRef.current) recognitionRef.current.stop();
  };

  // Pre-warm voices for Chrome/Edge
  useEffect(() => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      // Chrome requires this event listener to populate voices
      window.speechSynthesis.onvoiceschanged = () => {
        window.speechSynthesis.getVoices();
      };
    }
  }, []);

  const speakText = (text) => {
      if (!text || !('speechSynthesis' in window)) return;

      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      const currentLang = speechLangRef.current;
      utterance.lang = currentLang;
      
      const voices = window.speechSynthesis.getVoices();
      const targetLangLower = currentLang.toLowerCase().replace('_', '-');
      const baseLang = targetLangLower.split('-')[0];
      
      // 1. Prioritize "Google" or "Online" voices as they are high quality and support more languages
      let targetVoice = voices.find(v => 
          (v.lang.toLowerCase().replace('_', '-') === targetLangLower) && 
          (v.name.includes('Google') || v.name.includes('Online') || v.name.includes('Natural'))
      );

      // 2. Fallback to any exact language match
      if (!targetVoice) {
          targetVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-') === targetLangLower);
      }

      // 3. Fallback to base language match (e.g. "ta" for "ta-IN")
      if (!targetVoice) {
          targetVoice = voices.find(v => 
              v.lang.toLowerCase().startsWith(baseLang) || 
              v.name.toLowerCase().includes(baseLang)
          );
      }
      
      if (targetVoice) {
          utterance.voice = targetVoice;
          utterance.lang = targetVoice.lang;
      } else {
          // If absolutely no voice object is found, we still set the lang attribute 
          // to help the browser try its best with the default engine
          utterance.lang = currentLang;
      }

      utterance.rate = 1.0;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      window.speechSynthesis.speak(utterance);
  };

  // Initialize App Theme
  useEffect(() => {
    applyAppTheme(appTheme);
  }, [appTheme]);

  const applyAppTheme = (t) => {
    if (t === 'dark') {
      document.documentElement.removeAttribute('data-theme');
    } else if (t === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
      if (prefersLight) document.documentElement.setAttribute('data-theme', 'light');
      else document.documentElement.removeAttribute('data-theme');
    }
  };

  const handleAppThemeChange = (newTheme) => {
    setAppTheme(newTheme);
    localStorage.setItem('voterai-app-theme', newTheme);
  };

  const handleChatThemeChange = (newTheme) => {
    setChatTheme(newTheme);
    localStorage.setItem('voterai-chat-theme', newTheme);
  };

  const resolvedChatTheme = chatTheme === 'system' 
    ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') 
    : chatTheme;

  const handleInputText = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
        textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleCopy = (text, idx) => {
      navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      setTimeout(() => setCopiedIndex(null), 2000);
  };

  useEffect(() => {
    if (isChatOpen && user && token) {
      fetchHistory();
    }
    // Send any pending query once chat is open
    if (isChatOpen && pendingQuery) {
      const q = pendingQuery;
      setPendingQuery(null);
      setTimeout(() => handleSend(q, false), 300);
    }
  }, [isChatOpen]);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryList(res.data);
    } catch (e) {
      console.error("History fetch failed");
    }
  };

  const loadConversation = async (conv) => {
    setActiveConvId(conv._id);
    setMessages(conv.messages.map(m => ({
      role: m.role === 'assistant' ? 'bot' : 'user',
      content: m.content,
      thought: m.thought
    })));
  };

  const deleteConversation = async (e, convId) => {
    e.stopPropagation();
    try {
      await axios.delete(`${API_BASE_URL}/api/chat/${convId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryList(prev => prev.filter(c => c._id !== convId));
    } catch (err) {
      console.error("Failed to delete conversation");
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleAuth = async (type) => {
    setIsLoading(true);
    try {
      const endpoint = type === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await axios.post(`${API_BASE_URL}${endpoint}`, authData);
      setToken(res.data.token);
      setUser(res.data.user);
      localStorage.setItem('voter_token', res.data.token);
      localStorage.setItem('voter_user', JSON.stringify(res.data.user));
      setCurrentPage('home');
    } catch (e) {
      alert(e.response?.data?.error || "Authentication Failed");
    }
    setIsLoading(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('voter_token');
    localStorage.removeItem('voter_user');
    setCurrentPage('home');
  };

  const openChat = () => {
    setChatRndKey(k => k + 1); // force Rnd to reset position to center
    setIsChatOpen(true);
  };

  const handleSend = async (text, isInitial = false) => {
    // Stop any ongoing speech before sending
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        // Warm up / Unlock audio context for browsers that require it
        const warmUp = new SpeechSynthesisUtterance("");
        window.speechSynthesis.speak(warmUp);
    }

    const msg = text || input;
    if (!msg.trim() && !attachedFile && !isInitial) return;

    let displayContent = msg;
    if (attachedFile && !isInitial) {
      displayContent += (msg ? '\n\n' : '') + `📎 [Document Attached: ${attachedFile.name}]`;
    }

    if (!isInitial) {
      setMessages(prev => [...prev, { role: 'user', content: displayContent }]);
      setInput('');
      setAttachedFile(null);
    }
    setIsLoading(true);

    let payloadMessage = msg;
    if (attachedFile && !isInitial) {
      payloadMessage += `\n\n[System Note: The user has uploaded a document named "${attachedFile.name}". Please simulate a secure document verification process for this file assuming it is related to voter registration (like an ID card, utility bill, etc.) and give them feedback on whether it looks valid or what else might be needed.]`;
    }

    try {
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const payload = { 
          message: payloadMessage, 
          conversationId: activeConvId, 
          agentMode: agentMode,
          voiceEnabled: voiceEnabledRef.current,
          speechLang: speechLangRef.current
      };
      const res = await axios.post(`${API_BASE_URL}/api/chat`, payload, { headers });
      const data = res.data;
      
      let finalContent = data.content || "";
      let ttsContent = "";
      
      // Flexible regex to catch [[TTS: ...]], [[ tts: ... ]], etc.
      const ttsMatch = finalContent.match(/\[\[\s*TTS\s*:\s*([\s\S]*?)\s*\]\]/i);
      
      if (ttsMatch) {
          ttsContent = ttsMatch[1].trim();
          // Remove the tag from the displayed text
          finalContent = finalContent.replace(/\[\[\s*TTS\s*:\s*[\s\S]*?\s*\]\]/i, "").trim();
      }

      // Final fallback: if no TTS tag was found, speak the main content
      const textToSpeak = ttsContent || finalContent;

      setMessages(prev => [...prev, { role: 'bot', content: finalContent, thought: data.thought }]);
      
      if (voiceEnabledRef.current && textToSpeak) {
        speakText(textToSpeak);
      }
      if (data.conversationId) setActiveConvId(data.conversationId);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'bot', content: "Neural Core Offline. Please check your connection." }]);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <Navbar onOpenChat={openChat} setPage={setCurrentPage} currentPage={currentPage} />

      {/* Main Content */}
      <div className="pt-20">
        {currentPage === 'home' && <Home onOpenChat={openChat} setPage={setCurrentPage} />}
        {currentPage === 'features' && <EligibilityChecker setPage={setCurrentPage} />}
        {currentPage === 'intelligence' && (
          <div className="max-w-7xl mx-auto px-8 py-32">
            <h2 className="text-4xl font-black mb-12">Official Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                { title: 'Voter Service Portal', desc: 'Complete registration, correction and status tracking.', url: 'https://voters.eci.gov.in' },
                { title: 'ECI Official Site', desc: 'Guidelines, circulars, and historical election data.', url: 'https://eci.gov.in' },
                { title: 'NVSP (Legacy)', desc: 'National Voter Service Portal for older applications.', url: 'https://www.nvsp.in' },
                { title: 'EPIC Download', desc: 'Download your e-EPIC identity card digitally.', url: 'https://voters.eci.gov.in/home/download-epic' },
                { title: 'Voter Helpline App', desc: 'Mobile-first official application for Android & iOS.', url: 'https://play.google.com/store/apps/details?id=com.eci.citizen' }
              ].map((res, i) => (
                <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="glass p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all group">
                  <h3 className="text-xl font-bold mb-3 group-hover:text-blue-400">{res.title} <ExternalLink size={14} className="inline ml-2" /></h3>
                  <p className="text-gray-400 text-sm">{res.desc}</p>
                </a>
              ))}
            </div>
          </div>
        )}
        {currentPage === 'eci' && <RegistrationForm />}
        {currentPage === 'admin' && <AdminDashboard token={token} currentUser={user} />}
        
        {(currentPage === 'login' || currentPage === 'signup') && (
          <div className="max-w-md mx-auto py-40 px-8">
            <div className="glass p-10 rounded-[40px] border border-white/5 shadow-2xl">
              <h2 className="text-3xl font-black mb-8 text-center">{currentPage === 'login' ? 'Welcome Back' : 'Create Account'}</h2>
              <div className="space-y-6">
                {currentPage === 'signup' && (
                  <input
                    type="text" placeholder="Username"
                    value={authData.username} onChange={e => setAuthData({ ...authData, username: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50"
                  />
                )}
                <input
                  type="email" placeholder="Email Address"
                  value={authData.email} onChange={e => setAuthData({ ...authData, email: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50"
                />
                <input
                  type="password" placeholder="Password"
                  value={authData.password} onChange={e => setAuthData({ ...authData, password: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-white outline-none focus:border-blue-500/50"
                />
                <button
                  onClick={() => handleAuth(currentPage)}
                  className="w-full py-4 rounded-2xl bg-blue-600 text-white font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                >
                  {isLoading ? 'Verifying...' : (currentPage === 'login' ? 'Login' : 'Sign Up')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* System Infrastructure Section - Portfolio Proof */}
        <div className="max-w-7xl mx-auto px-8 py-20 border-t border-white/5 mt-40">
           <div className="flex flex-col md:flex-row justify-between items-start gap-12">
              <div className="max-w-md">
                <h4 className="text-xl font-black mb-4 uppercase tracking-tighter">Infrastructure Stack</h4>
                <p className="text-gray-500 text-sm leading-relaxed font-medium">
                  This production-ready application leverages a modern distributed architecture for maximum reliability and data integrity.
                </p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 w-full md:w-auto">
                <div>
                  <span className="text-[10px] font-black uppercase text-blue-400 tracking-widest block mb-2">Hosting</span>
                  <p className="text-sm font-bold text-white">Render Cloud</p>
                  <p className="text-[10px] text-gray-600">Auto-scaling PAAS</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-purple-400 tracking-widest block mb-2">Database</span>
                  <p className="text-sm font-bold text-white">MongoDB Atlas</p>
                  <p className="text-[10px] text-gray-600">Global Cluster v6.0</p>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-green-400 tracking-widest block mb-2">AI Engine</span>
                  <p className="text-sm font-bold text-white">Groq LPU</p>
                  <p className="text-[10px] text-gray-600">Llama 3.3 Inference</p>
                </div>
              </div>
           </div>
        </div>
      </div>

      <Footer />

      {/* Chat Overlay Backdrop removed to keep page visible on mobile like desktop */}

      {/* Chat Overlay */}
      {isChatOpen && (() => {
        const isMobile = window.innerWidth <= 480;
        const chatW = isMobile ? Math.min(360, window.innerWidth - 32) : 440;
        const chatH = isMobile ? Math.min(500, window.innerHeight - 100) : 600;
        return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 1000, pointerEvents: 'none' }}>
          <Rnd
            key={chatRndKey}
            default={{
              x: window.innerWidth - chatW - (isMobile ? 16 : 24),
              y: window.innerHeight - chatH - (isMobile ? 16 : 24),
              width: chatW,
              height: chatH,
            }}
            minWidth={320}
            minHeight={400}
            bounds="parent"
            dragHandleClassName="chat-header"
            style={{ pointerEvents: 'auto' }}
          >
            <div
              className="chat-window"
              data-theme={resolvedChatTheme}
              style={{ width: '100%', height: '100%' }}
            >
          <div className="chat-header">
            <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)' }}>
              <div className="chat-header-avatar" style={{ width: '28px', height: '28px' }}>🤖</div>
              Neural Core V4.0
            </span>
            <div className="chat-header-actions">
              {user && (
                <button
                  onClick={() => { setActiveConvId(null); setMessages([]); }}
                  style={{ background: 'none', border: '1px solid var(--accent-blue)', color: 'var(--accent-blue)', fontSize: '11px', borderRadius: '4px', cursor: 'pointer', padding: '2px 8px', fontWeight: 'bold' }}
                >
                  NEW
                </button>
              )}
              <button onClick={() => setShowSettings(!showSettings)} className="chat-settings-btn" aria-label="Settings" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Settings size={16} />
              </button>
              <button onClick={() => { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); setIsChatOpen(false); }} className="chat-close-btn" aria-label="Close" style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
          </div>

          <AnimatePresence>
              {showSettings && (
                  <motion.div 
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.15 }}
                      className="chat-settings-panel"
                  >
                      <div className="setting-item">
                          <span className="setting-label">Agent Mode</span>
                          <button 
                              className={`setting-btn ${agentMode ? 'active' : ''}`} 
                              onClick={() => setAgentMode(!agentMode)}
                              style={{ width: 'auto', padding: '4px 12px' }}
                          >
                              {agentMode ? 'On' : 'Off'}
                          </button>
                      </div>
                      <div className="setting-item">
                          <span className="setting-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              🔊 Voice Response
                          </span>
                          <button 
                              className={`setting-btn ${voiceEnabled ? 'active' : ''}`} 
                              onClick={() => {
                                  setVoiceEnabled(v => {
                                      if (v && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                                      return !v;
                                  });
                              }}
                              style={{ width: 'auto', padding: '4px 12px' }}
                          >
                              {voiceEnabled ? 'On' : 'Off'}
                          </button>
                      </div>
                      <div className="setting-item">
                          <span className="setting-label">Chat Theme</span>
                          <div className="setting-btn-group">
                              <button className={`setting-btn ${chatTheme === 'light' ? 'active' : ''}`} onClick={() => handleChatThemeChange('light')}><Sun size={14} /></button>
                              <button className={`setting-btn ${chatTheme === 'dark' ? 'active' : ''}`} onClick={() => handleChatThemeChange('dark')}><Moon size={14} /></button>
                              <button className={`setting-btn ${chatTheme === 'system' ? 'active' : ''}`} onClick={() => handleChatThemeChange('system')}><Monitor size={14} /></button>
                          </div>
                      </div>
                      <div className="setting-item">
                          <span className="setting-label">Voice Language</span>
                          <select 
                              value={speechLang} 
                              onChange={(e) => setSpeechLang(e.target.value)}
                              style={{ padding: '4px 8px', borderRadius: '8px', background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--glass-border)', fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
                          >
                              <option style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} value="en-US">English</option>
                              <option style={{ background: 'var(--bg-main)', color: 'var(--text-primary)' }} value="hi-IN">Hindi</option>
                          </select>
                      </div>
                  </motion.div>
              )}
          </AnimatePresence>

          {!activeConvId && messages.length === 0 && (
            <div className="chat-body custom-scrollbar" style={{ padding: '20px' }}>
              {user ? (
                historyList.length > 0 ? (
                  <>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '15px', fontWeight: 'bold', letterSpacing: '1px' }}>YOUR PAST SESSIONS</div>
                    {historyList.map(h => (
                      <div
                        key={h._id}
                        onClick={() => loadConversation(h)}
                        style={{ padding: '12px', backgroundColor: 'var(--bg-input)', borderRadius: '12px', marginBottom: '8px', cursor: 'pointer', border: '1px solid var(--glass-border)', transition: 'background 0.2s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                        onMouseOut={e => e.currentTarget.style.backgroundColor = 'var(--bg-input)'}
                      >
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <div style={{ fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: 'var(--text-primary)', fontWeight: '600' }}>{h.title}</div>
                          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '4px' }}>{new Date(h.updatedAt).toLocaleString()}</div>
                        </div>
                        <button
                          onClick={(e) => deleteConversation(e, h._id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', padding: '5px', opacity: 0.7, transition: 'opacity 0.2s' }}
                          onMouseOver={e => e.currentTarget.style.opacity = 1}
                          onMouseOut={e => e.currentTarget.style.opacity = 0.7}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                    
                    {/* New Chat Suggestions */}
                    <div style={{ marginTop: '30px', borderTop: '1px dashed var(--glass-border)', paddingTop: '20px' }}>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '11px', marginBottom: '12px', fontWeight: 'bold', letterSpacing: '1px' }}>START NEW SESSION</div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          {[
                              { icon: '📝', label: 'How do I register to vote?' },
                              { icon: '📄', label: 'Documents required for voting' },
                              { icon: '🗓️', label: 'Upcoming elections' },
                          ].map((opt) => (
                              <button
                                  key={opt.label}
                                  className="welcome-option-btn"
                                  onClick={() => { setActiveConvId(null); setMessages([]); handleSend(opt.label, false); }}
                              >
                                  <span className="welcome-option-icon">{opt.icon}</span>
                                  <span className="welcome-option-label">{opt.label}</span>
                              </button>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                    <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤖</div>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Welcome to VoterAI</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '90%', lineHeight: '1.6', marginBottom: '30px' }}>You have no past sessions. Select a query to start!</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        {[
                            { icon: '📝', label: 'How do I register to vote?' },
                            { icon: '📄', label: 'Documents required for voting' },
                            { icon: '🗓️', label: 'Upcoming elections' },
                        ].map((opt) => (
                            <button
                                key={opt.label}
                                className="welcome-option-btn"
                                onClick={() => handleSend(opt.label, false)}
                            >
                                <span className="welcome-option-icon">{opt.icon}</span>
                                <span className="welcome-option-label">{opt.label}</span>
                            </button>
                        ))}
                    </div>
                  </div>
                )
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                  <div style={{ fontSize: '50px', marginBottom: '20px' }}>🛡️</div>
                  <h3 style={{ marginBottom: '10px', fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Guest Session</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '13px', maxWidth: '90%', lineHeight: '1.6', marginBottom: '30px' }}>You are unauthenticated. Your session won't be saved.</p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                      {[
                          { icon: '📝', label: 'How do I register to vote?' },
                          { icon: '📄', label: 'Documents required for voting' },
                          { icon: '🗓️', label: 'Upcoming elections' },
                      ].map((opt) => (
                          <button
                              key={opt.label}
                              className="welcome-option-btn"
                              onClick={() => handleSend(opt.label, false)}
                          >
                              <span className="welcome-option-icon">{opt.icon}</span>
                              <span className="welcome-option-label">{opt.label}</span>
                          </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="chat-body custom-scrollbar" style={{ display: (!activeConvId && messages.length === 0) ? 'none' : 'flex' }}>
            {messages.map((m, i) => (
              <div key={i} className={`msg-row ${m.role === 'user' ? 'msg-row--user' : 'msg-row--bot'}`}>
                {m.role === 'bot' && m.thought && (
                    <div className="thought-pill">
                        <Zap size={9} />
                        <span>{m.thought}</span>
                    </div>
                )}
                <div className={`message-card ${m.role} animate-fade-in`}>
                  {m.role === 'bot' ? (
                      <>
                          <span className="bot-text" style={{ whiteSpace: 'pre-wrap' }}>{m.content}</span>
                          <button className="copy-btn" onClick={() => handleCopy(m.content, i)}>
                              {copiedIndex === i ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                          </button>
                      </>
                  ) : (
                      m.content
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="msg-row msg-row--bot">
                  <div className="typing-indicator">
                      <span></span><span></span><span></span>
                  </div>
              </div>
            )}

            {/* Official Sources Section */}
            <div className="official-sources-section">
                <button 
                    className="sources-toggle-btn"
                    onClick={() => setSourcesExpanded(!sourcesExpanded)}
                >
                    <span>Official Sources</span>
                    {sourcesExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                <AnimatePresence>
                    {sourcesExpanded && (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="sources-content"
                        >
                            <div className="sources-grid">
                                <a href="https://www.nvsp.in" target="_blank" rel="noopener noreferrer" className="source-link" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <ExternalLink size={14} /><span>NVSP Portal</span>
                                </a>
                                <a href="https://eci.gov.in" target="_blank" rel="noopener noreferrer" className="source-link" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <ExternalLink size={14} /><span>ECI Portal</span>
                                </a>
                                <a href="https://www.eci.gov.in/voter/voter" target="_blank" rel="noopener noreferrer" className="source-link" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <ExternalLink size={14} /><span>Voter Helpline</span>
                                </a>
                                <a href="https://www.aadhaar.gov.in" target="_blank" rel="noopener noreferrer" className="source-link" onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}>
                                    <ExternalLink size={14} /><span>Aadhaar Portal</span>
                                </a>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div ref={chatEndRef} />
          </div>

          <div className="chat-footer">
            {attachedFile && (
              <div style={{ marginBottom: '10px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', backgroundColor: 'var(--bg-input)', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '12px', color: 'var(--accent-blue)', fontWeight: '600' }}>
                📄 {attachedFile.name}
                <button onClick={() => setAttachedFile(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', marginLeft: '5px', fontSize: '16px', lineHeight: '10px' }}>×</button>
              </div>
            )}
            <div className="chat-input-row" style={{ alignItems: 'flex-end' }}>
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={(e) => setAttachedFile(e.target.files[0])}
              />
              <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', backgroundColor: 'transparent', borderRadius: '10px', cursor: 'pointer', color: 'var(--text-secondary)', transition: 'color 0.2s', marginBottom: '4px' }} title="Attach Document" onMouseOver={e => e.currentTarget.style.color = 'var(--text-primary)'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
              </label>
              <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputText}
                  onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          if (!isLoading) {
                              handleSend();
                              if (textareaRef.current) textareaRef.current.style.height = 'auto';
                          }
                      }
                  }}
                  placeholder="Ask about voting, registration…"
                  className="chat-input custom-scrollbar"
                  disabled={isLoading}
                  rows={1}
              />
              <button
                  onClick={() => {
                      setVoiceEnabled(v => {
                          if (v && 'speechSynthesis' in window) window.speechSynthesis.cancel();
                          return !v;
                      });
                  }}
                  className="chat-mic-btn"
                  aria-label="Toggle Voice Response"
                  title={voiceEnabled ? 'Voice Response: ON — click to turn off' : 'Voice Response: OFF — click to turn on'}
                  style={{
                      marginBottom: '4px',
                      marginRight: '4px',
                      color: voiceEnabled ? '#ffffff' : 'var(--text-secondary)',
                      background: voiceEnabled ? 'var(--accent-blue)' : 'transparent',
                      border: voiceEnabled ? '1.5px solid var(--accent-blue)' : '1.5px solid transparent',
                      borderRadius: '10px',
                      padding: '4px 8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer',
                  }}
              >
                  <span style={{ fontSize: '13px' }}>{voiceEnabled ? '🔊' : '🔇'}</span>
                  <span>{voiceEnabled ? 'Voice ON' : 'Voice'}</span>
              </button>
              <button
                  onClick={isListening ? stopListening : startListening}
                  className={`chat-mic-btn ${isListening ? 'listening' : ''}`}
                  aria-label="Voice Input"
                  style={{ marginBottom: '4px', marginRight: '8px' }}
              >
                  {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                  onClick={() => {
                      handleSend();
                      if (textareaRef.current) textareaRef.current.style.height = 'auto';
                  }}
                  disabled={isLoading || (!input.trim() && !attachedFile)}
                  className="chat-send-btn"
                  aria-label="Send"
                  style={{ marginBottom: '4px' }}
              >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
              </button>
            </div>
            
            <div className="chat-footer-meta" style={{ marginTop: '8px' }}>
                <span className="flex items-center gap-1" style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                    <Shield size={10} /> Secure session
                </span>
            </div>
          </div>
            </div>
          </Rnd>
        </div>
        );
      })()}
    </div>
  );
};

export default App;
