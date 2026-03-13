import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { getStartupAnalysis } from '../services/api'
import HealthScoreCard from '../components/HealthScoreCard'
import AlertBanner from '../components/AlertBanner'
import SentimentWidget from '../components/SentimentWidget'
import ReportDownloader from '../components/ReportDownloader'
import {
  RevenueChart,
  UserChart,
  BurnRateChart,
  EmployeeChart,
  RadarChart,
  RevenueHistogram,
  GrowthWaterfallChart,
  MetricsComparisonChart,
  RunwayGaugeChart,
} from '../components/StartupChart'

export default function StartupDetail() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    getStartupAnalysis(id)
      .then(r => setData(r.data))
      .catch(() => setError('Failed to load startup data'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <LoadingState />
  if (error || !data) return (
    <div style={{ paddingTop: 80, textAlign: 'center' }}>
      <div style={{ fontSize: 13, color: '#ff3860' }}>{error || 'Startup not found'}</div>
      <Link to="/" style={{ display: 'inline-block', marginTop: 12, color: '#00d4ff', fontSize: 12 }}>← Back to overview</Link>
    </div>
  )

  const { startup, metrics_history, analytics } = data
  const { health_score, momentum, runway_months, risk_probability, alerts, sentiment, news } = analytics
  const latest = metrics_history[metrics_history.length - 1] || {}

  const TABS = ['overview', 'charts', 'advanced', 'news']

  return (
    <div style={{ paddingTop: 32 }}>
      {/* Header */}
      <div className="animate-slide-up" style={{ marginBottom: 24 }}>
        <Link to="/" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 14 }}>
          ← OVERVIEW
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 38, fontWeight: 800, letterSpacing: '-1.5px', color: '#e2eaf4', lineHeight: 1 }}>{startup.name}</h1>
            <div style={{ display: 'flex', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
              <Tag label={startup.sector} color="#00d4ff" />
              <Tag label={startup.stage} color="#8b5cf6" />
              <Tag label={startup.location} color="#4a6080" />
              {startup.founding_year && <Tag label={`Est. ${startup.founding_year}`} color="#4a6080" />}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'flex-start' }}>
            <ReportDownloader startup={startup} analytics={analytics} metrics={metrics_history} />
            {startup.website && (
              <a href={startup.website} target="_blank" rel="noreferrer" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
                Visit Website ↗
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Quick stats bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 20 }} className="animate-slide-up delay-100">
        {[
          { label: 'Monthly Revenue', value: fmt(latest.monthly_revenue), color: '#00f5ff' },
          { label: 'Monthly Users', value: (latest.monthly_users || 0).toLocaleString('en-IN'), color: '#00ff88' },
          { label: 'Employees', value: latest.employee_count || '—', color: '#9d4edd' },
          { label: 'Burn Rate /mo', value: fmt(latest.burn_rate), color: '#ff3d5a' },
          { label: 'Funding Left', value: fmt(latest.funding_raised), color: '#ffb800' },
        ].map(s => (
          <div key={s.label} className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600, marginBottom: 6 }}>{s.label}</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 18, fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tab navigation */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(13,20,33,0.6)', border: '1px solid rgba(30,45,69,0.6)', borderRadius: 10, padding: 4, width: 'fit-content' }} className="animate-slide-up delay-100">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '6px 18px', borderRadius: 7, fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
            background: activeTab === tab ? 'rgba(0,212,255,0.12)' : 'transparent',
            color: activeTab === tab ? '#00d4ff' : '#4a6080',
            border: activeTab === tab ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
            cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            {tab === 'overview' ? '📊 Overview' : tab === 'charts' ? '📈 Charts' : tab === 'advanced' ? '🕸 Advanced' : '📰 News'}
          </button>
        ))}
      </div>

      {/* ─── OVERVIEW TAB ─── */}
      {activeTab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, marginBottom: 16 }}>
            <div className="animate-slide-up delay-100">
              <HealthScoreCard score={health_score} momentum={momentum} runway={runway_months} riskLevel={risk_probability?.risk_level} />
            </div>
            <div className="glass-panel rounded-2xl p-5 animate-slide-up delay-200">
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Risk Alerts</div>
              <AlertBanner alerts={alerts} />
              {risk_probability && (
                <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid rgba(30,45,69,0.5)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#4a6080', textTransform: 'uppercase', marginBottom: 4 }}>Risk Probability</div>
                      <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 24, fontWeight: 800, color: risk_probability.probability > 0.5 ? '#ff3860' : risk_probability.probability > 0.25 ? '#ffb800' : '#00ff88' }}>
                        {Math.round((risk_probability.probability || 0) * 100)}%
                      </div>
                    </div>
                    <RiskGauge value={risk_probability.probability || 0} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Metrics History Table */}
          <div className="glass-panel rounded-xl p-5 animate-slide-up delay-300">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Metrics History</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(30,45,69,0.6)' }}>
                    {['Month', 'Revenue', 'Users', 'Employees', 'Burn Rate', 'Runway'].map(h => (
                      <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...metrics_history].reverse().slice(0, 8).map((m, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(30,45,69,0.3)' }}>
                      <td style={{ padding: '8px 10px', fontFamily: "'JetBrains Mono',monospace", color: '#8fa3bf' }}>{m.month}</td>
                      <td style={{ padding: '8px 10px', color: '#00d4ff' }}>{fmt(m.monthly_revenue)}</td>
                      <td style={{ padding: '8px 10px', color: '#00ff88' }}>{(m.monthly_users || 0).toLocaleString('en-IN')}</td>
                      <td style={{ padding: '8px 10px', color: '#e2eaf4' }}>{m.employee_count}</td>
                      <td style={{ padding: '8px 10px', color: '#ff3860' }}>{fmt(m.burn_rate)}</td>
                      <td style={{ padding: '8px 10px', color: m.burn_rate > 0 ? (m.funding_raised / m.burn_rate > 12 ? '#00ff88' : m.funding_raised / m.burn_rate > 6 ? '#ffb800' : '#ff3860') : '#4a6080', fontFamily: "'JetBrains Mono',monospace", fontSize: 11 }}>
                        {m.burn_rate > 0 ? `${(m.funding_raised / m.burn_rate).toFixed(1)}mo` : '∞'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* ─── CHARTS TAB ─── */}
      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ChartCard title="Monthly Revenue (₹)">
              <RevenueChart metrics={metrics_history} />
            </ChartCard>
            <ChartCard title="Monthly Active Users">
              <UserChart metrics={metrics_history} />
            </ChartCard>
            <ChartCard title="Burn Rate vs Funding">
              <BurnRateChart metrics={metrics_history} />
            </ChartCard>
            <ChartCard title="Employee Growth">
              <EmployeeChart metrics={metrics_history} />
            </ChartCard>
          </div>

          <ChartCard title="Revenue Monthly Distribution (Green = Growth)">
            <RevenueHistogram metrics={metrics_history} />
          </ChartCard>

          <ChartCard title="Revenue Waterfall — Month-over-Month Δ">
            <GrowthWaterfallChart metrics={metrics_history} />
          </ChartCard>
        </div>
      )}

      {/* ─── ADVANCED TAB ─── */}
      {activeTab === 'advanced' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <ChartCard title={`🕸 Performance Radar — ${startup.name}`}>
              <RadarChart metrics={metrics_history} startupName={startup.name} />
            </ChartCard>
            <ChartCard title="⛽ Runway Gauge (months at current burn)">
              <RunwayGaugeChart funding={latest.funding_raised || 0} burn={latest.burn_rate || 1} />
            </ChartCard>
          </div>
          <ChartCard title="📊 Normalised Metric Comparison (All KPIs, 0–100%)">
            <MetricsComparisonChart metrics={metrics_history} />
          </ChartCard>
        </div>
      )}

      {/* ─── NEWS TAB ─── */}
      {activeTab === 'news' && (
        <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: 16 }}>
          <div className="glass-panel rounded-xl p-5 animate-slide-up">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>Sentiment Summary</div>
            <SentimentWidget sentiment={sentiment} articles={[]} />
          </div>
          <div className="glass-panel rounded-xl p-5 animate-slide-up">
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>News Articles</div>
            <SentimentWidget sentiment={null} articles={news || []} />
          </div>
        </div>
      )}
    </div>
  )
}

// ── helpers ──────────────────────────────────────────────────────────────────

function fmt(n) {
  if (!n && n !== 0) return '—'
  if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`
  if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`
  if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
  return `₹${n?.toFixed(0) || '0'}`
}

function Tag({ label, color }) {
  return (
    <span style={{ padding: '4px 10px', borderRadius: 6, background: `${color}12`, border: `1px solid ${color}30`, fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color, fontWeight: 500 }}>{label}</span>
  )
}

function ChartCard({ title, children }) {
  return (
    <div className="glass-panel rounded-xl p-5 animate-slide-up">
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )
}

function RiskGauge({ value }) {
  const pct = value * 100
  const color = pct > 60 ? '#ff3860' : pct > 30 ? '#ffb800' : '#00ff88'
  const angle = (pct / 100) * 180 - 90
  return (
    <svg width="80" height="50" viewBox="0 0 80 50">
      <path d="M 10 45 A 30 30 0 0 1 70 45" fill="none" stroke="rgba(30,45,69,0.8)" strokeWidth="6" strokeLinecap="round" />
      <path d="M 10 45 A 30 30 0 0 1 70 45" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${pct * 0.942} 100`} style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      <line x1="40" y1="45" x2={40 + 22 * Math.cos((angle * Math.PI) / 180)} y2={45 + 22 * Math.sin((angle * Math.PI) / 180)}
        stroke={color} strokeWidth="2" strokeLinecap="round" />
      <circle cx="40" cy="45" r="4" fill={color} />
    </svg>
  )
}

function LoadingState() {
  return (
    <div style={{ paddingTop: 32 }}>
      <div className="skeleton" style={{ height: 40, width: 200, marginBottom: 20 }} />
      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, marginBottom: 16 }}>
        <div className="skeleton" style={{ height: 180 }} />
        <div className="skeleton" style={{ height: 180 }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {[1, 2, 3, 4].map(i => <div key={i} className="skeleton" style={{ height: 260 }} />)}
      </div>
    </div>
  )
}
