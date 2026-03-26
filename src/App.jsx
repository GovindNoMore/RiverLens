/**
 * App.jsx — Watershed main app with landing page + map app
 */
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Waves, Search, BarChart2 } from 'lucide-react'
import { useRiverData } from './hooks/useRiverData'
import LandingPage from './components/LandingPage'
import SearchBar from './components/SearchBar'
import RiverMap from './components/RiverMap'
import ReportCard from './components/ReportCard'

function GradePill({ grade, count }) {
  const colors = { A:'#22C55E', B:'#84CC16', C:'#F59E0B', D:'#F97316', F:'#EF4444', '?':'#6b7280' }
  const c = colors[grade] ?? colors['?']
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full" style={{ background: c }} />
      <span className="text-xs" style={{ color: c, fontFamily:'var(--font-mono)', fontWeight:500 }}>{grade}</span>
      <span className="text-xs" style={{ color: 'rgba(245,240,232,0.35)', fontFamily:'var(--font-mono)' }}>{count}</span>
    </div>
  )
}

export default function App() {
  const { rivers, search }       = useRiverData()
  const [view, setView]          = useState('landing') // 'landing' | 'app'
  const [selected, setSelected]  = useState(null)
  const [panelOpen, setPanelOpen] = useState(false)

  const gradeCounts = useMemo(() => {
    const c = { A:0, B:0, C:0, D:0, F:0 }
    rivers.forEach(r => { if (c[r.grade] !== undefined) c[r.grade]++ })
    return c
  }, [rivers])

  function selectRiver(river) {
    setSelected(river)
    setPanelOpen(true)
  }

  function closePanel() {
    setPanelOpen(false)
    setTimeout(() => setSelected(null), 300)
  }

  function enterApp() {
    setView('app')
    window.scrollTo(0, 0)
  }

  /* ── Landing ───────────────────────────── */
  if (view === 'landing') {
    return <LandingPage onEnter={enterApp} />
  }

  /* ── App ────────────────────────────────── */
  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col" style={{ background: 'var(--ink)' }}>

      {/* Top bar */}
      <header className="shrink-0 flex items-center gap-3 px-4 py-2.5 z-20"
        style={{ background: 'var(--deep)', borderBottom: '1px solid var(--border)' }}>

        {/* Logo */}
        <button
          onClick={() => { setView('landing'); setPanelOpen(false) }}
          className="flex items-center gap-2 shrink-0 hover:opacity-80 transition-opacity"
        >
          <div className="w-7 h-7 rounded-full flex items-center justify-center"
            style={{ background: 'rgba(14,165,201,0.15)', border: '1px solid rgba(14,165,201,0.25)' }}>
            <Waves size={13} style={{ color: '#0EA5C9' }} />
          </div>
          <span className="hidden sm:block text-sm font-semibold"
            style={{ fontFamily: 'var(--font-head)', color: 'var(--sand)' }}>
            Watershed
          </span>
        </button>

        {/* Search */}
        <div className="flex-1 max-w-md">
          <SearchBar rivers={rivers} onSelect={selectRiver} />
        </div>

        {/* Grade counts */}
        <div className="hidden lg:flex items-center gap-3 ml-auto shrink-0">
          <BarChart2 size={12} style={{ color: 'var(--hint)' }} />
          {Object.entries(gradeCounts).map(([g, n]) => (
            <GradePill key={g} grade={g} count={n} />
          ))}
        </div>

        {/* Data note */}
        <div className="hidden xl:block shrink-0">
          <span className="pill pill-info" style={{ fontSize: '10px' }}>
            CPCB 2021 data
          </span>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 relative overflow-hidden flex">

        {/* Map */}
        <div className={`flex-1 transition-all duration-500 ${panelOpen ? 'lg:mr-[380px]' : ''}`}>
          <RiverMap rivers={rivers} selected={selected} onSelect={selectRiver} />
        </div>

        {/* Side panel */}
        <AnimatePresence>
          {panelOpen && (
            <motion.aside
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full sm:w-[380px] z-30 overflow-hidden flex flex-col"
              style={{ borderLeft: '1px solid var(--border)', background: 'var(--deep)' }}
            >
              {selected
                ? <ReportCard river={selected} onClose={closePanel} />
                : (
                  <div className="flex-1 flex items-center justify-center p-8 text-center">
                    <p className="text-sm" style={{ color: 'var(--hint)', fontFamily: 'var(--font-body)' }}>
                      Select a river on the map
                    </p>
                  </div>
                )
              }
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Legend overlay — shown when no panel */}
        {!panelOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 z-10 hidden lg:block"
          >
            <div className="glass rounded-2xl p-4 space-y-3" style={{ minWidth: 200 }}>
              <p className="text-xs font-medium tracking-widest uppercase"
                style={{ color: 'var(--hint)', fontFamily: 'var(--font-body)' }}>
                Grade legend
              </p>
              {[
                { g:'A', color:'#22C55E', label:'Clean' },
                { g:'B', color:'#84CC16', label:'Moderate' },
                { g:'C', color:'#F59E0B', label:'Polluted' },
                { g:'D', color:'#F97316', label:'Severely polluted' },
                { g:'F', color:'#EF4444', label:'Critical' },
              ].map(({ g, color, label }) => (
                <div key={g} className="flex items-center gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: color, boxShadow: `0 0 8px ${color}50` }}>
                    {g}
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(245,240,232,0.45)', fontFamily: 'var(--font-body)' }}>{label}</span>
                </div>
              ))}
              <p className="text-xs pt-1" style={{ color: 'var(--hint)', fontFamily: 'var(--font-body)', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
                Click any dot to open report
              </p>
            </div>
          </motion.div>
        )}

        {/* Mobile station count */}
        {!panelOpen && (
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 lg:hidden">
            <div className="glass rounded-full px-4 py-2 flex items-center gap-2">
              <Waves size={12} style={{ color: '#0EA5C9' }} />
              <span className="text-xs" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                {rivers.length} stations · tap a dot to explore
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
