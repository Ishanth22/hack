import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getOverview, getLeaderboard } from '../services/api.js'
import { MomentumScatterChart, SectorChart } from '../components/StartupChart.jsx'

function StatCard({ label, value, sub, color = 'var(--neon-cyan)', delay = 0 }) {
  return (
    <div className="glass-card" style={{ padding: 24, animation: `slideUp 0.5s ease-out ${delay}s both` }}>
      <div className="metric-label">{label}</div>
      <div className="metric-value" style={{ color }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

export default function Home() {
  const [overview, setOverview] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getOverview(), getLeaderboard()])
      .then(([ov, lb]) => {
        setOverview(ov.data)
        setLeaderboard(lb.data)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ paddingBottom: 60, maxWidth: 1280, margin: '0 auto', padding: '32px 24px 60px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 60, paddingTop: 20 }}>
        <div className="badge badge-cyan" style={{ marginBottom: 16, animation: 'fadeIn 0.6s ease-out' }}>
          ⚡ India Startup Intelligence Platform
        </div>
        <h1 style={{ fontFamily: 'Syne, sans-serif', fontSize: 'clamp(36px, 6vw, 72px)', fontWeight: 800, lineHeight: 1.1, color: '#e8eaf0', marginBottom: 16, animation: 'slideUp 0.6s ease-out 0.1s both' }}>
          Monitor. Analyze.<br />
          <span style={{ color: 'var(--neon-cyan)', textShadow: '0 0 40px rgba(0,245,255,0.4)' }}>Predict Risk.</span>
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 560, margin: '0 auto 28px', animation: 'slideUp 0.6s ease-out 0.2s both' }}>
          Real-time health scoring, momentum tracking, and risk detection for India's fastest-growing startups.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          <Link to="/register" className="btn-primary" style={{ textDecoration: 'none' }}>Register Startup</Link>
          <Link to="/leaderboard" style={{ textDecoration: 'none', padding: '10px 24px', borderRadius: 8, fontSize: 14, color: 'var(--text-secondary)', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.2s' }}>View Leaderboard →</Link>
        </div>
      </div>

      {/* Stats */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          {[...Array(4)].map((_, i) => <div key={i} className="skeleton" style={{ height: 96 }} />)}
        </div>
      ) : overview && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
          <StatCard label="Startups Monitored" value={overview.total_startups} sub="Active on platform" color="var(--neon-cyan)" delay={0} />
          <StatCard label="Avg Health Score" value={`${overview.avg_health_score}`} sub="Out of 100" color="var(--neon-green)" delay={0.1} />
          <StatCard label="Avg Momentum" value={`${overview.avg_momentum > 0 ? '+' : ''}${overview.avg_momentum}`} sub="Growth velocity" color="var(--neon-amber)" delay={0.2} />
          <StatCard label="Sectors Tracked" value={Object.keys(overview.sector_distribution || {}).length} sub="Industries" color="var(--neon-purple)" delay={0.3} />
        </div>
      )}

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>
        {/* Scatter */}
        <div className="glass-card" style={{ padding: 24, animation: 'fadeIn 0.8s ease-out 0.4s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>Momentum vs Health</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>All startups positioned by performance</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['🟢 Low', '🟡 Med', '🔴 High'].map(r => <span key={r} style={{ fontSize: 10, color: 'var(--text-muted)' }}>{r}</span>)}
            </div>
          </div>
          {leaderboard.length > 0 ? <MomentumScatterChart leaderboard={leaderboard} /> : <div className="skeleton" style={{ height: 280 }} />}
        </div>

        {/* Sector */}
        <div className="glass-card" style={{ padding: 24, animation: 'fadeIn 0.8s ease-out 0.5s both' }}>
          <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 4 }}>Sector Distribution</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>Startups by industry vertical</div>
          {overview?.sector_distribution ? <SectorChart distribution={overview.sector_distribution} /> : <div className="skeleton" style={{ height: 240 }} />}
        </div>
      </div>

      {/* Top startups quick list */}
      {leaderboard.length > 0 && (
        <div className="glass-card" style={{ padding: 24, animation: 'fadeIn 0.8s ease-out 0.6s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>Top Performers</div>
            <Link to="/leaderboard" style={{ fontSize: 12, color: 'var(--neon-cyan)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 12 }}>
            {leaderboard.slice(0, 6).map((s, i) => (
              <Link key={s.id} to={`/startup/${s.id}`} style={{ textDecoration: 'none' }}>
                <div style={{
                  padding: '14px 16px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)',
                  transition: 'all 0.2s', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: 12,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(0,245,255,0.2)'; e.currentTarget.style.background = 'rgba(0,245,255,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(0,245,255,0.1)', border: '1px solid rgba(0,245,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11, color: 'var(--neon-cyan)', flexShrink: 0 }}>
                    #{i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.sector}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, color: getScoreColor(s.health_score) }}>{s.health_score}</div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>score</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function getScoreColor(score) {
  if (score >= 70) return 'var(--neon-green)'
  if (score >= 45) return 'var(--neon-amber)'
  return 'var(--neon-red)'
}
