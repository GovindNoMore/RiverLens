/**
 * RiverMap.jsx — Leaflet map locked to India bounds with river polylines
 */
import { useEffect, useRef } from 'react'

const INDIA_CENTER = [22.5, 82.0]
const GRADE_COLORS = { A:'#22C55E', B:'#84CC16', C:'#F59E0B', D:'#F97316', F:'#EF4444', '?':'#6b7280' }

const RIVER_PATHS = [
  { name:'Ganga',       color:'#60a5fa', coords:[[30.1,78.8],[27.9,79.9],[26.5,80.3],[25.5,81.9],[25.3,83.0],[25.0,85.1],[24.8,87.9],[22.6,88.4]] },
  { name:'Yamuna',      color:'#93c5fd', coords:[[30.8,78.4],[28.6,77.2],[27.6,77.7],[26.8,78.0],[25.4,81.9]] },
  { name:'Brahmaputra', color:'#7dd3fc', coords:[[27.5,92.0],[26.3,92.8],[26.1,91.7],[26.2,90.0],[26.4,89.4],[25.9,89.8]] },
  { name:'Godavari',    color:'#6ee7b7', coords:[[19.9,73.8],[19.1,76.5],[18.8,79.5],[17.4,81.7],[16.9,82.3]] },
  { name:'Krishna',     color:'#86efac', coords:[[17.9,73.6],[16.5,75.7],[16.2,77.5],[16.5,79.3],[15.7,80.3]] },
  { name:'Cauvery',     color:'#a7f3d0', coords:[[12.3,75.8],[12.0,76.7],[11.5,77.9],[11.2,79.2],[11.0,79.8]] },
  { name:'Narmada',     color:'#67e8f9', coords:[[22.7,73.7],[22.8,75.0],[22.7,76.8],[22.6,78.0],[23.0,79.8],[22.8,81.6]] },
  { name:'Sabarmati',   color:'#38bdf8', coords:[[24.2,72.8],[23.6,72.7],[23.0,72.6],[22.3,72.6]] },
  { name:'Mahanadi',    color:'#a5f3fc', coords:[[21.5,83.9],[20.3,84.9],[20.1,85.8],[20.4,86.7]] },
  { name:'Chambal',     color:'#bae6fd', coords:[[24.9,75.6],[25.5,77.0],[26.6,78.7],[26.8,79.3]] },
  { name:'Tapti',       color:'#67e8f9', coords:[[21.8,74.2],[21.2,73.8],[21.1,72.8],[21.1,72.6]] },
  { name:'Sutlej',      color:'#a5b4fc', coords:[[32.5,76.5],[31.8,75.5],[31.0,74.5],[30.5,73.8]] },
  { name:'Beas',        color:'#c4b5fd', coords:[[32.1,77.2],[31.5,76.4],[31.0,75.6],[30.8,75.2]] },
]

export default function RiverMap({ rivers = [], selected, onSelect }) {
  const mapRef     = useRef(null)
  const leafletRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (leafletRef.current) return
    import('leaflet').then(L => {
      const map = L.map(mapRef.current, {
        center: INDIA_CENTER,
        zoom: 5,
        minZoom: 4,
        maxZoom: 13,
        zoomControl: false,
        maxBounds: [[1, 60], [42, 105]],
        maxBoundsViscosity: 0.85,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18,
      }).addTo(map)

      L.control.zoom({ position: 'bottomright' }).addTo(map)

      RIVER_PATHS.forEach(r => {
        L.polyline(r.coords, { color: r.color, weight: 2, opacity: 0.3, smoothFactor: 2 }).addTo(map)
      })

      leafletRef.current = { map, L }
      markersRef.current = renderMarkers(L, map, rivers, onSelect)
    })
    return () => { if (leafletRef.current) { leafletRef.current.map.remove(); leafletRef.current = null } }
  }, [])

  useEffect(() => {
    if (!leafletRef.current) return
    const { L, map } = leafletRef.current
    markersRef.current.forEach(m => m.remove())
    markersRef.current = renderMarkers(L, map, rivers, onSelect)
  }, [rivers, selected])

  useEffect(() => {
    if (!leafletRef.current || !selected?.latitude) return
    leafletRef.current.map.flyTo([selected.latitude, selected.longitude], 9, { duration: 1.0 })
  }, [selected?.id])

  function renderMarkers(L, map, rivers, onSelect) {
    return rivers.filter(r => r.latitude && r.longitude).map(r => {
      const color = GRADE_COLORS[r.grade] ?? GRADE_COLORS['?']
      const isSelected = selected?.id === r.id
      const size = isSelected ? 30 : 24
      const icon = L.divIcon({
        html: `<div style="width:${size}px;height:${size}px;background:${color};border:${isSelected?'2.5px solid #fff':'2px solid rgba(255,255,255,0.3)'};border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:${isSelected?11:9}px;font-weight:700;color:#fff;font-family:'Inter',sans-serif;box-shadow:0 2px 12px rgba(0,0,0,0.4),0 0 16px ${color}50;cursor:pointer;"></div>`,
        className: '',
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
      })
      const marker = L.marker([r.latitude, r.longitude], { icon })
        .addTo(map)
        .bindPopup(`<div style="font-family:'Inter',sans-serif;padding:12px;min-width:180px"><div style="font-weight:600;color:#F5F0E8;font-size:13px;margin-bottom:2px">${r.river_name}</div><div style="font-size:11px;color:rgba(245,240,232,0.45);margin-bottom:6px">${r.state}</div><div style="display:flex;align-items:center;gap:6px;margin-top:4px"><div style="background:${color};color:#fff;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;">${r.grade}</div><span style="font-size:12px;color:${color};font-weight:500">${r.gradeMeta?.label??''}</span></div></div>`, { maxWidth:220 })
        .on('click', () => onSelect?.(r))
      return marker
    })
  }

  return <div ref={mapRef} className="w-full h-full" style={{ minHeight: 320 }} />
}