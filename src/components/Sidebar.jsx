import React from 'react';

const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '⚡' },
        { id: 'search', label: 'Investigation Search', icon: '🔍' },
        { id: 'network', label: 'AI Investigation Portal', icon: '🕷️' }, // Promoted to top

        { id: 'tg_info', label: 'Telegram Info', icon: '📱' },
        { id: 'cases', label: 'Case Management', icon: '📁' },
        { id: 'reports', label: 'Reports', icon: '📄' },
        { id: 'access', label: 'User Access', icon: '🔐' },
        { id: 'settings', label: 'Settings', icon: '⚙️' },
    ];

    return (
        <div className="sidebar">
            <div style={{ padding: '0 0 2rem 0', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                    width: '32px', height: '32px', background: 'var(--primary)',
                    borderRadius: '8px', display: 'grid', placeItems: 'center', fontWeight: 'bold'
                }}>CL</div>
                <h1 style={{ fontSize: '1.25rem', fontWeight: '700', letterSpacing: '0.5px' }}>CYBERLENS</h1>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            background: activeTab === item.id ? 'var(--primary)' : 'transparent',
                            color: activeTab === item.id ? 'white' : 'var(--text-muted)',
                            border: 'none',
                            padding: '0.875rem 1rem',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: activeTab === item.id ? '600' : '500',
                            textAlign: 'left',
                            transition: 'all 0.2s',
                            fontSize: '0.95rem'
                        }}
                    >
                        <span>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SYSTEM STATUS</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                    <span style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%', boxShadow: '0 0 10px #10b981' }}></span>
                    <span>Online & Secure</span>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
