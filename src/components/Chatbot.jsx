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

    const saveToSupabase = async (finalData) => {
        try {
            const { error } = await supabase
                .from('chat_conversations')
                .insert({
                    user_name: finalData.name,
                    user_email: finalData.email,
                    company: finalData.company,
                    stage: finalData.stage,
                    challenge: finalData.challenge,
                    budget: finalData.budget,
                    timeline: finalData.timeline,
                    messages: messages // Save full chat history
                });
            if (error) console.error('Error saving chat:', error);
        } catch (err) {
            console.error('Failed to sync with Supabase:', err);
        }
    };

    const processResponse = (response) => {
        const newUserData = { ...userData };

        switch (currentStep) {
            case 'greeting':
                newUserData.name = response;
                setUserData(newUserData);
                addBotMessage(`Nice to meet you, ${response}! 🎯 To better understand your needs, could you share your email address?`);
                setCurrentStep('email');
                break;

            case 'email':
                newUserData.email = response;
                setUserData(newUserData);
                addBotMessage(`Thanks! What's your company name?`);
                setCurrentStep('company');
                break;

            case 'company':
                newUserData.company = response;
                setUserData(newUserData);
                addBotMessage(`Great! What stage is ${response} currently at?`, 500);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'options',
                        options: [
                            { value: 'idea', label: 'Idea Stage' },
                            { value: 'mvp', label: 'Building MVP' },
                            { value: 'launched', label: 'Just Launched' },
                            { value: 'growing', label: 'Scaling/Growing' },
                            { value: 'series-a', label: 'Series A+' }
                        ]
                    }]);
                }, 1000);
                setCurrentStep('stage');
                break;

            case 'stage':
                newUserData.stage = response;
                setUserData(newUserData);
                addBotMessage(`Perfect! What's your biggest technology challenge right now?`, 500);
                setTimeout(() => {
                    setMessages(prev => [...prev, {
                        type: 'options',
                        options: [
                            { value: 'infrastructure', label: '🏗️ Need cloud infrastructure' },
                            { value: 'devops', label: '⚙️ DevOps & automation' },
                            { value: 'scaling', label: '📈 Scaling issues' },
                            { value: 'costs', label: '💰 High cloud costs' },
                            { value: 'security', label: '🔒 Security & compliance' },
                            { value: 'automation', label: '🤖 Process automation' },
                            { value: 'other', label: '💡 Something else' }
                        ]
                    }]);
                }, 1000);
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
        <div style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 1000,
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
                    <div style={{
                        background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
                        color: 'white',
                        padding: '1.25rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '32px', height: '32px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🤖</div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1rem' }}>AI Consultant</h3>
                                <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>Online</div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
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
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'var(--text-primary)',
                                        padding: '0.875rem 1rem',
                                        borderRadius: '16px 16px 16px 4px',
                                        fontSize: '0.9rem',
                                        lineHeight: '1.5',
                                        whiteSpace: 'pre-line'
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
                                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--border-accent)', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                                        <h4 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>Summary Sent!</h4>
                                        <p>Our team will reach out shortly.</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Typing...</div>}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    {currentStep !== 'complete' && (
                        <form onSubmit={handleSubmit} style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                value={inputValue}
                                onChange={e => setInputValue(e.target.value)}
                                placeholder="Type a message..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid var(--border-light)',
                                    borderRadius: '12px',
                                    padding: '0.6rem 1rem',
                                    color: 'var(--text-primary)',
                                    fontSize: '0.9rem'
                                }}
                            />
                            <button type="submit" className="btn" style={{ padding: '0.6rem', marginBottom: 0, minWidth: 'auto', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                ➤
                            </button>
                        </form>
                    )}
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--accent-primary)',
                    border: 'none',
                    color: 'white',
                    fontSize: '1.5rem',
                    cursor: 'pointer',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'transform 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.1)'}
                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
            >
                {isOpen ? '×' : '💬'}
            </button>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .btn-small {
                    background: transparent;
                    border: 1px solid var(--border-light);
                    color: var(--text-primary);
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }
                .btn-small:hover {
                    border-color: var(--accent-primary);
                    color: var(--accent-primary);
                    background: rgba(99, 102, 241, 0.05);
                }
            `}</style>
        </div>
    );
}