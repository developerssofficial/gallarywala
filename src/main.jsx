import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ErrorBoundary } from './components/ErrorBoundary.jsx'

// Self-XSS Console Security Shield
if (typeof window !== "undefined") {
  console.log(
    "%c🛡️ GallaryWala Security Shield Active",
    "color: #38bdf8; font-size: 16px; font-weight: 800; padding: 4px 8px; border-radius: 4px; background: #0f172a;"
  );
  console.log(
    "%cSTOP! Do not paste any code or script here. Scammers can steal your account or data. This area is reserved for developers.",
    "color: #ef4444; font-size: 13px; font-weight: 700;"
  );
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
