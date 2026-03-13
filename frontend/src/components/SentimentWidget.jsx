export default function SentimentWidget({ sentiment, articles = [] }) {
  if (!sentiment) return null

  const { overall, score, positive, neutral, negative, total } = sentiment

  const colorMap = { Positive: 'var(--neon-green)', Neutral: 'var(--text-secondary)', Negative: 'var(--neon-red)' }
  const bgMap = { Positive: 'rgba(0,255,136,0.08)', Neutral: 'rgba(255,255,255,0.04)', Negative: 'rgba(255,61,90,0.08)' }

  const pct = total > 0 ? { pos: (positive/total)*100, neu: (neutral/total)*100, neg: (negative/total)*100 } : { pos: 0, neu: 0, neg: 0 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Overall */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 18px', background: bgMap[overall], border: `1px solid ${colorMap[overall]}33`, borderRadius: 10 }}>
        <span style={{ fontSize: 24 }}>
          {overall === 'Positive' ? '📈' : overall === 'Negative' ? '📉' : '📊'}
        </span>
        <div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Overall Sentiment</div>
          <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 20, fontWeight: 700, color: colorMap[overall] }}>{overall}</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 18, fontWeight: 600, color: colorMap[overall] }}>{(score * 100).toFixed(0)}%</div>
        </div>
      </div>

      {/* Bar */}
      <div>
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
          <div style={{ width: `${pct.pos}%`, background: 'var(--neon-green)', transition: 'width 0.8s ease' }} />
          <div style={{ width: `${pct.neu}%`, background: 'rgba(255,255,255,0.2)' }} />
          <div style={{ width: `${pct.neg}%`, background: 'var(--neon-red)' }} />
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 8, fontSize: 11, color: 'var(--text-muted)' }}>
          <span style={{ color: 'var(--neon-green)' }}>▲ {positive} Positive</span>
          <span>● {neutral} Neutral</span>
          <span style={{ color: 'var(--neon-red)' }}>▼ {negative} Negative</span>
        </div>
      </div>

      {/* Articles */}
      {articles.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {articles.slice(0, 3).map((a, i) => (
            <a key={i} href={a.url !== '#' ? a.url : undefined} target="_blank" rel="noreferrer" style={{
              textDecoration: 'none',
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 8,
              cursor: a.url !== '#' ? 'pointer' : 'default',
            }}>
              <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>
                {a.sentiment?.label === 'Positive' ? '🟢' : a.sentiment?.label === 'Negative' ? '🔴' : '⚪'}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, color: 'var(--text-primary)', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{a.title}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 3 }}>{a.source}</div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  )
}
