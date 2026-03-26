# 🌊 Watershed

> Instant water quality grades for Indian rivers — powered by CPCB 2021 data + Groq AI

## What it does

Search any Indian river and instantly get:
- A **letter grade (A → F)** based on BOD, Dissolved Oxygen, pH, and Fecal Coliform
- A **parameter breakdown** with pass/fail indicators
- An **AI-generated plain-English summary** (via Groq / Llama 3.3)
- An **interactive map** of all 50+ monitoring stations

## Quickstart

```bash
# 1. Install dependencies
npm install

# 2. Add your Groq API key (free at console.groq.com)
cp .env.example .env
# Edit .env and set VITE_GROQ_API_KEY

# 3. Run dev server
npm run dev
```

## Environment variables

| Variable | Description | Required |
|---|---|---|
| `VITE_GROQ_API_KEY` | Groq API key (free tier, no credit card) | Optional |
| `VITE_GROQ_MODEL` | Model name (default: `llama-3.3-70b-versatile`) | Optional |

> Without a Groq API key, the app works in **offline mode** with pre-computed summaries.

## Tech stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Styling | Tailwind CSS + custom design system |
| Animation | Framer Motion |
| Map | Leaflet + React-Leaflet |
| Charts | Recharts |
| AI | Groq API (Llama 3.3 70B) |
| Data | CPCB NWMP 2021 (pre-processed JSON) |

## Grading formula

| Parameter | Weight | Safe threshold |
|---|---|---|
| BOD | 33% | < 3 mg/L |
| Dissolved Oxygen | 28% | > 5 mg/L |
| Fecal Coliform | 28% | < 500 MPN/100mL |
| pH | 11% | 6.5 – 8.5 |

| Grade | Score | Meaning |
|---|---|---|
| A | 3.5 – 4.0 | Clean |
| B | 2.5 – 3.4 | Moderate |
| C | 1.5 – 2.4 | Polluted |
| D | 0.5 – 1.4 | Severely polluted |
| F | 0 – 0.4 | Critical |

## Data source

Central Pollution Control Board (CPCB) — National Water Monitoring Programme (NWMP) 2021.  
50 stations across major Indian rivers including Ganga, Yamuna, Godavari, Sabarmati, Musi, Cooum, and others.

## Deploy

```bash
npm run build
# Deploy the dist/ folder to Vercel, Netlify, or any static host
```
