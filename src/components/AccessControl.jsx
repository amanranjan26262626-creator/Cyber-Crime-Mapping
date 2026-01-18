import React, { useState } from 'react';

const AccessControl = () => {
    const [users, setUsers] = useState([
        { id: 1, name: 'Officer R. Kumar', email: 'r.kumar@police.gov.in', role: 'Admin', accessLevel: 'Full Access', status: 'Active' }
    ]);
    const [isAdding, setIsAdding] = useState(false);
    const [newUser, setNewUser] = useState({ name: '', email: '', role: 'Analyst' });

    const handleInvite = (e) => {
        e.preventDefault();
        if (!newUser.email || !newUser.name) return;

        const date = new Date().toLocaleDateString();
        const invitee = {
            id: Date.now(),
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            accessLevel: newUser.role === 'Admin' ? 'Full Access' : newUser.role === 'Analyst' ? 'Read/Write' : 'Read Only',
            status: 'Invite Sent'
        };

        setUsers([...users, invitee]);
        setIsAdding(false);
        setNewUser({ name: '', email: '', role: 'Analyst' });
    };

    return (
        <div className="animate-fade-in">
            <h2 className="glow-text" style={{ marginBottom: '1rem' }}>User Access Management</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Securely provision accounts for department personnel.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem', alignItems: 'center' }}>
                        <h3>Authorized Personnel</h3>
                        <button className="btn" onClick={() => setIsAdding(!isAdding)}>
                            {isAdding ? 'Cancel' : '+ New Officer'}
                        </button>
                    </div>

                    {isAdding && (
                        <form onSubmit={handleInvite} style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid var(--primary)' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                <input
                                    type="text" placeholder="Officer Name"
                                    className="input-field"
                                    value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white' }}
                                />
                                <input
                                    type="email" placeholder="Govt Email ID"
                                    className="input-field"
                                    value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white' }}
                                />
                                <select
                                    value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}
                                    style={{ padding: '0.75rem', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--bg-app)', color: 'white' }}
                                >
                                    <option value="Admin">Admin (Full)</option>
                                    <option value="Analyst">Analyst (Investigator)</option>
                                    <option value="Viewer">Viewer (Read Only)</option>
                                </select>
                            </div>
                            <button className="btn" style={{ width: '100%' }}>Send Secure Invite</button>
                        </form>
                    )}

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '0.75rem' }}>Officer Name</th>
                                <th style={{ padding: '0.75rem' }}>Email</th>
                                <th style={{ padding: '0.75rem' }}>Role</th>
                                <th style={{ padding: '0.75rem' }}>Status</th>
                                <th style={{ padding: '0.75rem' }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '0.75rem', fontWeight: 'bold' }}>{u.name}</td>
                                    <td style={{ padding: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem',
                                            background: u.role === 'Admin' ? 'rgba(59, 130, 246, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                            color: u.role === 'Admin' ? '#60a5fa' : '#fbbf24'
                                        }}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <span style={{ color: u.status === 'Active' ? '#10b981' : '#f43f5e' }}>● {u.status}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem' }}>
                                        <button style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer' }}>Revoke</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3>Role Definitions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <h4 style={{ color: '#60a5fa' }}>Admin</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Full access to all modules, settings, and user management.</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <h4 style={{ color: '#fbbf24' }}>Analyst</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Can perform searches and generate reports. Cannot delete cases.</p>
                        </div>
                        <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                            <h4 style={{ color: '#a3a3a3' }}>Viewer</h4>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Read-only access to assigned reports.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessControl;
