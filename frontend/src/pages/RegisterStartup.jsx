import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createStartup } from '../services/api'

const SECTORS = ['Fintech','Quick Commerce','E-Commerce','Healthtech','Edtech','SaaS','EV & Mobility','Consumer Electronics','Beauty & Fashion','Agritech','Logtech','Proptech','Gaming','DeepTech','Other']
const STAGES = ['Pre-seed','Seed','Series A','Series B','Series C','Series D+','IPO']
const LOCATIONS = ['Bangalore','Mumbai','Delhi','Hyderabad','Chennai','Pune','Kolkata','Ahmedabad','Jaipur','Noida','Gurgaon','Other']

export default function RegisterStartup() {
  const nav = useNavigate()
  const [form, setForm] = useState({ name: '', sector: '', founding_year: '', stage: '', website: '', location: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const payload = { ...form, founding_year: parseInt(form.founding_year) }
      const res = await createStartup(payload)
      setSuccess(true)
      setTimeout(() => nav(`/startup/${res.data.id}`), 1400)
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check your inputs.')
    } finally {
      setLoading(false)
    }
  }

  if (success) return (
    <div style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 700, color: '#00ff88', marginBottom: 8 }}>Startup Registered!</div>
      <div style={{ fontSize: 13, color: '#4a6080' }}>Redirecting to dashboard...</div>
    </div>
  )

  return (
    <div style={{ paddingTop: 32, maxWidth: 580, margin: '0 auto' }}>
      <div className="animate-slide-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: '-1px', color: '#e2eaf4' }}>Register Startup</h1>
        <p style={{ fontSize: 13, color: '#4a6080', marginTop: 6 }}>Add your startup to the India ecosystem monitor</p>
      </div>

      <div className="glass-panel rounded-2xl p-7 animate-slide-up delay-100">
        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div>
            <label className="label">Startup Name *</label>
            <input type="text" value={form.name} onChange={e => handle('name', e.target.value)} className="input-field" placeholder="e.g. Razorpay" required />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Sector *</label>
              <select value={form.sector} onChange={e => handle('sector', e.target.value)} className="input-field" required>
                <option value="">Select sector...</option>
                {SECTORS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Stage *</label>
              <select value={form.stage} onChange={e => handle('stage', e.target.value)} className="input-field" required>
                <option value="">Select stage...</option>
                {STAGES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label className="label">Founding Year *</label>
              <input type="number" value={form.founding_year} onChange={e => handle('founding_year', e.target.value)} className="input-field" placeholder="2020" min="1990" max={new Date().getFullYear()} required />
            </div>
            <div>
              <label className="label">Location *</label>
              <select value={form.location} onChange={e => handle('location', e.target.value)} className="input-field" required>
                <option value="">Select city...</option>
                {LOCATIONS.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="label">Website URL</label>
            <input type="url" value={form.website} onChange={e => handle('website', e.target.value)} className="input-field" placeholder="https://yourstartup.com" />
          </div>

          {error && (
            <div style={{ padding: '11px 14px', borderRadius: 9, background: 'rgba(255,56,96,0.08)', border: '1px solid rgba(255,56,96,0.25)', color: '#ff3860', fontSize: 13 }}>
              ❌ {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-success" style={{ justifyContent: 'center', padding: 13, fontSize: 14, fontWeight: 600 }}>
            {loading ? 'Registering...' : '🚀 Register Startup'}
          </button>
        </form>
      </div>

      {/* Info cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 14 }} className="animate-slide-up delay-200">
        {[
          { icon: '📊', title: 'Analytics Engine', desc: 'Health scores & momentum calculated from your data' },
          { icon: '⚡', title: 'Risk Detection', desc: 'Automatic alerts for runway, burn rate, and revenue signals' },
          { icon: '📰', title: 'News Sentiment', desc: 'AI-powered news monitoring for your startup' },
          { icon: '🏆', title: 'Leaderboard', desc: 'Compare performance against other startups' },
        ].map(c => (
          <div key={c.title} className="glass-panel rounded-xl p-4">
            <div style={{ fontSize: 20, marginBottom: 6 }}>{c.icon}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 13, fontWeight: 600, color: '#e2eaf4', marginBottom: 3 }}>{c.title}</div>
            <div style={{ fontSize: 11, color: '#4a6080', lineHeight: 1.5 }}>{c.desc}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
