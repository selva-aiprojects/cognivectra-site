import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuGitBranch,
    LuCode,
    LuCpu,
    LuCloud,
    LuDatabase,
    LuActivity,
    LuLayers,
    LuZap,
    LuShare2,
    LuBuilding2,
    LuShield
} from "react-icons/lu";

// High-end Enterprise Network Architecture Data
const networks = [
    {
        id: "ai",
        title: "AI Platform Engine",
        color: "#ec4899", // Pink
        desc: "Distributed intelligence hub for autonomous agents and RAG pipelines.",
        nodes: [
            { id: "data", x: 15, y: 50, label: "Enterprise Data", icon: <LuDatabase />, desc: "ERP / CRM / Logs" },
            { id: "vector", x: 35, y: 20, label: "Vector DB", icon: <LuLayers />, desc: "Embeddings" },
            { id: "engine", x: 50, y: 50, label: "AI Engine", icon: <LuCpu />, desc: "LLM Orchestration" },
            { id: "features", x: 35, y: 80, label: "Feature Store", icon: <LuActivity />, desc: "Real-time signals" },
            { id: "agents", x: 70, y: 30, label: "Autonomous Agents", icon: <LuZap />, desc: "Action execution" },
            { id: "business", x: 80, y: 70, label: "Business Systems", icon: <LuBuilding2 />, desc: "Process integration" }
        ],
        edges: [
            { from: "data", to: "engine" },
            { from: "vector", to: "engine", reverseFlow: true },
            { from: "features", to: "engine", delayOffset: 0.5 },
            { from: "engine", to: "agents" },
            { from: "engine", to: "business", delayOffset: 0.8 }
        ]
    },
    {
        id: "platform",
        title: "Platform Evolution",
        color: "#a855f7", // Purple
        desc: "Event-driven microservices architecture replacing monolithic systems.",
        nodes: [
            { id: "legacy", x: 15, y: 50, label: "Legacy Monolith", icon: <LuDatabase />, desc: "On-prem data" },
            { id: "api", x: 35, y: 50, label: "API Gateway", icon: <LuShare2 />, desc: "Kong / Apigee" },
            { id: "eventbus", x: 50, y: 20, label: "Event Bus", icon: <LuActivity />, desc: "Kafka / Kinesis" },
            { id: "micro", x: 65, y: 60, label: "Service Mesh", icon: <LuLayers />, desc: "Istio / Linkerd" },
            { id: "ai", x: 80, y: 25, label: "Intelligence Layer", icon: <LuZap />, desc: "Predictive Models" },
            { id: "client", x: 85, y: 80, label: "Omni-Channel", icon: <LuCloud />, desc: "Web / Mobile App" }
        ],
        edges: [
            { from: "legacy", to: "api" },
            { from: "api", to: "eventbus" },
            { from: "api", to: "micro" },
            { from: "eventbus", to: "micro", reverseFlow: true, delayOffset: 0.6 },
            { from: "eventbus", to: "ai" },
            { from: "micro", to: "client" },
            { from: "ai", to: "client", delayOffset: 0.4 }
        ]
    },
    {
        id: "kubernetes",
        title: "Global Kubernetes",
        color: "#0ea5e9", // Blue
        desc: "Highly available container orchestration across multi-cloud regions.",
        nodes: [
            { id: "traffic", x: 15, y: 50, label: "Global LB", icon: <LuActivity />, desc: "Traffic routing" },
            { id: "cluster1", x: 40, y: 25, label: "US-East Cluster", icon: <LuCloud />, desc: "EKS / GKE" },
            { id: "cluster2", x: 40, y: 75, label: "EU-West Cluster", icon: <LuCloud />, desc: "EKS / AKS" },
            { id: "dbMaster", x: 65, y: 50, label: "Global DB Master", icon: <LuDatabase />, desc: "Aurora / Spanner" },
            { id: "cache1", x: 80, y: 20, label: "Redis Edge", icon: <LuZap />, desc: "Low latency" },
            { id: "cache2", x: 80, y: 80, label: "Redis Edge", icon: <LuZap />, desc: "Low latency" }
        ],
        edges: [
            { from: "traffic", to: "cluster1" },
            { from: "traffic", to: "cluster2", delayOffset: 0.5 },
            { from: "cluster1", to: "dbMaster" },
            { from: "cluster2", to: "dbMaster" },
            { from: "cluster1", to: "cache1", delayOffset: 0.2 },
            { from: "cluster2", to: "cache2", delayOffset: 0.7 }
        ]
    },
    {
        id: "devops",
        title: "Enterprise DevOps",
        color: "#22c55e", // Green
        desc: "Zero-touch CI/CD pipeline with continuous security and observability.",
        nodes: [
            { id: "dev", x: 15, y: 50, label: "Engineering", icon: <LuCode />, desc: "Git Commit" },
            { id: "git", x: 30, y: 50, label: "GitOps Source", icon: <LuGitBranch />, desc: "GitHub / GitLab" },
            { id: "ci", x: 45, y: 20, label: "CI Pipeline", icon: <LuActivity />, desc: "Build & Test" },
            { id: "sec", x: 45, y: 80, label: "SecOps Scan", icon: <LuShield />, desc: "Sonar / Snyk" },
            { id: "registry", x: 65, y: 50, label: "Container Registry", icon: <LuDatabase />, desc: "ECR / ACR" },
            { id: "prod", x: 80, y: 50, label: "Production K8s", icon: <LuCloud />, desc: "ArgoCD / Flux" }
        ],
        edges: [
            { from: "dev", to: "git" },
            { from: "git", to: "ci" },
            { from: "git", to: "sec", delayOffset: 0.3 },
            { from: "ci", to: "registry" },
            { from: "sec", to: "registry", delayOffset: 0.6 },
            { from: "registry", to: "prod" }
        ]
    }
];

// Curved Path Generator using Quadratic Bezier
const generateCurvedPath = (startX, startY, endX, endY) => {
    // Determine control point to create a nice curve rather than a straight line
    const midX = (startX + endX) / 2;
    // Offset the Y curve based on the distance
    const curveOffset = Math.abs(endX - startX) * 0.2;
    // Curve bends downwards if going right to left, upwards if left to right (or vice versa for visual variety)
    const controlY = startY < endY ? Math.min(startY, endY) + curveOffset : Math.max(startY, endY) - curveOffset;

    return `M ${startX} ${startY} Q ${midX} ${controlY} ${endX} ${endY}`;
};

// Animated Path Line (Laser pulse effect) replacing the distorted circles
const FlowLine = ({ pathD, color, delayOffset = 0, reverseFlow = false }) => {
    return (
        <motion.path
            d={pathD}
            stroke={color}
            strokeWidth="3px"
            vectorEffect="non-scaling-stroke"
            fill="none"
            strokeLinecap="round"
            style={{
                filter: `drop-shadow(0 0 6px ${color}cc)`
            }}
            initial={{ pathLength: 0.1, pathOffset: reverseFlow ? 1 : 0, opacity: 0 }}
            animate={{
                pathOffset: reverseFlow ? [1, 0] : [0, 1],
                opacity: [0, 1, 1, 0]
            }}
            transition={{
                duration: 2.5,
                delay: delayOffset,
                repeat: Infinity,
                ease: "linear"
            }}
        />
    );
};

export default function ArchitectureMap() {
    const [activeNetId, setActiveNetId] = useState(networks[0].id);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const activeNetwork = networks.find(n => n.id === activeNetId) || networks[0];

    return (
        <div style={{
            padding: isMobile ? "3rem 1rem" : "6rem 2rem",
            background: "linear-gradient(180deg, rgba(2,6,23,1) 0%, rgba(15,23,42,0.8) 100%)",
            position: "relative",
            overflow: "hidden"
        }}>
            <div className="login-grid" style={{ opacity: 0.05, pointerEvents: "none" }} />

            {/* Header section */}
            <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 10 }}>
                <span className="hero-badge" style={{ margin: "0 auto 1rem" }}>
                    <LuShare2 /> Enterprise Architecture
                </span>
                <h2 style={{ fontSize: isMobile ? "2rem" : "3rem", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                    Dynamic Network Ecosystems
                </h2>
                <p style={{ color: "var(--text-secondary)", maxWidth: "600px", margin: "0 auto", fontSize: "1.05rem" }}>
                    Visualizing our platform engineering topologies — from intelligent orchestration to global distributed systems.
                </p>
            </div>

            {/* Main Interactive Map Container */}
            <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                gap: "2rem",
                position: "relative",
                zIndex: 10
            }}>
                {/* Control Panel (Left) */}
                <div style={{
                    width: isMobile ? "100%" : "300px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    flexShrink: 0
                }}>
                    {networks.map(net => (
                        <button
                            key={net.id}
                            onClick={() => setActiveNetId(net.id)}
                            style={{
                                textAlign: "left",
                                padding: "1.2rem 1.5rem",
                                borderRadius: "16px",
                                background: activeNetId === net.id ? `linear-gradient(135deg, ${net.color}15, transparent)` : "rgba(255,255,255,0.02)",
                                border: `1px solid ${activeNetId === net.id ? net.color + '66' : 'rgba(255,255,255,0.05)'}`,
                                cursor: "pointer",
                                transition: "all 0.3s ease",
                                boxShadow: activeNetId === net.id ? `0 0 20px ${net.color}15` : "none"
                            }}
                        >
                            <h4 style={{
                                color: "white",
                                fontSize: "1.1rem",
                                marginBottom: "0.4rem",
                                display: "flex",
                                alignItems: "center",
                                gap: "0.5rem"
                            }}>
                                <div style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    background: net.color,
                                    boxShadow: activeNetId === net.id ? `0 0 10px ${net.color}` : "none"
                                }} />
                                {net.title}
                            </h4>
                            <p style={{
                                fontSize: "0.85rem",
                                color: "var(--text-secondary)",
                                margin: 0,
                                lineHeight: 1.5
                            }}>
                                {net.desc}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Canvas Area (Right) */}
                <div style={{
                    flexGrow: 1,
                    height: isMobile ? "450px" : "600px",
                    background: "rgba(0,0,0,0.3)",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: "24px",
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "inset 0 0 100px rgba(0,0,0,0.5)"
                }}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeNetId}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            style={{ width: "100%", height: "100%", position: "absolute", inset: 0 }}
                        >
                            {/* SVG Layer for Connections */}
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflow: "visible" }}>
                                <defs>
                                    <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor={activeNetwork.color} stopOpacity="0.1" />
                                        <stop offset="50%" stopColor={activeNetwork.color} stopOpacity="0.4" />
                                        <stop offset="100%" stopColor={activeNetwork.color} stopOpacity="0.1" />
                                    </linearGradient>
                                </defs>

                                {activeNetwork.edges.map((edge, i) => {
                                    const fromNode = activeNetwork.nodes.find(n => n.id === edge.from);
                                    const toNode = activeNetwork.nodes.find(n => n.id === edge.to);

                                    if (!fromNode || !toNode) return null;

                                    // Calculate actual percentage coordinates based on container
                                    const pathD = generateCurvedPath(fromNode.x, fromNode.y, toNode.x, toNode.y);

                                    return (
                                        <g key={`edge-${i}`}>
                                            {/* Static background curve */}
                                            <path
                                                d={pathD}
                                                fill="none"
                                                stroke={`url(#edgeGrad)`}
                                                strokeWidth="2px"
                                                vectorEffect="non-scaling-stroke"
                                                strokeDasharray="4 6"
                                                opacity="0.6"
                                            />
                                            {/* Glowing animated path overlay (laser) */}
                                            <FlowLine
                                                pathD={pathD}
                                                color={activeNetwork.color}
                                                delayOffset={edge.delayOffset || i * 0.4}
                                                reverseFlow={edge.reverseFlow}
                                            />
                                        </g>
                                    );
                                })}
                            </svg>

                            {/* React DOM Layer for Nodes (enables hover cards and richer styling) */}
                            {activeNetwork.nodes.map((node) => (
                                <motion.div
                                    key={node.id}
                                    style={{
                                        position: "absolute",
                                        left: `${node.x}%`,
                                        top: `${node.y}%`,
                                        transform: "translate(-50%, -50%)", // Center on coordinate
                                        zIndex: 20
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    whileHover={{ scale: 1.1, zIndex: 30 }}
                                >
                                    {/* Pulse effect ring */}
                                    <motion.div
                                        style={{
                                            position: "absolute",
                                            inset: -8,
                                            borderRadius: "50%",
                                            border: `1px solid ${activeNetwork.color}`,
                                            opacity: 0.3
                                        }}
                                        animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
                                        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                    />

                                    {/* Icon Container */}
                                    <div style={{
                                        width: isMobile ? "40px" : "56px",
                                        height: isMobile ? "40px" : "56px",
                                        borderRadius: "50%",
                                        background: "rgba(15,23,42,0.9)",
                                        border: `2px solid ${activeNetwork.color}88`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: isMobile ? "1.2rem" : "1.5rem",
                                        color: "white",
                                        boxShadow: `0 0 20px ${activeNetwork.color}44`,
                                        position: "relative",
                                        backdropFilter: "blur(4px)"
                                    }}>
                                        {node.icon}
                                    </div>

                                    {/* Node Label Card */}
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginTop: "12px",
                                        background: "rgba(15,23,42,0.95)",
                                        border: "1px solid rgba(255,255,255,0.1)",
                                        padding: "0.5rem 0.8rem",
                                        borderRadius: "8px",
                                        whiteSpace: "nowrap",
                                        textAlign: "center",
                                        boxShadow: "0 10px 20px rgba(0,0,0,0.5)",
                                        pointerEvents: "none" // Prevent hovering over the text interrupting the main node hover
                                    }}>
                                        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "white", marginBottom: "2px" }}>
                                            {node.label}
                                        </div>
                                        <div style={{ fontSize: "0.7rem", color: activeNetwork.color, opacity: 0.9 }}>
                                            {node.desc}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
