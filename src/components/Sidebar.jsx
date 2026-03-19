import React from "react";
import { useApp } from "../context/AppContext";

const navItems = [
  { section: "Principal" },
  { id: "dashboard", label: "Dashboard", icon: "bi-grid-1x2" },
  { id: "appointments", label: "Agendamentos", icon: "bi-calendar2-week" },
  { section: "Pacientes" },
  { id: "patients", label: "Pacientes", icon: "bi-people" },
  { id: "records", label: "Prontuários", icon: "bi-folder2-open" },
  { section: "Urgência" },
  {
    id: "urgency",
    label: "Fila de Urgência",
    icon: "bi-exclamation-triangle",
    urgent: true,
  },
  { section: "Inteligência" },
  { id: "ai", label: "Assistente IA", icon: "bi-robot" },
  { section: "Relatórios" },
  { id: "reports", label: "Relatórios", icon: "bi-bar-chart-line" },
  { section: "Sistema" },
  { id: "settings", label: "Configurações", icon: "bi-gear" },
];

export default function Sidebar() {
  const { activePage, setActivePage, urgencyQueue, logout, user } = useApp();
  const pendingUrgency = urgencyQueue.filter(
    (u) => u.status === "waiting",
  ).length;

  return (
    <aside className="mc-sidebar">
      {/* Logo */}
      <div className="mc-sidebar-logo">
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, var(--mc-teal), #0a8a86)",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 0 12px var(--mc-teal-glow)",
            }}
          >
            <i
              className="bi bi-heart-pulse-fill"
              style={{ color: "var(--mc-navy)", fontSize: 16 }}
            ></i>
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 18,
                color: "var(--mc-text)",
                lineHeight: 1,
              }}
            >
              MediCore
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--mc-slate)",
                opacity: 0.6,
                letterSpacing: "0.05em",
              }}
            >
              SISTEMA MÉDICO
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 0" }}>
        {navItems.map((item, i) => {
          if (item.section) {
            return (
              <div key={i} className="mc-nav-section">
                {item.section}
              </div>
            );
          }
          return (
            <button
              key={item.id}
              className={`mc-nav-item ${activePage === item.id ? "active" : ""}`}
              onClick={() => setActivePage(item.id)}
            >
              <i className={`bi ${item.icon}`}></i>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.urgent && pendingUrgency > 0 && (
                <span
                  style={{
                    background: "var(--mc-red)",
                    color: "white",
                    borderRadius: "20px",
                    padding: "1px 7px",
                    fontSize: 11,
                    fontWeight: 700,
                    minWidth: 20,
                    textAlign: "center",
                  }}
                  className="pulse"
                >
                  {pendingUrgency}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div
        style={{
          padding: "16px",
          borderTop: "1px solid var(--mc-border-subtle)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "10px 12px",
            borderRadius: 8,
            background: "var(--mc-surface-2)",
          }}
        >
          <div
            className="mc-avatar"
            style={{ width: 32, height: 32, fontSize: 11 }}
          >
            {user?.avatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "var(--mc-text)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.name}
            </div>
            <div
              style={{
                fontSize: 10,
                color: "var(--mc-slate)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {user?.role}
            </div>
          </div>
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              color: "var(--mc-slate)",
              cursor: "pointer",
              padding: 4,
            }}
            title="Sair"
          >
            <i className="bi bi-box-arrow-right"></i>
          </button>
        </div>
      </div>
    </aside>
  );
}
