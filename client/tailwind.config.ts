import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    // This array tells Tailwind which files to scan for class names
    './app/**/*.{js,ts,jsx,tsx,mdx}', 
    './components/**/*.{js,ts,jsx,tsx,mdx}', 
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Your theme customizations
    },
  },
  plugins: [],
};

export default config;