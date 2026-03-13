export default function AlertBanner({ alerts = [] }) {
  if (!alerts || alerts.length === 0) return null

  const levelConfig = {
    CRITICAL: { color: 'var(--neon-red)', bg: 'rgba(255,61,90,0.08)', border: 'rgba(255,61,90,0.3)', icon: '🚨' },
    HIGH: { color: 'var(--neon-red)', bg: 'rgba(255,61,90,0.06)', border: 'rgba(255,61,90,0.2)', icon: '⚠️' },
    WARNING: { color: 'var(--neon-amber)', bg: 'rgba(255,184,0,0.06)', border: 'rgba(255,184,0,0.2)', icon: '⚡' },
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
        Risk Alerts
      </div>
      {alerts.map((alert, i) => {
        const cfg = levelConfig[alert.level] || levelConfig['WARNING']
        return (
          <div key={i} style={{
            background: cfg.bg,
            border: `1px solid ${cfg.border}`,
            borderRadius: 10,
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            animation: `slideUp 0.4s ease-out ${i * 0.08}s both`,
          }}>
            <span style={{ fontSize: 16, flexShrink: 0 }}>{cfg.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: cfg.color, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 2 }}>
                {alert.level}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                {alert.message}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
