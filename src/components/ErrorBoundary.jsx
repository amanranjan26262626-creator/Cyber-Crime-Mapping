import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        this.setState({ error, errorInfo });
        console.error("Uncaught error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{ padding: '2rem', background: '#111827', color: 'white', height: '100vh', fontFamily: 'sans-serif' }}>
                    <h2 style={{ color: '#ef4444' }}>⚠️ System Error (Crash Detected)</h2>
                    <p style={{ color: '#9ca3af', marginBottom: '1rem' }}>The application encountered a critical error during rendering.</p>

                    <div style={{ background: '#1f2937', padding: '1rem', borderRadius: '8px', border: '1px solid #374151', overflow: 'auto', maxHeight: '70vh' }}>
                        <strong style={{ color: '#fca5a5' }}>Error: {this.state.error && this.state.error.toString()}</strong>
                        <pre style={{ color: '#d1d5db', fontSize: '0.8rem', marginTop: '1rem' }}>
                            {this.state.errorInfo && this.state.errorInfo.componentStack}
                        </pre>
                    </div>

                    <button
                        onClick={() => window.location.reload()}
                        style={{ marginTop: '2rem', padding: '0.75rem 1.5rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        🔄 Reload System
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
