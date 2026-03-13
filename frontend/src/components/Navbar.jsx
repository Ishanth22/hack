import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const NAV_LINKS = [
  { to: '/', label: 'Dashboard' },
  { to: '/leaderboard', label: 'Leaderboard' },
  { to: '/submit', label: 'Submit Metrics' },
  { to: '/register', label: 'Register' },
]

export default function Navbar() {
  const location = useLocation()
  const [open, setOpen] = useState(false)

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(5, 6, 10, 0.85)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(0,245,255,0.3), rgba(0,255,136,0.1))',
            border: '1px solid rgba(0,245,255,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>⚡</div>
          <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: '#e8eaf0' }}>
            StartupPulse
          </span>
          <span style={{ fontSize: 10, color: 'var(--neon-cyan)', fontFamily: 'JetBrains Mono, monospace', background: 'rgba(0,245,255,0.1)', padding: '2px 6px', borderRadius: 4, border: '1px solid rgba(0,245,255,0.2)' }}>
            INDIA
          </span>
        </Link>

        {/* Desktop links */}
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {NAV_LINKS.map(link => {
            const active = location.pathname === link.to
            return (
              <Link key={link.to} to={link.to} style={{
                textDecoration: 'none',
                padding: '6px 16px',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 500,
                color: active ? 'var(--neon-cyan)' : 'var(--text-secondary)',
                background: active ? 'rgba(0,245,255,0.08)' : 'transparent',
                border: active ? '1px solid rgba(0,245,255,0.2)' : '1px solid transparent',
                transition: 'all 0.2s',
              }}>
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* Status dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--neon-green)', boxShadow: '0 0 8px rgba(0,255,136,0.6)', animation: 'glowPulse 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'JetBrains Mono, monospace' }}>LIVE</span>
        </div>
      </div>
    </nav>
  )
}
