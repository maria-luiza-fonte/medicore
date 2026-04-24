import React, { useState } from "react";
import { useApp } from "../context/AppContext";

const EMPTY = {
  name: "",
  cpf: "",
  dob: "",
  phone: "",
  email: "",
  bloodType: "A+",
  allergies: "",
  conditions: "",
  insurance: "",
};

const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useApp();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search) ||
      p.email.toLowerCase().includes(search.toLowerCase()),
  );

  const openNew = () => {
    setEditing(null);
    setForm(EMPTY);
    setShowModal(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    setForm({ ...p });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name || !form.cpf) return;
    if (editing) updatePatient(editing.id, form);
    else addPatient(form);
    setShowModal(false);
  };

  const f = (k, v) => setForm((prev) => ({ ...prev, [k]: v }));

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Pacientes</h1>
          <p className="mc-page-subtitle">
            {patients.length} pacientes cadastrados
          </p>
        </div>
        <button className="btn btn-teal px-4 py-2" onClick={openNew}>
          <i className="bi bi-person-plus me-2"></i>Novo Paciente
        </button>
      </div>

      {/* Search bar */}
      <div className="mc-card-flat mb-4" style={{ padding: "16px 20px" }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="mc-search-wrap">
              <i className="bi bi-search"></i>
              <input
                className="mc-input form-control"
                placeholder="Buscar por nome, CPF ou e-mail..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <select className="mc-input form-select">
              <option>Todos os convênios</option>
              <option>Unimed</option>
              <option>Bradesco Saúde</option>
              <option>SulAmérica</option>
              <option>Amil</option>
              <option>Particular</option>
            </select>
          </div>
          <div className="col-md-3 text-end">
            <span style={{ fontSize: 13, color: "var(--mc-slate)" }}>
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>
      </div>

      {/* Patients list with expandable cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((p) => {
          const age = Math.floor(
            (Date.now() - new Date(p.dob)) / (365.25 * 24 * 3600 * 1000),
          );
          const isExpanded = expandedId === p.id;
          return (
            <div
              key={p.id}
              className="mc-card"
              style={{ padding: 0, overflow: "hidden" }}
            >
              {/* Header - clickable */}
              <div
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
                style={{
                  padding: "16px 20px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  borderBottom: isExpanded
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
                <div className="mc-avatar">
                  {p.name
                    .split(" ")
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: "var(--mc-text)",
                    }}
                  >
                    {p.name}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--mc-slate)",
                      marginTop: 2,
                    }}
                  >
                    {age} anos · {p.cpf}
                  </div>
                </div>
                <i
                  className={`bi bi-chevron-${isExpanded ? "up" : "down"}`}
                  style={{ color: "var(--mc-slate)", fontSize: 18 }}
                ></i>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div
                  style={{
                    padding: "20px",
                    borderTop: "1px solid var(--mc-border-subtle)",
                  }}
                >
                  <div className="row g-3">
                    {/* Contact Info */}
                    <div className="col-md-6">
                      <h5
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                          textTransform: "uppercase",
                          marginBottom: 12,
                        }}
                      >
                        Contato
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Email:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {p.email}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Telefone:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {p.phone}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Convênio:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {p.insurance}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Medical Info */}
                    <div className="col-md-6">
                      <h5
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                          textTransform: "uppercase",
                          marginBottom: 12,
                        }}
                      >
                        Saúde
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Tipo Sanguíneo:
                          </span>{" "}
                          <span
                            style={{ color: "var(--mc-text)", fontWeight: 600 }}
                          >
                            {p.bloodType}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Alergias:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {p.allergies || "-"}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Condições:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {p.conditions || "-"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Personal Info */}
                    <div className="col-md-6">
                      <h5
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                          textTransform: "uppercase",
                          marginBottom: 12,
                        }}
                      >
                        Dados Pessoais
                      </h5>
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 8,
                        }}
                      >
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            CPF:
                          </span>{" "}
                          <span
                            style={{
                              color: "var(--mc-text)",
                              fontFamily: "var(--font-mono)",
                            }}
                          >
                            {p.cpf}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Data Nascimento:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {new Date(p.dob + "T12:00").toLocaleDateString(
                              "pt-BR",
                            )}
                          </span>
                        </div>
                        <div>
                          <span
                            style={{ color: "var(--mc-slate)", fontSize: 11 }}
                          >
                            Cadastro:
                          </span>{" "}
                          <span style={{ color: "var(--mc-text)" }}>
                            {new Date(p.createdAt).toLocaleDateString("pt-BR")}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div
                      className="col-md-6"
                      style={{
                        display: "flex",
                        alignItems: "flex-end",
                        gap: 8,
                      }}
                    >
                      <button
                        className="btn btn-outline-teal"
                        onClick={() => openEdit(p)}
                        style={{ flex: 1 }}
                      >
                        <i className="bi bi-pencil me-1"></i>Editar
                      </button>
                      <button
                        className="btn btn-ghost"
                        onClick={() => setConfirmDelete(p.id)}
                        style={{ flex: 1, color: "#ef4444" }}
                      >
                        <i className="bi bi-trash me-1"></i>Deletar
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal de edição */}
      {showModal && (
        <div className="mc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h4>{editing ? "Editar Paciente" : "Novo Paciente"}</h4>
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
                style={{ padding: 0, width: 32, height: 32 }}
              >
                <i className="bi bi-x"></i>
              </button>
            </div>
            <div className="mc-modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="mc-label d-block">Nome *</label>
                  <input
                    className="mc-input form-control"
                    value={form.name}
                    onChange={(e) => f("name", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">CPF *</label>
                  <input
                    className="mc-input form-control"
                    value={form.cpf}
                    onChange={(e) => f("cpf", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">Data de Nascimento</label>
                  <input
                    className="mc-input form-control"
                    type="date"
                    value={form.dob}
                    onChange={(e) => f("dob", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">Email</label>
                  <input
                    className="mc-input form-control"
                    value={form.email}
                    onChange={(e) => f("email", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">Telefone</label>
                  <input
                    className="mc-input form-control"
                    value={form.phone}
                    onChange={(e) => f("phone", e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">Tipo Sanguíneo</label>
                  <select
                    className="mc-input form-select"
                    value={form.bloodType}
                    onChange={(e) => f("bloodType", e.target.value)}
                  >
                    {bloodTypes.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="mc-label d-block">Convênio</label>
                  <input
                    className="mc-input form-control"
                    value={form.insurance}
                    onChange={(e) => f("insurance", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="mc-label d-block">Alergias</label>
                  <input
                    className="mc-input form-control"
                    value={form.allergies}
                    onChange={(e) => f("allergies", e.target.value)}
                  />
                </div>
                <div className="col-12">
                  <label className="mc-label d-block">Condições Clínicas</label>
                  <input
                    className="mc-input form-control"
                    value={form.conditions}
                    onChange={(e) => f("conditions", e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="mc-modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
              <button className="btn btn-teal" onClick={handleSave}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {confirmDelete && (
        <div
          className="mc-modal-overlay"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="mc-modal"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 400 }}
          >
            <div className="mc-modal-header">
              <h4>Confirmar Exclusão</h4>
            </div>
            <div className="mc-modal-body">
              <p style={{ color: "var(--mc-slate)", marginBottom: 16 }}>
                Tem certeza que deseja deletar este paciente?
              </p>
            </div>
            <div className="mc-modal-footer">
              <button
                className="btn btn-ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </button>
              <button
                className="btn btn-teal"
                onClick={() => {
                  deletePatient(confirmDelete);
                  setConfirmDelete(null);
                }}
              >
                Deletar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
