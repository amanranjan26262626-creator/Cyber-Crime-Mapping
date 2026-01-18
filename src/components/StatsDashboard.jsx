import React from 'react';

const StatsDashboard = () => {
    return (
        <div className="animate-fade-in">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                {[
                    { label: 'Active Cases', val: '24', color: 'var(--primaryIcon)' },
                    { label: 'Pending Requests', val: '12', color: '#fbbf24' },
                    { label: 'Evidence Linked', val: '1,842', color: '#10b981' },
                    { label: 'flagged profiles', val: '89', color: '#f43f5e' }
                ].map((stat, i) => (
                    <div key={i} className="card">
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{stat.label.toUpperCase()}</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: '700', marginTop: '0.5rem' }}>{stat.val}</h3>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h3>Recent Investigations</h3>
                        <button className="btn" style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}>View All</button>
                    </div>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem 0' }}>Case ID</th>
                                <th>Target</th>
                                <th>Type</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { id: 'CS-2026-001', target: '+91-98765xxxxx', type: 'Financial Fraud', status: 'Active' },
                                { id: 'CS-2026-002', target: 'upi@okhdfc', type: 'Cyber Stalking', status: 'Tracing' },
                                { id: 'CS-2026-003', target: 'IP: 192.168.x.x', type: 'Data Theft', status: 'Closed' },
                            ].map((row, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <td style={{ padding: '1rem 0', fontFamily: 'monospace', color: 'var(--accent)' }}>{row.id}</td>
                                    <td>{row.target}</td>
                                    <td>{row.type}</td>
                                    <td>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                                            background: row.status === 'Active' ? 'rgba(59, 130, 246, 0.2)' :
                                                row.status === 'Closed' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(251, 191, 36, 0.2)',
                                            color: row.status === 'Active' ? '#60a5fa' :
                                                row.status === 'Closed' ? '#34d399' : '#fbbf24'
                                        }}>
                                            {row.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="card">
                    <h3>System Alerts</h3>
                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {[
                            { msg: 'New match found for Case #882', time: '10m ago', type: 'success' },
                            { msg: 'High latency on Banking Gateway', time: '1h ago', type: 'warning' },
                            { msg: 'Report generation completed', time: '2h ago', type: 'info' }
                        ].map((alert, i) => (
                            <div key={i} style={{
                                padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px',
                                borderLeft: `3px solid ${alert.type === 'success' ? '#10b981' : alert.type === 'warning' ? '#fbbf24' : '#3b82f6'}`
                            }}>
                                <p style={{ fontSize: '0.9rem' }}>{alert.msg}</p>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{alert.time}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;
