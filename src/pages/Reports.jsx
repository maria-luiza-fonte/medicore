import React from 'react'
import { useApp } from '../context/AppContext'

export default function Reports() {
  const { patients, appointments, urgencyQueue } = useApp()

  const done = appointments.filter(a => a.status === 'done')
  const pending = appointments.filter(a => a.status === 'pending')
  const cancelled = appointments.filter(a => a.status === 'cancelled')
  const total = appointments.length

  const specialties = [...new Set(appointments.map(a => a.specialty))]
  const specialtyCounts = specialties.map(s => ({
    name: s,
    count: appointments.filter(a => a.specialty === s).length,
    done: appointments.filter(a => a.specialty === s && a.status === 'done').length,
  })).sort((a, b) => b.count - a.count)

  const urgencyByLevel = [1,2,3,4,5].map(l => ({
    level: l,
    count: urgencyQueue.filter(u => u.level === l).length
  }))

  const urgencyColors = { 1: '#ef4444', 2: '#f97316', 3: '#f59e0b', 4: '#10b981', 5: '#64748b' }
  const urgencyLabels = { 1: 'Crítico', 2: 'Alto', 3: 'Moderado', 4: 'Baixo', 5: 'Rotina' }

  const insurances = [...new Set(patients.map(p => p.insurance))]
  const insuranceCounts = insurances.map(ins => ({
    name: ins,
    count: patients.filter(p => p.insurance === ins).length,
  })).sort((a, b) => b.count - a.count)

  const maxIns = Math.max(...insuranceCounts.map(i => i.count), 1)

  return (
    <div className="fade-in">
      <div className="mc-page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="mc-page-title">Relatórios</h1>
          <p className="mc-page-subtitle">Análise estatística do consultório</p>
        </div>
        <button className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 16px' }}>
          <i className="bi bi-download me-2"></i>Exportar PDF
        </button>
      </div>

      {/* Overview stats */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Pacientes', value: patients.length, icon: 'bi-people-fill', color: 'var(--mc-teal)' },
          { label: 'Total Consultas', value: total, icon: 'bi-calendar2-check', color: '#a78bfa' },
          { label: 'Taxa de Realização', value: total > 0 ? `${Math.round(done.length/total*100)}%` : '0%', icon: 'bi-graph-up', color: '#10b981' },
          { label: 'Urgências Registradas', value: urgencyQueue.length, icon: 'bi-exclamation-triangle-fill', color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className={`col-6 col-lg-3 fade-in anim-delay-${i+1}`}>
            <div className="stat-card">
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${s.color}, transparent)` }}></div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <i className={`bi ${s.icon} stat-icon`} style={{ color: s.color }}></i>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-3 mb-3">
        {/* Appointment status breakdown */}
        <div className="col-lg-5 fade-in anim-delay-2">
          <div className="mc-card" style={{ padding: '22px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Status das Consultas</h4>
            {[
              { label: 'Realizadas', count: done.length, color: '#10b981' },
              { label: 'Pendentes', count: pending.length, color: '#f59e0b' },
              { label: 'Canceladas', count: cancelled.length, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--mc-text)' }}>{s.label}</span>
                  <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', color: s.color, fontWeight: 700 }}>
                    {s.count} ({total > 0 ? Math.round(s.count/total*100) : 0}%)
                  </span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: 'var(--mc-surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${total > 0 ? (s.count/total*100) : 0}%`, background: s.color, borderRadius: 4, transition: 'width 1s ease' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Urgency distribution */}
        <div className="col-lg-7 fade-in anim-delay-3">
          <div className="mc-card" style={{ padding: '22px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Distribuição de Urgências</h4>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              {urgencyByLevel.map(({ level, count }) => {
                const color = urgencyColors[level]
                const rgb = color.replace('#','').match(/.{2}/g).map(h=>parseInt(h,16)).join(',')
                return (
                  <div key={level} style={{ flex: 1, minWidth: 80, textAlign: 'center', padding: '16px 8px', borderRadius: 12, background: `rgba(${rgb},0.1)`, border: `1px solid rgba(${rgb},0.25)` }}>
                    <div style={{ fontSize: 28, fontWeight: 800, color, fontFamily: 'var(--font-mono)', lineHeight: 1, marginBottom: 6 }}>{count}</div>
                    <div style={{ fontSize: 11, fontWeight: 700, color }}>{urgencyLabels[level]}</div>
                    <div style={{ fontSize: 10, color: 'var(--mc-slate)', marginTop: 2 }}>Nível {level}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3">
        {/* Specialties */}
        <div className="col-lg-6 fade-in anim-delay-3">
          <div className="mc-card" style={{ padding: '22px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Consultas por Especialidade</h4>
            {specialtyCounts.map((s, i) => (
              <div key={s.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 13 }}>{s.name}</span>
                  <span style={{ fontSize: 12, color: 'var(--mc-slate)' }}>{s.count} total · {s.done} realizadas</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: 'var(--mc-surface-3)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${s.count/total*100}%`, background: `hsl(${170 + i*30}, 70%, 50%)`, borderRadius: 3 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insurance */}
        <div className="col-lg-6 fade-in anim-delay-4">
          <div className="mc-card" style={{ padding: '22px 24px' }}>
            <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Pacientes por Convênio</h4>
            {insuranceCounts.map((ins, i) => (
              <div key={ins.name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: `hsl(${180 + i*35}, 60%, 20%)`, border: `1px solid hsl(${180 + i*35}, 60%, 35%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, color: `hsl(${180 + i*35}, 70%, 60%)`, flexShrink: 0 }}>
                  {ins.name[0]}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13 }}>{ins.name}</span>
                    <span style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 700, color: `hsl(${180 + i*35}, 70%, 60%)` }}>{ins.count}</span>
                  </div>
                  <div style={{ height: 5, borderRadius: 3, background: 'var(--mc-surface-3)', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ins.count/maxIns*100}%`, background: `hsl(${180 + i*35}, 70%, 50%)`, borderRadius: 3 }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
