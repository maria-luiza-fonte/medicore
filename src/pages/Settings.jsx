import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

const SETTINGS_STORAGE_KEY = "mc-user-settings";

const defaultSettings = {
  compactMode: false,
  showTips: true,
  notifications: true,
};

export default function Settings() {
  const { theme, setTheme, user, compactMode, setCompactMode } = useApp();
  const [settings, setSettings] = useState(defaultSettings);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setSettings((prev) => ({ ...prev, ...parsed }));
      if (typeof parsed.compactMode === "boolean") {
        setCompactMode(parsed.compactMode);
      }
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key) => {
    setSettings((prev) => {
      const nextValue = !prev[key];

      if (key === "compactMode") {
        setCompactMode(nextValue);
      }

      return { ...prev, [key]: nextValue };
    });
  };

  return (
    <div>
      <div className="mc-page-header">
        <h1 className="mc-page-title">Configurações</h1>
        <p className="mc-page-subtitle">
          Personalize sua experiência no MediCore
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-7">
          <div className="mc-card p-4 h-100">
            <h2
              style={{ fontSize: 18, marginBottom: 4, color: "var(--mc-text)" }}
            >
              Aparência
            </h2>
            <p
              style={{
                color: "var(--mc-slate)",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              Escolha como deseja visualizar o sistema.
            </p>

            <div className="d-flex flex-wrap gap-2">
              <button
                className={`btn ${theme === "light" ? "btn-teal" : "btn-ghost"}`}
                onClick={() => setTheme("light")}
              >
                <i className="bi bi-sun me-2"></i>Modo claro
              </button>

              <button
                className={`btn ${theme === "dark" ? "btn-teal" : "btn-ghost"}`}
                onClick={() => setTheme("dark")}
              >
                <i className="bi bi-moon-stars me-2"></i>Modo escuro
              </button>

              <button
                className={`btn ${theme === "auto" ? "btn-teal" : "btn-ghost"}`}
                onClick={() => setTheme("auto")}
              >
                <i className="bi bi-circle-half me-2"></i>Seguir navegador
              </button>
            </div>

            <div
              className="mc-card-flat mt-4"
              style={{
                padding: "12px 14px",
                fontSize: 12,
                color: "var(--mc-slate)",
              }}
            >
              Tema atual:{" "}
              <strong style={{ color: "var(--mc-text)" }}>
                {theme === "auto"
                  ? "Automático (seguindo as preferências do navegador)"
                  : theme === "dark"
                    ? "Escuro"
                    : "Claro"}
              </strong>
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-5">
          <div className="mc-card p-4 h-100">
            <h2
              style={{ fontSize: 18, marginBottom: 4, color: "var(--mc-text)" }}
            >
              Preferências
            </h2>
            <p
              style={{
                color: "var(--mc-slate)",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              Essas opções ficam salvas para você neste navegador.
            </p>

            <div className="d-flex flex-column gap-3">
              <label
                className="d-flex justify-content-between align-items-center"
                style={{ color: "var(--mc-text)" }}
              >
                <span style={{ fontSize: 14 }}>
                  Compactar conversa longa da IA
                </span>
                <input
                  type="checkbox"
                  checked={compactMode}
                  onChange={() => updateSetting("compactMode")}
                  style={{ accentColor: "var(--mc-teal)" }}
                />
              </label>

              <div
                style={{
                  color: "var(--mc-slate)",
                  fontSize: 12,
                  marginTop: -6,
                }}
              >
                Ao ativar, o sistema resume partes antigas do chat da IA para
                reduzir contexto e consumo de tokens.
              </div>

              <label
                className="d-flex justify-content-between align-items-center"
                style={{ color: "var(--mc-text)" }}
              >
                <span style={{ fontSize: 14 }}>Mostrar dicas no sistema</span>
                <input
                  type="checkbox"
                  checked={settings.showTips}
                  onChange={() => updateSetting("showTips")}
                  style={{ accentColor: "var(--mc-teal)" }}
                />
              </label>

              <label
                className="d-flex justify-content-between align-items-center"
                style={{ color: "var(--mc-text)" }}
              >
                <span style={{ fontSize: 14 }}>Notificações visuais</span>
                <input
                  type="checkbox"
                  checked={settings.notifications}
                  onChange={() => updateSetting("notifications")}
                  style={{ accentColor: "var(--mc-teal)" }}
                />
              </label>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="mc-card-flat p-3 d-flex align-items-center justify-content-between flex-wrap gap-2">
            <div>
              <div
                style={{
                  color: "var(--mc-text)",
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Usuário logado
              </div>
              <div style={{ color: "var(--mc-slate)", fontSize: 12 }}>
                {user?.name} • {user?.role}
              </div>
            </div>
            <span
              className="mc-badge"
              style={{
                background: "var(--mc-teal-pale)",
                color: "var(--mc-teal)",
              }}
            >
              Configurações salvas automaticamente
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
