import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Reports() {
  const { user, patients, appointments, urgencyQueue, insurances } = useApp();
  const [filterMonth, setFilterMonth] = useState(new Date().getMonth());
  const [filterYear, setFilterYear] = useState(new Date().getFullYear());
  const [appointmentType, setAppointmentType] = useState("all");

  const userPatients = patients.filter((p) => p.doctorId === user?.doctorId);
  const userAppointments = appointments.filter((a) => a.doctor === user?.name);
  const userUrgencies = urgencyQueue.filter((u) => u.doctor === user?.name);

  // Filter appointments by month/year
  const filteredAppointments = userAppointments.filter((a) => {
    const [year, month] = a.date.split("-");
    const match =
      parseInt(year) === filterYear && parseInt(month) - 1 === filterMonth;
    if (appointmentType === "all") return match;
    return match && a.status === appointmentType;
  });

  const done = filteredAppointments.filter((a) => a.status === "done");
  const pending = filteredAppointments.filter((a) => a.status === "pending");
  const cancelled = filteredAppointments.filter(
    (a) => a.status === "cancelled",
  );
  const total = filteredAppointments.length;

  const allDone = userAppointments.filter((a) => a.status === "done");
  const allPending = userAppointments.filter((a) => a.status === "pending");
  const allCancelled = userAppointments.filter((a) => a.status === "cancelled");
  const allTotal = userAppointments.length;

  // Insurance distribution
  const insuranceDistribution = insurances.map((ins) => ({
    name: ins.name,
    count: userPatients.filter((p) => p.insurance === ins.name).length,
  }));

  const urgencyByLevel = [1, 2, 3, 4, 5].map((l) => ({
    level: l,
    count: userUrgencies.filter((u) => u.level === l).length,
  }));

  // Consultation period data (last 6 months)
  const getMonthsData = () => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const year = d.getFullYear();
      const month = d.getMonth();
      const count = userAppointments.filter((a) => {
        const [y, m] = a.date.split("-");
        return parseInt(y) === year && parseInt(m) - 1 === month;
      }).length;
      months.push({
        label: d.toLocaleDateString("pt-BR", {
          month: "short",
          year: "2-digit",
        }),
        count,
      });
    }
    return months;
  };

  const monthsData = getMonthsData();
  const maxCount = Math.max(...monthsData.map((m) => m.count), 1);

  const urgencyColors = {
    1: "#ef4444",
    2: "#f97316",
    3: "#f59e0b",
    4: "#10b981",
    5: "#64748b",
  };

  const urgencyLabels = {
    1: "Crítico",
    2: "Alto",
    3: "Moderado",
    4: "Baixo",
    5: "Rotina",
  };

  const handleExportTXT = () => {
    const content = `
RELATÓRIO DE CONSULTAS - MediCore
Médico: ${user?.name}
Data: ${new Date().toLocaleDateString("pt-BR")}
Período: ${filterMonth + 1}/${filterYear}

RESUMO GERAL:
- Total de Pacientes: ${userPatients.length}
- Total de Consultas: ${allTotal}
- Consultas Realizadas: ${allDone.length}
- Consultas Pendentes: ${allPending.length}
- Consultas Canceladas: ${allCancelled.length}
- Taxa de Realização: ${allTotal > 0 ? Math.round((allDone.length / allTotal) * 100) : 0}%
- Urgências Registradas: ${userUrgencies.length}

PERÍODO FILTRADO (${filterMonth + 1}/${filterYear}):
- Consultas Realizadas: ${done.length}
- Consultas Pendentes: ${pending.length}
- Consultas Canceladas: ${cancelled.length}

DISTRIBUIÇÃO POR CONVÊNIO:
${insuranceDistribution.map((ins) => `- ${ins.name}: ${ins.count} pacientes`).join("\n")}

Relatório gerado em ${new Date().toLocaleString("pt-BR")}
    `.trim();

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-consultas-${filterYear}-${String(filterMonth + 1).padStart(2, "0")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    // Header
    const csvContent = [
      ["RELATÓRIO DE CONSULTAS - MediCore"],
      ["Médico", user?.name],
      ["Data", new Date().toLocaleDateString("pt-BR")],
      ["Período", `${filterMonth + 1}/${filterYear}`],
      [],
      ["RESUMO GERAL"],
      ["Total de Pacientes", userPatients.length],
      ["Total de Consultas", allTotal],
      ["Consultas Realizadas", allDone.length],
      ["Consultas Pendentes", allPending.length],
      ["Consultas Canceladas", allCancelled.length],
      [
        "Taxa de Realização (%)",
        allTotal > 0 ? Math.round((allDone.length / allTotal) * 100) : 0,
      ],
      ["Urgências Registradas", userUrgencies.length],
      [],
      ["PERÍODO FILTRADO"],
      ["Mês", filterMonth + 1],
      ["Ano", filterYear],
      ["Consultas Realizadas", done.length],
      ["Consultas Pendentes", pending.length],
      ["Consultas Canceladas", cancelled.length],
      [],
      ["DISTRIBUIÇÃO POR CONVÊNIO"],
      ["Convênio", "Quantidade de Pacientes"],
      ...insuranceDistribution.map((ins) => [ins.name, ins.count]),
    ];

    const csv = csvContent
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-consultas-${filterYear}-${String(filterMonth + 1).padStart(2, "0")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Relatórios</h1>
          <p className="mc-page-subtitle">Análise estatística do consultório</p>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            className="btn btn-teal"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={handleExportTXT}
          >
            <i className="bi bi-file-text me-2"></i>Exportar TXT
          </button>
          <button
            className="btn btn-ghost"
            style={{ fontSize: 13, padding: "8px 16px" }}
            onClick={handleExportCSV}
          >
            <i className="bi bi-table me-2"></i>Exportar CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mc-card mb-4" style={{ padding: "16px 24px" }}>
        <h5
          style={{
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 12,
            color: "var(--mc-text)",
          }}
        >
          <i className="bi bi-funnel me-2"></i>Filtros
        </h5>
        <div className="row g-3">
          <div className="col-md-3">
            <label
              className="mc-label d-block"
              style={{ fontSize: 12, marginBottom: 6 }}
            >
              Mês
            </label>
            <select
              className="mc-input form-select"
              value={filterMonth}
              onChange={(e) => setFilterMonth(parseInt(e.target.value))}
              style={{ fontSize: 13 }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i}>
                  {new Date(2024, i).toLocaleDateString("pt-BR", {
                    month: "long",
                  })}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label
              className="mc-label d-block"
              style={{ fontSize: 12, marginBottom: 6 }}
            >
              Ano
            </label>
            <select
              className="mc-input form-select"
              value={filterYear}
              onChange={(e) => setFilterYear(parseInt(e.target.value))}
              style={{ fontSize: 13 }}
            >
              {[2024, 2025, 2026].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <label
              className="mc-label d-block"
              style={{ fontSize: 12, marginBottom: 6 }}
            >
              Status
            </label>
            <select
              className="mc-input form-select"
              value={appointmentType}
              onChange={(e) => setAppointmentType(e.target.value)}
              style={{ fontSize: 13 }}
            >
              <option value="all">Todas</option>
              <option value="done">Realizadas</option>
              <option value="pending">Pendentes</option>
              <option value="cancelled">Canceladas</option>
            </select>
          </div>
          <div className="col-md-3 d-flex align-items-end">
            <button
              className="btn btn-ghost w-100"
              onClick={() => {
                setFilterMonth(new Date().getMonth());
                setFilterYear(new Date().getFullYear());
                setAppointmentType("all");
              }}
              style={{ fontSize: 13 }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>Limpar
            </button>
          </div>
        </div>
      </div>

      {/* Consultas do Mês - Destaque */}
      <div className="row g-3 mb-4">
        <div className="col-12 fade-in">
          <div
            className="mc-card"
            style={{
              padding: "24px",
              background:
                "linear-gradient(135deg, var(--mc-teal-surface), var(--mc-surface-2))",
              border: "1px solid var(--mc-teal)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--mc-slate)",
                    marginBottom: 4,
                  }}
                >
                  CONSULTAS NO MÊS SELECIONADO
                </p>
                <div
                  style={{
                    fontSize: 36,
                    fontWeight: 800,
                    color: "var(--mc-teal)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {total}
                </div>
                <p
                  style={{
                    fontSize: 12,
                    color: "var(--mc-text)",
                    marginTop: 8,
                  }}
                >
                  Período:{" "}
                  {new Date(filterYear, filterMonth).toLocaleDateString(
                    "pt-BR",
                    { month: "long", year: "numeric" },
                  )}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    color: "#10b981",
                    marginBottom: 8,
                  }}
                >
                  {done.length}
                </div>
                <p style={{ fontSize: 11, color: "var(--mc-slate)" }}>
                  Realizadas
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Overview stats */}
      <div className="row g-3 mb-4">
        {[
          {
            label: "Total Pacientes",
            value: userPatients.length,
            icon: "bi-people-fill",
            color: "var(--mc-teal)",
          },
          {
            label: "Total de Consultas",
            value: allTotal,
            icon: "bi-calendar2-check",
            color: "#a78bfa",
          },
          {
            label: "Taxa de Realização",
            value:
              allTotal > 0
                ? `${Math.round((allDone.length / allTotal) * 100)}%`
                : "0%",
            icon: "bi-graph-up",
            color: "#10b981",
          },
          {
            label: "Urgências Registradas",
            value: userUrgencies.length,
            icon: "bi-exclamation-triangle-fill",
            color: "#ef4444",
          },
        ].map((s, i) => (
          <div key={i} className={`col-6 col-lg-3 fade-in anim-delay-${i + 1}`}>
            <div className="stat-card">
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
              <div className="stat-value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="stat-label">{s.label}</div>
              <i
                className={`bi ${s.icon} stat-icon`}
                style={{ color: s.color }}
              ></i>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        {/* Appointment status breakdown */}
        <div className="col-lg-5 fade-in anim-delay-2">
          <div className="mc-card" style={{ padding: "22px 24px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Status das Consultas
            </h4>
            {[
              { label: "Realizadas", count: done.length, color: "#10b981" },
              { label: "Pendentes", count: pending.length, color: "#f59e0b" },
              {
                label: "Canceladas",
                count: cancelled.length,
                color: "#ef4444",
              },
            ].map((s) => (
              <div key={s.label} style={{ marginBottom: 16 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 13, color: "var(--mc-text)" }}>
                    {s.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontFamily: "var(--font-mono)",
                      color: s.color,
                      fontWeight: 700,
                    }}
                  >
                    {s.count} (
                    {total > 0 ? Math.round((s.count / total) * 100) : 0}%)
                  </span>
                </div>
                <div
                  style={{
                    height: 8,
                    borderRadius: 4,
                    background: "var(--mc-surface-3)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${total > 0 ? (s.count / total) * 100 : 0}%`,
                      background: s.color,
                      borderRadius: 4,
                      transition: "width 1s ease",
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency distribution */}
        <div className="col-lg-7 fade-in anim-delay-3">
          <div className="mc-card" style={{ padding: "22px 24px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Distribuição de Urgências
            </h4>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {urgencyByLevel.map(({ level, count }) => {
                const color = urgencyColors[level];
                const rgb = color
                  .replace("#", "")
                  .match(/.{2}/g)
                  .map((h) => parseInt(h, 16))
                  .join(",");
                return (
                  <div
                    key={level}
                    style={{
                      flex: 1,
                      minWidth: 80,
                      textAlign: "center",
                      padding: "16px 8px",
                      borderRadius: 12,
                      background: `rgba(${rgb},0.1)`,
                      border: `1px solid rgba(${rgb},0.25)`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 28,
                        fontWeight: 800,
                        color,
                        fontFamily: "var(--font-mono)",
                        lineHeight: 1,
                        marginBottom: 6,
                      }}
                    >
                      {count}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 700, color }}>
                      {urgencyLabels[level]}
                    </div>
                    <div
                      style={{
                        fontSize: 10,
                        color: "var(--mc-slate)",
                        marginTop: 2,
                      }}
                    >
                      Nível {level}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Consultas por período (últimos 6 meses) */}
      <div className="row g-3 mb-3">
        <div className="col-12 fade-in anim-delay-4">
          <div className="mc-card" style={{ padding: "22px 24px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Consultas por Período (últimos 6 meses)
            </h4>
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                height: 200,
              }}
            >
              {monthsData.map((month, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: `${(month.count / maxCount) * 180}px`,
                      borderRadius: "8px 8px 0 0",
                      background:
                        "linear-gradient(180deg, var(--mc-teal), var(--mc-teal-surface))",
                      minHeight: month.count > 0 ? 20 : 2,
                      transition: "all 0.3s ease",
                    }}
                    title={`${month.count} consultas`}
                  ></div>
                  <span
                    style={{
                      fontSize: 11,
                      color: "var(--mc-slate)",
                      textAlign: "center",
                    }}
                  >
                    {month.label}
                  </span>
                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "var(--mc-text)",
                      fontFamily: "var(--font-mono)",
                    }}
                  >
                    {month.count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Insurance Distribution */}
      <div className="row g-3">
        <div className="col-12 fade-in anim-delay-5">
          <div className="mc-card" style={{ padding: "22px 24px" }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Distribuição de Pacientes por Convênio
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: 12,
              }}
            >
              {insuranceDistribution.filter((ins) => ins.count > 0).length >
              0 ? (
                insuranceDistribution.map((ins) =>
                  ins.count > 0 ? (
                    <div
                      key={ins.name}
                      style={{
                        padding: "16px",
                        borderRadius: 12,
                        background: "var(--mc-surface-2)",
                        border: "1px solid var(--mc-surface-3)",
                      }}
                    >
                      <div
                        style={{
                          fontSize: 13,
                          color: "var(--mc-text)",
                          marginBottom: 8,
                        }}
                      >
                        {ins.name}
                      </div>
                      <div
                        style={{
                          fontSize: 24,
                          fontWeight: 800,
                          color: "var(--mc-teal)",
                          fontFamily: "var(--font-mono)",
                        }}
                      >
                        {ins.count}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: "var(--mc-slate)",
                          marginTop: 4,
                        }}
                      >
                        {Math.round((ins.count / userPatients.length) * 100)}%
                        dos pacientes
                      </div>
                    </div>
                  ) : null,
                )
              ) : (
                <p style={{ color: "var(--mc-slate)", fontSize: 13 }}>
                  Nenhum paciente com convênio registrado
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
