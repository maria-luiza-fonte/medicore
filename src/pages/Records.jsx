import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Records() {
  const { user, patients, appointments } = useApp();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");

  const userPatients = patients.filter((p) => p.doctorId === user?.doctorId);
  const filtered = userPatients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search),
  );
  const patientAppts = selectedPatient
    ? appointments.filter((a) => a.patientId === selectedPatient.id)
    : [];

  return (
    <div className="fade-in">
      <div className="mc-page-header">
        <h1 className="mc-page-title">Prontuários</h1>
        <p className="mc-page-subtitle">Histórico completo dos pacientes</p>
      </div>

      <div className="row g-3">
        {/* Patient list */}
        <div className="col-md-4">
          <div className="mc-card" style={{ padding: 0 }}>
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid var(--mc-border-subtle)",
              }}
            >
              <div className="mc-search-wrap">
                <i className="bi bi-search"></i>
                <input
                  className="mc-input form-control"
                  placeholder="Buscar paciente..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div style={{ maxHeight: 500, overflowY: "auto" }}>
              {filtered.map((p) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedPatient(p)}
                  style={{
                    padding: "14px 20px",
                    cursor: "pointer",
                    borderBottom: "1px solid var(--mc-border-subtle)",
                    background:
                      selectedPatient?.id === p.id
                        ? "var(--mc-teal-pale)"
                        : "transparent",
                    borderLeft:
                      selectedPatient?.id === p.id
                        ? "3px solid var(--mc-teal)"
                        : "3px solid transparent",
                    transition: "all 0.15s",
                  }}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <div
                      className="mc-avatar"
                      style={{ width: 34, height: 34, fontSize: 12 }}
                    >
                      {p.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13.5,
                          fontWeight: 500,
                          color:
                            selectedPatient?.id === p.id
                              ? "var(--mc-teal)"
                              : "var(--mc-text)",
                        }}
                      >
                        {p.name}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--mc-slate)" }}>
                        {
                          appointments.filter(
                            (a) =>
                              a.patientId === p.id && a.doctor === user?.name,
                          ).length
                        }{" "}
                        consulta(s)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Patient record */}
        <div className="col-md-8">
          {selectedPatient ? (
            <div>
              {/* Header card */}
              <div className="mc-card mb-3" style={{ padding: "24px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 16,
                    marginBottom: 20,
                  }}
                >
                  <div
                    className="mc-avatar"
                    style={{
                      width: 52,
                      height: 52,
                      fontSize: 18,
                      flexShrink: 0,
                    }}
                  >
                    {selectedPatient.name
                      .split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: 22,
                        marginBottom: 4,
                      }}
                    >
                      {selectedPatient.name}
                    </h3>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, color: "var(--mc-slate)" }}>
                        <i className="bi bi-calendar me-1"></i>
                        {Math.floor(
                          (Date.now() - new Date(selectedPatient.dob)) /
                            (365.25 * 24 * 3600 * 1000),
                        )}{" "}
                        anos
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--mc-teal)",
                          fontWeight: 600,
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {selectedPatient.bloodType}
                      </span>
                      <span style={{ fontSize: 13, color: "var(--mc-slate)" }}>
                        <i className="bi bi-shield-check me-1"></i>
                        {selectedPatient.insurance}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="row g-2">
                  {selectedPatient.allergies &&
                    selectedPatient.allergies !== "Nenhuma" && (
                      <div className="col-12">
                        <div
                          style={{
                            background: "rgba(239,68,68,0.08)",
                            border: "1px solid rgba(239,68,68,0.2)",
                            borderRadius: 8,
                            padding: "10px 14px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                          }}
                        >
                          <i
                            className="bi bi-exclamation-triangle-fill"
                            style={{ color: "#ef4444" }}
                          ></i>
                          <span style={{ fontSize: 13 }}>
                            <strong style={{ color: "#f87171" }}>
                              Alergia:
                            </strong>{" "}
                            {selectedPatient.allergies}
                          </span>
                        </div>
                      </div>
                    )}
                  {selectedPatient.conditions && (
                    <div className="col-12">
                      <div
                        style={{
                          background: "rgba(245,158,11,0.08)",
                          border: "1px solid rgba(245,158,11,0.2)",
                          borderRadius: 8,
                          padding: "10px 14px",
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <i
                          className="bi bi-activity"
                          style={{ color: "#f59e0b" }}
                        ></i>
                        <span style={{ fontSize: 13 }}>
                          <strong style={{ color: "#fbbf24" }}>
                            Condições:
                          </strong>{" "}
                          {selectedPatient.conditions}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointments history */}
              <div className="mc-card" style={{ padding: 0 }}>
                <div
                  style={{
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--mc-border-subtle)",
                  }}
                >
                  <h4 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                    <i
                      className="bi bi-clock-history me-2"
                      style={{ color: "var(--mc-teal)" }}
                    ></i>
                    Histórico de Consultas ({patientAppts.length})
                  </h4>
                </div>
                {patientAppts.length === 0 ? (
                  <div
                    style={{
                      padding: "32px",
                      textAlign: "center",
                      color: "var(--mc-slate)",
                    }}
                  >
                    <i
                      className="bi bi-calendar-x d-block mb-2"
                      style={{ fontSize: 32, opacity: 0.3 }}
                    ></i>
                    Nenhuma consulta registrada
                  </div>
                ) : (
                  <div>
                    {patientAppts.map((a, i) => (
                      <div
                        key={a.id}
                        style={{
                          padding: "16px 20px",
                          borderBottom:
                            i < patientAppts.length - 1
                              ? "1px solid var(--mc-border-subtle)"
                              : "none",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            marginBottom: 8,
                          }}
                        >
                          <div>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>
                              {a.specialty}
                            </span>
                            <span
                              style={{
                                fontSize: 12,
                                color: "var(--mc-slate)",
                                marginLeft: 8,
                              }}
                            >
                              — {a.doctor}
                            </span>
                          </div>
                          <div style={{ textAlign: "right" }}>
                            <div
                              style={{
                                fontSize: 13,
                                fontFamily: "var(--font-mono)",
                                color: "var(--mc-teal)",
                              }}
                            >
                              {new Date(a.date + "T12:00").toLocaleDateString(
                                "pt-BR",
                              )}{" "}
                              às {a.time}
                            </div>
                            <span
                              className={`mc-badge ${a.status === "done" ? "badge-status-active" : a.status === "pending" ? "badge-status-pending" : "badge-status-cancelled"}`}
                              style={{ fontSize: 10 }}
                            >
                              {a.status === "done"
                                ? "Realizada"
                                : a.status === "pending"
                                  ? "Pendente"
                                  : "Cancelada"}
                            </span>
                          </div>
                        </div>
                        {a.diagnosis && (
                          <div
                            style={{
                              background: "var(--mc-surface-3)",
                              borderRadius: 6,
                              padding: "8px 12px",
                              fontSize: 12.5,
                            }}
                          >
                            <span
                              style={{
                                color: "var(--mc-slate)",
                                fontSize: 11,
                                textTransform: "uppercase",
                                letterSpacing: "0.05em",
                              }}
                            >
                              Diagnóstico:{" "}
                            </span>
                            {a.diagnosis}
                          </div>
                        )}
                        {a.notes && (
                          <p
                            style={{
                              fontSize: 12.5,
                              color: "var(--mc-slate)",
                              marginTop: 6,
                              marginBottom: 0,
                            }}
                          >
                            <i className="bi bi-chat-quote me-1"></i>
                            {a.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div
              className="mc-card"
              style={{ padding: "60px 20px", textAlign: "center" }}
            >
              <i
                className="bi bi-folder2-open d-block mb-3"
                style={{ fontSize: 52, color: "var(--mc-teal)", opacity: 0.3 }}
              ></i>
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  marginBottom: 8,
                }}
              >
                Selecione um paciente
              </h4>
              <p style={{ color: "var(--mc-slate)", fontSize: 14 }}>
                Clique em um paciente na lista ao lado para visualizar seu
                prontuário completo.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
