import React from "react";
import { useApp } from "../context/AppContext";

export default function Home() {
  const { setShowLogin, setShowHome } = useApp();

  return (
    <div className="login-bg">
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 520,
          padding: "0 20px",
          textAlign: "center",
        }}
      >
        {/* Logo */}
        <div className="fade-in" style={{ marginBottom: 48 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                background: "linear-gradient(135deg, var(--mc-teal), #0a8a86)",
                borderRadius: 14,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 24px var(--mc-teal-glow)",
              }}
            >
              <i
                className="bi bi-heart-pulse-fill"
                style={{ color: "var(--mc-navy)", fontSize: 28 }}
              ></i>
            </div>
          </div>
          <h1
            style={{
              fontSize: 40,
              fontWeight: 700,
              fontFamily: "var(--font-display)",
              marginBottom: 12,
              letterSpacing: "-0.5px",
            }}
          >
            MediCore
          </h1>
          <p
            style={{
              fontSize: 16,
              color: "var(--mc-slate-light)",
              marginBottom: 8,
              fontWeight: 500,
            }}
          >
            Plataforma Médica Inteligente
          </p>
          <p
            style={{
              fontSize: 13,
              color: "var(--mc-slate)",
              maxWidth: 380,
              margin: "0 auto",
            }}
          >
            Gerencie pacientes, agendamentos e dados clínicos com IA integrada
          </p>
        </div>

        {/* Feature highlights */}
        <div
          className="fade-in anim-delay-1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 12,
            marginBottom: 36,
          }}
        >
          <div
            style={{
              padding: 16,
              background: "var(--mc-teal-pale)",
              borderRadius: 12,
              border: "1px solid rgba(15, 188, 182, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                marginBottom: 6,
                color: "var(--mc-teal)",
              }}
            >
              <i className="bi bi-people"></i>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--mc-text)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Gestão de Pacientes
            </p>
          </div>
          <div
            style={{
              padding: 16,
              background: "var(--mc-teal-pale)",
              borderRadius: 12,
              border: "1px solid rgba(15, 188, 182, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                marginBottom: 6,
                color: "var(--mc-teal)",
              }}
            >
              <i className="bi bi-calendar2"></i>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--mc-text)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Agendamentos
            </p>
          </div>
          <div
            style={{
              padding: 16,
              background: "var(--mc-teal-pale)",
              borderRadius: 12,
              border: "1px solid rgba(15, 188, 182, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                marginBottom: 6,
                color: "var(--mc-teal)",
              }}
            >
              <i className="bi bi-robot"></i>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--mc-text)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Assistente IA
            </p>
          </div>
          <div
            style={{
              padding: 16,
              background: "var(--mc-teal-pale)",
              borderRadius: 12,
              border: "1px solid rgba(15, 188, 182, 0.2)",
            }}
          >
            <div
              style={{
                fontSize: 20,
                marginBottom: 6,
                color: "var(--mc-teal)",
              }}
            >
              <i className="bi bi-graph-up"></i>
            </div>
            <p
              style={{
                fontSize: 12,
                color: "var(--mc-text)",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Relatórios
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div
          className="fade-in anim-delay-2"
          style={{ display: "flex", gap: 12, flexDirection: "column" }}
        >
          <button
            onClick={() => {
              setShowHome(false);
              setShowLogin(false);
            }}
            className="btn btn-teal w-100"
            style={{
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <i className="bi bi-person-plus me-2"></i>
            Criar Conta
          </button>
          <button
            onClick={() => {
              setShowHome(false);
              setShowLogin(true);
            }}
            className="btn btn-outline-teal w-100"
            style={{
              padding: "14px 20px",
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Fazer Login
          </button>
        </div>

        {/* Footer */}
        <div className="fade-in anim-delay-3" style={{ marginTop: 40 }}>
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
