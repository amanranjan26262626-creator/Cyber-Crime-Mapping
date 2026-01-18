import React, { useState } from 'react';
import { searchLeakOsint } from '../services/api';
import { saveReport } from '../services/reportService';

const SearchTool = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!query) return;

        setLoading(true);
        setError(null);
        setResult(null);

        const data = await searchLeakOsint(query);
        setLoading(false);

        if (data && data.List) {
            setResult(data);
            // Save real data for Link Analysis to use
            localStorage.setItem('lastSearchData', JSON.stringify({ query, data }));
            saveReport('Intel Search', query, data);
        } else {
            setError("No results found or API error.");
        }
    };

    return (
        <div className="animate-fade-in">
            <div className="card" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="glow-text">Intelligence Search Engine</h2>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        Enter a digital identifier (Email, Phone, Name) to trace footprints.
                    </p>
                </div>

                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                    <input
                        type="text"
                        placeholder="Enter search term..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        style={{
                            flex: 1,
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--border)',
                            padding: '1rem',
                            borderRadius: '8px',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none'
                        }}
                    />
                    <button className="btn" disabled={loading} style={{ minWidth: '120px' }}>
                        {loading ? 'Scanning...' : 'Trace Target'}
                    </button>
                </form>

                {error && <div style={{ color: '#f43f5e', textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                {/* --- EXISTING OSINT RESULTS --- */}
                {result && result.List && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {Object.keys(result.List).map((dbName, index) => {
                            // Skip the 'No results found' key if it exists as a database entry (API quirk)
                            if (dbName === 'No results found') return null;

                            const dbData = result.List[dbName];

                            // Ensure we have an array of data, even if it's single object or missing
                            const records = Array.isArray(dbData.Data) ? dbData.Data : [];

                            if (records.length === 0) return null;

                            return (
                                <div key={index} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h3 style={{ color: 'var(--accent)', margin: 0 }}>{dbName}</h3>
                                        <span style={{ background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                                            {records.length} Records
                                        </span>
                                    </div>



                                    <div style={{ overflowX: 'auto' }}>
                                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                                            <tbody>
                                                {records.map((row, rIndex) => (
                                                    <React.Fragment key={rIndex}>
                                                        {/* Header for each record block */}
                                                        <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                                                            <td colSpan="2" style={{ padding: '0.5rem', color: '#60a5fa', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                                                Record #{rIndex + 1}
                                                            </td>
                                                        </tr>
                                                        {Object.entries(row).sort((a, b) => {
                                                            const keyA = a[0];
                                                            const keyB = b[0];

                                                            // Explicit Priority Map
                                                            const priority = {
                                                                'FullName': 1,
                                                                'FatherName': 2,
                                                                'Address': 3,
                                                                'Address2': 4,
                                                                'Phone': 90,
                                                                'Phone2': 91,
                                                                'Phone3': 92
                                                            };

                                                            const pA = priority[keyA] || 100; // Default low priority
                                                            const pB = priority[keyB] || 100;

                                                            return pA - pB;
                                                        }).map(([key, val]) => {
                                                            // 1. Rename Keys & FIX DATA SWAP
                                                            let displayKey = key;

                                                            // SWAP LOGIC: Data Source has mixed up these fields
                                                            if (key === 'FullName') displayKey = 'Father Name';
                                                            else if (key === 'FatherName') displayKey = 'Full Name';

                                                            else if (key === 'Phone' || key === 'Phone2' || key === 'Phone3') displayKey = 'Linked Number';

                                                            // 2. Format Values (Add + to 91...)
                                                            let displayVal = val;
                                                            if ((key.startsWith('Phone') || key === 'Mobile') && String(val).startsWith('91')) {
                                                                displayVal = '+' + val;
                                                            }

                                                            return (
                                                                <tr key={key} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                                                    <td style={{ padding: '0.5rem', color: 'var(--text-muted)', width: '30%' }}>{displayKey}</td>
                                                                    <td style={{ padding: '0.5rem', color: '#fff', wordBreak: 'break-word' }}>{String(displayVal)}</td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                        {/* Fallback if List is empty or only contains 'No results found' */}
                        {(Object.keys(result.List).length === 0 || (Object.keys(result.List).length === 1 && result.List['No results found'])) ? (
                            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', background: 'rgba(255,0,0,0.1)', borderRadius: '8px' }}>
                                No actionable intelligence found in any database for this target.
                            </div>
                        ) : null}
                    </div>
                )}            </div>
        </div>
    );
};

export default SearchTool;
