import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                cf: {
                    // True background colours — match index.css exactly
                    void:    '#050508',   // app background
                    ink:     '#0a0a10',   // deep panels
                    surface: '#12100e',   // widget panel bg
                    panel:   '#1a1815',   // settings dropdown
                    border:  'rgba(255,255,255,0.08)',
                    // Brand palette
                    gold:      '#c9a96e',
                    'gold-dim':'#8b7d5a',
                    sage:      '#7aaa88',
                    'sage-dim':'#5a8a68',
                    rose:      '#c07898',
                    slate:     'rgba(255,255,255,0.3)',
                    muted:     'rgba(255,255,255,0.15)',
                    // Matrix pill accents
                    guitar:    '#cc3333',  // 🔴 Red pill — AI Troubadour
                    'guitar-glow': 'rgba(204,51,51,0.45)',
                    book:      '#2255cc',  // 📖 Blue pill — Audio / Save
                    'book-glow': 'rgba(34,85,204,0.45)',
                    // Legacy aliases
                    meditation: '#7b6aaa',
                    breath:     '#5a90a0',
                },
            },
            fontFamily: {
                heading: ['Cormorant Garamond', 'Georgia', 'serif'],
                body: ['Inter', 'system-ui', 'sans-serif'],
                quote: ['EB Garamond', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'monospace'],
            },
            animation: {
                'breathe': 'breathe 4s ease-in-out infinite',
                'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'float': 'float 6s ease-in-out infinite',
                'breath-guide': 'breath-guide 10s ease-in-out infinite',
            },
        },
    },
    plugins: [
        typography,
    ],
}
