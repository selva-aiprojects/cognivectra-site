import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import App from "./App.jsx";
import "./index.css";

import { TenantProvider } from "./context/TenantContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <TenantProvider>
          <App />
          <Analytics />
          <SpeedInsights />
        </TenantProvider>
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>
);
