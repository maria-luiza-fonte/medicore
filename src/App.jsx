import React from "react";
import { AppProvider, useApp } from "./context/AppContext";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import UrgencyQueue from "./pages/UrgencyQueue";
import AIAssistant from "./pages/AIAssistant";
import Records from "./pages/Records";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

function AppContent() {
  const { user, activePage, sidebarOpen, closeSidebar, showHome, showLogin } =
    useApp();

  if (showHome && !user) return <Home />;
  if (!user) return showLogin ? <Login /> : <Register />;

  const pages = {
    dashboard: <Dashboard />,
    patients: <Patients />,
    appointments: <Appointments />,
    urgency: <UrgencyQueue />,
    ai: <AIAssistant />,
    records: <Records />,
    reports: <Reports />,
    settings: <Settings />,
    admin: <Admin />,
  };

  return (
    <div className="mc-layout">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={closeSidebar} />
      )}

      <Sidebar />
      <div className="mc-main">
        <Topbar />
        <div className="mc-content">{pages[activePage] || <Dashboard />}</div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
