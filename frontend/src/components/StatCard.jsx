export default function StatCard({ label, value, sub, color = '#00D4FF', icon, trend }) {
  const trendPositive = trend > 0
  return (
    <div className="rounded-xl p-5 card-hover" style={{
      background: 'linear-gradient(135deg, rgba(22,29,46,0.8) 0%, rgba(13,18,32,0.8) 100%)',
      border: '1px solid rgba(30,42,66,0.7)',
    }}>
      <div className="flex items-start justify-between mb-3">
        <span style={{ color: '#4A5C80', fontSize: 11, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
        {icon && <span style={{ fontSize: 18, opacity: 0.7 }}>{icon}</span>}
      </div>
      <div style={{ color, fontSize: 26, fontWeight: 800, fontFamily: 'Syne, sans-serif', lineHeight: 1, marginBottom: 6 }}>
        {value}
      </div>
      <div className="flex items-center gap-2">
        {sub && <span style={{ color: '#8A9CC4', fontSize: 12 }}>{sub}</span>}
        {trend !== undefined && (
          <span style={{ color: trendPositive ? '#00F5A0' : '#FF3D71', fontSize: 11, fontWeight: 600 }}>
            {trendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  )
}
