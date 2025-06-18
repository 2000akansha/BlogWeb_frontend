import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Tailwind CSS file
import App from './App.jsx'; // Default import of App

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <div className="min-h-screen bg-[#2c3e50]"> {/* Dark blue background for the whole app */}
      <App />
    </div>
  </StrictMode>
);
