/**
 * ReportCard.jsx — The main river detail panel
 */
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Database } from 'lucide-react'
import GradeBadge from './GradeBadge'
import ParameterGrid from './ParameterGrid'
import TrendChart from './TrendChart'
import AIInsight from './AIInsight'
import ShareCard from './ShareCard'

export default function ReportCard({ river, onClose }) {
  if (!river) return null

  return (
    <AnimatePresence>
      <motion.div
        key={river.id}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 40 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="h-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3 shrink-0">
          <div className="flex-1 min-w-0 pr-3">
            <h2 className="font-display text-2xl font-bold text-river-sand leading-tight">
              {river.river_name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <MapPin size={11} className="text-river-teal shrink-0" />
              <p className="text-xs text-river-foam/50 font-body truncate">{river.state}</p>
            </div>
            <p className="text-xs text-river-foam/30 font-body mt-0.5 leading-tight line-clamp-2">
              {river.station_name}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2 shrink-0">
            <button
              onClick={onClose}
              className="text-river-foam/20 hover:text-river-sand transition-colors"
            >
              <X size={16} />
            </button>
            <GradeBadge grade={river.grade} size="md" />
          </div>
        </div>

        {/* Grade label */}
        <div className="px-5 pb-3 shrink-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-body font-semibold ${river.gradeMeta?.text ?? 'text-gray-400'}`}>
              {river.gradeMeta?.label ?? 'No data'}
            </span>
            {river.partial && (
              <span className="text-xs text-yellow-500/60 font-mono bg-yellow-500/10 px-2 py-0.5 rounded-full">
                partial data
              </span>
            )}
          </div>
          <p className="text-xs text-river-foam/30 font-body mt-0.5">{river.gradeMeta?.desc}</p>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-5 space-y-4">

          {/* Parameter Grid */}
          <ParameterGrid river={river} />

          {/* Trend Chart */}
          <TrendChart river={river} />

          {/* AI Insight */}
          <AIInsight river={river} />

          {/* Share */}
          <ShareCard river={river} />

          {/* Data Source Footer */}
          <div className="flex items-center gap-2 pt-2">
            <Database size={10} className="text-river-foam/20 shrink-0" />
            <span className="text-xs text-river-foam/20 font-mono">
              CPCB NWMP 2021 · Station {river.station_code}
            </span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
