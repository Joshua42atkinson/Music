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
                    void: '#1a2332',
                    deep: '#1e2838',
                    surface: '#243040',
                    'surface-raised': '#2a3848',
                    border: '#354560',
                    'border-light': '#455878',
                    gold: '#c9a96e',
                    'gold-dim': '#8b7d5a',
                    sage: '#7aaa88',
                    'sage-dim': '#5a8a68',
                    meditation: '#7b6aaa',
                    breath: '#5a90a0',
                    ink: '#d0d8e0',
                    'ink-bright': '#e8edf2',
                    whisper: '#8090a8',
                    muted: '#5a6a80',
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
