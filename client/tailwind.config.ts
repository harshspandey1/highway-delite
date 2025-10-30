import type { Config } from 'tailwindcss';

const config: Config = {
  // CRITICAL: This tells Tailwind where to scan for CSS classes
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You can add your custom theme extensions here
    },
  },
  plugins: [],
};

export default config;
