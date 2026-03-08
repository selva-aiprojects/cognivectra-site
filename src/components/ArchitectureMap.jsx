import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    LuGitBranch,
    LuCode,
    LuCpu,
    LuCloud,
    LuDatabase,
    LuActivity,
    LuChevronLeft,
    LuChevronRight,
    LuLayers,
    LuZap,
    LuShare2
} from "react-icons/lu";

const workflows = [
    {
        id: "devops",
        title: "Enterprise DevOps",
        color: "#6366f1",
        nodes: [
            { title: "Developer", icon: <LuCode />, stack: "VS Code / JetBrains", color: "#6366f1" },
            { title: "Git Repo", icon: <LuGitBranch />, stack: "GitHub / GitLab", color: "#8b5cf6" },
            { title: "CI Pipeline", icon: <LuActivity />, stack: "Jenkins / GHA", color: "#22c55e" },
            { title: "Artifacts", icon: <LuDatabase />, stack: "Docker / ECR", color: "#f97316" },
            { title: "Kubernetes", icon: <LuCloud />, stack: "EKS / AKS", color: "#0ea5e9" },
            { title: "Observability", icon: <LuCpu />, stack: "Grafana", color: "#f43f5e" }
        ]
    },
    {
        id: "ai",
        title: "Enterprise AI Platform",
        color: "#ec4899",
        nodes: [
            { title: "Enterprise Data", icon: <LuDatabase />, stack: "ERP / CRM", color: "#f97316" },
            { title: "Data Processing", icon: <LuActivity />, stack: "Spark / Databricks", color: "#22c55e" },
            { title: "Feature Store", icon: <LuCpu />, stack: "ML Features", color: "#6366f1" },
            { title: "Model Training", icon: <LuCpu />, stack: "PyTorch / TF", color: "#a855f7" },
            { title: "Vector DB", icon: <LuDatabase />, stack: "Pinecone", color: "#06b6d4" },
            { title: "AI Decision", icon: <LuZap />, stack: "LLM Agents", color: "#ec4899" }
        ]
    },
    {
        id: "cloud",
        title: "Cloud Migration",
        color: "#0ea5e9",
        nodes: [
            { title: "Legacy Systems", icon: <LuDatabase />, stack: "VMware", color: "#64748b" },
            { title: "Discovery", icon: <LuActivity />, stack: "CMDB", color: "#f59e0b" },
            { title: "Migration", icon: <LuCpu />, stack: "Automation", color: "#6366f1" },
            { title: "Landing Zone", icon: <LuCloud />, stack: "AWS / Azure", color: "#06b6d4" },
            { title: "Containers", icon: <LuLayers />, stack: "Kubernetes", color: "#0ea5e9" },
            { title: "Cloud Ops", icon: <LuActivity />, stack: "AI Ops", color: "#22c55e" }
        ]
    },
    {
        id: "modern",
        title: "IT Modernization",
        color: "#22c55e",
        nodes: [
            { title: "Monolith", icon: <LuDatabase />, stack: "Java / .NET", color: "#ef4444" },
            { title: "API Gateway", icon: <LuLayers />, stack: "Kong", color: "#a855f7" },
            { title: "Service Mesh", icon: <LuShare2 />, stack: "Istio", color: "#6366f1" },
            { title: "Microservices", icon: <LuCpu />, stack: "Spring Boot", color: "#0ea5e9" },
            { title: "Observability", icon: <LuActivity />, stack: "Prometheus", color: "#22c55e" },
            { title: "Self-Healing", icon: <LuZap />, stack: "Automation", color: "#f97316" }
        ]
    },
    {
        id: "platform",
        title: "Platform Evolution",
        color: "#a855f7",
        nodes: [
            { title: "Business Core", icon: <LuDatabase />, stack: "ERP", color: "#6366f1" },
            { title: "API Layer", icon: <LuLayers />, stack: "Gateway", color: "#8b5cf6" },
            { title: "Event Bus", icon: <LuActivity />, stack: "Kafka", color: "#22c55e" },
            { title: "K8s Micro", icon: <LuCpu />, stack: "Cloud Native", color: "#06b6d4" },
            { title: "Intelligence", icon: <LuZap />, stack: "LLM", color: "#ec4899" },
            { title: "Experience", icon: <LuCloud />, stack: "Omni-channel", color: "#0ea5e9" }
        ]
    },
    {
        id: "customai",
        title: "Unique AI Solving",
        color: "#f97316",
        nodes: [
            { title: "Business Problem", icon: <LuZap />, stack: "Use Case", color: "#ec4899" },
            { title: "Knowledge Base", icon: <LuDatabase />, stack: "Neo4j", color: "#22c55e" },
            { title: "AI Agents", icon: <LuCpu />, stack: "Agentic AI", color: "#6366f1" },
            { title: "Decision Engine", icon: <LuActivity />, stack: "Custom Logic", color: "#f97316" },
            { title: "Integration", icon: <LuLayers />, stack: "APIs", color: "#06b6d4" },
            { title: "Outcome / ROI", icon: <LuCloud />, stack: "Business Value", color: "#0ea5e9" }
        ]
    }
];

// Animated flowing dot along the horizontal path
const FlowDot = ({ delay, rowColor }) => (
    <motion.circle
        r="3"
        fill={rowColor}
        initial={{ cx: 0, cy: 0 }}
        animate={{ cx: [24, 516] }}
        transition={{
            duration: 4,
            delay,
            repeat: Infinity,
            ease: "linear"
        }}
        cy={0}
        opacity={0.7}
        style={{ filter: `drop-shadow(0 0 4px ${rowColor})` }}
    />
);

// A single horizontal architecture row
function WorkflowRow({ wf, isVisible }) {
    const nodeCount = wf.nodes.length;
    const svgWidth = 540;
    const nodeSpacing = svgWidth / nodeCount;

    return (
        <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.5 }}
            style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                padding: "1.2rem 1.5rem",
                borderRadius: "16px",
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${wf.color}22`,
                boxShadow: `0 0 20px ${wf.color}0a`,
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Row label */}
            <div style={{
                fontSize: "0.7rem",
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: wf.color,
                marginBottom: "0.4rem",
                opacity: 0.9
            }}>
                {wf.title}
            </div>

            {/* Nodes + connector line */}
            <div style={{ position: "relative", height: "72px" }}>
                {/* SVG connector line + dots */}
                <svg
                    viewBox={`0 0 ${svgWidth} 10`}
                    style={{
                        position: "absolute",
                        top: "24px",
                        left: "0",
                        width: "100%",
                        height: "10px",
                        overflow: "visible"
                    }}
                >
                    <defs>
                        <linearGradient id={`grad-${wf.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor={wf.color} stopOpacity="0.1" />
                            <stop offset="50%" stopColor={wf.color} stopOpacity="0.5" />
                            <stop offset="100%" stopColor={wf.color} stopOpacity="0.1" />
                        </linearGradient>
                        <marker id={`arrow-${wf.id}`} markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                            <polygon points="0 0, 6 2.5, 0 5" fill={wf.color} opacity="0.6" />
                        </marker>
                    </defs>
                    {/* Connecting line */}
                    <line
                        x1={nodeSpacing / 2}
                        y1="0"
                        x2={svgWidth - nodeSpacing / 2}
                        y2="0"
                        stroke={`url(#grad-${wf.id})`}
                        strokeWidth="1.5"
                        markerEnd={`url(#arrow-${wf.id})`}
                    />
                    {/* Animated dots */}
                    {[0, 1, 2].map(di => (
                        <FlowDot key={di} delay={di * 1.3} rowColor={wf.color} />
                    ))}
                </svg>

                {/* Node icons */}
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    height: "100%"
                }}>
                    {wf.nodes.map((node, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.06 }}
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: "0.3rem",
                                width: `${100 / nodeCount}%`,
                            }}
                        >
                            <div style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "10px",
                                background: `linear-gradient(135deg, ${node.color}cc, rgba(15,23,42,0.9))`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "1rem",
                                color: "white",
                                boxShadow: `0 0 8px ${node.color}44`,
                                border: `1px solid ${node.color}44`,
                                flexShrink: 0
                            }}>
                                {node.icon}
                            </div>
                            <span style={{
                                fontSize: "0.6rem",
                                fontWeight: "600",
                                color: "white",
                                textAlign: "center",
                                lineHeight: 1.2,
                                maxWidth: "56px"
                            }}>{node.title}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

export default function ArchitectureMap() {
    const [page, setPage] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    // Show 3 rows per page on desktop, 1 on mobile
    const rowsPerPage = isMobile ? 1 : 3;
    const totalPages = Math.ceil(workflows.length / rowsPerPage);

    const visibleWorkflows = workflows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const prev = () => setPage(p => Math.max(p - 1, 0));
    const next = () => setPage(p => Math.min(p + 1, totalPages - 1));

    return (
        <div
            style={{
                padding: isMobile ? "3rem 1rem" : "5rem 2rem",
                position: "relative",
                overflow: "hidden",
                background: "rgba(2,6,23,0.3)"
            }}
        >
            <div className="login-grid" style={{ opacity: 0.06, pointerEvents: "none" }} />

            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
                <span className="hero-badge" style={{ margin: "0 auto 0.8rem" }}>
                    <LuLayers /> Engineering Hub
                </span>
                <h2 style={{ fontSize: isMobile ? "1.5rem" : "2.2rem", marginBottom: "0.75rem" }}>
                    Architecture Gap We Solve
                </h2>
                <p style={{
                    color: "var(--text-secondary)",
                    maxWidth: "600px",
                    margin: "0 auto",
                    fontSize: isMobile ? "0.85rem" : "1rem",
                    opacity: 0.7
                }}>
                    Enterprise AI, Cloud, and DevOps architecture flows — visualized as live engineering pipelines.
                </p>
            </div>

            {/* Rows */}
            <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -40 }}
                        transition={{ duration: 0.35 }}
                        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
                    >
                        {visibleWorkflows.map((wf) => (
                            <WorkflowRow key={wf.id} wf={wf} isVisible />
                        ))}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "1.5rem",
                    marginTop: "2rem"
                }}>
                    <button
                        onClick={prev}
                        disabled={page === 0}
                        className="nav-btn-mini"
                        style={{ opacity: page === 0 ? 0.3 : 1, width: "40px", height: "40px" }}
                    >
                        <LuChevronLeft />
                    </button>

                    {/* Dots */}
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setPage(i)}
                                style={{
                                    width: page === i ? "20px" : "6px",
                                    height: "6px",
                                    borderRadius: "3px",
                                    background: page === i ? "var(--accent-primary)" : "rgba(255,255,255,0.12)",
                                    transition: "all 0.3s ease",
                                    cursor: "pointer"
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={next}
                        disabled={page === totalPages - 1}
                        className="nav-btn-mini"
                        style={{ opacity: page === totalPages - 1 ? 0.3 : 1, width: "40px", height: "40px" }}
                    >
                        <LuChevronRight />
                    </button>
                </div>

                <div style={{
                    textAlign: "center",
                    marginTop: "1rem",
                    fontSize: "0.75rem",
                    opacity: 0.35,
                    letterSpacing: "2px",
                    textTransform: "uppercase"
                }}>
                    ← Navigate Enterprise Flows →
                </div>
            </div>
        </div>
    );
}
