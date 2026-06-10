import './app.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { initializeTheme } from './hooks/use-appearance';
import Dashboard from './pages/dashboard';
import Appearance from './pages/settings/appearance';
import Tracker from './pages/tracker';
import Welcome from './pages/welcome';

// This will set light / dark mode on load...
initializeTheme();

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/saves" element={<Dashboard />} />
            <Route path="/saves/:saveId" element={<Tracker />} />
            <Route path="/settings/appearance" element={<Appearance />} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>,
);
