import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Register() {
  const { register, setShowLogin, setShowHome } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    professionalType: "doctor",
    crm: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleProfessionalTypeChange = (type) => {
    setFormData((prev) => ({
      ...prev,
      professionalType: type,
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Nome é obrigatório");
      return false;
    }
    if (!formData.email.includes("@")) {
      setError("Email inválido");
      return false;
    }
    if (formData.password.length < 6) {
      setError("Senha deve ter pelo menos 6 caracteres");
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Senhas não correspondem");
      return false;
    }
    if (!formData.crm.trim()) {
      setError("CRM/CRMV é obrigatório");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));

    const ok = register(
      formData.name,
      formData.email,
      formData.password,
      formData.professionalType,
      formData.crm,
    );

    if (!ok) {
      setError("Erro ao criar conta. Tente novamente.");
    }
    setLoading(false);
  };

  return (
    <div className="login-bg">
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
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
                width: 48,
                height: 48,
                background: "linear-gradient(135deg, var(--mc-teal), #0a8a86)",
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px var(--mc-teal-glow)",
              }}
            >
              <i
                className="bi bi-heart-pulse-fill"
                style={{ color: "var(--mc-navy)", fontSize: 24 }}
              ></i>
            </div>
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              marginBottom: 4,
            }}
          >
            MediCore
          </h1>
          <p style={{ color: "var(--mc-slate)", fontSize: 13 }}>
            Crie sua conta e acesse o sistema
          </p>
        </div>

        {/* Professional type selector */}
        <div className="mb-4" style={{ display: "flex", gap: 12 }}>
          <button
            type="button"
            onClick={() => handleProfessionalTypeChange("doctor")}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border:
                formData.professionalType === "doctor"
                  ? "2px solid var(--mc-teal)"
                  : "1px solid var(--mc-border)",
              background:
                formData.professionalType === "doctor"
                  ? "var(--mc-teal-pale)"
                  : "transparent",
              color:
                formData.professionalType === "doctor"
                  ? "var(--mc-teal)"
                  : "var(--mc-slate)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <i className="bi bi-hospital me-2"></i>Médico
          </button>
          <button
            type="button"
            onClick={() => handleProfessionalTypeChange("veterinary")}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 8,
              border:
                formData.professionalType === "veterinary"
                  ? "2px solid var(--mc-teal)"
                  : "1px solid var(--mc-border)",
              background:
                formData.professionalType === "veterinary"
                  ? "var(--mc-teal-pale)"
                  : "transparent",
              color:
                formData.professionalType === "veterinary"
                  ? "var(--mc-teal)"
                  : "var(--mc-slate)",
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <i className="bi bi-paw me-2"></i>Veterinário
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="mc-card-flat"
          style={{ padding: 24 }}
        >
          {/* Error message */}
          {error && (
            <div
              style={{
                padding: "12px 16px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: 8,
                color: "#f87171",
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              <i className="bi bi-exclamation-circle me-2"></i>
              {error}
            </div>
          )}

          {/* Name */}
          <div className="mb-4">
            <label className="mc-label">Nome Completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome"
              className="mc-input form-control"
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="mc-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="seu@email.com"
              className="mc-input form-control"
              required
            />
          </div>

          {/* CRM/CRMV */}
          <div className="mb-4">
            <label className="mc-label">
              {formData.professionalType === "veterinary" ? "CRMV" : "CRM"}
            </label>
            <input
              type="text"
              name="crm"
              value={formData.crm}
              onChange={handleChange}
              placeholder="Ex: 123456/SP"
              className="mc-input form-control"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="mc-label">Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                className="mc-input form-control"
                style={{ paddingRight: "40px" }}
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

          {/* Confirm password */}
          <div className="mb-4">
            <label className="mc-label">Confirmar Senha</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Repita a senha"
                className="mc-input form-control"
                style={{ paddingRight: "40px" }}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
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
                  className={`bi ${showConfirmPassword ? "bi-eye-slash" : "bi-eye"}`}
                ></i>
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="btn btn-teal w-100"
            style={{
              padding: "11px 20px",
              fontSize: 14,
              fontWeight: 600,
              marginBottom: 12,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Criando conta...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>
                Criar Conta
              </>
            )}
          </button>

          {/* Login link */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontSize: 13, color: "var(--mc-slate)" }}>
              Já tem conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setShowHome(false);
                  setShowLogin(true);
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
                Faça login
              </button>
            </p>
            <p
              style={{ fontSize: 12, color: "var(--mc-slate)", marginTop: 12 }}
            >
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
        </form>

        {/* Footer */}
        <div
          style={{
            marginTop: 20,
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--mc-slate)",
              opacity: 0.6,
              margin: 0,
            }}
          >
            © 2026 MediCore · LGPD Compliant · CFM Homologado
          </p>
        </div>
      </div>
    </div>
  );
}
