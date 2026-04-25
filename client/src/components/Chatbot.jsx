import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import axios from 'axios';
import { Send, X, Cpu, Zap, Trash2, Shield, ExternalLink, Settings, Moon, Sun, Monitor, Maximize, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Quick-start options shown in the welcome card ──────────────────────────
const QUICK_OPTIONS = [
    { icon: '📝', label: 'How do I register to vote?', query: 'How do I register to vote?' },
    { icon: '📄', label: 'Documents required', query: 'Documents required for voting' },
    { icon: '🗓️', label: 'Upcoming elections', query: 'Upcoming elections' },
];

// ── Standalone Welcome Card ────────────────────────────────────────────────
const WelcomeCard = ({ onOptionClick }) => (
    <div className="welcome-card animate-fade-in">
        <div className="welcome-avatar">
            <span>🗳️</span>
        </div>
        <h2 className="welcome-title">Hi there! 👋</h2>
        <p className="welcome-subtitle">
            I can help you with voting &amp; elections in India.<br />
            What would you like to do today?
        </p>

        <div className="welcome-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {QUICK_OPTIONS.map((opt) => (
                <button
                    key={opt.label}
                    className="welcome-option-btn"
                    onClick={() => onOptionClick(opt.query)}
                >
                    <span className="welcome-option-icon">{opt.icon}</span>
                    <span className="welcome-option-label">{opt.label}</span>
                </button>
            ))}
        </div>

        <a
            href="https://www.nvsp.in"
            target="_blank"
            rel="noopener noreferrer"
            className="welcome-nvsp-btn"
        >
            <ExternalLink size={13} />
            Visit NVSP Portal
        </a>
    </div>
);

// ── Main Chatbot Component ────────────────────────────────────────────────
const Chatbot = ({ isOpen, onClose }) => {
    const [showWelcome, setShowWelcome] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [theme, setTheme] = useState('system');
    const [chatSize, setChatSize] = useState('medium');
    const [copiedIndex, setCopiedIndex] = useState(null);

    const chatContainerRef = useRef(null);
    const textareaRef = useRef(null);

    // Initialize Theme
    useEffect(() => {
        const savedTheme = localStorage.getItem('voterai-theme') || 'system';
        setTheme(savedTheme);
        applyTheme(savedTheme);
    }, []);

    const applyTheme = (t) => {
        if (t === 'dark') {
            document.documentElement.removeAttribute('data-theme');
        } else if (t === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            // System
            const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
            if (prefersLight) {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
        }
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        localStorage.setItem('voterai-theme', newTheme);
        applyTheme(newTheme);
    };

    // Auto-scroll on new messages
    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    // Textarea auto-resize
    const handleInput = (e) => {
        setInput(e.target.value);
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    };

    const handleClose = () => {
        onClose();
    };

    const handleClear = () => {
        setMessages([]);
        setShowWelcome(true);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleCopy = (text, idx) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(idx);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    // Core send logic
    const handleSendMessage = async (text) => {
        const msgText = (text || input).trim();
        if (!msgText || isLoading) return;

        setShowWelcome(false);
        setInput('');
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
        setMessages(prev => [...prev, { role: 'user', content: msgText, timestamp: new Date() }]);
        setIsLoading(true);

        try {
            const res = await axios.post('https://chatbot-0g7m.onrender.com/api/chat', {
                message: msgText,
            });

            const { content, thought } = res.data;

            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'bot',
                    content: content || 'Sorry, I could not process that.',
                    thought,
                    timestamp: new Date(),
                }]);
                setIsLoading(false);
            }, 500);
        } catch {
            setMessages(prev => [...prev, {
                role: 'bot',
                content: 'Connection failed. Please check the server status.',
                timestamp: new Date(),
            }]);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <motion.div 
            className={`chat-window size-${chatSize}`}
            drag={chatSize !== 'fullscreen'}
            dragConstraints={{ left: -500, right: 0, top: -500, bottom: 0 }}
            dragElastic={0.1}
            dragMomentum={false}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
        >
            {/* ── Header ───────────────────────────────────────────── */}
            <div className="chat-header">
                <div className="flex items-center gap-3">
                    <div className="chat-header-avatar">
                        <Cpu size={18} color="white" />
                    </div>
                    <div>
                        <h3 className="chat-header-title">VoterAI</h3>
                        <div className="chat-header-status">
                            <div className="status-dot"></div>
                            <span>Online · Electoral Assistant</span>
                        </div>
                    </div>
                </div>
                <div className="chat-header-actions">
                    <button 
                        onClick={() => setShowSettings(!showSettings)} 
                        className="chat-settings-btn" 
                        aria-label="Settings" 
                        style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <Settings size={18} />
                    </button>
                    <button onClick={handleClose} className="chat-close-btn" aria-label="Close">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {/* ── Settings Panel ───────────────────────────────────── */}
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
                            <span className="setting-label">Theme</span>
                            <div className="setting-btn-group">
                                <button className={`setting-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => handleThemeChange('light')}><Sun size={14} /></button>
                                <button className={`setting-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => handleThemeChange('dark')}><Moon size={14} /></button>
                                <button className={`setting-btn ${theme === 'system' ? 'active' : ''}`} onClick={() => handleThemeChange('system')}><Monitor size={14} /></button>
                            </div>
                        </div>
                        <div className="setting-item">
                            <span className="setting-label">Window Size</span>
                            <div className="setting-btn-group">
                                <button className={`setting-btn ${chatSize === 'small' ? 'active' : ''}`} onClick={() => setChatSize('small')}>S</button>
                                <button className={`setting-btn ${chatSize === 'medium' ? 'active' : ''}`} onClick={() => setChatSize('medium')}>M</button>
                                <button className={`setting-btn ${chatSize === 'fullscreen' ? 'active' : ''}`} onClick={() => setChatSize('fullscreen')}><Maximize size={14} /></button>
                            </div>
                        </div>
                        <div className="setting-item">
                            <span className="setting-label">Language</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>Auto-detect ✨</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div ref={chatContainerRef} className="chat-body custom-scrollbar">
                {showWelcome ? (
                    <WelcomeCard onOptionClick={handleSendMessage} />
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`msg-row ${msg.role === 'user' ? 'msg-row--user' : 'msg-row--bot'}`}>
                                {msg.role === 'bot' && msg.thought && (
                                    <div className="thought-pill">
                                        <Zap size={9} />
                                        <span>{msg.thought}</span>
                                    </div>
                                )}

                                <div className={`message-card ${msg.role} animate-fade-in`}>
                                    {msg.role === 'bot' ? (
                                        <>
                                            <span className="bot-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
                                            <button className="copy-btn" onClick={() => handleCopy(msg.content, idx)}>
                                                {copiedIndex === idx ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                                            </button>
                                        </>
                                    ) : (
                                        msg.content
                                    )}
                                    <div className="message-meta">
                                        {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </div>
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
                    </>
                )}
            </div>

            {/* ── Input Bar ────────────────────────────────────────── */}
            <div className="chat-footer">
                <div className="chat-input-row">
                    <textarea
                        ref={textareaRef}
                        value={input}
                        onChange={handleInput}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                if (!isLoading) handleSendMessage();
                            }
                        }}
                        placeholder="Ask about voting, registration…"
                        className="chat-input custom-scrollbar"
                        disabled={isLoading}
                        rows={1}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="chat-send-btn"
                        aria-label="Send"
                        style={{ marginBottom: '4px' }}
                    >
                        <Send size={16} />
                    </button>
                </div>

                <div className="chat-footer-meta">
                    <span className="flex items-center gap-1">
                        <Shield size={9} /> Secure session
                    </span>
                    <button onClick={handleClear} className="chat-clear-btn">
                        <Trash2 size={9} /> New chat
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default Chatbot;
