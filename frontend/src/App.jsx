import React, { useEffect, useState } from 'react'
import { apiFetch } from './api.js'

const STATUSES = ['Applied', 'OA/Test', 'Interview', 'Offer', 'Rejected']
const STATUS_COLORS = {
  Applied: '#64748b',
  'OA/Test': '#eab308',
  Interview: '#3b82f6',
  Offer: '#22c55e',
  Rejected: '#ef4444',
}

export default function App() {
  const [applications, setApplications] = useState([])
  const [stats, setStats] = useState(null)
  const [filter, setFilter] = useState('')
  const [form, setForm] = useState({ company: '', role: '', status: 'Applied', link: '', notes: '' })
  const [showForm, setShowForm] = useState(false)

  const fetchApplications = async () => {
    const url = filter ? `/api/applications?status=${filter}` : '/api/applications'
    const res = await apiFetch(url)
    setApplications(await res.json())
  }

  const fetchStats = async () => {
    const res = await apiFetch('/api/stats')
    setStats(await res.json())
  }

  useEffect(() => {
    fetchApplications()
    fetchStats()
  }, [filter])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.company || !form.role) return
    await apiFetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setForm({ company: '', role: '', status: 'Applied', link: '', notes: '' })
    setShowForm(false)
    fetchApplications()
    fetchStats()
  }

  const updateStatus = async (id, status) => {
    await apiFetch(`/api/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchApplications()
    fetchStats()
  }

  const deleteApp = async (id) => {
    await apiFetch(`/api/applications/${id}`, { method: 'DELETE' })
    fetchApplications()
    fetchStats()
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h1 style={styles.title}>📋 TrackMyApps</h1>
        <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Application'}
        </button>
      </header>

      {stats && (
        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <div style={styles.statNum}>{stats.total}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          {STATUSES.map((s) => (
            <div key={s} style={{ ...styles.statCard, borderTop: `3px solid ${STATUS_COLORS[s]}` }}>
              <div style={styles.statNum}>{stats.by_status[s] || 0}</div>
              <div style={styles.statLabel}>{s}</div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            style={styles.input}
            placeholder="Company"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Role"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          />
          <select
            style={styles.input}
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <input
            style={styles.input}
            placeholder="Job posting link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
          />
          <textarea
            style={{ ...styles.input, minHeight: 60 }}
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
          />
          <button type="submit" style={styles.primaryBtn}>Save Application</button>
        </form>
      )}

      <div style={styles.filterRow}>
        <button style={filter === '' ? styles.filterActive : styles.filterBtn} onClick={() => setFilter('')}>All</button>
        {STATUSES.map((s) => (
          <button
            key={s}
            style={filter === s ? styles.filterActive : styles.filterBtn}
            onClick={() => setFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div style={styles.list}>
        {applications.length === 0 && <p style={{ color: '#94a3b8' }}>No applications yet. Add your first one!</p>}
        {applications.map((a) => (
          <div key={a.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <strong>{a.company}</strong> — {a.role}
                <div style={{ fontSize: 12, color: '#94a3b8' }}>{a.applied_date}</div>
              </div>
              <span style={{ ...styles.badge, background: STATUS_COLORS[a.status] }}>{a.status}</span>
            </div>
            {a.notes && <p style={styles.notes}>{a.notes}</p>}
            <div style={styles.cardFooter}>
              <select value={a.status} onChange={(e) => updateStatus(a.id, e.target.value)} style={styles.smallSelect}>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {a.link && <a href={a.link} target="_blank" rel="noreferrer" style={styles.link}>View posting</a>}
              <button style={styles.deleteBtn} onClick={() => deleteApp(a.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  page: { maxWidth: 800, margin: '0 auto', padding: 24, fontFamily: 'system-ui, sans-serif', color: '#1e293b' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 26, margin: 0 },
  primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 },
  statsRow: { display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' },
  statCard: { flex: 1, minWidth: 90, background: '#f8fafc', borderRadius: 10, padding: 12, textAlign: 'center' },
  statNum: { fontSize: 22, fontWeight: 700 },
  statLabel: { fontSize: 12, color: '#64748b' },
  form: { display: 'flex', flexDirection: 'column', gap: 10, background: '#f8fafc', padding: 16, borderRadius: 10, marginBottom: 20 },
  input: { padding: 10, borderRadius: 8, border: '1px solid #cbd5e1', fontSize: 14 },
  filterRow: { display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' },
  filterBtn: { padding: '6px 12px', borderRadius: 20, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: 13 },
  filterActive: { padding: '6px 12px', borderRadius: 20, border: '1px solid #3b82f6', background: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: 13 },
  list: { display: 'flex', flexDirection: 'column', gap: 12 },
  card: { border: '1px solid #e2e8f0', borderRadius: 10, padding: 14 },
  cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: 12, fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap' },
  notes: { fontSize: 13, color: '#475569', marginTop: 8 },
  cardFooter: { display: 'flex', gap: 12, alignItems: 'center', marginTop: 10 },
  smallSelect: { padding: 6, borderRadius: 6, border: '1px solid #cbd5e1', fontSize: 12 },
  link: { fontSize: 12, color: '#3b82f6' },
  deleteBtn: { marginLeft: 'auto', background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: 12 },
}
