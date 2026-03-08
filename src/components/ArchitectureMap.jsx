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
            { id: "data", layer: "Data Layer", x: 15, y: 35, label: "Enterprise Data", icon: <LuDatabase />, desc: "ERP / CRM / Logs", hoverDetail: "Multi-modal ingestion pipeline pulling structured and unstructured data into unified storage." },
            { id: "vector", layer: "Data Layer", x: 35, y: 5, label: "Vector DB", icon: <LuLayers />, desc: "Embeddings", hoverDetail: "High-performance vector search engine storing billions of document embeddings." },
            { id: "engine", layer: "Intelligence", x: 50, y: 35, label: "AI Engine", icon: <LuCpu />, desc: "LLM Orchestration", hoverDetail: "Central API gateway routing prompts to OpenAI/Anthropic while enforcing enterprise security." },
            { id: "features", layer: "Intelligence", x: 35, y: 65, label: "Feature Store", icon: <LuActivity />, desc: "Real-time signals", hoverDetail: "Low-latency cache serving live user profiles and historical signals to the AI." },
            { id: "agents", layer: "Application", x: 70, y: 15, label: "Autonomous Agents", icon: <LuZap />, desc: "Action execution", hoverDetail: "Task-specific micro-agents capable of multi-step reasoning and API execution." },
            { id: "business", layer: "Application", x: 80, y: 55, label: "Business Systems", icon: <LuBuilding2 />, desc: "Process integration", hoverDetail: "Direct integration into existing CRMs or custom frontends for end-user delivery." }
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
            { id: "legacy", layer: "Legacy", x: 15, y: 35, label: "Legacy Monolith", icon: <LuDatabase />, desc: "On-prem data", hoverDetail: "Strangler-fig pattern gradually extracting domain logic from the legacy core." },
            { id: "api", layer: "Gateway", x: 35, y: 35, label: "API Gateway", icon: <LuShare2 />, desc: "Kong / Apigee", hoverDetail: "Secure edge routing with rate-limiting, auth validation, and payload inspection." },
            { id: "eventbus", layer: "Platform", x: 50, y: 5, label: "Event Bus", icon: <LuActivity />, desc: "Kafka / Kinesis", hoverDetail: "High-throughput asynchronous messaging backbone for decoupled services." },
            { id: "micro", layer: "Platform", x: 65, y: 45, label: "Service Mesh", icon: <LuLayers />, desc: "Istio / Linkerd", hoverDetail: "Zero-trust network layer handling service-to-service mTLS and observability." },
            { id: "ai", layer: "Intelligence", x: 80, y: 10, label: "Intelligence Layer", icon: <LuZap />, desc: "Predictive Models", hoverDetail: "Real-time decision engine flagging anomalies or generating recommendations." },
            { id: "client", layer: "Experience", x: 85, y: 65, label: "Omni-Channel", icon: <LuCloud />, desc: "Web / Mobile App", hoverDetail: "Unified front-end experience consuming scalable microservice APIs." }
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
            { id: "traffic", layer: "Edge", x: 15, y: 35, label: "Global LB", icon: <LuActivity />, desc: "Traffic routing", hoverDetail: "Anycast load balancing routing users to their nearest healthy data center." },
            { id: "cluster1", layer: "Compute", x: 40, y: 10, label: "US-East Cluster", icon: <LuCloud />, desc: "EKS / GKE", hoverDetail: "Auto-scaling Kubernetes cluster managing active workloads in the US region." },
            { id: "cluster2", layer: "Compute", x: 40, y: 60, label: "EU-West Cluster", icon: <LuCloud />, desc: "EKS / AKS", hoverDetail: "Active-active failover cluster ensuring GDPR compliance for EU users." },
            { id: "dbMaster", layer: "Storage", x: 65, y: 35, label: "Global DB Master", icon: <LuDatabase />, desc: "Aurora / Spanner", hoverDetail: "Multi-region distributed database with synchronous cross-ocean replication." },
            { id: "cache1", layer: "Edge", x: 80, y: 5, label: "Redis Edge", icon: <LuZap />, desc: "Low latency", hoverDetail: "In-memory caching layer reducing DB load and dropping latency to sub-10ms." },
            { id: "cache2", layer: "Edge", x: 80, y: 65, label: "Redis Edge", icon: <LuZap />, desc: "Low latency", hoverDetail: "In-memory caching layer reducing DB load and dropping latency to sub-10ms." }
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
            { id: "dev", layer: "Code", x: 15, y: 35, label: "Engineering", icon: <LuCode />, desc: "Git Commit", hoverDetail: "Developers push code triggerring automated pre-commit and linting hooks." },
            { id: "git", layer: "Code", x: 30, y: 35, label: "GitOps Source", icon: <LuGitBranch />, desc: "GitHub / GitLab", hoverDetail: "Single source of truth for both application code and infrastructure manifests." },
            { id: "ci", layer: "Build", x: 45, y: 5, label: "CI Pipeline", icon: <LuActivity />, desc: "Build & Test", hoverDetail: "Automated unit testing, integration logic, and docker image compilation." },
            { id: "sec", layer: "Security", x: 45, y: 65, label: "SecOps Scan", icon: <LuShield />, desc: "Sonar / Snyk", hoverDetail: "Static code analysis and vulnerability scanning blocking unsafe deployments." },
            { id: "registry", layer: "Artifact", x: 65, y: 35, label: "Container Registry", icon: <LuDatabase />, desc: "ECR / ACR", hoverDetail: "Immutable image storage with cryptographic signing for supply-chain security." },
            { id: "prod", layer: "Deploy", x: 80, y: 35, label: "Production K8s", icon: <LuCloud />, desc: "ArgoCD / Flux", hoverDetail: "GitOps controller automatically pulling and deploying new registry images." }
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
                duration: 6.0,
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
    const [userInteracted, setUserInteracted] = useState(false);
    const [hoveredNodeId, setHoveredNodeId] = useState(null);

    // Auto-rotate workflows every 8 seconds, unless user clicks one manually
    useEffect(() => {
        if (userInteracted) return;
        const interval = setInterval(() => {
            setActiveNetId(currentId => {
                const currentIndex = networks.findIndex(n => n.id === currentId);
                const nextIndex = (currentIndex + 1) % networks.length;
                return networks[nextIndex].id;
            });
        }, 8000);
        return () => clearInterval(interval);
    }, [userInteracted]);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    const activeNetwork = networks.find(n => n.id === activeNetId) || networks[0];

    return (
        <div style={{
            padding: isMobile ? "2rem 1rem" : "2rem 2rem",
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
                {/* Sidebar (Left) */}
                <div style={{
                    width: isMobile ? "100%" : "320px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                    zIndex: 2 // Above SVG
                }}>
                    {networks.map(net => (
                        <button
                            key={net.id}
                            onClick={() => {
                                setActiveNetId(net.id);
                                setUserInteracted(true);
                            }}
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
                    height: isMobile ? "450px" : "550px",
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
                                    <marker id={`arrow-${activeNetwork.id}`} markerWidth="2.5" markerHeight="2.5" refX="4" refY="1.25" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M 0 0 L 2.5 1.25 L 0 2.5 z" fill={activeNetwork.color} opacity="0.8" />
                                    </marker>
                                    <marker id={`arrow-rev-${activeNetwork.id}`} markerWidth="2.5" markerHeight="2.5" refX="-1.5" refY="1.25" orient="auto" markerUnits="userSpaceOnUse">
                                        <path d="M 2.5 0 L 0 1.25 L 2.5 2.5 z" fill={activeNetwork.color} opacity="0.8" />
                                    </marker>
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
                                                markerEnd={!edge.reverseFlow ? `url(#arrow-${activeNetwork.id})` : undefined}
                                                markerStart={edge.reverseFlow ? `url(#arrow-rev-${activeNetwork.id})` : undefined}
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
                                    onMouseEnter={() => setHoveredNodeId(node.id)}
                                    onMouseLeave={() => setHoveredNodeId(null)}
                                    style={{
                                        position: "absolute",
                                        left: `${node.x}%`,
                                        top: `${node.y}%`,
                                        transform: "translate(-50%, -50%)", // Center on coordinate
                                        zIndex: hoveredNodeId === node.id ? 50 : 20 // Bring hovered node to the top
                                    }}
                                    initial={{ opacity: 0, scale: 0 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    whileHover={{ scale: 1.1 }} // Removed hardcoded zIndex: 30 to rely on the state-based zIndex above
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

                                    {/* Static Node Label (Always Visible) */}
                                    <div style={{
                                        position: "absolute",
                                        top: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginTop: "8px",
                                        textAlign: "center",
                                        whiteSpace: "nowrap",
                                        pointerEvents: "none",
                                        opacity: hoveredNodeId === node.id ? 0 : 1, // Hide when deep hover card is active
                                        transition: "opacity 0.2s ease",
                                        background: "rgba(15,23,42,0.6)",
                                        border: "1px solid rgba(255,255,255,0.05)",
                                        backdropFilter: "blur(4px)",
                                        padding: "0.4rem 0.6rem",
                                        borderRadius: "8px",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.5)"
                                    }}>
                                        <div style={{ fontSize: "0.55rem", textTransform: "uppercase", letterSpacing: "1px", color: activeNetwork.color, opacity: 0.8, marginBottom: "2px" }}>
                                            {node.layer}
                                        </div>
                                        <div style={{ fontSize: "0.85rem", fontWeight: "600", color: "white" }}>
                                            {node.label}
                                        </div>
                                        <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>
                                            {node.desc}
                                        </div>
                                    </div>

                                    {/* Node Label Deep Hover Card */}
                                    {hoveredNodeId === node.id && (
                                        <div style={{
                                            position: "absolute",
                                            ...(node.y > 60
                                                ? { bottom: "100%", marginBottom: "12px" }
                                                : { top: "100%", marginTop: "12px" }),
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            background: "rgba(15,23,42,0.98)",
                                            border: "1px solid rgba(255,255,255,0.1)",
                                            padding: "0.8rem", // Slightly tighter padding
                                            borderRadius: "10px",
                                            width: "200px", // Slightly narrower
                                            textAlign: "left",
                                            boxShadow: `0 15px 35px rgba(0,0,0,0.6), 0 0 10px ${activeNetwork.color}22`,
                                            pointerEvents: "none" // Prevent hovering over the text interrupting the main node hover
                                        }}>
                                            <div style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "1px", color: activeNetwork.color, opacity: 0.9, marginBottom: "4px" }}>
                                                {node.layer}
                                            </div>
                                            <div style={{ fontSize: "0.9rem", fontWeight: "700", color: "white", marginBottom: "4px" }}>
                                                {node.label}
                                            </div>
                                            <div style={{ fontSize: "0.75rem", color: "white", opacity: 0.9, paddingBottom: "6px", borderBottom: "1px solid rgba(255,255,255,0.1)", marginBottom: "6px" }}>
                                                {node.desc}
                                            </div>
                                            {node.hoverDetail && (
                                                <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: 1.4 }}>
                                                    {node.hoverDetail}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
