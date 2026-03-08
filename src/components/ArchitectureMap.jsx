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
        <div className="architecture-map-container glass-panel" style={{ position: 'relative', overflow: 'hidden', padding: '6rem 2rem' }}>
            {/* Background Grid Accent */}
            <div className="login-grid" style={{ opacity: 0.1, pointerEvents: 'none' }} />

            <div className="architecture-map-header text-center mb-16">
                <span className="hero-badge" style={{ margin: '0 auto 1.5rem' }}>
                    <LuLayers /> Engineering Excellence
                </span>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>The Architecture Gap We Solve</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', fontSize: '1.1rem', opacity: 0.8 }}>
                    Explore our production-ready platform architecture. Hover over the nodes to see the technical specifications.
                </p>
            </div>

            <div className="architecture-grid-wrapper" style={{ position: 'relative', maxWidth: '1000px', margin: '0 auto' }}>
                <svg viewBox="0 0 800 550" className="architecture-svg" style={{ overflow: 'visible' }}>
                    {/* Blueprint Definition */}
                    <defs>
                        <pattern id="archGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(99, 102, 241, 0.1)" strokeWidth="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#archGrid)" opacity="0.5" />

                    {/* Neural Flow Paths */}
                    <g className="flow-lines">
                        {/* Auth to Data */}
                        <path id="path-auth-data" d="M 230 180 Q 360 120 460 120" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" fill="none" />
                        {/* Data to Event Bus */}
                        <path id="path-data-bus" d="M 540 120 Q 640 120 720 180" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" fill="none" />
                        {/* Automation Centerpiece */}
                        <path id="path-data-auto" d="M 500 160 L 500 280" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" fill="none" />
                        <path id="path-auth-auto" d="M 230 220 Q 360 320 460 320" stroke="rgba(99,102,241,0.15)" strokeWidth="1.5" fill="none" />

                        {/* Animated Particles */}
                        <circle r="3" className="data-particle">
                            <animateMotion dur="4s" repeatCount="indefinite" path="M 230 180 Q 360 120 460 120" />
                        </circle>
                        <circle r="2" className="data-particle">
                            <animateMotion dur="3s" repeatCount="indefinite" delay="1s" path="M 540 120 Q 640 120 720 180" />
                        </circle>
                        <circle r="2.5" className="data-particle">
                            <animateMotion dur="5s" repeatCount="indefinite" delay="0.5s" path="M 500 160 L 500 280" />
                        </circle>
                    </g>

                    {/* Layer Nodes */}
                    {architectureLayers.map((layer) => (
                        <foreignObject
                            key={layer.id}
                            x={layer.pos.x}
                            y={layer.pos.y}
                            width="250"
                            height="100"
                            style={{ overflow: 'visible' }}
                        >
                            <motion.div
                                className={`arch-node ${hoveredLayer?.id === layer.id ? 'active' : ''}`}
                                onMouseEnter={() => setHoveredLayer(layer)}
                                onMouseLeave={() => setHoveredLayer(null)}
                                whileHover={{ y: -5 }}
                            >
                                <div className="arch-node-icon" style={{
                                    background: `linear-gradient(135deg, ${layer.color} 0%, rgba(0,0,0,0.5) 100%)`,
                                    border: `1px solid ${layer.color}44`
                                }}>
                                    {layer.icon}
                                    <motion.div
                                        className="arch-node-pulse"
                                        animate={{ scale: [1, 1.4], opacity: [0.3, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        style={{ color: layer.color }}
                                    />
                                </div>
                                <div className="arch-node-content">
                                    <span style={{ fontSize: '0.65rem', opacity: 0.4, fontFamily: 'JetBrains Mono', letterSpacing: '0.1em', display: 'block' }}>
                                        LVL_{layer.id.toUpperCase()}
                                    </span>
                                    <h4>{layer.title}</h4>
                                </div>
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    height: '2px',
                                    width: hoveredLayer?.id === layer.id ? '100%' : '0%',
                                    background: layer.color,
                                    transition: 'width 0.3s ease'
                                }} />
                            </motion.div>
                        </foreignObject>
                    ))}
                </svg>

                {/* HUD Detail Overlay - Terminals Style */}
                <AnimatePresence>
                    {hoveredLayer && (
                        <motion.div
                            className="arch-detail-overlay"
                            initial={{ opacity: 0, x: 40, scale: 0.95 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.95 }}
                            transition={{ type: 'spring', damping: 20 }}
                        >
                            <div className="detail-header" style={{ borderColor: `${hoveredLayer.color}44` }}>
                                <div style={{ color: hoveredLayer.color, fontSize: '1.5rem' }}>{hoveredLayer.icon}</div>
                                <div>
                                    <h3 style={{ color: hoveredLayer.color }}>{hoveredLayer.title}</h3>
                                    <span style={{ fontSize: '0.6rem', opacity: 0.5, fontFamily: 'monospace' }}>SEC_PROTOCOL_ACTIVE</span>
                                </div>
                            </div>
                            <p>{hoveredLayer.description}</p>
                            <div style={{ marginBottom: '1rem', height: '1px', background: 'rgba(255,255,255,0.05)' }} />
                            <ul className="detail-list">
                                {hoveredLayer.details.map((detail, idx) => (
                                    <li key={idx} style={{ color: `${hoveredLayer.color}ee` }}>
                                        <div style={{ width: '4px', height: '4px', background: hoveredLayer.color, borderRadius: '50%' }} />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                            <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.3 }}>
                                <span style={{ fontSize: '0.55rem', fontFamily: 'monospace' }}>X: {hoveredLayer.pos.x} Y: {hoveredLayer.pos.y}</span>
                                <LuCpu size={12} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!hoveredLayer && (
                    <motion.div
                        className="arch-hint"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.6 }}
                    >
                        <LuCpu className="animate-pulse" />
                        <span>Interactive Platform Intelligence [HUD v2.0]</span>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
