/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#B8956A',
                    light: '#D4AF82',
                    pale: '#F5EDE0',
                },
                accent: '#B8956A',
                dark: '#1A1714',
                mid: '#4A423C',
                light: '#FAF7F3',
            },
            fontFamily: {
                serif: ['"Cormorant Garamond"', 'serif'],
                sans: ['"Jost"', 'sans-serif'],
            },
            letterSpacing: {
                widest: '0.28em',
                wider: '0.18em',
            }
        },
    },
    plugins: [],
}
