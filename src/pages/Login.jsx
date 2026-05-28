import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Login() {
  const { login, setShowLogin, setShowHome } = useApp();
  const [email, setEmail] = useState("dr.ricardo@medicore.com");
  const [password, setPassword] = useState("senha123");
  const [showPassword, setShowPassword] = useState(false);
  const [professionalType, setProfessionalType] = useState("medical");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleProfessionalTypeChange = (type) => {
    setProfessionalType(type);
    if (type === "admin") {
      setEmail("admin@medicore.com");
    } else if (type === "veterinary") {
      setEmail("dra.camila@medicorevet.com");
    } else {
      setEmail("dr.ricardo@medicore.com");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 800));
    const ok = login(email, password, professionalType);
    if (!ok) setError("Credenciais inválidas. Tente novamente.");
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 420,
          padding: "0 20px",
        }}
      >
        {/* Logo */}
        <div className="text-center mb-5 fade-in">
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, var(--mc-teal), #0a8a86)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                boxShadow: "0 0 20px var(--mc-teal-glow)",
              }}
            >
              <i
                className="bi bi-heart-pulse-fill"
                style={{ color: "var(--mc-navy)" }}
              ></i>
            </div>
            <span
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 28,
                color: "var(--mc-text)",
              }}
            >
              MediCore
            </span>
          </div>
          <p style={{ color: "var(--mc-slate)", fontSize: 13 }}>
            Sistema Médico Inteligente
          </p>
        </div>

        {/* Card */}
        <div
          className="mc-card fade-in anim-delay-1"
          style={{ padding: "36px 32px" }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 22,
              marginBottom: 6,
            }}
          >
            Bem-vindo de volta
          </h2>
          <p
            style={{ color: "var(--mc-slate)", fontSize: 13, marginBottom: 28 }}
          >
            Entre com suas credenciais para continuar
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="mc-label d-block">Perfil profissional</label>
              <div className="d-flex gap-2" style={{ flexWrap: "wrap" }}>
                <button
                  type="button"
                  className={`btn ${professionalType === "medical" ? "btn-teal" : "btn-ghost"}`}
                  onClick={() => handleProfessionalTypeChange("medical")}
                >
                  <i className="bi bi-hospital me-2"></i>Médico
                </button>
                <button
                  type="button"
                  className={`btn ${professionalType === "veterinary" ? "btn-teal" : "btn-ghost"}`}
                  onClick={() => handleProfessionalTypeChange("veterinary")}
                >
                  <i className="bi bi-heart me-2"></i>Médico Veterinário
                </button>
                <button
                  type="button"
                  className={`btn ${professionalType === "admin" ? "btn-teal" : "btn-ghost"}`}
                  onClick={() => handleProfessionalTypeChange("admin")}
                >
                  <i className="bi bi-shield-lock me-2"></i>Admin
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="mc-label d-block">E-mail profissional</label>
              <div style={{ position: "relative" }}>
                <i
                  className="bi bi-envelope"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mc-slate)",
                  }}
                ></i>
                <input
                  type="email"
                  className="mc-input form-control"
                  style={{ paddingLeft: 36 }}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="mc-label d-block">Senha</label>
              <div style={{ position: "relative" }}>
                <i
                  className="bi bi-lock"
                  style={{
                    position: "absolute",
                    left: 12,
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--mc-slate)",
                  }}
                ></i>
                <input
                  type={showPassword ? "text" : "password"}
                  className="mc-input form-control"
                  style={{ paddingLeft: 36, paddingRight: 40 }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "8px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    padding: "4px 8px",
                    fontSize: 16,
                    border: "none",
                    background: "none",
                    color: "var(--mc-slate)",
                    cursor: "pointer",
                  }}
                >
                  <i
                    className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
                  ></i>
                </button>
              </div>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239,68,68,0.1)",
                  border: "1px solid rgba(239,68,68,0.3)",
                  borderRadius: 8,
                  padding: "10px 14px",
                  marginBottom: 20,
                  color: "#f87171",
                  fontSize: 13,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <i className="bi bi-exclamation-circle"></i> {error}
              </div>
            )}

            <div className="d-flex justify-content-between align-items-center mb-4">
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                  color: "var(--mc-slate)",
                  fontSize: 13,
                }}
              >
                <input
                  type="checkbox"
                  style={{ accentColor: "var(--mc-teal)" }}
                />{" "}
                Lembrar-me
              </label>
              <a
                href="#"
                style={{
                  color: "var(--mc-teal)",
                  fontSize: 13,
                  textDecoration: "none",
                }}
              >
                Esqueceu a senha?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-teal w-100 py-2"
              disabled={loading}
              style={{ fontSize: 15 }}
            >
              {loading ? (
                <span>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Autenticando...
                </span>
              ) : (
                <span>
                  <i className="bi bi-box-arrow-in-right me-2"></i>Entrar no
                  sistema
                </span>
              )}
            </button>
          </form>
        </div>

        {/* Create account link */}
        <div className="text-center mt-4 fade-in anim-delay-2">
          <p style={{ color: "var(--mc-slate)", fontSize: 13 }}>
            Não tem conta?{" "}
            <button
              type="button"
              onClick={() => {
                setShowHome(false);
                setShowLogin(false);
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--mc-teal)",
                fontWeight: 600,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                font: "inherit",
              }}
            >
              Crie uma agora
            </button>
          </p>
          <p style={{ fontSize: 12, color: "var(--mc-slate)", marginTop: 12 }}>
            ou{" "}
            <button
              type="button"
              onClick={() => setShowHome(true)}
              style={{
                background: "none",
                border: "none",
                color: "var(--mc-slate)",
                fontWeight: 500,
                cursor: "pointer",
                textDecoration: "underline",
                padding: 0,
                font: "inherit",
              }}
            >
              volte para o início
            </button>
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-5 fade-in anim-delay-3">
          <p style={{ color: "var(--mc-slate)", fontSize: 11, opacity: 0.5 }}>
            © 2026 MediCore · LGPD Compliant · CFM Homologado
          </p>
        </div>
      </div>
    </div>
  );
}
