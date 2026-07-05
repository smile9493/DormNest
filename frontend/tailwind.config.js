/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1E40AF',
          light: '#3B82F6',
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
        background: '#F3F4F6',
      },
      fontFamily: {
        chinese: ['PingFang SC', 'Microsoft YaHei', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['DIN', 'Roboto Mono', 'monospace'],
      },
      borderRadius: {
        'card': '8px',
        'modal': '12px',
      },
      boxShadow: {
        'card': '0 2px 8px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.12)',
      },
    },
  },
  plugins: [],
};
