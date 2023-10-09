/** @type {import('tailwindcss/defaultTheme')} */
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
    darkMode: 'class',
    theme: {
        screens: {
            xs: '475px',
            ...defaultTheme.screens,
        },
        extend: {},
    },
    plugins: [],
};
