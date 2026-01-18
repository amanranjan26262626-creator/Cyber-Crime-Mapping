import React from 'react';

const Header = ({ title }) => {
    return (
        <header className="header" style={{
            background: 'linear-gradient(to right, #0F2027, #203A43, #2C5364)', // Keep the Dark Teal Gradient as it fits Dark Mode well
            borderBottom: '4px solid #F7931E',
            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
            height: '80px',
            padding: '0 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
        }}>
            {/* Left: Emblem & Gov Titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    background: '#fff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px rgba(255,255,255,0.2)'
                }}>
                    <span style={{ fontSize: '1.8rem' }}>🏛️</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{
                        fontSize: '1.1rem',
                        fontWeight: '800',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        margin: 0,
                        color: '#fff'
                    }}>
                        Cyber Crime Coordination Centre
                    </h1>
                    <span style={{
                        fontSize: '0.75rem',
                        color: '#FFD700', // Gold looks goood on dark
                        fontWeight: '600',
                        letterSpacing: '0.5px'
                    }}>
                        Ministry of Home Affairs, Govt. of India (Mock)
                    </span>
                </div>
            </div>

            {/* Middle: Live Ticker */}
            <div style={{
                flex: 1,
                margin: '0 2rem',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '4px',
                padding: '0.25rem 1rem',
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden'
            }}>
                <span style={{ color: '#F44336', fontWeight: 'bold', fontSize: '0.8rem', marginRight: '0.5rem' }}>LIVE:</span>
                <span className="marquee-text" style={{ fontSize: '0.8rem', color: '#e0e0e0', whiteSpace: 'nowrap' }}>
                    Connecting to CCTNS Node... Threat Level: MODERATE... New Phishing Campaign Detected in Sector 4...
                </span>
            </div>

            {/* Right: Officer Profile */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <div style={{ textAlign: 'right', borderRight: '1px solid rgba(255,255,255,0.2)', paddingRight: '1rem' }}>
                    <p style={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#fff', margin: 0 }}>Officer R. Kumar</p>
                    <p style={{ fontSize: '0.75rem', color: '#4ade80', margin: 0 }}>⬤ ACU Unit: Active</p>
                </div>
                <div style={{
                    width: '45px', height: '45px',
                    background: '#1e293b',
                    borderRadius: '8px',
                    border: '2px solid #3b82f6',
                    display: 'grid', placeItems: 'center',
                    cursor: 'pointer'
                }}>
                    👮‍♂️
                </div>
            </div>

            <style>{`
                @keyframes scroll { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }
                .marquee-text { animation: scroll 15s linear infinite; }
            `}</style>
        </header>
    );
};

export default Header;
