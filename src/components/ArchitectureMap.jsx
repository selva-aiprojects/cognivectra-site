import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LuShieldCheck, LuLayers, LuShare2, LuCpu, LuActivity, LuDatabase } from 'react-icons/lu';

const architectureLayers = [
    {
        id: 'auth',
        title: 'Auth & Identity',
        icon: <LuShieldCheck />,
        description: 'Secure, multi-tenant RBAC foundations integrated into every layer.',
        details: ['Tenant Isolation', 'Cross-Domain Auth', 'Compliance Ready'],
        color: '#818cf8',
        pos: { x: '15%', y: '30%' }
    },
    {
        id: 'data',
        title: 'Scalable Data Layer',
        icon: <LuDatabase />,
        description: 'Highly available database clusters with intelligent caching.',
        details: ['Global Distribution', 'Auto-Scaling Storage', 'Real-time Sync'],
        color: '#38bdf8',
        pos: { x: '45%', y: '20%' }
    },
    {
        id: 'bus',
        title: 'Event Bus',
        icon: <LuShare2 />,
        description: 'Low-latency communication backbone for decoupled microservices.',
        details: ['Kafka Integration', 'Pub/Sub Architecture', 'Message Integrity'],
        color: '#34d399',
        pos: { x: '75%', y: '30%' }
    },
    {
        id: 'automation',
        title: 'Automated Lifecycle',
        icon: <LuActivity />,
        description: 'Orchestration for complex employee and client lifecycles.',
        details: ['BPMN Workflows', 'State Machines', 'Retry Logic'],
        color: '#fbbf24',
        pos: { x: '45%', y: '60%' }
    }
];

export default function ArchitectureMap() {
    const [hoveredLayer, setHoveredLayer] = useState(null);

    return (
        <div className="architecture-map-container glass-panel">
            <div className="architecture-map-header text-center mb-12">
                <span className="hero-badge" style={{ margin: '0 auto 1rem' }}>
                    <LuLayers style={{ marginRight: '0.4rem' }} /> Technical Foundation
                </span>
                <h2>The Architecture Gap We Solve</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                    Hover over the strategic layers of our production-ready platform to see how we build roots for your scale.
                </p>
            </div>

            <div className="architecture-grid-wrapper">
                <svg viewBox="0 0 800 500" className="architecture-svg">
                    {/* Connecting Lines */}
                    <motion.path
                        d="M 120 150 L 360 100"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    />
                    <motion.path
                        d="M 600 150 L 360 100"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        fill="none"
                    />
                    <motion.path
                        d="M 360 100 L 360 300"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="1"
                        fill="none"
                    />

                    {/* Layer Nodes */}
                    {architectureLayers.map((layer) => (
                        <foreignObject
                            key={layer.id}
                            x={layer.pos.x}
                            y={layer.pos.y}
                            width="200"
                            height="80"
                            style={{ overflow: 'visible' }}
                        >
                            <motion.div
                                className={`arch-node glass-panel ${hoveredLayer?.id === layer.id ? 'active' : ''}`}
                                onMouseEnter={() => setHoveredLayer(layer)}
                                onMouseLeave={() => setHoveredLayer(null)}
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <div className="arch-node-icon" style={{ backgroundColor: layer.color }}>
                                    {layer.icon}
                                    {/* Discovery Beacon / Pulse */}
                                    <motion.div
                                        className="arch-node-pulse"
                                        animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ backgroundColor: layer.color }}
                                    />
                                </div>
                                <div className="arch-node-content">
                                    <h4>{layer.title}</h4>
                                </div>
                            </motion.div>
                        </foreignObject>
                    ))}
                </svg>

                {/* Detail Overlay */}
                <AnimatePresence>
                    {hoveredLayer && (
                        <motion.div
                            className="arch-detail-overlay glass-panel"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="detail-header" style={{ color: hoveredLayer.color }}>
                                {hoveredLayer.icon}
                                <h3>{hoveredLayer.title}</h3>
                            </div>
                            <p>{hoveredLayer.description}</p>
                            <ul className="detail-list">
                                {hoveredLayer.details.map((detail, idx) => (
                                    <li key={idx}><span>•</span> {detail}</li>
                                ))}
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!hoveredLayer && (
                    <div className="arch-hint">
                        <LuCpu className="animate-pulse" />
                        <span>Interactive Platform Architecture</span>
                    </div>
                )}
            </div>
        </div>
    );
}
