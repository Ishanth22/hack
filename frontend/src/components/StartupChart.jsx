import Plot from 'react-plotly.js'

const LAYOUT_BASE = {
  paper_bgcolor: 'transparent',
  plot_bgcolor: 'transparent',
  font: { family: 'DM Sans, sans-serif', color: '#8892a4', size: 12 },
  margin: { t: 10, r: 10, b: 40, l: 60 },
  xaxis: {
    gridcolor: 'rgba(255,255,255,0.04)',
    linecolor: 'rgba(255,255,255,0.06)',
    tickfont: { size: 11, color: '#4a5568' },
    tickangle: -30,
  },
  yaxis: {
    gridcolor: 'rgba(255,255,255,0.04)',
    linecolor: 'rgba(255,255,255,0.06)',
    tickfont: { size: 11, color: '#4a5568' },
    zeroline: false,
  },
  showlegend: false,
  hoverlabel: {
    bgcolor: '#0e1420',
    bordercolor: 'rgba(0,245,255,0.3)',
    font: { family: 'DM Sans, sans-serif', color: '#e8eaf0' },
  },
}

const CONFIG = { displayModeBar: false, responsive: true }

export function RevenueChart({ metrics }) {
  const months = metrics.map(m => m.month)
  const values = metrics.map(m => m.monthly_revenue)

  const trace = {
    x: months,
    y: values,
    type: 'scatter',
    mode: 'lines+markers',
    fill: 'tozeroy',
    fillcolor: 'rgba(0,245,255,0.06)',
    line: { color: '#00f5ff', width: 2, shape: 'spline' },
    marker: { color: '#00f5ff', size: 5, line: { color: 'rgba(0,245,255,0.4)', width: 2 } },
    hovertemplate: '<b>%{x}</b><br>₹%{y:,.0f}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{ ...LAYOUT_BASE, yaxis: { ...LAYOUT_BASE.yaxis, tickprefix: '₹', tickformat: ',.0s' }, height: 200 }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function UserChart({ metrics }) {
  const months = metrics.map(m => m.month)
  const values = metrics.map(m => m.monthly_users)

  const trace = {
    x: months,
    y: values,
    type: 'scatter',
    mode: 'lines+markers',
    fill: 'tozeroy',
    fillcolor: 'rgba(0,255,136,0.06)',
    line: { color: '#00ff88', width: 2, shape: 'spline' },
    marker: { color: '#00ff88', size: 5 },
    hovertemplate: '<b>%{x}</b><br>%{y:,.0f} users<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{ ...LAYOUT_BASE, height: 200 }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function BurnRateChart({ metrics }) {
  const months = metrics.map(m => m.month)
  const burn = metrics.map(m => m.burn_rate)
  const funding = metrics.map(m => m.funding_raised)

  const traceBurn = {
    x: months, y: burn,
    type: 'bar',
    name: 'Burn Rate',
    marker: { color: 'rgba(255,61,90,0.7)', line: { color: 'rgba(255,61,90,0.4)', width: 1 } },
    hovertemplate: '<b>%{x}</b><br>Burn: ₹%{y:,.0s}<extra></extra>',
  }

  const traceFunding = {
    x: months, y: funding,
    type: 'scatter', mode: 'lines',
    name: 'Funding Left',
    line: { color: '#ffb800', width: 2, dash: 'dot' },
    yaxis: 'y2',
    hovertemplate: '<b>%{x}</b><br>Funding: ₹%{y:,.0s}<extra></extra>',
  }

  return (
    <Plot
      data={[traceBurn, traceFunding]}
      layout={{
        ...LAYOUT_BASE,
        height: 200,
        showlegend: true,
        legend: { font: { size: 11, color: '#8892a4' }, bgcolor: 'transparent', x: 0, y: 1 },
        yaxis: { ...LAYOUT_BASE.yaxis, tickprefix: '₹', tickformat: '.2s' },
        yaxis2: { overlaying: 'y', side: 'right', gridcolor: 'transparent', linecolor: 'transparent', tickprefix: '₹', tickformat: '.2s', tickfont: { size: 11, color: '#ffb800' } },
        barmode: 'group',
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function EmployeeChart({ metrics }) {
  const months = metrics.map(m => m.month)
  const values = metrics.map(m => m.employee_count)

  const trace = {
    x: months,
    y: values,
    type: 'scatter',
    mode: 'lines+markers',
    fill: 'tozeroy',
    fillcolor: 'rgba(157,78,221,0.06)',
    line: { color: '#9d4edd', width: 2, shape: 'spline' },
    marker: { color: '#9d4edd', size: 5 },
    hovertemplate: '<b>%{x}</b><br>%{y} employees<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{ ...LAYOUT_BASE, height: 200 }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function MomentumScatterChart({ leaderboard }) {
  const names = leaderboard.map(s => s.name)
  const health = leaderboard.map(s => s.health_score)
  const momentum = leaderboard.map(s => s.momentum)
  const risk = leaderboard.map(s => s.risk_level)

  const colorMap = { Low: '#00ff88', Medium: '#ffb800', High: '#ff3d5a', Critical: '#ff0000' }
  const colors = risk.map(r => colorMap[r] || '#8892a4')

  const trace = {
    x: health, y: momentum,
    mode: 'markers+text',
    type: 'scatter',
    text: names,
    textposition: 'top center',
    textfont: { size: 10, color: '#8892a4' },
    marker: {
      size: 12,
      color: colors,
      line: { color: 'rgba(255,255,255,0.2)', width: 1 },
      opacity: 0.85,
    },
    hovertemplate: '<b>%{text}</b><br>Health: %{x:.1f}<br>Momentum: %{y:.1f}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        ...LAYOUT_BASE,
        height: 320,
        xaxis: { ...LAYOUT_BASE.xaxis, title: { text: 'Health Score', font: { size: 12, color: '#4a5568' } }, tickangle: 0 },
        yaxis: { ...LAYOUT_BASE.yaxis, title: { text: 'Momentum', font: { size: 12, color: '#4a5568' } } },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function SectorChart({ distribution }) {
  const sectors = Object.keys(distribution)
  const counts = Object.values(distribution)
  const colors = ['#00f5ff', '#00ff88', '#ffb800', '#9d4edd', '#ff3d5a', '#00bcd4', '#ff6b35', '#4caf50']

  const trace = {
    labels: sectors,
    values: counts,
    type: 'pie',
    hole: 0.6,
    marker: { colors: colors.slice(0, sectors.length), line: { color: '#05060a', width: 2 } },
    textfont: { size: 11, color: '#8892a4' },
    hovertemplate: '<b>%{label}</b><br>%{value} startups<br>%{percent}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        ...LAYOUT_BASE,
        height: 280,
        margin: { t: 10, r: 10, b: 10, l: 10 },
        showlegend: true,
        legend: { font: { size: 11, color: '#8892a4' }, bgcolor: 'transparent', orientation: 'v', x: 1, xanchor: 'left' },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

// ─── NEW ADVANCED CHARTS ─────────────────────────────────────────────────────

export function RadarChart({ metrics, startupName }) {
  if (!metrics || !metrics.length) return null
  const latest = metrics[metrics.length - 1]
  const prev = metrics.length > 1 ? metrics[metrics.length - 2] : null

  const revenueGrowth = prev && prev.monthly_revenue > 0
    ? Math.min(100, Math.max(0, ((latest.monthly_revenue - prev.monthly_revenue) / prev.monthly_revenue) * 100 + 50))
    : 50

  const userGrowth = prev && prev.monthly_users > 0
    ? Math.min(100, Math.max(0, ((latest.monthly_users - prev.monthly_users) / prev.monthly_users) * 100 + 50))
    : 50

  const runway = latest.burn_rate > 0 ? Math.min(100, (latest.funding_raised / latest.burn_rate / 24) * 100) : 100
  const burnEfficiency = latest.monthly_revenue > 0 ? Math.min(100, (latest.monthly_revenue / latest.burn_rate) * 50) : 20
  const teamGrowth = prev && prev.employee_count > 0
    ? Math.min(100, Math.max(0, ((latest.employee_count - prev.employee_count) / prev.employee_count) * 100 + 50))
    : 50
  const capitalEfficiency = Math.min(100, burnEfficiency * 0.9)

  const categories = ['Revenue Growth', 'User Growth', 'Runway', 'Burn Efficiency', 'Team Growth', 'Capital Eff.']
  const values = [revenueGrowth, userGrowth, runway, burnEfficiency, teamGrowth, capitalEfficiency]

  const trace = {
    type: 'scatterpolar',
    r: [...values, values[0]],
    theta: [...categories, categories[0]],
    fill: 'toself',
    fillcolor: 'rgba(0,245,255,0.08)',
    line: { color: '#00f5ff', width: 2 },
    marker: { color: '#00f5ff', size: 6 },
    name: startupName || 'Current',
    hovertemplate: '<b>%{theta}</b><br>Score: %{r:.1f}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        height: 300,
        margin: { t: 20, r: 40, b: 20, l: 40 },
        polar: {
          bgcolor: 'transparent',
          radialaxis: {
            range: [0, 100],
            gridcolor: 'rgba(255,255,255,0.06)',
            linecolor: 'rgba(255,255,255,0.06)',
            tickfont: { size: 9, color: '#4a5568' },
            tickvals: [25, 50, 75, 100],
          },
          angularaxis: {
            gridcolor: 'rgba(255,255,255,0.06)',
            linecolor: 'rgba(255,255,255,0.06)',
            tickfont: { size: 10, color: '#8892a4' },
          },
        },
        showlegend: false,
        hoverlabel: {
          bgcolor: '#0e1420',
          bordercolor: 'rgba(0,245,255,0.3)',
          font: { family: 'DM Sans, sans-serif', color: '#e8eaf0' },
        },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function RevenueHistogram({ metrics }) {
  if (!metrics || !metrics.length) return null

  // Monthly revenue growth % histogram
  const growthRates = []
  for (let i = 1; i < metrics.length; i++) {
    if (metrics[i - 1].monthly_revenue > 0) {
      const rate = ((metrics[i].monthly_revenue - metrics[i - 1].monthly_revenue) / metrics[i - 1].monthly_revenue) * 100
      growthRates.push(parseFloat(rate.toFixed(1)))
    }
  }

  const months = metrics.map(m => m.month)
  const revenues = metrics.map(m => m.monthly_revenue)

  const trace = {
    x: months,
    y: revenues,
    type: 'bar',
    marker: {
      color: revenues.map((v, i) => {
        const prev = i > 0 ? revenues[i - 1] : v
        return v >= prev ? 'rgba(0,255,136,0.7)' : 'rgba(255,61,90,0.7)'
      }),
      line: { color: 'rgba(255,255,255,0.1)', width: 1 },
    },
    hovertemplate: '<b>%{x}</b><br>Revenue: ₹%{y:,.0f}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        ...LAYOUT_BASE,
        height: 220,
        yaxis: { ...LAYOUT_BASE.yaxis, tickprefix: '₹', tickformat: '.2s' },
        bargap: 0.15,
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function GrowthWaterfallChart({ metrics }) {
  if (!metrics || metrics.length < 2) return null

  const months = metrics.map(m => m.month)
  const revenues = metrics.map(m => m.monthly_revenue)
  const base = revenues[0]
  const measures = ['absolute', ...revenues.slice(1).map((v, i) => v >= revenues[i] ? 'relative' : 'relative'),]
  const values = [base, ...revenues.slice(1).map((v, i) => v - revenues[i])]

  const trace = {
    type: 'waterfall',
    x: months,
    y: values,
    measure: ['absolute', ...revenues.slice(1).map((v, i) => 'relative')],
    increasing: { marker: { color: 'rgba(0,255,136,0.7)', line: { color: '#00ff88', width: 1 } } },
    decreasing: { marker: { color: 'rgba(255,61,90,0.7)', line: { color: '#ff3d5a', width: 1 } } },
    totals: { marker: { color: 'rgba(0,245,255,0.7)', line: { color: '#00f5ff', width: 1 } } },
    connector: { line: { color: 'rgba(255,255,255,0.1)' } },
    hovertemplate: '<b>%{x}</b><br>Δ Revenue: ₹%{y:,.0f}<extra></extra>',
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        ...LAYOUT_BASE,
        height: 220,
        yaxis: { ...LAYOUT_BASE.yaxis, tickprefix: '₹', tickformat: '.2s' },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function MetricsComparisonChart({ metrics }) {
  if (!metrics || !metrics.length) return null
  const months = metrics.map(m => m.month)

  // Normalize to 0–100 for comparison
  const normalize = arr => {
    const max = Math.max(...arr, 1)
    return arr.map(v => (v / max) * 100)
  }

  const normRevenue = normalize(metrics.map(m => m.monthly_revenue))
  const normUsers = normalize(metrics.map(m => m.monthly_users))
  const normBurn = normalize(metrics.map(m => m.burn_rate))
  const normEmployees = normalize(metrics.map(m => m.employee_count))

  const traces = [
    { name: 'Revenue', y: normRevenue, color: '#00f5ff' },
    { name: 'Users', y: normUsers, color: '#00ff88' },
    { name: 'Burn Rate', y: normBurn, color: '#ff3d5a' },
    { name: 'Employees', y: normEmployees, color: '#9d4edd' },
  ].map(t => ({
    x: months, y: t.y,
    mode: 'lines',
    type: 'scatter',
    name: t.name,
    line: { color: t.color, width: 2, shape: 'spline' },
    hovertemplate: `<b>${t.name}</b> %{x}<br>Relative: %{y:.1f}%<extra></extra>`,
  }))

  return (
    <Plot
      data={traces}
      layout={{
        ...LAYOUT_BASE,
        height: 240,
        showlegend: true,
        legend: { font: { size: 11, color: '#8892a4' }, bgcolor: 'transparent', x: 0, y: 1, orientation: 'h' },
        yaxis: { ...LAYOUT_BASE.yaxis, ticksuffix: '%' },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export function RunwayGaugeChart({ funding, burn }) {
  const runway = burn > 0 ? Math.min(24, funding / burn) : 24
  const pct = (runway / 24) * 100
  const color = runway > 12 ? '#00ff88' : runway > 6 ? '#ffb800' : '#ff3d5a'

  const trace = {
    type: 'indicator',
    mode: 'gauge+number+delta',
    value: parseFloat(runway.toFixed(1)),
    number: { suffix: ' mo', font: { color: color, family: 'Syne, sans-serif', size: 28 } },
    gauge: {
      axis: { range: [0, 24], tickcolor: '#4a5568', tickfont: { size: 10, color: '#4a5568' } },
      bar: { color: color, thickness: 0.7 },
      bgcolor: 'transparent',
      borderwidth: 0,
      steps: [
        { range: [0, 6], color: 'rgba(255,61,90,0.08)' },
        { range: [6, 12], color: 'rgba(255,184,0,0.08)' },
        { range: [12, 24], color: 'rgba(0,255,136,0.08)' },
      ],
      threshold: {
        line: { color: color, width: 3 },
        thickness: 0.75,
        value: runway,
      },
    },
  }

  return (
    <Plot
      data={[trace]}
      layout={{
        paper_bgcolor: 'transparent',
        plot_bgcolor: 'transparent',
        height: 200,
        margin: { t: 20, r: 20, b: 20, l: 20 },
        font: { family: 'DM Sans, sans-serif', color: '#8892a4' },
      }}
      config={CONFIG}
      style={{ width: '100%' }}
    />
  )
}

export default function StartupChart({ metrics, type, title }) {
  let ChartComponent
  switch (type) {
    case 'revenue': ChartComponent = RevenueChart; break
    case 'users': ChartComponent = UserChart; break
    case 'burn': ChartComponent = BurnRateChart; break
    case 'employees': ChartComponent = EmployeeChart; break
    default: return null
  }

  return (
    <div className="glass-panel rounded-xl p-5">
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: '#4a6080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
        {title}
      </div>
      <ChartComponent metrics={metrics} />
    </div>
  )
}
