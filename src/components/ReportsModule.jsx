import React, { useState, useEffect } from 'react';
import { getReports, clearReports, generateReportPDF } from '../services/reportService';

const ReportsModule = () => {
    const [reports, setReports] = useState([]);
    const [filter, setFilter] = useState('All');

    useEffect(() => {
        setReports(getReports());
    }, []);

    const handleDownload = (report) => {
        generateReportPDF(report);
    };

    const handleClear = () => {
        if (window.confirm("Are you sure you want to delete all reports?")) {
            clearReports();
            setReports([]);
        }
    };

    const filteredReports = filter === 'All'
        ? reports
        : reports.filter(r => r.type === filter);

    return (
        <div className="animate-fade-in">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 className="glow-text">Intelligence Reports</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Generated investigation logs and PDF exports.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        style={{ padding: '0.5rem', borderRadius: '4px', background: 'rgba(0,0,0,0.3)', color: 'white', border: '1px solid var(--border)' }}
                    >
                        <option value="All">All Sources</option>
                        <option value="Intel Search">Intel Search</option>

                        <option value="Telegram Analysis">Telegram Analysis</option>
                    </select>
                    <button onClick={handleClear} className="btn" style={{ background: '#f43f5e', border: 'none' }}>Clear All</button>
                </div>
            </div>

            {filteredReports.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📄</div>
                    <p>No reports generated yet. Perform searches to auto-generate logs.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {filteredReports.map((report) => (
                        <div key={report.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '8px',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: report.type === 'Telegram Analysis' ? 'rgba(59, 130, 246, 0.2)' :
                                        report.type === 'Ration Card' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(139, 92, 246, 0.2)',
                                    color: report.type === 'Telegram Analysis' ? '#60a5fa' :
                                        report.type === 'Ration Card' ? '#34d399' : '#a78bfa'
                                }}>
                                    {report.type === 'Telegram Analysis' ? '📱' : report.type === 'Ration Card' ? '💳' : '🔍'}
                                </div>
                                <div>
                                    <h4 style={{ margin: 0 }}>{report.query}</h4>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                                        <span>{report.type}</span>
                                        <span>•</span>
                                        <span>{new Date(report.timestamp).toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => handleDownload(report)}
                                className="btn"
                                style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <span>⬇️</span> Download PDF
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReportsModule;
