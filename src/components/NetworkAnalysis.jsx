import React, { useEffect, useRef } from 'react';
import { Network } from 'vis-network';
import 'vis-network/styles/vis-network.css';

const NetworkAnalysis = ({ graphData }) => {
    const containerRef = useRef(null);
    const networkRef = useRef(null);

    useEffect(() => {
        if (containerRef.current && graphData) {
            // Destroy existing if any
            if (networkRef.current) {
                networkRef.current.destroy();
            }

            const options = {
                width: '100%',
                height: '100%',
                layout: {
                    improvedLayout: true,
                    // hierarchy: false 
                },
                physics: {
                    enabled: false, // TURNING OFF PHYSICS TO STOP EXPLOSIONS
                    stabilization: false
                },
                nodes: {
                    shape: 'dot',
                    size: 20,
                    font: { size: 14, color: '#ffffff' },
                    borderWidth: 2,
                    shadow: true
                },
                edges: {
                    width: 2,
                    color: { color: '#555555', highlight: '#06b6d4' },
                    smooth: false // Straight lines for better performance
                },
                interaction: {
                    hover: true,
                    dragNodes: true, // Allow user to arrange them
                    zoomView: true,
                    dragView: true
                }
            };

            networkRef.current = new Network(containerRef.current, graphData, options);

            // Force Camera to find the nodes
            setTimeout(() => {
                if (networkRef.current) {
                    networkRef.current.fit({
                        animation: { duration: 1000, easingFunction: 'easeOutQuart' }
                    });
                }
            }, 200);
        }

        return () => {
            if (networkRef.current) {
                networkRef.current.destroy();
                networkRef.current = null;
            }
        };
    }, [graphData]);

    return (
        <div style={{ width: '100%', height: '600px', background: '#0a0a0a', position: 'relative' }}>
            {!graphData ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280' }}>
                    Loading Map...
                </div>
            ) : (
                <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
            )}
            {/* Legend Overlay */}
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', background: 'rgba(15, 23, 42, 0.9)', padding: '15px', borderRadius: '12px', zIndex: 10, border: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#94a3b8', marginBottom: '8px', textTransform: 'uppercase' }}>Node Types</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <LegendItem color="#f43f5e" label="TARGET" />
                    <LegendItem color="#fb923c" label="LINKED CRIMINAL" />
                    <LegendItem color="#3b82f6" label="IP ADDRESS" />
                    <LegendItem color="#10b981" label="MOBILE" />
                    <LegendItem color="#8b5cf6" label="DEVICE / EMAIL" />
                    <LegendItem color="#f59e0b" label="LOCATION" />
                </div>
            </div>
        </div>
    );
};

const LegendItem = ({ color, label }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }}></span>
        <span style={{ color: '#cbd5e1', fontSize: '0.7rem' }}>{label}</span>
    </div>
);

export default NetworkAnalysis;
