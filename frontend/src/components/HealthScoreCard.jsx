import { useMemo } from 'react'

function getScoreColor(score) {
  if (score >= 70) return { color: '#00ff88', glow: 'rgba(0,255,136,0.4)' }
  if (score >= 45) return { color: '#ffb800', glow: 'rgba(255,184,0,0.4)' }
  return { color: '#ff3d5a', glow: 'rgba(255,61,90,0.4)' }
}

function getScoreLabel(score) {
  if (score >= 80) return 'Excellent'
  if (score >= 65) return 'Strong'
  if (score >= 50) return 'Moderate'
  if (score >= 30) return 'Weak'
  return 'Critical'
}

export default function HealthScoreCard({ score = 0, momentum = 0, riskLevel = 'Unknown', runway = null }) {
  const { color, glow } = useMemo(() => getScoreColor(score), [score])
  const label = useMemo(() => getScoreLabel(score), [score])

  const circumference = 2 * Math.PI * 54
  const strokeDash = (score / 100) * circumference

  return (
    <div className="glass-card" style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>
        Health Score
      </div>

      {/* Score Ring */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg width="120" height="120" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke={color} strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${circumference}`}
              style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 8px ${glow})` }}
            />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800, color, lineHeight: 1 }}>
              {Math.round(score)}
            </span>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</span>
          </div>
        </div>

        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <div className="metric-label">Momentum</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 700, color: momentum >= 0 ? 'var(--neon-green)' : 'var(--neon-red)' }}>
              {momentum >= 0 ? '+' : ''}{momentum.toFixed(1)}
            </div>
          </div>
          <div>
            <div className="metric-label">Risk Level</div>
            <div>
              <span className={`badge badge-${riskBadge(riskLevel)}`}>
                {riskLevel}
              </span>
            </div>
          </div>
          {runway !== null && (
            <div>
              <div className="metric-label">Runway</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, color: runway < 6 ? 'var(--neon-red)' : runway < 12 ? 'var(--neon-amber)' : 'var(--neon-green)' }}>
                {runway} mo
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function riskBadge(level) {
  const map = { 'Low': 'green', 'Medium': 'amber', 'High': 'red', 'Critical': 'red', 'Unknown': 'gray' }
  return map[level] || 'gray'
}
