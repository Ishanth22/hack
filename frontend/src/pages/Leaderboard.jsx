import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLeaderboard } from '../services/api'

const RISK_COLORS = {
  Low: '#00ff88', Medium: '#ffb800', High: '#ff3860', Critical: '#ff3860',
}

export default function Leaderboard() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('health_score')
  const [filterSector, setFilterSector] = useState('All')

  useEffect(() => {
    getLeaderboard().then(r => setData(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const sectors = ['All', ...new Set(data.map(d => d.sector))]
  const filtered = data
    .filter(d => filterSector === 'All' || d.sector === filterSector)
    .sort((a, b) => (b[sortBy] || 0) - (a[sortBy] || 0))

  return (
    <div style={{ paddingTop: 32 }}>
      <div className="animate-slide-up" style={{ marginBottom: 28 }}>
        <h1 style={{ fontFamily: "'Syne',sans-serif", fontSize: 36, fontWeight: 800, letterSpacing: '-1px', color: '#e2eaf4' }}>Leaderboard</h1>
        <p style={{ fontSize: 13, color: '#4a6080', marginTop: 4 }}>All startups ranked by growth analytics</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }} className="animate-slide-up delay-100">
        <div style={{ display: 'flex', gap: 6, background: 'rgba(13,20,33,0.6)', border: '1px solid rgba(30,45,69,0.6)', borderRadius: 10, padding: 4 }}>
          {['health_score', 'momentum'].map(k => (
            <button key={k} onClick={() => setSortBy(k)} style={{
              padding: '5px 14px', borderRadius: 7, fontSize: 11, fontFamily: "'JetBrains Mono',monospace",
              background: sortBy === k ? 'rgba(0,212,255,0.12)' : 'transparent',
              color: sortBy === k ? '#00d4ff' : '#4a6080',
              border: sortBy === k ? '1px solid rgba(0,212,255,0.25)' : '1px solid transparent',
              cursor: 'pointer', transition: 'all 0.2s', textTransform: 'uppercase', letterSpacing: '0.05em'
            }}>{k.replace('_', ' ')}</button>
          ))}
        </div>
        <select value={filterSector} onChange={e => setFilterSector(e.target.value)} className="input-field" style={{ width: 'auto', paddingTop: 8, paddingBottom: 8, fontSize: 12 }}>
          {sectors.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...Array(8)].map((_, i) => <div key={i} className="skeleton" style={{ height: 70 }} />)}
        </div>
      ) : (
        <div className="glass-panel rounded-2xl overflow-hidden animate-slide-up delay-200">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(30,45,69,0.8)' }}>
                {['#', 'Startup', 'Sector', 'Stage', 'Health', 'Momentum', 'Runway', 'Risk', ''].map(h => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: 'left', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ borderBottom: '1px solid rgba(30,45,69,0.4)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,212,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <td style={{ padding: '14px 16px' }}>
                    <RankBadge rank={i + 1} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: 14, fontWeight: 600, color: '#e2eaf4' }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: '#4a6080' }}>{s.location}</div>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: 12, color: '#8fa3bf' }}>{s.sector}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: 4, background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)', fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: '#8b5cf6' }}>{s.stage}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <HealthBar value={s.health_score} />
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: s.momentum >= 0 ? '#00ff88' : '#ff3860', fontWeight: 600 }}>
                      {s.momentum >= 0 ? '+' : ''}{(s.momentum || 0).toFixed(1)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: s.runway_months > 12 ? '#00ff88' : s.runway_months > 6 ? '#ffb800' : '#ff3860' }}>
                      {s.runway_months != null ? `${s.runway_months}mo` : '—'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: 20, background: `${RISK_COLORS[s.risk_level]}18`, border: `1px solid ${RISK_COLORS[s.risk_level]}44`, fontFamily: "'JetBrains Mono',monospace", fontSize: 9, color: RISK_COLORS[s.risk_level], fontWeight: 600 }}>
                      {s.risk_level}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <Link to={`/startup/${s.id}`} style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#00d4ff', textDecoration: 'none' }}>View →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && (
            <div style={{ padding: 40, textAlign: 'center', color: '#4a6080', fontSize: 13 }}>No startups found. <Link to="/register" style={{ color: '#00d4ff' }}>Register one →</Link></div>
          )}
        </div>
      )}
    </div>
  )
}

function RankBadge({ rank }) {
  const gold = rank === 1, silver = rank === 2, bronze = rank === 3
  const style = gold ? { background: 'linear-gradient(135deg,#ffb800,#ff8c00)', color: '#080c14' }
    : silver ? { background: 'linear-gradient(135deg,#8fa3bf,#4a6080)', color: '#080c14' }
    : bronze ? { background: 'linear-gradient(135deg,#cd7f32,#8b5a2b)', color: '#080c14' }
    : { background: 'rgba(30,45,69,0.5)', color: '#4a6080' }
  return <div style={{ ...style, width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Syne',sans-serif", fontSize: 11, fontWeight: 800 }}>{rank}</div>
}

function HealthBar({ value }) {
  const v = value || 0
  const color = v >= 70 ? '#00ff88' : v >= 40 ? '#ffb800' : '#ff3860'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ width: 60, height: 4, borderRadius: 2, background: 'rgba(30,45,69,0.8)' }}>
        <div style={{ width: `${v}%`, height: '100%', borderRadius: 2, background: color, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color, minWidth: 28 }}>{v.toFixed(0)}</span>
    </div>
  )
}
