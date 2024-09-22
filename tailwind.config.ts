import type { Config } from 'tailwindcss';

export default {
    content: ['./index.html', './src/**/*.{js,ts}'],
    theme: {
        colors: {
            primary: {
                DEFAULT: '#f7f7ff',
                100: '#000064',
                200: '#0000c8',
                300: '#2d2dff',
                400: '#9191ff',
                500: '#f7f7ff',
                600: '#f7f7ff',
                700: '#f9f9ff',
                800: '#fbfbff',
                900: '#fdfdff',
            },
            secondary: {
                DEFAULT: '#3e505b',
                100: '#0c1012',
                200: '#192024',
                300: '#253037',
                400: '#324049',
                500: '#3e505b',
                600: '#5b7586',
                700: '#8099a8',
                800: '#aabbc5',
                900: '#d5dde2',
            },
            tertiary: {
                DEFAULT: '#e01a4f',
                100: '#2d0510',
                200: '#590a20',
                300: '#86102f',
                400: '#b3153f',
                500: '#e01a4f',
                600: '#e94571',
                700: '#ef7394',
                800: '#f4a2b8',
                900: '#fad0db',
            },
        },
        fontFamily: {
            montserrat: ['Montserrat', 'sans-serif'],
        },
        extend: {},
    },
    plugins: [],
} satisfies Config;
