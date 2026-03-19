import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const EMPTY = { name: '', cpf: '', dob: '', phone: '', email: '', bloodType: 'A+', allergies: '', conditions: '', insurance: '' }

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export default function Patients() {
  const { patients, addPatient, updatePatient, deletePatient } = useApp()
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [viewPatient, setViewPatient] = useState(null)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const filtered = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.cpf.includes(search) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  )

  const openNew = () => { setEditing(null); setForm(EMPTY); setShowModal(true) }
  const openEdit = (p) => { setEditing(p); setForm({ ...p }); setShowModal(true) }

  const handleSave = () => {
    if (!form.name || !form.cpf) return
    if (editing) updatePatient(editing.id, form)
    else addPatient(form)
    setShowModal(false)
  }

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Pacientes</h1>
          <p className="mc-page-subtitle">{patients.length} pacientes cadastrados</p>
        </div>
        <button className="btn btn-teal px-4 py-2" onClick={openNew}>
          <i className="bi bi-person-plus me-2"></i>Novo Paciente
        </button>
      </div>

      {/* Search bar */}
      <div className="mc-card-flat mb-4" style={{ padding: '16px 20px' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-6">
            <div className="mc-search-wrap">
              <i className="bi bi-search"></i>
              <input className="mc-input form-control" placeholder="Buscar por nome, CPF ou e-mail..." value={search} onChange={e => setSearch(e.target.value)} />
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
            <span style={{ fontSize: 13, color: 'var(--mc-slate)' }}>{filtered.length} resultado{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mc-card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="mc-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>CPF</th>
                <th>Contato</th>
                <th>Tipo Sang.</th>
                <th>Convênio</th>
                <th>Condições</th>
                <th>Cadastro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mc-avatar">{p.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
                      <div>
                        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{p.name}</div>
                        <div style={{ fontSize: 11.5, color: 'var(--mc-slate)' }}>
                          {new Date(p.dob + 'T12:00').toLocaleDateString('pt-BR')} · {Math.floor((Date.now() - new Date(p.dob)) / (365.25*24*3600*1000))} anos
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: 12.5 }}>{p.cpf}</td>
                  <td>
                    <div style={{ fontSize: 12.5 }}>{p.phone}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--mc-slate)' }}>{p.email}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, fontWeight: 700, color: 'var(--mc-teal)' }}>{p.bloodType}</span>
                  </td>
                  <td style={{ fontSize: 12.5 }}>{p.insurance}</td>
                  <td style={{ fontSize: 12, color: 'var(--mc-slate)', maxWidth: 160 }}>
                    {p.conditions || <span style={{ opacity: 0.4 }}>—</span>}
                  </td>
                  <td style={{ fontSize: 11.5, color: 'var(--mc-slate)' }}>
                    {new Date(p.createdAt + 'T12:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button className="btn-ghost btn" style={{ padding: '4px 8px', fontSize: 13 }} onClick={() => setViewPatient(p)} title="Ver"><i className="bi bi-eye"></i></button>
                      <button className="btn-ghost btn" style={{ padding: '4px 8px', fontSize: 13 }} onClick={() => openEdit(p)} title="Editar"><i className="bi bi-pencil"></i></button>
                      <button className="btn-ghost btn" style={{ padding: '4px 8px', fontSize: 13, color: '#f87171' }} onClick={() => setConfirmDelete(p)} title="Excluir"><i className="bi bi-trash"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--mc-slate)' }}>
                  <i className="bi bi-search d-block mb-2" style={{ fontSize: 28, opacity: 0.3 }}></i>
                  Nenhum paciente encontrado
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="mc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>
                {editing ? 'Editar Paciente' : 'Cadastrar Paciente'}
              </h4>
              <button className="btn-ghost btn" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="mc-modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="mc-label">Nome completo *</label>
                  <input className="mc-input form-control" value={form.name} onChange={e => f('name', e.target.value)} placeholder="Nome do paciente" />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">CPF *</label>
                  <input className="mc-input form-control" value={form.cpf} onChange={e => f('cpf', e.target.value)} placeholder="000.000.000-00" />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Data de Nascimento</label>
                  <input type="date" className="mc-input form-control" value={form.dob} onChange={e => f('dob', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Telefone</label>
                  <input className="mc-input form-control" value={form.phone} onChange={e => f('phone', e.target.value)} placeholder="(11) 99999-9999" />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">E-mail</label>
                  <input type="email" className="mc-input form-control" value={form.email} onChange={e => f('email', e.target.value)} placeholder="email@exemplo.com" />
                </div>
                <div className="col-md-4">
                  <label className="mc-label">Tipo Sanguíneo</label>
                  <select className="mc-input form-select" value={form.bloodType} onChange={e => f('bloodType', e.target.value)}>
                    {bloodTypes.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
                <div className="col-md-8">
                  <label className="mc-label">Convênio</label>
                  <input className="mc-input form-control" value={form.insurance} onChange={e => f('insurance', e.target.value)} placeholder="Ex: Unimed, Bradesco, Particular..." />
                </div>
                <div className="col-12">
                  <label className="mc-label">Alergias</label>
                  <input className="mc-input form-control" value={form.allergies} onChange={e => f('allergies', e.target.value)} placeholder="Ex: Penicilina, AAS... ou Nenhuma" />
                </div>
                <div className="col-12">
                  <label className="mc-label">Condições / Diagnósticos</label>
                  <textarea className="mc-input form-control" rows={2} value={form.conditions} onChange={e => f('conditions', e.target.value)} placeholder="Ex: Hipertensão, Diabetes Tipo 2..." />
                </div>
              </div>
            </div>
            <div className="mc-modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-teal px-4" onClick={handleSave} disabled={!form.name || !form.cpf}>
                {editing ? 'Salvar alterações' : 'Cadastrar paciente'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewPatient && (
        <div className="mc-modal-overlay" onClick={() => setViewPatient(null)}>
          <div className="mc-modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Ficha do Paciente</h4>
              <button className="btn-ghost btn" style={{ padding: '4px 8px' }} onClick={() => setViewPatient(null)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="mc-modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
                <div className="mc-avatar" style={{ width: 52, height: 52, fontSize: 18 }}>
                  {viewPatient.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
                </div>
                <div>
                  <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>{viewPatient.name}</h5>
                  <p style={{ color: 'var(--mc-slate)', fontSize: 13, margin: 0 }}>
                    {Math.floor((Date.now() - new Date(viewPatient.dob)) / (365.25*24*3600*1000))} anos · {viewPatient.insurance}
                  </p>
                </div>
              </div>
              <div className="row g-3">
                {[
                  ['CPF', viewPatient.cpf], ['Nascimento', new Date(viewPatient.dob+'T12:00').toLocaleDateString('pt-BR')],
                  ['Telefone', viewPatient.phone], ['E-mail', viewPatient.email],
                  ['Tipo Sanguíneo', viewPatient.bloodType], ['Convênio', viewPatient.insurance],
                ].map(([label, val]) => (
                  <div key={label} className="col-6">
                    <div className="mc-card-flat" style={{ padding: '10px 14px' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mc-slate)', marginBottom: 3 }}>{label}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 500 }}>{val || '—'}</div>
                    </div>
                  </div>
                ))}
                <div className="col-12">
                  <div className="mc-card-flat" style={{ padding: '12px 14px' }}>
                    <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#f87171', marginBottom: 4 }}>
                      <i className="bi bi-exclamation-circle me-1"></i>Alergias
                    </div>
                    <div style={{ fontSize: 13.5 }}>{viewPatient.allergies || 'Nenhuma'}</div>
                  </div>
                </div>
                {viewPatient.conditions && (
                  <div className="col-12">
                    <div className="mc-card-flat" style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--mc-slate)', marginBottom: 4 }}>Condições</div>
                      <div style={{ fontSize: 13.5 }}>{viewPatient.conditions}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mc-modal-footer">
              <button className="btn btn-ghost" onClick={() => setViewPatient(null)}>Fechar</button>
              <button className="btn btn-outline-teal px-4" onClick={() => { openEdit(viewPatient); setViewPatient(null) }}>
                <i className="bi bi-pencil me-2"></i>Editar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {confirmDelete && (
        <div className="mc-modal-overlay" onClick={() => setConfirmDelete(null)}>
          <div className="mc-modal" style={{ maxWidth: 400 }} onClick={e => e.stopPropagation()}>
            <div className="mc-modal-body" style={{ textAlign: 'center', padding: '32px 28px' }}>
              <div style={{ fontSize: 44, marginBottom: 16 }}>⚠️</div>
              <h5 style={{ fontFamily: 'var(--font-display)', fontSize: 20, marginBottom: 8 }}>Confirmar exclusão</h5>
              <p style={{ color: 'var(--mc-slate)', fontSize: 14 }}>Deseja remover <strong style={{ color: 'var(--mc-text)' }}>{confirmDelete.name}</strong> do sistema? Esta ação não pode ser desfeita.</p>
            </div>
            <div className="mc-modal-footer" style={{ justifyContent: 'center' }}>
              <button className="btn btn-ghost px-4" onClick={() => setConfirmDelete(null)}>Cancelar</button>
              <button className="btn px-4" style={{ background: '#ef4444', color: 'white', borderRadius: 8 }} onClick={() => { deletePatient(confirmDelete.id); setConfirmDelete(null) }}>
                <i className="bi bi-trash me-2"></i>Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
