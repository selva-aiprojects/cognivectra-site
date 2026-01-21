import React from "react";

export default function AppSimple() {
  return (
    <div style={{ 
      padding: "20px", 
      background: "#0B0E14", 
      color: "#F8FAFC", 
      minHeight: "100vh",
      fontFamily: "system-ui, -apple-system, sans-serif"
    }}>
      <h1 style={{ color: "#6366F1", marginBottom: "20px" }}>
        CogniVectra - Simple Test
      </h1>
      <div style={{ 
        background: "#161B22", 
        padding: "30px", 
        borderRadius: "12px", 
        marginBottom: "20px",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <h2>React Status: Working</h2>
        <p>If you can see this page, React is working properly.</p>
        <p>The basic structure and styling are functional.</p>
      </div>
      <div style={{ 
        background: "#161B22", 
        padding: "30px", 
        borderRadius: "12px",
        border: "1px solid rgba(255, 255, 255, 0.1)"
      }}>
        <h2>Next Steps:</h2>
        <ul>
          <li>✅ Basic React setup working</li>
          <li>✅ CSS styling functional</li>
          <li>🔄 Need to check router imports</li>
          <li>🔄 Need to verify component imports</li>
        </ul>
      </div>
    </div>
  );
}
