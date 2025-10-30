// client/postcss.config.js
// Using CommonJS module.exports for stability in Next.js build environment
module.exports = {
  plugins: {
    // This is the correct plugin name for Tailwind CSS
    'tailwindcss': {},
    // Autoprefixer for vendor prefixing
    'autoprefixer': {},
  },
};
