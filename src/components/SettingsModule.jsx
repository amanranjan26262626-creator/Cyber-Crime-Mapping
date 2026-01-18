import React from 'react';

const SettingsModule = () => {
    return (
        <div className="animate-fade-in">
            <h2 className="glow-text" style={{ marginBottom: '2rem' }}>System Configuration</h2>

            <div className="card" style={{ maxWidth: '600px', marginBottom: '1.5rem' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>API Configuration</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>Leakosint API Key</label>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input type="password" value="14676813173:app:siWbMMzB" readOnly style={{
                                flex: 1, padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-muted)'
                            }} />
                            <button className="btn" style={{ padding: '0.5rem 1rem' }}>Update</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ maxWidth: '600px' }}>
                <h3 style={{ marginBottom: '1.5rem' }}>Appearance</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    {['Dark Cyber', 'Light Operational', 'High Contrast'].map(theme => (
                        <div key={theme} style={{
                            padding: '1rem', border: '1px solid var(--border)', borderRadius: '8px', cursor: 'pointer',
                            background: theme === 'Dark Cyber' ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            borderColor: theme === 'Dark Cyber' ? 'var(--primary)' : 'var(--border)'
                        }}>
                            <div style={{ width: '100%', height: '40px', background: theme === 'Light Operational' ? '#e2e8f0' : '#0f172a', marginBottom: '0.5rem', borderRadius: '4px' }}></div>
                            <p style={{ fontSize: '0.9rem', textAlign: 'center' }}>{theme}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SettingsModule;
