/**
 * useRiverData.js — loads, enriches, and indexes river data
 */
import { useMemo } from 'react'
import rawRivers from '../data/rivers.json'
import { enrichAll } from '../utils/grading'

export function useRiverData() {
  const rivers = useMemo(() => enrichAll(rawRivers), [])

  // Index by id for O(1) lookup
  const byId = useMemo(() => {
    const map = {}
    rivers.forEach(r => { map[r.id] = r })
    return map
  }, [rivers])

  // Unique river names for search autocomplete
  const riverNames = useMemo(() =>
    [...new Set(rivers.map(r => r.river_name))].sort(),
  [rivers])

  // Search: returns matching rivers by name or state
  function search(query) {
    if (!query || query.trim().length < 1) return []
    const q = query.toLowerCase().trim()
    return rivers.filter(r =>
      r.river_name.toLowerCase().includes(q) ||
      r.state.toLowerCase().includes(q)     ||
      r.station_name.toLowerCase().includes(q)
    ).slice(0, 8)
  }

  return { rivers, byId, riverNames, search }
}
