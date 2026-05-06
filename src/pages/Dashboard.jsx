import React from "react";
import { useApp } from "../context/AppContext";

const urgencyLabels = {
  1: "Crítico",
  2: "Alto",
  3: "Moderado",
  4: "Baixo",
  5: "Rotina",
};
const urgencyColors = {
  1: "#ef4444",
  2: "#f97316",
  3: "#f59e0b",
  4: "#10b981",
  5: "#64748b",
};

export default function Dashboard() {
  const { user, patients, appointments, urgencyQueue, setActivePage } =
    useApp();

  const userPatients = patients.filter((p) => p.doctorId === user?.doctorId);
  const userAppointments = appointments.filter((a) => a.doctor === user?.name);
  const userUrgencies = urgencyQueue.filter((u) => u.doctor === user?.name);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppts = userAppointments
    .filter((a) => a.status === "pending")
    .slice(0, 5);
  const urgentPending = userUrgencies.filter((u) => u.status === "waiting");
  const doneAppts = userAppointments.filter((a) => a.status === "done").length;

  const stats = [
    {
      value: userPatients.length,
      label: "Total de Pacientes",
      icon: "bi-people-fill",
      color: "var(--mc-teal)",
    },
    {
      value: todayAppts.length,
      label: "Consultas Pendentes",
      icon: "bi-calendar-check",
      color: "#a78bfa",
    },
    {
      value: urgentPending.length,
      label: "Urgências Ativas",
      icon: "bi-exclamation-triangle-fill",
      color: "#ef4444",
    },
    {
      value: doneAppts,
      label: "Atendimentos Realizados",
      icon: "bi-check-circle-fill",
      color: "#10b981",
    },
  ];

  return (
    <div className="fade-in">
      {/* Page header */}
      <div className="mc-page-header">
        <h1 className="mc-page-title">Visão Geral</h1>
        <p className="mc-page-subtitle">
          Resumo do sistema e atividades recentes
        </p>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        {stats.map((s, i) => (
          <div key={i} className={`col-6 col-lg-3 fade-in anim-delay-${i + 1}`}>
            <div className="stat-card" style={{ "--accent": s.color }}>
              <div className="stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
              <i
                className={`bi ${s.icon} stat-icon`}
                style={{ color: s.color }}
              ></i>
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 2,
                  background: `linear-gradient(90deg, ${s.color}, transparent)`,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3">
        {/* Upcoming appointments */}
        <div className="col-lg-7 fade-in anim-delay-2">
          <div className="mc-card" style={{ padding: 0 }}>
            <div
              style={{
                padding: "20px 24px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid var(--mc-border-subtle)",
              }}
            >
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>
                  Próximas Consultas
                </h3>
                <p
                  style={{ fontSize: 12, color: "var(--mc-slate)", margin: 0 }}
                >
                  Agendamentos pendentes
                </p>
              </div>
              <button
                className="btn-outline-teal btn"
                style={{ fontSize: 12, padding: "5px 12px" }}
                onClick={() => setActivePage("appointments")}
              >
                Ver todas <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {todayAppts.map((a, i) => (
                <div
                  key={a.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    padding: "12px 24px",
                    borderBottom:
                      i < todayAppts.length - 1
                        ? "1px solid var(--mc-border-subtle)"
                        : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "var(--mc-surface-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <div
                    className="mc-avatar"
                    style={{ width: 38, height: 38, fontSize: 13 }}
                  >
                    {a.patientName
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: 13.5,
                        fontWeight: 500,
                        color: "var(--mc-text)",
                      }}
                    >
                      {a.patientName}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--mc-slate)" }}>
                      {a.specialty} · {a.doctor}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        color: "var(--mc-teal)",
                        fontFamily: "var(--font-mono)",
                      }}
                    >
                      {a.time}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--mc-slate)" }}>
                      {new Date(a.date + "T12:00").toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </div>
                  </div>
                  {a.urgency && (
                    <div
                      className="urgency-dot"
                      style={{
                        [`urgencyDot${a.urgency}`]: true,
                        background: urgencyColors[a.urgency],
                        boxShadow:
                          a.urgency === 1
                            ? `0 0 6px ${urgencyColors[1]}`
                            : "none",
                        animation:
                          a.urgency === 1 ? "pulse 1.5s infinite" : "none",
                      }}
                    ></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Urgency sidebar */}
        <div className="col-lg-5 fade-in anim-delay-3">
          <div className="mc-card" style={{ padding: 0 }}>
            <div
              style={{
                padding: "20px 24px 16px",
                borderBottom: "1px solid var(--mc-border-subtle)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                    marginBottom: 2,
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                  }}
                >
                  <span className="urgency-dot urgency-dot-1"></span> Fila de
                  Urgência
                </h3>
                <p
                  style={{ fontSize: 12, color: "var(--mc-slate)", margin: 0 }}
                >
                  {urgentPending.length} aguardando reagendamento
                </p>
              </div>
              <button
                className="btn-ghost btn"
                style={{ fontSize: 12, padding: "5px 12px" }}
                onClick={() => setActivePage("urgency")}
              >
                Gerenciar <i className="bi bi-arrow-right ms-1"></i>
              </button>
            </div>
            <div style={{ padding: "8px 0" }}>
              {userUrgencies.slice(0, 4).map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    padding: "12px 24px",
                    borderBottom:
                      i < Math.min(userUrgencies.length, 4) - 1
                        ? "1px solid var(--mc-border-subtle)"
                        : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        background: `rgba(${urgencyColors[u.level]
                          .replace("#", "")
                          .match(/.{2}/g)
                          .map((h) => parseInt(h, 16))
                          .join(",")},0.15)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: urgencyColors[u.level],
                      }}
                    >
                      {u.level}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: "var(--mc-text)",
                        }}
                      >
                        {u.patientName}
                      </div>
                      <span
                        className={`mc-badge badge-urgency-${u.level}`}
                        style={{ fontSize: 10 }}
                      >
                        {urgencyLabels[u.level]}
                      </span>
                    </div>
                    <span
                      style={{
                        fontSize: 11,
                        color: u.status === "scheduled" ? "#34d399" : "#fbbf24",
                      }}
                    >
                      {u.status === "scheduled" ? "Agendado" : "Aguardando"}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 11.5,
                      color: "var(--mc-slate)",
                      margin: 0,
                      lineHeight: 1.5,
                      paddingLeft: 38,
                    }}
                  >
                    {u.reason.substring(0, 72)}
                    {u.reason.length > 72 ? "..." : ""}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="col-12 fade-in anim-delay-4">
          <div className="mc-card-flat" style={{ padding: "20px 24px" }}>
            <h3
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--mc-slate)",
                textTransform: "uppercase",
                letterSpacing: "0.07em",
                marginBottom: 16,
              }}
            >
              Ações Rápidas
            </h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {[
                {
                  icon: "bi-person-plus",
                  label: "Novo Paciente",
                  page: "patients",
                  color: "var(--mc-teal)",
                },
                {
                  icon: "bi-calendar-plus",
                  label: "Novo Agendamento",
                  page: "appointments",
                  color: "#a78bfa",
                },
                {
                  icon: "bi-exclamation-triangle",
                  label: "Registrar Urgência",
                  page: "urgency",
                  color: "#ef4444",
                },
                {
                  icon: "bi-robot",
                  label: "Consultar IA",
                  page: "ai",
                  color: "#10b981",
                },
                {
                  icon: "bi-file-earmark-text",
                  label: "Ver Prontuários",
                  page: "records",
                  color: "#f59e0b",
                },
              ].map((a, i) => (
                <button
                  key={i}
                  onClick={() => setActivePage(a.page)}
                  className="btn-ghost btn"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    fontSize: 13,
                    padding: "8px 16px",
                  }}
                >
                  <i
                    className={`bi ${a.icon}`}
                    style={{ color: a.color, fontSize: 15 }}
                  ></i>
                  {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
