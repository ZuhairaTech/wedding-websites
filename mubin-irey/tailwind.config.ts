import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      colors: {
        wine: '#5c1f2b',
        rosePaper: '#fff8f3',
        warmCream: '#f6eee7'
      },
      boxShadow: {
        paper: '0 16px 50px rgba(70,20,31,0.10)'
      }
    }
  },
  plugins: []
};

export default config;
