import React, { useState } from 'react'
import { useApp } from '../context/AppContext'

const EMPTY = { patientId: '', patientName: '', doctor: 'Dr. Ricardo Mendes', specialty: 'Cardiologia', date: '', time: '', status: 'pending', notes: '', diagnosis: '' }

const doctors = ['Dr. Ricardo Mendes', 'Dra. Beatriz Almeida', 'Dr. Paulo Henrique', 'Dra. Camila Torres']
const specialties = ['Cardiologia', 'Clínica Geral', 'Ginecologia', 'Pneumologia', 'Ortopedia', 'Neurologia', 'Dermatologia', 'Pediatria']

const statusLabel = { pending: 'Pendente', done: 'Realizada', cancelled: 'Cancelada' }
const statusClass = { pending: 'badge-status-pending', done: 'badge-status-done', cancelled: 'badge-status-cancelled' }

export default function Appointments() {
  const { appointments, addAppointment, updateAppointment, patients, addUrgency } = useApp()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [filterStatus, setFilterStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [postCareModal, setPostCareModal] = useState(null)
  const [urgencyForm, setUrgencyForm] = useState({ reason: '', level: 2 })

  const filtered = appointments.filter(a => {
    const matchStatus = filterStatus === 'all' || a.status === filterStatus
    const matchSearch = a.patientName.toLowerCase().includes(search.toLowerCase()) || a.doctor.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const f = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleSave = () => {
    if (!form.patientName || !form.date || !form.time) return
    addAppointment(form)
    setShowModal(false)
    setForm(EMPTY)
  }

  const handleComplete = (a) => {
    updateAppointment(a.id, { status: 'done' })
    setPostCareModal(a)
  }

  const handleUrgency = () => {
    if (!urgencyForm.reason) return
    addUrgency({
      patientId: postCareModal.patientId,
      patientName: postCareModal.patientName,
      reason: urgencyForm.reason,
      level: parseInt(urgencyForm.level),
      doctor: postCareModal.doctor,
      appointmentId: postCareModal.id,
    })
    setPostCareModal(null)
    setUrgencyForm({ reason: '', level: 2 })
  }

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Agendamentos</h1>
          <p className="mc-page-subtitle">{appointments.length} consultas registradas</p>
        </div>
        <button className="btn btn-teal px-4 py-2" onClick={() => setShowModal(true)}>
          <i className="bi bi-calendar-plus me-2"></i>Nova Consulta
        </button>
      </div>

      {/* Filters */}
      <div className="mc-card-flat mb-4" style={{ padding: '16px 20px' }}>
        <div className="row g-3 align-items-center">
          <div className="col-md-5">
            <div className="mc-search-wrap">
              <i className="bi bi-search"></i>
              <input className="mc-input form-control" placeholder="Buscar paciente ou médico..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
          <div className="col-md-4">
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'pending', 'done', 'cancelled'].map(s => (
                <button key={s} onClick={() => setFilterStatus(s)}
                  className={`btn ${filterStatus === s ? 'btn-teal' : 'btn-ghost'}`}
                  style={{ fontSize: 12, padding: '5px 12px' }}>
                  {s === 'all' ? 'Todas' : statusLabel[s]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mc-card" style={{ padding: 0 }}>
        <div style={{ overflowX: 'auto' }}>
          <table className="mc-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Médico</th>
                <th>Especialidade</th>
                <th>Data</th>
                <th>Horário</th>
                <th>Status</th>
                <th>Diagnóstico</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(a => (
                <tr key={a.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div className="mc-avatar" style={{ width: 32, height: 32, fontSize: 11 }}>
                        {a.patientName.split(' ').map(n=>n[0]).slice(0,2).join('')}
                      </div>
                      <span style={{ fontSize: 13.5, fontWeight: 500 }}>{a.patientName}</span>
                    </div>
                  </td>
                  <td style={{ fontSize: 13 }}>{a.doctor}</td>
                  <td style={{ fontSize: 12.5, color: 'var(--mc-slate)' }}>{a.specialty}</td>
                  <td style={{ fontSize: 13, fontFamily: 'var(--font-mono)' }}>
                    {new Date(a.date + 'T12:00').toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--mc-teal)' }}>{a.time}</td>
                  <td><span className={`mc-badge ${statusClass[a.status]}`}>{statusLabel[a.status]}</span></td>
                  <td style={{ fontSize: 12.5, color: 'var(--mc-slate)', maxWidth: 160 }}>
                    {a.diagnosis || <span style={{ opacity: 0.3 }}>—</span>}
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      {a.status === 'pending' && (
                        <>
                          <button className="btn btn-teal" style={{ fontSize: 11, padding: '4px 10px' }} onClick={() => handleComplete(a)}>
                            <i className="bi bi-check-circle me-1"></i>Concluir
                          </button>
                          <button className="btn btn-ghost" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => updateAppointment(a.id, { status: 'cancelled' })}>
                            <i className="bi bi-x-circle"></i>
                          </button>
                        </>
                      )}
                      {a.status === 'done' && (
                        <button className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px', color: '#f87171' }} onClick={() => setPostCareModal(a)}>
                          <i className="bi bi-exclamation-triangle me-1"></i>Urgência
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New appointment modal */}
      {showModal && (
        <div className="mc-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0 }}>Nova Consulta</h4>
              <button className="btn-ghost btn" style={{ padding: '4px 8px' }} onClick={() => setShowModal(false)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="mc-modal-body">
              <div className="row g-3">
                <div className="col-12">
                  <label className="mc-label">Paciente</label>
                  <select className="mc-input form-select" value={form.patientId} onChange={e => {
                    const p = patients.find(p => p.id === parseInt(e.target.value))
                    f('patientId', e.target.value); f('patientName', p ? p.name : '')
                  }}>
                    <option value="">Selecione o paciente...</option>
                    {patients.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Médico</label>
                  <select className="mc-input form-select" value={form.doctor} onChange={e => f('doctor', e.target.value)}>
                    {doctors.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Especialidade</label>
                  <select className="mc-input form-select" value={form.specialty} onChange={e => f('specialty', e.target.value)}>
                    {specialties.map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Data</label>
                  <input type="date" className="mc-input form-control" value={form.date} onChange={e => f('date', e.target.value)} />
                </div>
                <div className="col-md-6">
                  <label className="mc-label">Horário</label>
                  <input type="time" className="mc-input form-control" value={form.time} onChange={e => f('time', e.target.value)} />
                </div>
                <div className="col-12">
                  <label className="mc-label">Observações</label>
                  <textarea className="mc-input form-control" rows={2} value={form.notes} onChange={e => f('notes', e.target.value)} placeholder="Motivo da consulta, queixas..." />
                </div>
              </div>
            </div>
            <div className="mc-modal-footer">
              <button className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-teal px-4" onClick={handleSave}>Agendar consulta</button>
            </div>
          </div>
        </div>
      )}

      {/* Post-care / urgency modal */}
      {postCareModal && (
        <div className="mc-modal-overlay" onClick={() => setPostCareModal(null)}>
          <div className="mc-modal" onClick={e => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h4 style={{ fontFamily: 'var(--font-display)', fontSize: 20, margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
                <i className="bi bi-shield-exclamation" style={{ color: '#f59e0b' }}></i>
                Pós-Atendimento & Urgência
              </h4>
              <button className="btn-ghost btn" style={{ padding: '4px 8px' }} onClick={() => setPostCareModal(null)}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="mc-modal-body">
              <div style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <p style={{ fontSize: 13.5, margin: 0, color: 'var(--mc-text)' }}>
                  <strong>{postCareModal.patientName}</strong> — Consulta de {postCareModal.specialty}
                </p>
                <p style={{ fontSize: 12, color: 'var(--mc-slate)', margin: '4px 0 0' }}>
                  Registre se o paciente necessita de acompanhamento urgente pós-consulta.
                </p>
              </div>
              <div className="mb-3">
                <label className="mc-label">Diagnóstico / Observação final</label>
                <textarea className="mc-input form-control" rows={2} placeholder="Diagnóstico e conduta prescrita..." onChange={e => updateAppointment(postCareModal.id, { diagnosis: e.target.value })} />
              </div>
              <hr className="mc-divider" />
              <h6 style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: 'var(--mc-text)' }}>
                <i className="bi bi-exclamation-triangle-fill me-2" style={{ color: '#ef4444' }}></i>
                Registrar Urgência no Pós-Atendimento
              </h6>
              <div className="mb-3">
                <label className="mc-label">Motivo da urgência</label>
                <textarea className="mc-input form-control" rows={3} placeholder="Descreva o motivo da urgência para reagendamento prioritário..." value={urgencyForm.reason} onChange={e => setUrgencyForm(p => ({...p, reason: e.target.value}))} />
              </div>
              <div className="mb-3">
                <label className="mc-label d-block mb-2">Grau de Prioridade</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[
                    { level: 1, label: 'Crítico', color: '#ef4444' },
                    { level: 2, label: 'Alto', color: '#f97316' },
                    { level: 3, label: 'Moderado', color: '#f59e0b' },
                    { level: 4, label: 'Baixo', color: '#10b981' },
                    { level: 5, label: 'Rotina', color: '#64748b' },
                  ].map(({ level, label, color }) => (
                    <button key={level} onClick={() => setUrgencyForm(p => ({...p, level}))}
                      style={{
                        flex: 1, padding: '8px 4px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                        background: urgencyForm.level === level ? `rgba(${color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')},0.2)` : 'var(--mc-surface-3)',
                        border: urgencyForm.level === level ? `2px solid ${color}` : '2px solid transparent',
                        color: urgencyForm.level === level ? color : 'var(--mc-slate)',
                        transition: 'all 0.15s',
                      }}>
                      {level}<br/><span style={{ fontSize: 10, fontWeight: 400 }}>{label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <div className="mc-modal-footer">
              <button className="btn btn-ghost" onClick={() => setPostCareModal(null)}>Só salvar consulta</button>
              <button className="btn px-4" style={{ background: '#ef4444', color: 'white', borderRadius: 8 }} onClick={handleUrgency} disabled={!urgencyForm.reason}>
                <i className="bi bi-exclamation-triangle me-2"></i>Registrar Urgência
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
