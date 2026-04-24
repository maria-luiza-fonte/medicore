import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";

const SETTINGS_STORAGE_KEY = "mc-user-settings";
const OPENROUTER_KEY_STORAGE = "mc-openrouter-api-key";
const OPENROUTER_MODEL_STORAGE = "mc-openrouter-model";

const defaultSettings = {
  compactMode: false,
  showTips: true,
  notifications: true,
};

export default function Settings() {
  const { theme, setTheme, user } = useApp();
  const [settings, setSettings] = useState(defaultSettings);
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState("openai/gpt-4o-mini");
  const [showKey, setShowKey] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setSettings((prev) => ({ ...prev, ...parsed }));
    } catch {
      setSettings(defaultSettings);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    setApiKey(localStorage.getItem(OPENROUTER_KEY_STORAGE) || "");
    setModel(
      localStorage.getItem(OPENROUTER_MODEL_STORAGE) || "openai/gpt-4o-mini",
    );
  }, []);

  const updateSetting = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const saveAISettings = () => {
    if (apiKey.trim()) {
      localStorage.setItem(OPENROUTER_KEY_STORAGE, apiKey.trim());
    } else {
      localStorage.removeItem(OPENROUTER_KEY_STORAGE);
    }

    localStorage.setItem(
      OPENROUTER_MODEL_STORAGE,
      model.trim() || "openai/gpt-4o-mini",
    );
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
                <span style={{ fontSize: 14 }}>Modo compacto</span>
                <input
                  type="checkbox"
                  checked={settings.compactMode}
                  onChange={() => updateSetting("compactMode")}
                  style={{ accentColor: "var(--mc-teal)" }}
                />
              </label>

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
          <div className="mc-card p-4">
            <h2
              style={{ fontSize: 18, marginBottom: 4, color: "var(--mc-text)" }}
            >
              Integração de IA
            </h2>
            <p
              style={{
                color: "var(--mc-slate)",
                fontSize: 13,
                marginBottom: 18,
              }}
            >
              Conecte uma IA real via OpenRouter. A chave fica salva localmente
              no seu navegador.
            </p>

            <div className="row g-3">
              <div className="col-12 col-xl-8">
                <label className="mc-label d-block">API Key OpenRouter</label>
                <div className="d-flex gap-2">
                  <input
                    type={showKey ? "text" : "password"}
                    className="mc-input form-control"
                    placeholder="sk-or-v1-..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                  />
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => setShowKey((prev) => !prev)}
                  >
                    <i
                      className={`bi ${showKey ? "bi-eye-slash" : "bi-eye"}`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="col-12 col-xl-4">
                <label className="mc-label d-block">Modelo</label>
                <input
                  type="text"
                  className="mc-input form-control"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  placeholder="openai/gpt-4o-mini"
                />
              </div>

              <div className="col-12 d-flex gap-2 align-items-center">
                <button
                  type="button"
                  className="btn btn-teal"
                  onClick={saveAISettings}
                >
                  <i className="bi bi-save me-2"></i>Salvar integração
                </button>
                <span style={{ color: "var(--mc-slate)", fontSize: 12 }}>
                  Dica: após salvar, abra o Assistente IA e envie uma mensagem.
                </span>
              </div>
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
