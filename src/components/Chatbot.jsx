import { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

export default function Chatbot({ isOpen, setIsOpen }) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [currentStep, setCurrentStep] = useState('greeting');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        company: '',
        stage: '',
        challenge: '',
        budget: '',
        timeline: ''
    });
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const [floatingPos, setFloatingPos] = useState({ x: null, y: null });
    const isDraggingRef = useRef(false);
    const dragOffsetRef = useRef({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            // Initial greeting when opened for the first time
            addBotMessage("👋 Hello! I'm your virtual assistant. I'm here to help you find the perfect technology solution for your startup. What's your name?");
        }
    }, [isOpen]);

    useEffect(() => {
        if (floatingPos.x !== null && floatingPos.y !== null) return;
        if (typeof window === 'undefined') return;

        const margin = 24;
        const defaultWidth = 380;
        const defaultHeight = 520;
        const toggleSize = 64;
        const gap = 16;

        const x = Math.max(margin, window.innerWidth - defaultWidth - margin);
        const y = Math.max(margin, window.innerHeight - (defaultHeight + toggleSize + gap + margin));
        setFloatingPos({ x, y });
    }, [floatingPos.x, floatingPos.y]);

    useEffect(() => {
        const onMove = (clientX, clientY) => {
            if (!isDraggingRef.current) return;
            const el = containerRef.current;
            const rect = el ? el.getBoundingClientRect() : { width: 420, height: 620 };

            const margin = 8;
            const nextX = clientX - dragOffsetRef.current.x;
            const nextY = clientY - dragOffsetRef.current.y;

            const maxX = window.innerWidth - rect.width - margin;
            const maxY = window.innerHeight - rect.height - margin;

            setFloatingPos({
                x: Math.min(Math.max(margin, nextX), Math.max(margin, maxX)),
                y: Math.min(Math.max(margin, nextY), Math.max(margin, maxY))
            });
        };

        const handleMouseMove = (e) => onMove(e.clientX, e.clientY);
        const handleTouchMove = (e) => {
            if (!e.touches || e.touches.length === 0) return;
            onMove(e.touches[0].clientX, e.touches[0].clientY);
        };
        const stopDragging = () => { isDraggingRef.current = false; };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', stopDragging);
        document.addEventListener('touchmove', handleTouchMove, { passive: true });
        document.addEventListener('touchend', stopDragging);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', stopDragging);
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', stopDragging);
        };
    }, []);

    const addBotMessage = (text, delay = 800) => {
        setIsTyping(true);
        setTimeout(() => {
            setMessages(prev => [...prev, { type: 'bot', text }]);
            setIsTyping(false);
        }, delay);
    };

    const addUserMessage = (text) => {
        setMessages(prev => [...prev, { type: 'user', text }]);
    };

    const handleQuickReply = (value, label) => {
        addUserMessage(label || value);
        processResponse(value);
    };

    const processResponse = (response) => {
        const newUserData = { ...userData };
        
        switch (currentStep) {
            case 'greeting':
                newUserData.name = response;
                setUserData(newUserData);
                addBotMessage(`Nice to meet you, ${response}! What's your email address so I can send you a personalized proposal?`, 500);
                setCurrentStep('email');
                break;

            case 'email':
                newUserData.email = response;
                setUserData(newUserData);
                addBotMessage(`Thanks! What's your company name and what stage are you at?`, 500);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'options',
                        options: [
                            { value: 'idea', label: 'Idea/Pre-Seed' },
                            { value: 'mvp', label: 'MVP/Seed Stage' },
                            { value: 'launched', label: 'Launched/Growing' },
                            { value: 'series-a', label: 'Series A+' }
                        ]
                    }]);
                }, 1000);
                setCurrentStep('stage');
                break;

            case 'stage':
                newUserData.stage = response;
                setUserData(newUserData);
                addBotMessage(`Great! What's your biggest technical challenge right now?`, 500);
                setCurrentStep('challenge');
                break;

            case 'challenge':
                newUserData.challenge = response;
                setUserData(newUserData);
                addBotMessage(`I understand. When are you looking to get started?`, 500);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'options',
                        options: [
                            { value: 'asap', label: 'ASAP - Urgent' },
                            { value: '2weeks', label: 'Within 2 weeks' },
                            { value: 'month', label: 'Within a month' },
                            { value: 'exploring', label: 'Just exploring' }
                        ]
                    }]);
                }, 1000);
                setCurrentStep('timeline');
                break;

            case 'timeline':
                newUserData.timeline = response;
                setUserData(newUserData);
                addBotMessage(`Got it! Last question - what's your approximate monthly budget for infrastructure and DevOps?`, 500);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'options',
                        options: [
                            { value: 'under-5k', label: 'Under $5k/month' },
                            { value: '5k-15k', label: '$5k - $15k/month' },
                            { value: '15k-30k', label: '$15k - $30k/month' },
                            { value: 'over-30k', label: 'Over $30k/month' },
                            { value: 'flexible', label: 'Flexible/Not sure' }
                        ]
                    }]);
                }, 1000);
                setCurrentStep('budget');
                break;

            case 'budget':
                newUserData.budget = response;
                setUserData(newUserData);

                // Generate summary and recommendation
                const summary = generateSummary(newUserData);
                addBotMessage(summary, 800);

                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'final',
                        data: newUserData
                    }]);
                    saveToSupabase(newUserData);
                }, 2000);

                setCurrentStep('complete');
                break;

            default:
                break;
        }
    };

    const generateSummary = (data) => {
        const recommendations = {
            'idea': 'Our Startup Launch Pack would be perfect for you',
            'mvp': 'We can help you build a solid foundation with our MVP Infrastructure Setup',
            'launched': 'Our Platform Optimization service can help you scale efficiently',
            'growing': 'Our Growth Engineering package is designed for your stage',
            'series-a': 'Our Enterprise-Grade Solutions align with your maturity level'
        };

        return `Excellent! Based on our conversation, ${data.name}, here's what I recommend:\n\n✨ ${recommendations[data.stage] || 'We have the perfect solution for your needs'}.\n\n📊 I've prepared a customized proposal based on your requirements. Our team will review this and reach out to you at ${data.email} within 24 hours.`;
    };

    const saveToSupabase = async (data) => {
        try {
            const { error } = await supabase
                .from('leads')
                .insert([{
                    name: data.name,
                    email: data.email,
                    company: data.company || '',
                    stage: data.stage,
                    challenge: data.challenge,
                    budget: data.budget,
                    timeline: data.timeline,
                    source: 'chatbot',
                    created_at: new Date().toISOString()
                }]);
            
            if (error) {
                console.error('Error saving to Supabase:', error);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputValue.trim()) {
            addUserMessage(inputValue);
            processResponse(inputValue);
            setInputValue('');
        }
    };

    if (!setIsOpen) return null; // Placeholder for safety

    return (
        <div ref={containerRef} style={{
            position: 'fixed',
            left: floatingPos.x !== null ? `${floatingPos.x}px` : 'auto',
            top: floatingPos.y !== null ? `${floatingPos.y}px` : 'auto',
            right: floatingPos.x === null ? '2rem' : 'auto',
            bottom: floatingPos.y === null ? '2rem' : 'auto',
            zIndex: 2500,
            fontFamily: 'var(--font-primary, system-ui, sans-serif)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            {/* Chat Window */}
            {isOpen && (
                <div style={{
                    width: '380px',
                    height: '520px',
                    background: 'var(--bg-secondary)',
                    borderRadius: '24px',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--border-light)',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                    marginBottom: '1rem',
                    animation: 'slideUp 0.3s ease-out'
                }}>
                    {/* Header */}
                    <div
                        onMouseDown={(e) => {
                            isDraggingRef.current = true;
                            const rect = containerRef.current?.getBoundingClientRect();
                            const baseX = rect ? rect.left : 0;
                            const baseY = rect ? rect.top : 0;
                            dragOffsetRef.current = { x: e.clientX - baseX, y: e.clientY - baseY };
                        }}
                        onTouchStart={(e) => {
                            if (!e.touches || e.touches.length === 0) return;
                            isDraggingRef.current = true;
                            const rect = containerRef.current?.getBoundingClientRect();
                            const baseX = rect ? rect.left : 0;
                            const baseY = rect ? rect.top : 0;
                            dragOffsetRef.current = { x: e.touches[0].clientX - baseX, y: e.touches[0].clientY - baseY };
                        }}
                        style={{
                        background: '#1e293b !important',
                        color: '#ffffff !important',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        borderBottom: '3px solid #4f46e5 !important',
                        cursor: 'move',
                        userSelect: 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', background: '#4f46e5 !important', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>🤖</div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem !important', fontWeight: '800 !important', color: '#ffffff !important', lineHeight: '1.2', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>AI Consultant</h3>
                                <div style={{ fontSize: '0.9rem !important', color: '#10b981 !important', fontWeight: '600 !important', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}>● Online</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: '#ef4444 !important', border: 'none', color: '#ffffff !important', cursor: 'pointer', fontSize: '1.5rem', fontWeight: 'bold', padding: '0.5rem', borderRadius: '6px', transition: 'background 0.2s', minWidth: '40px', minHeight: '40px' }}>×</button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {messages.map((msg, index) => (
                            <div key={index} style={{
                                alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%'
                            }}>
                                {msg.type === 'bot' && (
                                    <div style={{
                                        background: 'rgba(99, 102, 241, 0.1)',
                                        color: '#ffffff',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '16px 16px 16px 4px',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-line',
                                        border: '1px solid rgba(99, 102, 241, 0.2)'
                                    }}>
                                        {msg.text}
                                    </div>
                                )}
                                {msg.type === 'user' && (
                                    <div style={{
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '16px 16px 4px 16px',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5'
                                    }}>
                                        {msg.text}
                                    </div>
                                )}
                                {msg.type === 'options' && (
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                                        {msg.options.map((opt, i) => (
                                            <button key={i} onClick={() => handleQuickReply(opt.value, opt.label)} className="btn-small" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {msg.type === 'final' && (
                                    <div style={{ 
                                        background: 'rgba(99, 102, 241, 0.15)', 
                                        border: '1px solid rgba(99, 102, 241, 0.3)', 
                                        padding: '1rem', 
                                        borderRadius: '12px', 
                                        fontSize: '0.85rem',
                                        color: '#ffffff'
                                    }}>
                                        <h4 style={{ color: '#ffffff', marginTop: 0, marginBottom: '0.5rem' }}>Summary Sent!</h4>
                                        <p style={{ color: '#e5e7eb', margin: 0 }}>Our team will reach out shortly.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && <div style={{ color: '#9ca3af', fontSize: '0.8rem' }}>Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {currentStep !== 'complete' && (
                        <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    borderRadius: '12px',
                                    padding: '0.6rem 1rem',
                                    color: '#ffffff',
                                    fontSize: '0.9rem',
                                    placeholderColor: '#9ca3af'
                                }}
                            />
                            <button type="submit" className="btn" style={{ padding: '0.6rem', marginBottom: 0, minWidth: 'auto', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ➤
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Professional Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.8rem',
                    cursor: 'pointer',
                    boxShadow: '0 8px 32px rgba(99, 102, 241, 0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
                onMouseOver={e => {
                    e.currentTarget.style.transform = 'scale(1.05) translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(99, 102, 241, 0.4)';
                }}
                onMouseOut={e => {
                    e.currentTarget.style.transform = 'scale(1) translateY(0)';
                    e.currentTarget.style.boxShadow = '0 8px 32px rgba(99, 102, 241, 0.3)';
                }}
            >
                {/* Professional Chat Icon */}
                <svg 
                    width="28" 
                    height="28" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ 
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                    }}
                >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="8" y1="9" x2="16" y2="9"></line>
                    <line x1="8" y1="13" x2="14" y2="13"></line>
                </svg>
                
                {/* Pulse Animation */}
                <div 
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '100%',
                        height: '100%',
                        borderRadius: '16px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        animation: isOpen ? 'none' : 'pulse 2s infinite'
                    }}
                />
            </button>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes pulse {
                    0% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
                    50% { opacity: 0.1; transform: translate(-50%, -50%) scale(1.05); }
                    100% { opacity: 0.3; transform: translate(-50%, -50%) scale(0.95); }
                }
                .btn-small {
                    background: rgba(99, 102, 241, 0.1);
                    border: 1px solid rgba(99, 102, 241, 0.3);
                    color: #ffffff;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-small:hover {
                    border-color: rgba(99, 102, 241, 0.5);
                    color: #ffffff;
                    background: rgba(99, 102, 241, 0.2);
                }
            `}</style>
        </div>
    );
}
