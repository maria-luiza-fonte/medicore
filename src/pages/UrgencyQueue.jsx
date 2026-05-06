import React, { useState } from "react";
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
const urgencyDesc = {
  1: "Risco de vida imediato. Reagendamento em até 24h.",
  2: "Condição grave. Reagendamento em até 48h.",
  3: "Atenção requerida. Reagendamento em até 1 semana.",
  4: "Acompanhamento de rotina acelerado. Até 2 semanas.",
  5: "Rotina normal. Sem prioridade especial.",
};

export default function UrgencyQueue() {
  const { user, urgencyQueue, updateUrgency, addAppointment, patients } =
    useApp();
  const [scheduleModal, setScheduleModal] = useState(null);
  const [schedForm, setSchedForm] = useState({
    date: "",
    time: "",
    doctor: "",
  });

  const filtered = urgencyQueue.filter((u) => u.doctor === user?.name);

  const sorted = [...filtered].sort((a, b) => {
    if (a.status === "waiting" && b.status !== "waiting") return -1;
    if (a.status !== "waiting" && b.status === "waiting") return 1;
    return a.level - b.level;
  });

  const waiting = filtered.filter((u) => u.status === "waiting");
  const scheduled = filtered.filter((u) => u.status === "scheduled");

  const handleSchedule = () => {
    if (!schedForm.date || !schedForm.time) return;
    const u = scheduleModal;
    addAppointment({
      patientId: u.patientId,
      patientName: u.patientName,
      doctor: schedForm.doctor || u.doctor,
      specialty: "Urgência",
      date: schedForm.date,
      time: schedForm.time,
      status: "pending",
      notes: `[URGÊNCIA Nível ${u.level}] ${u.reason}`,
      diagnosis: "",
    });
    updateUrgency(u.id, {
      status: "scheduled",
      scheduledDate: schedForm.date,
      scheduledTime: schedForm.time,
    });
    setScheduleModal(null);
    setSchedForm({ date: "", time: "", doctor: "" });
  };

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Fila de Urgência</h1>
          <p className="mc-page-subtitle">
            Gerenciamento de reagendamentos prioritários no pós-atendimento
          </p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <div
            className="mc-card-flat"
            style={{ padding: "8px 16px", display: "flex", gap: 16 }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#ef4444",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {waiting.length}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--mc-slate)",
                  textTransform: "uppercase",
                }}
              >
                Aguardando
              </div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#10b981",
                  fontFamily: "var(--font-mono)",
                }}
              >
                {scheduled.length}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: "var(--mc-slate)",
                  textTransform: "uppercase",
                }}
              >
                Agendados
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Priority legend */}
      <div className="mc-card-flat mb-4" style={{ padding: "16px 20px" }}>
        <div
          style={{
            fontSize: 11,
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.07em",
            color: "var(--mc-slate)",
            marginBottom: 12,
          }}
        >
          Escala de Prioridade
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {[1, 2, 3, 4, 5].map((level) => (
            <div
              key={level}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 8,
                background: `rgba(${urgencyColors[level]
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((h) => parseInt(h, 16))
                  .join(",")},0.1)`,
                border: `1px solid rgba(${urgencyColors[level]
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((h) => parseInt(h, 16))
                  .join(",")},0.25)`,
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontWeight: 700,
                  fontSize: 16,
                  color: urgencyColors[level],
                  lineHeight: 1,
                }}
              >
                {level}
              </span>
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: urgencyColors[level],
                  }}
                >
                  {urgencyLabels[level]}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "var(--mc-slate)",
                    maxWidth: 160,
                  }}
                >
                  {urgencyDesc[level]}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Queue */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {sorted.map((u, i) => {
          const color = urgencyColors[u.level];
          const rgb = color
            .replace("#", "")
            .match(/.{2}/g)
            .map((h) => parseInt(h, 16))
            .join(",");
          return (
            <div
              key={u.id}
              className="mc-card fade-in"
              style={{
                padding: 0,
                borderLeft: `4px solid ${color}`,
                animationDelay: `${i * 0.05}s`,
              }}
            >
              <div style={{ padding: "20px 24px" }}>
                <div
                  style={{ display: "flex", alignItems: "flex-start", gap: 16 }}
                >
                  {/* Level indicator */}
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: 12,
                      background: `rgba(${rgb},0.15)`,
                      border: `1px solid rgba(${rgb},0.3)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: "var(--font-mono)",
                        fontWeight: 800,
                        fontSize: 22,
                        color,
                        lineHeight: 1,
                      }}
                    >
                      {u.level}
                    </span>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        marginBottom: 6,
                      }}
                    >
                      <span style={{ fontSize: 16, fontWeight: 600 }}>
                        {u.patientName}
                      </span>
                      <span className={`mc-badge badge-urgency-${u.level}`}>
                        {urgencyLabels[u.level]}
                      </span>
                      {u.status === "waiting" && u.level <= 2 && (
                        <span
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                            fontSize: 11,
                            color: "#f87171",
                          }}
                        >
                          <span className="urgency-dot urgency-dot-1"></span>
                          URGENTE
                        </span>
                      )}
                    </div>

                    <p
                      style={{
                        fontSize: 13.5,
                        color: "var(--mc-text)",
                        lineHeight: 1.6,
                        marginBottom: 10,
                      }}
                    >
                      {u.reason}
                    </p>

                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--mc-slate)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <i className="bi bi-person"></i> {u.doctor}
                      </span>
                      <span
                        style={{
                          fontSize: 12,
                          color: "var(--mc-slate)",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <i className="bi bi-calendar"></i> Registrado em{" "}
                        {new Date(u.createdAt + "T12:00").toLocaleDateString(
                          "pt-BR",
                        )}
                      </span>
                      {u.status === "scheduled" && u.scheduledDate && (
                        <span
                          style={{
                            fontSize: 12,
                            color: "#34d399",
                            display: "flex",
                            alignItems: "center",
                            gap: 5,
                          }}
                        >
                          <i className="bi bi-check-circle-fill"></i> Agendado
                          para{" "}
                          {new Date(
                            u.scheduledDate + "T12:00",
                          ).toLocaleDateString("pt-BR")}{" "}
                          às {u.scheduledTime}
                        </span>
                      )}
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 8,
                      flexShrink: 0,
                    }}
                  >
                    {u.status === "waiting" ? (
                      <button
                        className="btn btn-teal"
                        style={{
                          fontSize: 12,
                          padding: "7px 16px",
                          whiteSpace: "nowrap",
                        }}
                        onClick={() => setScheduleModal(u)}
                      >
                        <i className="bi bi-calendar-check me-2"></i>Agendar
                      </button>
                    ) : (
                      <span
                        className="mc-badge badge-status-active"
                        style={{ padding: "6px 12px" }}
                      >
                        <i className="bi bi-check-circle me-1"></i>Agendado
                      </span>
                    )}
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 11, padding: "5px 12px" }}
                      onClick={() =>
                        updateUrgency(u.id, { status: "resolved" })
                      }
                    >
                      Resolver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {urgencyQueue.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "var(--mc-slate)",
            }}
          >
            <i
              className="bi bi-check-circle d-block mb-3"
              style={{ fontSize: 48, color: "#10b981", opacity: 0.5 }}
            ></i>
            <h4
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 20,
                marginBottom: 8,
              }}
            >
              Fila vazia
            </h4>
            <p style={{ fontSize: 14, opacity: 0.7 }}>
              Nenhuma urgência registrada no momento.
            </p>
          </div>
        )}
      </div>

      {/* Schedule modal */}
      {scheduleModal && (
        <div
          className="mc-modal-overlay"
          onClick={() => setScheduleModal(null)}
        >
          <div
            className="mc-modal"
            style={{ maxWidth: 480 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mc-modal-header">
              <h4
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  margin: 0,
                }}
              >
                Agendar Urgência
              </h4>
              <button
                className="btn-ghost btn"
                style={{ padding: "4px 8px" }}
                onClick={() => setScheduleModal(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mc-modal-body">
              <div
                style={{
                  background: `rgba(${urgencyColors[scheduleModal.level]
                    .replace("#", "")
                    .match(/.{2}/g)
                    .map((h) => parseInt(h, 16))
                    .join(",")},0.1)`,
                  border: `1px solid rgba(${urgencyColors[scheduleModal.level]
                    .replace("#", "")
                    .match(/.{2}/g)
                    .map((h) => parseInt(h, 16))
                    .join(",")},0.25)`,
                  borderRadius: 10,
                  padding: "14px 16px",
                  marginBottom: 20,
                }}
              >
                <div style={{ fontWeight: 600, marginBottom: 4 }}>
                  {scheduleModal.patientName}
                </div>
                <div style={{ fontSize: 12.5, color: "var(--mc-slate)" }}>
                  Nível {scheduleModal.level} —{" "}
                  {urgencyLabels[scheduleModal.level]}
                </div>
              </div>
              <div className="row g-3">
                <div className="col-12">
                  <label className="mc-label">Médico responsável</label>
                  <input
                    className="mc-input form-control"
                    value={schedForm.doctor || scheduleModal.doctor}
                    onChange={(e) =>
                      setSchedForm((p) => ({ ...p, doctor: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-7">
                  <label className="mc-label">Data preferencial</label>
                  <input
                    type="date"
                    className="mc-input form-control"
                    value={schedForm.date}
                    onChange={(e) =>
                      setSchedForm((p) => ({ ...p, date: e.target.value }))
                    }
                  />
                </div>
                <div className="col-md-5">
                  <label className="mc-label">Horário</label>
                  <input
                    type="time"
                    className="mc-input form-control"
                    value={schedForm.time}
                    onChange={(e) =>
                      setSchedForm((p) => ({ ...p, time: e.target.value }))
                    }
                  />
                </div>
              </div>
            </div>
            <div className="mc-modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setScheduleModal(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-teal px-4"
                onClick={handleSchedule}
                disabled={!schedForm.date || !schedForm.time}
              >
                <i className="bi bi-calendar-check me-2"></i>Confirmar
                Agendamento
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
