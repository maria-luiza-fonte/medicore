import React, { useState } from "react";
import { useApp } from "../context/AppContext";

export default function Admin() {
  const {
    systemUsers,
    addSystemUser,
    updateSystemUser,
    deleteSystemUser,
    systemLogs,
    insurances,
    addInsurance,
    deleteInsurance,
    toggleInsuranceStatus,
    appointments,
    patients,
    user,
  } = useApp();

  // Verificar se o usuário atual é admin
  const currentUserAdmin = systemUsers.find(
    (u) => u.name === user?.name || u.id === user?.id,
  );
  const isCurrentUserAdmin = currentUserAdmin?.role === "admin";

  const [activeTab, setActiveTab] = useState("overview");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showInsuranceModal, setShowInsuranceModal] = useState(false);
  const [showPasswordUser, setShowPasswordUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [showEditDoctorModal, setShowEditDoctorModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "doctor",
    specialty: "",
    crm: "",
  });
  const [editDoctorForm, setEditDoctorForm] = useState({
    name: "",
    email: "",
    specialty: "",
    crm: "",
  });
  const [newInsurance, setNewInsurance] = useState({ name: "" });

  const doctors = systemUsers.filter(
    (u) => u.role === "doctor" || u.role === "veterinary",
  );
  const admins = systemUsers.filter((u) => u.role === "admin");

  const totalAppointments = appointments.length;
  const totalDoctors = doctors.length;
  const totalAdmins = admins.length;
  const totalUsers = systemUsers.length;

  // Logs statistics
  const logsToday = systemLogs.filter((log) => {
    const logDate = new Date(log.timestamp).toLocaleDateString();
    const today = new Date().toLocaleDateString();
    return logDate === today;
  }).length;

  const handleAddUser = () => {
    // Validação: apenas admins podem criar admins
    if (newUser.role === "admin" && !isCurrentUserAdmin) {
      alert("Apenas administradores podem criar outros administradores");
      return;
    }

    if (newUser.name && newUser.email) {
      addSystemUser(newUser);
      setNewUser({
        name: "",
        email: "",
        role: "doctor",
        specialty: "",
        crm: "",
      });
      setShowUserModal(false);
    }
  };

  const handleDeleteUser = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este usuário?")) {
      deleteSystemUser(id);
    }
  };

  const handleAddInsurance = () => {
    if (newInsurance.name) {
      addInsurance(newInsurance);
      setNewInsurance({ name: "" });
      setShowInsuranceModal(false);
    }
  };

  const handleDeleteInsurance = (id) => {
    if (window.confirm("Tem certeza que deseja deletar este convênio?")) {
      deleteInsurance(id);
    }
  };

  const handleEditDoctor = (doctor) => {
    setEditingDoctor(doctor);
    setEditDoctorForm({
      name: doctor.name,
      email: doctor.email,
      specialty: doctor.specialty,
      crm: doctor.crm,
    });
    setShowEditDoctorModal(true);
  };

  const handleSaveDoctor = () => {
    updateSystemUser(editingDoctor.id, editDoctorForm);
    setShowEditDoctorModal(false);
    setEditingDoctor(null);
  };

  return (
    <div className="fade-in">
      <div className="mc-page-header">
        <div>
          <h1 className="mc-page-title">
            <i className="bi bi-shield-lock me-2"></i>Painel Administrativo
          </h1>
          <p className="mc-page-subtitle">
            Gerenciamento completo do sistema MediCore
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mc-card mb-4" style={{ padding: 0, overflow: "hidden" }}>
        <div
          className="admin-tabs"
          style={{
            display: "flex",
            borderBottom: "1px solid var(--mc-surface-3)",
            overflowX: "auto",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {[
            { id: "overview", label: "Visão Geral", icon: "bi-speedometer2" },
            { id: "users", label: "Usuários", icon: "bi-people" },
            { id: "doctors", label: "Médicos", icon: "bi-hospital" },
            {
              id: "appointments",
              label: "Agendamentos",
              icon: "bi-calendar2-week",
            },
            { id: "patients", label: "Pacientes", icon: "bi-person-heart" },
            { id: "insurance", label: "Convênios", icon: "bi-credit-card" },
            { id: "logs", label: "Logs", icon: "bi-file-text" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="admin-tab-btn"
              style={{
                flex: "0 0 auto",
                minWidth: "fit-content",
                padding: "14px 20px",
                border: "none",
                background: "none",
                borderBottom:
                  activeTab === tab.id ? "2px solid var(--mc-teal)" : "none",
                color:
                  activeTab === tab.id ? "var(--mc-teal)" : "var(--mc-slate)",
                fontSize: 13,
                fontWeight: activeTab === tab.id ? 600 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              <i className={`bi ${tab.icon} me-2`}></i>
              <span className="admin-tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <div>
          <div className="row g-3 mb-4 admin-overview">
            {[
              {
                label: "Usuários Totais",
                value: totalUsers,
                icon: "bi-people-fill",
                color: "var(--mc-teal)",
              },
              {
                label: "Médicos",
                value: totalDoctors,
                icon: "bi-hospital",
                color: "#a78bfa",
              },
              {
                label: "Administradores",
                value: totalAdmins,
                icon: "bi-shield-lock",
                color: "#f59e0b",
              },
              {
                label: "Total Consultas",
                value: totalAppointments,
                icon: "bi-calendar2-check",
                color: "#10b981",
              },
            ].map((s, i) => (
              <div key={i} className="col-6 col-lg-3 fade-in">
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

          {/* System Activity */}
          <div className="row g-3">
            <div className="col-lg-6">
              <div className="mc-card" style={{ padding: "22px 24px" }}>
                <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                  <i className="bi bi-activity me-2"></i>Atividade do Sistema
                </h5>
                <div style={{ fontSize: 13 }}>
                  <div
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>Logs Today</span>
                    <span style={{ fontWeight: 700, color: "var(--mc-text)" }}>
                      {logsToday}
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>Total Logs</span>
                    <span style={{ fontWeight: 700, color: "var(--mc-text)" }}>
                      {systemLogs.length}
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>Status</span>
                    <span style={{ fontWeight: 700, color: "#10b981" }}>
                      <i
                        className="bi bi-circle-fill me-2"
                        style={{ fontSize: 8 }}
                      ></i>
                      Online
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="mc-card" style={{ padding: "22px 24px" }}>
                <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
                  <i className="bi bi-info-circle me-2"></i>Informações do
                  Sistema
                </h5>
                <div style={{ fontSize: 13 }}>
                  <div
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>Versão</span>
                    <span style={{ fontWeight: 700, color: "var(--mc-text)" }}>
                      1.0.0
                    </span>
                  </div>
                  <div
                    style={{
                      marginBottom: 12,
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>Ambiente</span>
                    <span style={{ fontWeight: 700, color: "var(--mc-text)" }}>
                      Production
                    </span>
                  </div>
                  <div
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <span style={{ color: "var(--mc-slate)" }}>
                      Data do Sistema
                    </span>
                    <span style={{ fontWeight: 700, color: "var(--mc-text)" }}>
                      {new Date().toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === "users" && (
        <div>
          <div className="mc-card mb-4" style={{ padding: "16px 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                Todos os Usuários
              </h5>
              <button
                className="btn btn-teal"
                style={{ fontSize: 13, padding: "6px 12px" }}
                onClick={() => setShowUserModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>Novo Usuário
              </button>
            </div>
          </div>

          {showUserModal && (
            <div
              className="mc-card mb-4"
              style={{
                padding: "20px 24px",
                background: "var(--mc-surface-2)",
              }}
            >
              <h6 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Adicionar Novo Usuário
              </h6>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="mc-label">Nome</label>
                  <input
                    type="text"
                    className="mc-input form-control"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="Nome completo"
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">E-mail</label>
                  <input
                    type="email"
                    className="mc-input form-control"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="email@exemplo.com"
                  />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Senha</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type={showPasswordUser ? "text" : "password"}
                      className="mc-input form-control"
                      value={newUser.password || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, password: e.target.value })
                      }
                      placeholder="Crie uma senha"
                      style={{ paddingRight: "40px" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordUser(!showPasswordUser)}
                      style={{
                        position: "absolute",
                        right: "8px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        padding: "4px 8px",
                        fontSize: 16,
                        zIndex: 10,
                        border: "none",
                        background: "none",
                        color: "var(--mc-slate)",
                        cursor: "pointer",
                      }}
                    >
                      <i
                        className={`bi ${showPasswordUser ? "bi-eye-slash" : "bi-eye"}`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Perfil</label>
                  <select
                    className="mc-input form-select"
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value })
                    }
                  >
                    <option value="doctor">Médico</option>
                    <option value="veterinary">Médico Veterinário</option>
                    {isCurrentUserAdmin && <option value="admin">Admin</option>}
                  </select>
                  {!isCurrentUserAdmin && newUser.role === "admin" && (
                    <p style={{ fontSize: 11, color: "#ef4444", marginTop: 4 }}>
                      <i className="bi bi-exclamation-circle me-1"></i>
                      Apenas administradores podem criar admins
                    </p>
                  )}
                </div>
                {(newUser.role === "doctor" ||
                  newUser.role === "veterinary") && (
                  <>
                    <div className="col-md-6">
                      <label className="mc-label">Especialidade</label>
                      <input
                        type="text"
                        className="mc-input form-control"
                        value={newUser.specialty}
                        onChange={(e) =>
                          setNewUser({ ...newUser, specialty: e.target.value })
                        }
                        placeholder={
                          newUser.role === "veterinary"
                            ? "Ex: Pequenos Animais"
                            : "Ex: Cardiologia"
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="mc-label">
                        {newUser.role === "veterinary" ? "CRMV" : "CRM"}
                      </label>
                      <input
                        type="text"
                        className="mc-input form-control"
                        value={newUser.crm}
                        onChange={(e) =>
                          setNewUser({ ...newUser, crm: e.target.value })
                        }
                        placeholder={
                          newUser.role === "veterinary"
                            ? "CRMV do médico veterinário"
                            : "CRM do médico"
                        }
                      />
                    </div>
                  </>
                )}
                <div className="col-12 d-flex gap-2">
                  <button
                    className="btn btn-teal"
                    onClick={handleAddUser}
                    style={{ fontSize: 13 }}
                  >
                    Adicionar
                  </button>
                  <button
                    className="btn btn-ghost"
                    onClick={() => {
                      setShowUserModal(false);
                      setNewUser({
                        name: "",
                        email: "",
                        role: "doctor",
                        specialty: "",
                        crm: "",
                      });
                    }}
                    style={{ fontSize: 13 }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div
            className="mc-card admin-table"
            style={{ padding: "20px 24px", overflowX: "auto" }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 13,
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid var(--mc-surface-3)" }}>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--mc-slate)",
                    }}
                  >
                    Nome
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--mc-slate)",
                    }}
                  >
                    E-mail
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--mc-slate)",
                    }}
                  >
                    Perfil
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "var(--mc-slate)",
                    }}
                  >
                    Criado em
                  </th>
                  <th
                    style={{
                      padding: "12px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "var(--mc-slate)",
                    }}
                  >
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {systemUsers.map((user) => (
                  <tr
                    key={user.id}
                    style={{
                      borderBottom: "1px solid var(--mc-surface-3)",
                      ":hover": { background: "var(--mc-surface-2)" },
                    }}
                  >
                    <td style={{ padding: "12px", color: "var(--mc-text)" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            background: "var(--mc-teal-surface)",
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: 11,
                            fontWeight: 700,
                            color: "var(--mc-teal)",
                          }}
                        >
                          {user.name
                            .split(" ")
                            .slice(0, 2)
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </div>
                        {user.name}
                      </div>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "var(--mc-slate)",
                        fontSize: 12,
                      }}
                    >
                      {user.email}
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 4,
                          background:
                            user.role === "admin"
                              ? "rgba(245, 158, 11, 0.1)"
                              : "rgba(167, 139, 250, 0.1)",
                          color: user.role === "admin" ? "#f59e0b" : "#a78bfa",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {user.role === "admin" ? "Admin" : "Médico"}
                      </span>
                    </td>
                    <td
                      style={{
                        padding: "12px",
                        color: "var(--mc-slate)",
                        fontSize: 12,
                      }}
                    >
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td style={{ padding: "12px", textAlign: "center" }}>
                      <button
                        className="btn btn-ghost"
                        style={{ fontSize: 12, padding: "4px 8px" }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards view */}
          <div className="admin-cards row g-3">
            {systemUsers.map((user) => (
              <div key={user.id} className="col-12">
                <div className="mc-card" style={{ padding: "16px" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: "var(--mc-teal-surface)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 12,
                        fontWeight: 700,
                        color: "var(--mc-teal)",
                        flexShrink: 0,
                      }}
                    >
                      {user.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--mc-text)",
                          marginBottom: 2,
                        }}
                      >
                        {user.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--mc-slate)" }}>
                        {user.email}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: 12,
                      borderTop: "1px solid var(--mc-surface-3)",
                    }}
                  >
                    <span
                      style={{
                        padding: "4px 8px",
                        borderRadius: 4,
                        background:
                          user.role === "admin"
                            ? "rgba(245, 158, 11, 0.1)"
                            : "rgba(167, 139, 250, 0.1)",
                        color: user.role === "admin" ? "#f59e0b" : "#a78bfa",
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {user.role === "admin" ? "Admin" : "Médico"}
                    </span>
                    <button
                      className="btn btn-ghost"
                      style={{ fontSize: 12, padding: "4px 8px" }}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Doctors Tab */}
      {activeTab === "doctors" && (
        <div>
          <div className="mc-card" style={{ padding: "20px 24px" }}>
            <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              Médicos Cadastrados
            </h5>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {doctors.map((doctor) => (
                <div
                  key={doctor.id}
                  style={{
                    padding: "16px",
                    borderRadius: 12,
                    background: "var(--mc-surface-2)",
                    border: "1px solid var(--mc-surface-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "start",
                      marginBottom: 12,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background:
                          "linear-gradient(135deg, var(--mc-teal), #0a8a86)",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#fff",
                        marginRight: 12,
                        flexShrink: 0,
                      }}
                    >
                      {doctor.name
                        .split(" ")
                        .slice(0, 2)
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 13,
                          fontWeight: 600,
                          color: "var(--mc-text)",
                        }}
                      >
                        {doctor.name}
                      </div>
                      <div style={{ fontSize: 11, color: "var(--mc-slate)" }}>
                        {doctor.specialty}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 8,
                      color: "var(--mc-slate)",
                    }}
                  >
                    <strong>CRM:</strong> {doctor.crm}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      marginBottom: 12,
                      color: "var(--mc-slate)",
                    }}
                  >
                    <strong>E-mail:</strong> {doctor.email}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      paddingTop: 12,
                      borderTop: "1px solid var(--mc-surface-3)",
                    }}
                  >
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 12, padding: "6px 12px" }}
                      onClick={() => handleEditDoctor(doctor)}
                    >
                      <i className="bi bi-pencil me-1"></i>Editar
                    </button>
                    <button
                      className="btn btn-ghost"
                      style={{ flex: 1, fontSize: 12, padding: "6px 12px" }}
                      onClick={() => handleDeleteUser(doctor.id)}
                    >
                      <i className="bi bi-trash me-1"></i>Deletar
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {doctors.length === 0 && (
              <p
                style={{
                  color: "var(--mc-slate)",
                  fontSize: 13,
                  textAlign: "center",
                }}
              >
                Nenhum médico cadastrado
              </p>
            )}
          </div>

          {/* Edit Doctor Modal */}
          {showEditDoctorModal && (
            <div
              className="mc-modal-overlay"
              onClick={() => setShowEditDoctorModal(false)}
            >
              <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
                <div className="mc-modal-header">
                  <h4 style={{ margin: 0 }}>Editar Médico</h4>
                  <button
                    className="btn-ghost btn"
                    onClick={() => setShowEditDoctorModal(false)}
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
                <div className="mc-modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="mc-label">Nome</label>
                      <input
                        type="text"
                        className="mc-input form-control"
                        value={editDoctorForm.name}
                        onChange={(e) =>
                          setEditDoctorForm({
                            ...editDoctorForm,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="mc-label">E-mail</label>
                      <input
                        type="email"
                        className="mc-input form-control"
                        value={editDoctorForm.email}
                        onChange={(e) =>
                          setEditDoctorForm({
                            ...editDoctorForm,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="mc-label">Especialidade</label>
                      <input
                        type="text"
                        className="mc-input form-control"
                        value={editDoctorForm.specialty}
                        onChange={(e) =>
                          setEditDoctorForm({
                            ...editDoctorForm,
                            specialty: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="mc-label">
                        {editingDoctor?.role === "veterinary" ? "CRMV" : "CRM"}
                      </label>
                      <input
                        type="text"
                        className="mc-input form-control"
                        value={editDoctorForm.crm}
                        onChange={(e) =>
                          setEditDoctorForm({
                            ...editDoctorForm,
                            crm: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mc-modal-footer">
                  <button
                    className="btn btn-ghost"
                    onClick={() => setShowEditDoctorModal(false)}
                  >
                    Cancelar
                  </button>
                  <button className="btn btn-teal" onClick={handleSaveDoctor}>
                    Salvar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === "appointments" && (
        <div>
          <div className="mc-card mb-4" style={{ padding: "16px 24px" }}>
            <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
              Agendamentos do Sistema
            </h5>
          </div>

          {appointments.length === 0 ? (
            <div
              className="mc-card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <i
                className="bi bi-calendar-x"
                style={{
                  fontSize: 32,
                  color: "var(--mc-slate)",
                  marginBottom: 12,
                }}
              ></i>
              <p style={{ color: "var(--mc-slate)", margin: 0 }}>
                Nenhum agendamento encontrado
              </p>
            </div>
          ) : (
            <>
              <div
                className="mc-card admin-table"
                style={{ padding: "16px", overflow: "auto" }}
              >
                <table
                  style={{
                    width: "100%",
                    fontSize: 13,
                    borderCollapse: "collapse",
                  }}
                >
                  <thead>
                    <tr
                      style={{
                        borderBottom: "1px solid var(--mc-border-subtle)",
                      }}
                    >
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                        }}
                      >
                        Data
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                        }}
                      >
                        Paciente
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                        }}
                      >
                        Médico
                      </th>
                      <th
                        style={{
                          padding: "12px",
                          textAlign: "left",
                          fontWeight: 600,
                          color: "var(--mc-slate)",
                        }}
                      >
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((apt) => (
                      <tr
                        key={apt.id}
                        style={{
                          borderBottom: "1px solid var(--mc-border-subtle)",
                        }}
                      >
                        <td style={{ padding: "12px" }}>
                          {new Date(apt.date).toLocaleDateString("pt-BR")}{" "}
                          {apt.time}
                        </td>
                        <td style={{ padding: "12px" }}>{apt.patientName}</td>
                        <td style={{ padding: "12px" }}>{apt.doctor}</td>
                        <td style={{ padding: "12px" }}>
                          <span
                            style={{
                              background:
                                apt.status === "completed"
                                  ? "#10b98126"
                                  : "#f59e0b26",
                              color:
                                apt.status === "completed"
                                  ? "#10b981"
                                  : "#f59e0b",
                              padding: "4px 8px",
                              borderRadius: 4,
                              fontSize: 11,
                              fontWeight: 600,
                            }}
                          >
                            {apt.status === "completed"
                              ? "Realizado"
                              : "Agendado"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards view */}
              <div className="admin-cards row g-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="col-12">
                    <div className="mc-card" style={{ padding: "16px" }}>
                      <div style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "var(--mc-text)",
                            marginBottom: 4,
                          }}
                        >
                          <i className="bi bi-calendar-event me-2"></i>
                          {new Date(apt.date).toLocaleDateString(
                            "pt-BR",
                          )} às {apt.time}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--mc-slate)",
                            marginBottom: 4,
                          }}
                        >
                          <i className="bi bi-person me-2"></i>
                          <strong>Paciente:</strong> {apt.patientName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: "var(--mc-slate)",
                            marginBottom: 4,
                          }}
                        >
                          <i className="bi bi-stethoscope me-2"></i>
                          <strong>Médico:</strong> {apt.doctor}
                        </div>
                      </div>
                      <div
                        style={{
                          paddingTop: 12,
                          borderTop: "1px solid var(--mc-surface-3)",
                        }}
                      >
                        <span
                          style={{
                            background:
                              apt.status === "completed"
                                ? "#10b98126"
                                : "#f59e0b26",
                            color:
                              apt.status === "completed"
                                ? "#10b981"
                                : "#f59e0b",
                            padding: "6px 12px",
                            borderRadius: 4,
                            fontSize: 12,
                            fontWeight: 600,
                          }}
                        >
                          {apt.status === "completed"
                            ? "✓ Realizado"
                            : "⧐ Agendado"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Patients Tab */}
      {activeTab === "patients" && (
        <div>
          <div className="mc-card mb-4" style={{ padding: "16px 24px" }}>
            <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
              Pacientes Registrados
            </h5>
          </div>

          {patients.length === 0 ? (
            <div
              className="mc-card"
              style={{ padding: "40px", textAlign: "center" }}
            >
              <i
                className="bi bi-person-dash"
                style={{
                  fontSize: 32,
                  color: "var(--mc-slate)",
                  marginBottom: 12,
                }}
              ></i>
              <p style={{ color: "var(--mc-slate)", margin: 0 }}>
                Nenhum paciente encontrado
              </p>
            </div>
          ) : (
            <div className="row g-3">
              {patients.map((pat) => (
                <div key={pat.id} className="col-md-6 col-lg-4">
                  <div className="mc-card" style={{ padding: "16px" }}>
                    <div
                      style={{
                        fontSize: 14,
                        fontWeight: 600,
                        marginBottom: 8,
                        color: "var(--mc-text)",
                      }}
                    >
                      {pat.name}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--mc-slate)",
                        marginBottom: 4,
                      }}
                    >
                      <i className="bi bi-person me-1"></i>
                      {pat.cpf}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--mc-slate)",
                        marginBottom: 4,
                      }}
                    >
                      <i className="bi bi-envelope me-1"></i>
                      {pat.email}
                    </div>
                    <div
                      style={{
                        fontSize: 12,
                        color: "var(--mc-slate)",
                        marginBottom: 4,
                      }}
                    >
                      <i className="bi bi-telephone me-1"></i>
                      {pat.phone}
                    </div>
                    <div style={{ fontSize: 12, color: "var(--mc-slate)" }}>
                      <i className="bi bi-credit-card me-1"></i>
                      {pat.insurance}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Insurance Tab */}
      {activeTab === "insurance" && (
        <div>
          <div className="mc-card mb-4" style={{ padding: "16px 24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h5 style={{ fontSize: 14, fontWeight: 600, margin: 0 }}>
                Convênios Cadastrados
              </h5>
              <button
                className="btn btn-teal"
                style={{ fontSize: 13, padding: "6px 12px" }}
                onClick={() => setShowInsuranceModal(true)}
              >
                <i className="bi bi-plus-lg me-2"></i>Novo Convênio
              </button>
            </div>
          </div>

          {showInsuranceModal && (
            <div
              className="mc-card mb-4"
              style={{
                padding: "20px 24px",
                background: "var(--mc-surface-2)",
              }}
            >
              <h6 style={{ fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
                Adicionar Novo Convênio
              </h6>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="mc-input form-control"
                  value={newInsurance.name}
                  onChange={(e) => setNewInsurance({ name: e.target.value })}
                  placeholder="Nome do convênio"
                />
                <button
                  className="btn btn-teal"
                  onClick={handleAddInsurance}
                  style={{ fontSize: 13, whiteSpace: "nowrap" }}
                >
                  Adicionar
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => {
                    setShowInsuranceModal(false);
                    setNewInsurance({ name: "" });
                  }}
                  style={{ fontSize: 13, whiteSpace: "nowrap" }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <div className="row g-3">
            {insurances.map((ins) => (
              <div key={ins.id} className="col-md-6 col-lg-4">
                <div
                  style={{
                    padding: "16px",
                    borderRadius: 12,
                    background: "var(--mc-surface-2)",
                    border: "1px solid var(--mc-surface-3)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "start",
                      marginBottom: 12,
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: "var(--mc-text)",
                        }}
                      >
                        {ins.name}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: "var(--mc-slate)",
                          marginTop: 4,
                        }}
                      >
                        <span
                          style={{
                            color:
                              ins.status === "active" ? "#10b981" : "#ef4444",
                            fontWeight: 600,
                          }}
                        >
                          <i
                            className={`bi me-1 ${ins.status === "active" ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}
                          ></i>
                          {ins.status === "active" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          flex: 1,
                          justifyContent: "flex-end",
                        }}
                      >
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 12, padding: "6px 12px" }}
                          onClick={() => toggleInsuranceStatus(ins.id)}
                          title={
                            ins.status === "active" ? "Desativar" : "Ativar"
                          }
                        >
                          <i
                            className={`bi me-1 ${ins.status === "active" ? "bi-eye-slash" : "bi-eye"}`}
                          ></i>
                          {ins.status === "active" ? "Desativar" : "Ativar"}
                        </button>
                        <button
                          className="btn btn-ghost"
                          style={{ fontSize: 12, padding: "6px 12px" }}
                          onClick={() => handleDeleteInsurance(ins.id)}
                        >
                          <i className="bi bi-trash me-1"></i>Deletar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === "logs" && (
        <div>
          {/* Help section */}
          <div className="row g-3 mb-4">
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(167, 139, 250, 0.1)",
                      color: "#a78bfa",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    LOGIN
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando um usuário entra no sistema. Rastreia acesso e
                  autenticação.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(34, 197, 94, 0.1)",
                      color: "#22c55e",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    APPOINTMENT
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando uma consulta é criada, atualizada ou cancelada.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      color: "#3b82f6",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    PATIENT
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando um paciente é adicionado, editado ou removido do
                  sistema.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(239, 68, 68, 0.1)",
                      color: "#ef4444",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    URGENCY
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando uma urgência é registrada ou atualizada no
                  pós-atendimento.
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(148, 163, 184, 0.1)",
                      color: "#64748b",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    USER
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando um usuário é criado, editado ou removido (admin).
                </div>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="mc-card" style={{ padding: "16px 20px" }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--mc-text)",
                    marginBottom: 8,
                  }}
                >
                  <span
                    style={{
                      background: "rgba(245, 158, 11, 0.1)",
                      color: "#f59e0b",
                      padding: "2px 6px",
                      borderRadius: 4,
                    }}
                  >
                    INSURANCE
                  </span>
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: "var(--mc-slate)",
                    lineHeight: 1.6,
                  }}
                >
                  Quando um convênio é adicionado ou removido do sistema.
                </div>
              </div>
            </div>
          </div>

          <div className="mc-card" style={{ padding: "20px 24px" }}>
            <h5 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
              <i className="bi bi-clock-history me-2"></i>Logs do Sistema
              (últimos 50)
            </h5>
            <div style={{ overflowX: "auto" }} className="admin-table">
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 12,
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--mc-surface-3)" }}>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--mc-slate)",
                      }}
                    >
                      Tipo
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--mc-slate)",
                      }}
                    >
                      Usuário
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--mc-slate)",
                      }}
                    >
                      Ação
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        textAlign: "left",
                        fontWeight: 600,
                        color: "var(--mc-slate)",
                      }}
                    >
                      Data/Hora
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {systemLogs.slice(0, 50).map((log) => (
                    <tr
                      key={log.id}
                      style={{
                        borderBottom: "1px solid var(--mc-surface-3)",
                      }}
                    >
                      <td style={{ padding: "12px" }}>
                        <span
                          style={{
                            padding: "3px 8px",
                            borderRadius: 4,
                            background: "rgba(167, 139, 250, 0.1)",
                            color: "#a78bfa",
                            fontSize: 11,
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          {log.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px", color: "var(--mc-text)" }}>
                        {log.user}
                      </td>
                      <td style={{ padding: "12px", color: "var(--mc-slate)" }}>
                        {log.action}
                      </td>
                      <td style={{ padding: "12px", color: "var(--mc-slate)" }}>
                        {new Date(log.timestamp).toLocaleString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards view */}
            <div className="admin-cards">
              {systemLogs.slice(0, 50).map((log) => (
                <div
                  key={log.id}
                  className="mc-card"
                  style={{ padding: "16px", marginBottom: "12px" }}
                >
                  <div style={{ marginBottom: 12 }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: 4,
                        background: "rgba(167, 139, 250, 0.1)",
                        color: "#a78bfa",
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: "uppercase",
                      }}
                    >
                      {log.type}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 600,
                      color: "var(--mc-text)",
                      marginBottom: 8,
                    }}
                  >
                    <strong>Usuário:</strong> {log.user}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--mc-slate)",
                      marginBottom: 8,
                    }}
                  >
                    <strong>Ação:</strong> {log.action}
                  </div>
                  <div style={{ fontSize: 12, color: "var(--mc-slate)" }}>
                    <strong>Data/Hora:</strong>{" "}
                    {new Date(log.timestamp).toLocaleString("pt-BR")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
