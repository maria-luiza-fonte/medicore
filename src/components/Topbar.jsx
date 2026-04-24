import React from "react";
import { useApp } from "../context/AppContext";

const titles = {
  dashboard: "Dashboard",
  appointments: "Agendamentos",
  patients: "Pacientes",
  records: "Prontuários",
  urgency: "Fila de Urgência",
  ai: "Assistente IA",
  reports: "Relatórios",
  settings: "Configurações",
};

export default function Topbar() {
  const {
    activePage,
    urgencyQueue,
    setActivePage,
    theme,
    toggleTheme,
    toggleSidebarOpen,
  } = useApp();
  const pendingUrgency = urgencyQueue.filter(
    (u) => u.status === "waiting",
  ).length;
  const today = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="mc-topbar">
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Menu toggle for mobile - inline */}
        <button
          className="btn-ghost btn"
          style={{
            padding: "5px 8px",
            display: "none",
            minWidth: 32,
          }}
          onClick={toggleSidebarOpen}
          title="Abrir menu"
          aria-label="Abrir menu de navegação"
          id="sidebar-toggle"
        >
          <i className="bi bi-list" style={{ fontSize: 18 }}></i>
        </button>

        {/* Title and date */}
        <div>
          <div
            style={{
              fontSize: 16,
              fontWeight: 600,
              color: "var(--mc-text)",
              fontFamily: "var(--font-display)",
            }}
          >
            {titles[activePage]}
          </div>
          <div
            style={{
              fontSize: 11,
              color: "var(--mc-slate)",
              textTransform: "capitalize",
            }}
          >
            {today}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Urgency alert */}
        {pendingUrgency > 0 && (
          <button
            className="btn-ghost btn"
            style={{
              fontSize: 12,
              padding: "5px 12px",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => setActivePage("urgency")}
          >
            <span className="urgency-dot urgency-dot-1"></span>
            <span style={{ color: "#f87171" }}>{pendingUrgency} urgências</span>
          </button>
        )}

        {/* Quick AI */}
        <button
          className="btn-outline-teal btn"
          style={{ fontSize: 12, padding: "5px 12px" }}
          onClick={() => setActivePage("ai")}
        >
          <i className="bi bi-robot me-1"></i> IA Diagnóstica
        </button>

        {/* Theme */}
        <button
          className="btn-ghost btn"
          style={{ padding: "5px 10px" }}
          onClick={toggleTheme}
          title={
            theme === "dark"
              ? "Ativar modo claro"
              : theme === "light"
                ? "Ativar modo escuro"
                : "Ativar modo manual"
          }
          aria-label={
            theme === "dark"
              ? "Ativar modo claro"
              : theme === "light"
                ? "Ativar modo escuro"
                : "Ativar modo manual"
          }
        >
          <i
            className={`bi ${
              theme === "dark"
                ? "bi-sun"
                : theme === "light"
                  ? "bi-moon-stars"
                  : "bi-circle-half"
            }`}
            style={{ fontSize: 15 }}
          ></i>
        </button>

        {/* Settings */}
        <button
          className="btn-ghost btn"
          style={{ padding: "5px 10px" }}
          onClick={() => setActivePage("settings")}
          title="Configurações"
          aria-label="Abrir configurações"
        >
          <i className="bi bi-gear" style={{ fontSize: 15 }}></i>
        </button>
      </div>
    </div>
  );
}
