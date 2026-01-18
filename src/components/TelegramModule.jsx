import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const TelegramModule = () => {
    const [status, setStatus] = useState('Disconnected');
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [botToken, setBotToken] = useState('7847423927:AAHlH6c-rQ_...'); // Placeholder
    const [targetChatId, setTargetChatId] = useState('');
    const socketRef = useRef(null);

    useEffect(() => {
        // Connect to our local bridge server
        socketRef.current = io('http://localhost:3001');

        socketRef.current.on('connect', () => setStatus('Connected to Bridge'));
        socketRef.current.on('bot-reply', (msg) => {
            setMessages(prev => [...prev, { type: 'bot', text: msg }]);
        });

        return () => socketRef.current.disconnect();
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (!input) return;

        // Add to UI
        setMessages(prev => [...prev, { type: 'user', text: input }]);

        // Send to Server
        socketRef.current.emit('user-message', { token: botToken, chatId: targetChatId, text: input });
        setInput('');
    };

    return (
        <div className="animate-fade-in" style={{ height: '100%', display: 'flex', gap: '2rem' }}>
            {/* Configuration Panel */}
            <div className="card" style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3>🤖 Bot Configuration</h3>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Bot Token</label>
                    <input
                        type="password" value={botToken} onChange={e => setBotToken(e.target.value)}
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }}
                    />
                </div>
                <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target Chat ID (Optional)</label>
                    <input
                        type="text" value={targetChatId} onChange={e => setTargetChatId(e.target.value)} placeholder="@channel or ID"
                        style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '4px', color: 'white' }}
                    />
                </div>
                <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', marginTop: 'auto' }}>
                    <p style={{ fontSize: '0.8rem', color: '#60a5fa' }}>Status: {status}</p>
                </div>
            </div>

            {/* Chat Interface */}
            <div className="card" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                    <h4>Live Telegram Feed</h4>
                </div>

                <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {messages.map((m, i) => (
                        <div key={i} style={{
                            alignSelf: m.type === 'user' ? 'flex-end' : 'flex-start',
                            maxWidth: '70%',
                            padding: '1rem',
                            borderRadius: '12px',
                            background: m.type === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            borderTopRightRadius: m.type === 'user' ? '2px' : '12px',
                            borderTopLeftRadius: m.type === 'bot' ? '2px' : '12px'
                        }}>
                            <p style={{ fontSize: '0.9rem' }}>{m.text}</p>
                        </div>
                    ))}
                    {messages.length === 0 && (
                        <div style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '4rem' }}>
                            Start typing to interact with the bot...
                        </div>
                    )}
                </div>

                <form onSubmit={sendMessage} style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', gap: '1rem' }}>
                    <input
                        type="text" placeholder="Send command..." value={input} onChange={e => setInput(e.target.value)}
                        style={{ flex: 1, padding: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '8px', color: 'white' }}
                    />
                    <button className="btn">Send ➤</button>
                </form>
            </div>
        </div>
    );
};

export default TelegramModule;
