/**
 * StatsPulse component for displaying "real-time" engineering metrics.
 * Adds a layer of technical authority and "live" feel to the site.
 */
export default function StatsPulse() {
    return (
        <div className="stats-pulse-container">
            <div className="stats-pulse-item">
                <div className="pulse-dot"></div>
                <div className="stats-content">
                    <span className="stats-label">SaaS Core Stability</span>
                    <span className="stats-value">99.99%</span>
                </div>
            </div>
            <div className="stats-pulse-item">
                <div className="pulse-dot blue"></div>
                <div className="stats-content">
                    <span className="stats-label">Avg. Deployment Time</span>
                    <span className="stats-value">&lt; 4 mins</span>
                </div>
            </div>
            <div className="stats-pulse-item">
                <div className="pulse-dot green"></div>
                <div className="stats-content">
                    <span className="stats-label">Security Compliance</span>
                    <span className="stats-value">SOC2 Ready</span>
                </div>
            </div>
        </div>
    );
}
