import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import axios from 'axios';
import { Send, X, Cpu, Zap, Activity, Trash2, Bot, Shield } from 'lucide-react';

const Chatbot = ({ isOpen, onClose }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [sessionId, setSessionId] = useState('');
    
    const chatContainerRef = useRef(null);

    // Reliable Scrolling
    useLayoutEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const sid = `sid-${Math.random().toString(36).substring(2, 11)}`;
            setSessionId(sid);
            handleSendMessage("Hello", sid, false);
        }
    }, [isOpen]);

    const handleSendMessage = async (text, sid = sessionId, showUser = true) => {
        const msgText = text || input;
        if (!msgText.trim() || isLoading) return;

        if (showUser) {
            setInput('');
            setMessages(prev => [...prev, { role: 'user', content: msgText, timestamp: new Date() }]);
        }

        setIsLoading(true);

        try {
            const res = await axios.post('https://chatbot-0g7m.onrender.com/api/chat', {
                sessionId: sid,
                message: msgText
            });

            const { response, thought } = res.data;

            setTimeout(() => {
                setMessages(prev => [...prev, { 
                    role: 'bot', 
                    content: response, 
                    thought, 
                    timestamp: new Date() 
                }]);
                setIsLoading(false);
            }, 600);
        } catch (err) {
            setMessages(prev => [...prev, { 
                role: 'bot', 
                content: "System connection failed. Please check the server status.", 
                timestamp: new Date() 
            }]);
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-window animate-fade-in">
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                        <Cpu size={20} color="white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">VoterAI Core</h3>
                        <div className="flex items-center gap-1.5 opacity-50">
                            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-[9px] uppercase font-bold tracking-widest text-blue-400">V3.5 Neural</span>
                        </div>
                    </div>
                </div>
                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400">
                    <X size={20} />
                </button>
            </div>

            {/* Messages */}
            <div 
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-6 flex flex-col gap-6 custom-scrollbar"
            >
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} gap-1`}>
                        {msg.role === 'bot' && msg.thought && (
                            <div className="thought-bubble">
                                {msg.thought}
                            </div>
                        )}
                        <div className={`message-card ${msg.role}`}>
                            {msg.content}
                            <div style={{ fontSize: '9px', marginTop: '6px', opacity: 0.4, textAlign: 'right' }}>
                                {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {isLoading && (
                    <div className="flex flex-col items-start gap-2 opacity-50">
                        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                            <Activity size={10} className="animate-spin" /> Processing...
                        </div>
                        <div className="message-card bot" style={{ width: '60px' }}>
                            <div className="flex gap-1">
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></div>
                                <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-6 bg-black/20 border-t border-white/10">
                <div className="flex items-center gap-3">
                    <input 
                        type="text" value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSendMessage()}
                        placeholder="Message the core..."
                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition-all placeholder:text-gray-600"
                    />
                    <button 
                        onClick={() => handleSendMessage()}
                        disabled={isLoading || !input.trim()}
                        className="w-11 h-11 flex items-center justify-center bg-blue-600 rounded-xl text-white shadow-lg disabled:opacity-30 hover:bg-blue-500 transition-all"
                    >
                        <Send size={18} />
                    </button>
                </div>
                <div className="mt-4 flex justify-between items-center opacity-40">
                    <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <Shield size={10} /> Encrypted Session
                    </p>
                    <button onClick={() => setMessages([])} className="text-[9px] hover:text-red-400 font-bold uppercase tracking-widest transition-colors flex items-center gap-1">
                        <Trash2 size={10} /> Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
