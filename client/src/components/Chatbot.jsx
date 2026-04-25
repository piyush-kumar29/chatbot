import React, { useState, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import { Send, X, Cpu, Zap, Activity, Trash2, Shield, ExternalLink } from 'lucide-react';


// ── Quick-start options shown in the welcome card ──────────────────────────
const QUICK_OPTIONS = [
    { icon: '🗳️', label: 'Register as a Voter',  query: 'How do I register as a new voter in India?' },
    { icon: '📋', label: 'Check Eligibility',     query: 'Am I eligible to vote in India?' },
    { icon: '🗓️', label: 'Upcoming Elections',    query: 'What are the upcoming elections in India?' },
    { icon: '🧾', label: 'Voting Process',         query: 'How does the voting process work in India?' },
];

// ── Standalone Welcome Card ────────────────────────────────────────────────
const WelcomeCard = ({ onOptionClick }) => (
    <div className="welcome-card animate-fade-in">
        {/* Avatar + greeting */}
        <div className="welcome-avatar">
            <span>🗳️</span>
        </div>
        <h2 className="welcome-title">Hi there! 👋</h2>
        <p className="welcome-subtitle">
            I can help you with voting &amp; elections in India.<br />
            What would you like to do today?
        </p>

        {/* Option buttons — 2 × 2 grid */}
        <div className="welcome-options">
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

        {/* NVSP portal link */}
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
    // `showWelcome` drives whether we show the card or the message thread
    const [showWelcome, setShowWelcome] = useState(true);
    const [messages, setMessages] = useState([]);
    const [input, setInput]         = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const chatContainerRef = useRef(null);

    // Auto-scroll on new messages
    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages, isLoading]);

    // Reset to welcome card when the chat is reopened fresh
    const handleClose = () => {
        onClose();
    };

    const handleClear = () => {
        setMessages([]);
        setShowWelcome(true);
    };

    // Core send logic (called from input bar OR welcome card option click)
    const handleSendMessage = async (text) => {
        const msgText = (text || input).trim();
        if (!msgText || isLoading) return;

        // First message: hide welcome card, show thread
        setShowWelcome(false);
        setInput('');
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
        <div className="chat-window animate-fade-in">

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
                <button onClick={handleClose} className="chat-close-btn" aria-label="Close">
                    <X size={18} />
                </button>
            </div>

            {/* ── Body ─────────────────────────────────────────────── */}
            <div
                ref={chatContainerRef}
                className="chat-body custom-scrollbar"
            >
                {showWelcome ? (
                    <WelcomeCard onOptionClick={handleSendMessage} />
                ) : (
                    <>
                        {messages.map((msg, idx) => (
                            <div
                                key={idx}
                                className={`msg-row ${msg.role === 'user' ? 'msg-row--user' : 'msg-row--bot'}`}
                            >
                                {/* Thought pill — only for bot */}
                                {msg.role === 'bot' && msg.thought && (
                                    <div className="thought-pill">
                                        <Zap size={9} />
                                        <span>{msg.thought}</span>
                                    </div>
                                )}

                                <div className={`message-card ${msg.role} animate-fade-in`}>
                                    {msg.role === 'bot' ? (
                                        <span className="bot-text" style={{ whiteSpace: 'pre-wrap' }}>{msg.content}</span>
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
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder="Ask about voting, registration…"
                        className="chat-input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="chat-send-btn"
                        aria-label="Send"
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
        </div>
    );
};

export default Chatbot;
