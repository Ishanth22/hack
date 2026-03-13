/**
 * ReportDownloader — generates a detailed PDF report for the startup.
 * Uses the browser's native print-to-PDF pipeline (window.print) with a
 * dedicated stylesheet so no heavy libraries are needed.
 */
export default function ReportDownloader({ startup, analytics, metrics }) {
    const generateReport = () => {
        const { health_score, momentum, runway_months, risk_probability, alerts, sentiment } = analytics
        const latest = metrics[metrics.length - 1] || {}
        const first = metrics[0] || {}

        const revenueGrowth = first.monthly_revenue > 0
            ? (((latest.monthly_revenue - first.monthly_revenue) / first.monthly_revenue) * 100).toFixed(1)
            : 'N/A'
        const userGrowth = first.monthly_users > 0
            ? (((latest.monthly_users - first.monthly_users) / first.monthly_users) * 100).toFixed(1)
            : 'N/A'

        const fmt = (n) => {
            if (!n && n !== 0) return '—'
            if (n >= 1e7) return `₹${(n / 1e7).toFixed(1)}Cr`
            if (n >= 1e5) return `₹${(n / 1e5).toFixed(1)}L`
            if (n >= 1000) return `₹${(n / 1000).toFixed(1)}K`
            return `₹${n.toFixed(0)}`
        }

        const riskColor = risk_probability?.probability > 0.5 ? '#dc2626' : risk_probability?.probability > 0.25 ? '#d97706' : '#16a34a'

        const metricsRows = [...metrics].reverse().slice(0, 12).map(m => `
      <tr>
        <td>${m.month}</td>
        <td>${fmt(m.monthly_revenue)}</td>
        <td>${(m.monthly_users || 0).toLocaleString('en-IN')}</td>
        <td>${m.employee_count || 0}</td>
        <td>${fmt(m.burn_rate)}</td>
        <td>${m.burn_rate > 0 ? (m.funding_raised / m.burn_rate).toFixed(1) + ' mo' : '∞'}</td>
      </tr>
    `).join('')

        const alertRows = (alerts || []).map(a =>
            `<li style="color:#dc2626;margin:4px 0;">⚠ ${a.message || a}</li>`
        ).join('') || '<li style="color:#16a34a;">✓ No major risk alerts detected</li>'

        const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${startup.name} — Performance Report</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #111827; background: #fff; padding: 40px; font-size: 13px; line-height: 1.6; }
    h1 { font-size: 28px; font-weight: 800; color: #0f172a; margin-bottom: 4px; }
    h2 { font-size: 16px; font-weight: 700; color: #0f172a; margin: 24px 0 10px; border-bottom: 2px solid #e5e7eb; padding-bottom: 6px; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; padding-bottom: 20px; border-bottom: 3px solid #0f172a; }
    .logo { font-size: 11px; color: #6b7280; background: #f3f4f6; padding: 4px 10px; border-radius: 4px; border: 1px solid #e5e7eb; }
    .badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; font-weight: 700; margin-right: 6px; }
    .grid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 20px; }
    .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px; }
    .stat-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 16px; }
    .stat-card .label { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 4px; }
    .stat-card .value { font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1; }
    .stat-card .sub { font-size: 10px; color: #9ca3af; margin-top: 3px; }
    table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th { background: #0f172a; color: #fff; padding: 8px 10px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em; }
    td { padding: 7px 10px; border-bottom: 1px solid #f1f5f9; font-size: 12px; }
    tr:nth-child(even) td { background: #f8fafc; }
    ul { padding-left: 0; list-style: none; }
    .info-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .info-item .lbl { font-size: 10px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.06em; }
    .info-item .val { font-size: 13px; font-weight: 600; color: #0f172a; margin-top: 2px; }
    .footer { margin-top: 32px; padding-top: 14px; border-top: 1px solid #e5e7eb; font-size: 10px; color: #9ca3af; text-align: center; }
    @media print { body { padding: 20px; } @page { margin: 10mm; } }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>${startup.name}</h1>
      <div style="margin-top:8px;">
        <span class="badge" style="background:#dbeafe;color:#1d4ed8;">${startup.sector}</span>
        <span class="badge" style="background:#ede9fe;color:#6d28d9;">${startup.stage}</span>
        <span class="badge" style="background:#f1f5f9;color:#475569;">${startup.location}</span>
        ${startup.founding_year ? `<span class="badge" style="background:#f1f5f9;color:#475569;">Est. ${startup.founding_year}</span>` : ''}
      </div>
    </div>
    <div style="text-align:right;">
      <div class="logo">⚡ StartupPulse INDIA</div>
      <div style="font-size:11px;color:#6b7280;margin-top:6px;">Performance Report</div>
      <div style="font-size:10px;color:#9ca3af;">Generated: ${new Date().toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}</div>
    </div>
  </div>

  <h2>Performance Overview</h2>
  <div class="grid4">
    <div class="stat-card">
      <div class="label">Health Score</div>
      <div class="value" style="color:${health_score >= 70 ? '#16a34a' : health_score >= 45 ? '#d97706' : '#dc2626'}">${health_score}</div>
      <div class="sub">/ 100 overall</div>
    </div>
    <div class="stat-card">
      <div class="label">Momentum</div>
      <div class="value" style="color:${momentum >= 0 ? '#16a34a' : '#dc2626'}">${momentum >= 0 ? '+' : ''}${momentum?.toFixed(1)}</div>
      <div class="sub">Growth velocity</div>
    </div>
    <div class="stat-card">
      <div class="label">Runway</div>
      <div class="value" style="color:${(runway_months || 0) > 12 ? '#16a34a' : (runway_months || 0) > 6 ? '#d97706' : '#dc2626'}">${runway_months != null ? runway_months + ' mo' : '—'}</div>
      <div class="sub">At current burn rate</div>
    </div>
    <div class="stat-card">
      <div class="label">Risk Level</div>
      <div class="value" style="font-size:16px;color:${riskColor}">${risk_probability?.risk_level || 'Unknown'}</div>
      <div class="sub">${risk_probability?.probability != null ? Math.round(risk_probability.probability * 100) + '% probability' : ''}</div>
    </div>
  </div>

  <div class="grid2">
    <div class="stat-card">
      <div class="label">Revenue Growth (Period)</div>
      <div class="value" style="color:${parseFloat(revenueGrowth) >= 0 ? '#16a34a' : '#dc2626'}">${revenueGrowth !== 'N/A' ? (parseFloat(revenueGrowth) >= 0 ? '+' : '') + revenueGrowth + '%' : 'N/A'}</div>
      <div class="sub">${fmt(first.monthly_revenue)} → ${fmt(latest.monthly_revenue)}</div>
    </div>
    <div class="stat-card">
      <div class="label">User Growth (Period)</div>
      <div class="value" style="color:${parseFloat(userGrowth) >= 0 ? '#16a34a' : '#dc2626'}">${userGrowth !== 'N/A' ? (parseFloat(userGrowth) >= 0 ? '+' : '') + userGrowth + '%' : 'N/A'}</div>
      <div class="sub">${(first.monthly_users || 0).toLocaleString('en-IN')} → ${(latest.monthly_users || 0).toLocaleString('en-IN')} users</div>
    </div>
  </div>

  <h2>Company Information</h2>
  <div class="info-grid">
    <div class="info-item"><div class="lbl">Startup Name</div><div class="val">${startup.name}</div></div>
    <div class="info-item"><div class="lbl">Sector</div><div class="val">${startup.sector}</div></div>
    <div class="info-item"><div class="lbl">Stage</div><div class="val">${startup.stage}</div></div>
    <div class="info-item"><div class="lbl">Location</div><div class="val">${startup.location}</div></div>
    <div class="info-item"><div class="lbl">Founded</div><div class="val">${startup.founding_year || '—'}</div></div>
    <div class="info-item"><div class="lbl">Website</div><div class="val">${startup.website || '—'}</div></div>
    <div class="info-item"><div class="lbl">Latest Revenue</div><div class="val">${fmt(latest.monthly_revenue)}/mo</div></div>
    <div class="info-item"><div class="lbl">Monthly Users</div><div class="val">${(latest.monthly_users || 0).toLocaleString('en-IN')}</div></div>
    <div class="info-item"><div class="lbl">Team Size</div><div class="val">${latest.employee_count || '—'} employees</div></div>
  </div>

  <h2>Monthly Metrics History</h2>
  <table>
    <thead>
      <tr>
        <th>Month</th><th>Revenue</th><th>Users</th><th>Employees</th><th>Burn Rate</th><th>Runway</th>
      </tr>
    </thead>
    <tbody>${metricsRows}</tbody>
  </table>

  <h2>Risk Alerts</h2>
  <ul>${alertRows}</ul>

  <h2>News Sentiment Analysis</h2>
  <div class="stat-card" style="display:inline-flex;align-items:center;gap:16px;margin-bottom:12px;">
    <div>
      <div class="label">Overall Sentiment</div>
      <div class="value" style="font-size:16px;color:${sentiment?.overall === 'Positive' ? '#16a34a' : sentiment?.overall === 'Negative' ? '#dc2626' : '#6b7280'}">${sentiment?.overall || 'Neutral'}</div>
    </div>
    <div>
      <div class="label">Score</div>
      <div class="value" style="font-size:16px;">${sentiment?.score != null ? Math.round(sentiment.score * 100) + '%' : '—'}</div>
    </div>
    <div>
      <div class="label">Distribution</div>
      <div style="font-size:12px;margin-top:2px;">
        <span style="color:#16a34a">▲ ${sentiment?.positive || 0} Positive</span> &nbsp;
        <span>● ${sentiment?.neutral || 0} Neutral</span> &nbsp;
        <span style="color:#dc2626">▼ ${sentiment?.negative || 0} Negative</span>
      </div>
    </div>
  </div>

  <div class="footer">
    This report was automatically generated by ⚡ StartupPulse India · Data is based on submitted metrics and third-party news sources.
    For investment decisions, please consult a certified financial advisor.
  </div>
</body>
</html>`

        const win = window.open('', '_blank')
        win.document.write(html)
        win.document.close()
        win.focus()
        setTimeout(() => win.print(), 600)
    }

    return (
        <button
            onClick={generateReport}
            id="download-report-btn"
            style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                borderRadius: 8,
                background: 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,255,136,0.08))',
                border: '1px solid rgba(0,245,255,0.3)',
                color: 'var(--neon-cyan)',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'DM Sans, sans-serif',
            }}
            onMouseEnter={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,245,255,0.25), rgba(0,255,136,0.12))'
                e.currentTarget.style.transform = 'translateY(-1px)'
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,245,255,0.2)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,245,255,0.15), rgba(0,255,136,0.08))'
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = 'none'
            }}
        >
            📥 Download Report
        </button>
    )
}
