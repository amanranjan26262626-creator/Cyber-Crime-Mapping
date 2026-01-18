import React, { useState, useEffect } from 'react';

const CaseManagement = () => {
    // Load cases from local storage or default to empty
    const [cases, setCases] = useState(() => {
        try {
            const saved = localStorage.getItem('officerCases');
            return saved ? JSON.parse(saved) : [
                { id: 'CS-2026-001', title: 'Financial Fraud - HDFC', status: 'Active', severity: 'High', date: '2026-01-14', assignedTo: 'Officer Kumar' }
            ];
        } catch (e) {
            console.error("Corrupt Case Data Reset", e);
            return [
                { id: 'CS-2026-001', title: 'Financial Fraud - HDFC', status: 'Active', severity: 'High', date: '2026-01-14', assignedTo: 'Officer Kumar' }
            ];
        }
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newCase, setNewCase] = useState({ title: '', severity: 'Medium' });

    useEffect(() => {
        localStorage.setItem('officerCases', JSON.stringify(cases));
    }, [cases]);

    const handleCreateCase = (e) => {
        e.preventDefault();
        if (!newCase.title) return;

        const caseId = `CS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
        const createdCase = {
            id: caseId,
            title: newCase.title,
            severity: newCase.severity,
            status: 'Active',
            assignedTo: 'Officer Kumar', // Auto-assign to current user
            date: new Date().toISOString().split('T')[0]
        };

        setCases([createdCase, ...cases]);
        setIsModalOpen(false);
        setNewCase({ title: '', severity: 'Medium' });
    };

    const deleteCase = (id) => {
        if (confirm('Are you sure you want to delete this case logic? This action is logged.')) {
            setCases(cases.filter(c => c.id !== id));
        }
    };

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="glow-text">Case Management</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Manage and track ongoing cyber investigations.</p>
                </div>
                <button className="btn" onClick={() => setIsModalOpen(true)}> + New Case</button>
            </div>

            {isModalOpen && (
                <div className="card" style={{ marginBottom: '2rem', border: '1px solid var(--primary)' }}>
                    <h3>Open New Investigation File</h3>
                    <form onSubmit={handleCreateCase} style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                        <input
                            type="text" placeholder="Case Title (e.g. UPI Fraud - R. Singh)"
                            value={newCase.title} onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        />
                        <select
                            value={newCase.severity} onChange={e => setNewCase({ ...newCase, severity: e.target.value })}
                            style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)', color: 'white', borderRadius: '4px' }}
                        >
                            <option value="High">High Severity (Critical)</option>
                            <option value="Medium">Medium Severity</option>
                            <option value="Low">Low Severity</option>
                        </select>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn" type="submit">Initialize Case</button>
                            <button className="btn" type="button" onClick={() => setIsModalOpen(false)} style={{ background: 'var(--bg-card)' }}>Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {cases.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    No active cases. Click "+ New Case" to start an investigation.
                </div>
            ) : (
                <div className="card">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', textAlign: 'left', color: 'var(--text-muted)' }}>
                                <th style={{ padding: '1rem' }}>Case ID</th>
                                <th style={{ padding: '1rem' }}>Title</th>
                                <th style={{ padding: '1rem' }}>Severity</th>
                                <th style={{ padding: '1rem' }}>Assigned To</th>
                                <th style={{ padding: '1rem' }}>Date</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                                <th style={{ padding: '1rem' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cases.map((c) => (
                                <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                    <td style={{ padding: '1rem', fontFamily: 'monospace', color: 'var(--accent)' }}>{c.id}</td>
                                    <td style={{ padding: '1rem', fontWeight: '500' }}>{c.title}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 'bold',
                                            background: c.severity === 'High' ? 'rgba(244, 63, 94, 0.1)' : c.severity === 'Medium' ? 'rgba(251, 191, 36, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                            color: c.severity === 'High' ? '#f43f5e' : c.severity === 'Medium' ? '#fbbf24' : '#10b981'
                                        }}>
                                            {c.severity}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.assignedTo}</td>
                                    <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{c.date}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.75rem',
                                            border: `1px solid ${c.status === 'Active' ? '#60a5fa' : c.status === 'Closed' ? '#34d399' : '#fbbf24'}`,
                                            color: c.status === 'Active' ? '#60a5fa' : c.status === 'Closed' ? '#34d399' : '#fbbf24'
                                        }}>
                                            {c.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem' }}>
                                        <button onClick={() => deleteCase(c.id)} style={{ color: '#f43f5e', background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}>🗑️</button>
                                        <button style={{ background: 'none', border: 'none', cursor: 'pointer' }}>👁️</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CaseManagement;
