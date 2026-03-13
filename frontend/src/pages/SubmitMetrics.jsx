import { useState, useEffect } from 'react'
import { submitMetrics, getStartups } from '../services/api'

const FIELD_CONFIG = [
  { name: 'startup_id', label: 'Startup', type: 'select', placeholder: 'Select startup' },
  { name: 'month', label: 'Month', type: 'month', placeholder: 'YYYY-MM' },
  { name: 'monthly_revenue', label: 'Monthly Revenue (₹)', type: 'number', placeholder: '500000' },
  { name: 'monthly_users', label: 'Monthly Active Users', type: 'number', placeholder: '25000' },
  { name: 'employee_count', label: 'Employee Count', type: 'number', placeholder: '120' },
  { name: 'funding_raised', label: 'Total Funding Available (₹)', type: 'number', placeholder: '10000000' },
  { name: 'burn_rate', label: 'Monthly Burn Rate (₹)', type: 'number', placeholder: '500000' },
]

export default function SubmitMetrics() {
  const [form, setForm] = useState({ startup_id: '', month: '', monthly_revenue: '', monthly_users: '', employee_count: '', funding_raised: '', burn_rate: '' })
  const [startups, setStartups] = useState([])
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getStartups().then(r => setStartups(r.data)).catch(() => { })
  }, [])

  const handle = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      const payload = {
        ...form,
        monthly_revenue: parseFloat(form.monthly_revenue),
        monthly_users: parseInt(form.monthly_users),
        employee_count: parseInt(form.employee_count),
        funding_raised: parseFloat(form.funding_raised),
        burn_rate: parseFloat(form.burn_rate),
      }
      await submitMetrics(payload)
      setStatus({ type: 'success', msg: 'Metrics submitted successfully! Dashboard will update.' })
      setForm(f => ({ ...f, monthly_revenue: '', monthly_users: '', employee_count: '', funding_raised: '', burn_rate: '' }))
    } catch (err) {
      setStatus({ type: 'error', msg: err.response?.data?.detail || 'Submission failed. Please check your inputs.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ paddingTop: 32, maxWidth: 640, margin: '0 auto' }}>
      <div className="animate-slide-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 34, fontWeight: 800, letterSpacing: '-1px', color: '#e2eaf4' }}>Submit Metrics</h1>
        <p style={{ fontSize: 13, color: '#4a6080', marginTop: 6 }}>Report monthly performance data for analytics and health scoring</p>
      </div>

      <div className="glass-panel rounded-2xl p-7 animate-slide-up delay-100">
        {/* Runway preview */}
        {form.funding_raised && form.burn_rate && (
          <RunwayPreview funding={form.funding_raised} burn={form.burn_rate} />
        )}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Startup select */}
          <div>
            <label className="label">Startup</label>
            <select value={form.startup_id} onChange={e => handle('startup_id', e.target.value)} className="input-field" required>
              <option value="">Select a startup...</option>
              {startups.map(s => <option key={s.id} value={s.id}>{s.name} — {s.sector}</option>)}
            </select>
          </div>

          {/* Month */}
          <div>
            <label className="label">Report Month</label>
            <input type="month" value={form.month} onChange={e => handle('month', e.target.value)} className="input-field" required style={{ colorScheme: 'dark' }} />
          </div>

          <div style={{ height: 1, background: 'rgba(30,45,69,0.5)', margin: '2px 0' }} />

          {/* 2-col grid for metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { name: 'monthly_revenue', label: 'Monthly Revenue', prefix: '₹', placeholder: '500000' },
              { name: 'monthly_users', label: 'Monthly Users', placeholder: '25000' },
              { name: 'employee_count', label: 'Employee Count', placeholder: '120' },
              { name: 'funding_raised', label: 'Funding Available', prefix: '₹', placeholder: '10000000' },
            ].map(f => (
              <div key={f.name}>
                <label className="label">{f.label}</label>
                <div style={{ position: 'relative' }}>
                  {f.prefix && <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', fontSize: 13 }}>{f.prefix}</span>}
                  <input type="number" min="0" step="any" value={form[f.name]} onChange={e => handle(f.name, e.target.value)} className="input-field" style={{ paddingLeft: f.prefix ? 24 : 16 }} placeholder={f.placeholder} required />
                </div>
              </div>
            ))}
          </div>

          {/* Burn rate - full width */}
          <div>
            <label className="label">Monthly Burn Rate</label>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#4a6080', fontSize: 13 }}>₹</span>
              <input type="number" min="0" step="any" value={form.burn_rate} onChange={e => handle('burn_rate', e.target.value)} className="input-field" style={{ paddingLeft: 24 }} placeholder="500000" required />
            </div>
            <p style={{ fontSize: 11, color: '#4a6080', marginTop: 4 }}>Monthly cash spent on operations</p>
          </div>

          {status && (
            <div style={{ padding: '12px 16px', borderRadius: 10, background: status.type === 'success' ? 'rgba(0,255,136,0.08)' : 'rgba(255,56,96,0.08)', border: `1px solid ${status.type === 'success' ? 'rgba(0,255,136,0.25)' : 'rgba(255,56,96,0.25)'}`, color: status.type === 'success' ? '#00ff88' : '#ff3860', fontSize: 13 }}>
              {status.type === 'success' ? '✅' : '❌'} {status.msg}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-success" style={{ justifyContent: 'center', padding: '13px', fontSize: 14, fontWeight: 600 }}>
            {loading ? 'Submitting...' : '+ Submit Monthly Metrics'}
          </button>
        </form>
      </div>

      {/* Tips */}
      <div className="glass-panel rounded-xl p-5 mt-4 animate-slide-up delay-200">
        <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>📊 Analytics Notes</div>
        <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
          {[
            'Health score is computed from revenue growth, user growth, employee growth, and runway',
            'Runway = Funding Available ÷ Monthly Burn Rate',
            'Risk alerts are triggered at runway < 6 months, burn increase > 50%, or revenue decline > 30%',
            'Submit data monthly for accurate momentum tracking',
          ].map((tip, i) => (
            <li key={i} style={{ display: 'flex', gap: 8, fontSize: 12, color: '#8fa3bf' }}>
              <span style={{ color: '#00d4ff', flexShrink: 0 }}>→</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function RunwayPreview({ funding, burn }) {
  const runway = burn > 0 ? (parseFloat(funding) / parseFloat(burn)).toFixed(1) : null
  const color = runway > 12 ? '#00ff88' : runway > 6 ? '#ffb800' : '#ff3860'
  return (
    <div style={{ marginBottom: 20, padding: '12px 16px', borderRadius: 10, background: `${color}0c`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color }}>{runway}</div>
      <div>
        <div style={{ fontSize: 12, color, fontWeight: 600 }}>months runway</div>
        <div style={{ fontSize: 11, color: '#4a6080' }}>Based on current funding / burn rate</div>
      </div>
    </div>
  )
}
