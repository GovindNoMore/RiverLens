# RiverLens

India has hundreds of river monitoring stations. The data exists — CPCB publishes it — but it's dense, technical, and inaccessible to anyone outside research circles.

RiverLens converts that raw water quality data into letter grades (A–F), plain-English AI summaries, and an interactive map of 50+ monitored stations across the country. The goal: make river health legible to anyone.

---

## Features

- Interactive Leaflet map with 50+ river stations
- Water quality grading algorithm (BOD, Dissolved O₂, Fecal Coliform, pH)
- AI-generated plain-English summaries via Groq
- Filter by grade, state, and pollution zone
- Shareable report cards and PDF export

---

## Stack

| Layer | Tech |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| Maps | Leaflet + react-leaflet |
| Charts | Recharts |
| Animation | Framer Motion |
| AI | Groq API — llama-3.3-70b |
| Deployment | Vercel |

---

## Data Source

CPCB 2021 National Water Monitoring Programme — public domain.
