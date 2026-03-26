/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        head: ['"Lora"', 'Georgia', 'serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        river: {
          ink:  '#1A1A2E',
          deep: '#16213E',
          card: '#1F2D45',
          surf: '#243350',
          teal: '#0EA5C9',
          sand: '#F5F0E8',
        },
        grade: { A:'#22C55E', B:'#84CC16', C:'#F59E0B', D:'#F97316', F:'#EF4444' },
      },
      animation: {
        'scale-in':   'scaleIn 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        'slide-up':   'slideUp 0.5s ease-out',
        'fade-in':    'fadeIn 0.4s ease-out',
        'shimmer':    'shimmer 1.8s infinite',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        scaleIn:  { '0%':{ transform:'scale(0.4) rotate(-12deg)', opacity:'0' }, '100%':{ transform:'scale(1) rotate(0)', opacity:'1' } },
        slideUp:  { '0%':{ transform:'translateY(30px)', opacity:'0' }, '100%':{ transform:'translateY(0)', opacity:'1' } },
        fadeIn:   { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        shimmer:  { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
    },
  },
  plugins: [],
}
