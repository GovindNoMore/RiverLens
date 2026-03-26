import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, CartesianGrid } from 'recharts'

function buildTrend(river) {
  const bod = river.bod_max, doVal = river.do_min
  if (bod == null && doVal == null) return null
  const factor = river.zone === 'Red Zone' ? 1.18 : 0.92
  return [
    { year:'2019', BOD: bod ? +(bod * factor).toFixed(1) : null, DO: doVal ? +(doVal / factor).toFixed(1) : null },
    { year:'2021', BOD: bod, DO: doVal },
  ]
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 text-xs space-y-1" style={{ fontFamily: 'var(--font-body)' }}>
      <p style={{ color: 'var(--hint)' }}>{label}</p>
      {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value} mg/L</p>)}
    </div>
  )
}

export default function TrendChart({ river }) {
  const data = buildTrend(river)
  if (!data) return null
  return (
    <div className="rounded-xl p-4 space-y-3" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-widest" style={{ color: 'var(--hint)', fontFamily: 'var(--font-body)' }}>📈 Trend (2019 → 2021)</span>
        <span className="text-xs" style={{ color: 'var(--hint)', fontFamily: 'var(--font-mono)' }}>Estimated</span>
      </div>
      <ResponsiveContainer width="100%" height={100}>
        <LineChart data={data} margin={{ top:4, right:8, left:-22, bottom:0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="year" tick={{ fill:'rgba(245,240,232,0.35)', fontSize:10, fontFamily:'var(--font-body)' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill:'rgba(245,240,232,0.25)', fontSize:9, fontFamily:'var(--font-mono)' }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={3} stroke="rgba(239,68,68,0.25)" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="BOD" stroke="#F97316" strokeWidth={2} dot={{ fill:'#F97316', r:4, strokeWidth:0 }} activeDot={{ r:5 }} />
          <Line type="monotone" dataKey="DO"  stroke="#0EA5C9" strokeWidth={2} dot={{ fill:'#0EA5C9', r:4, strokeWidth:0 }} activeDot={{ r:5 }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background:'#F97316' }} /><span className="text-xs" style={{ color:'var(--hint)', fontFamily:'var(--font-body)' }}>BOD (lower=better)</span></div>
        <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 rounded" style={{ background:'#0EA5C9' }} /><span className="text-xs" style={{ color:'var(--hint)', fontFamily:'var(--font-body)' }}>DO (higher=better)</span></div>
      </div>
    </div>
  )
}
