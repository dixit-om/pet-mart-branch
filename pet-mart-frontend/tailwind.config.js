/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("daisyui"),
  ],
  daisyui: {
    themes: [
      {
        petmart: {
          // Primary: Bright Orange (#FF6600) - Main actions, header, primary buttons
          "primary": "#FF6600",
          "primary-content": "#FFFFFF", // White text for optimal contrast on orange
          
          // Secondary: Golden Yellow (#F1C550) - Cards, secondary backgrounds
          "secondary": "#F1C550",
          "secondary-content": "#1a1a1a", // Dark text on golden yellow for readability
          
          // Accent: Red (#CE2525) - Important accents, highlights
          "accent": "#CE2525",
          "accent-content": "#FFFFFF", // White text on red for contrast
          
          // Neutral: Darker orange for footer and contrast elements
          "neutral": "#CC5200", // Darker shade of orange for footer
          "neutral-content": "#FFFFFF", // White text on dark orange
          
          // Base colors: Very light cream (#FFF9E0) for main background
          "base-100": "#FFF9E0", // Main background - very light cream
          "base-200": "#F1C550", // Cards and elevated surfaces - golden yellow
          "base-300": "#FFE8B3", // Subtle backgrounds - lighter golden yellow
          "base-content": "#1a1a1a", // Dark text on light backgrounds
          
          // Status colors following UI/UX best practices
          "info": "#F1C550", // Golden yellow for info
          "info-content": "#1a1a1a",
          "success": "#F1C550", // Golden yellow for success (positive)
          "success-content": "#1a1a1a",
          "warning": "#FF6600", // Orange for warnings
          "warning-content": "#FFFFFF",
          "error": "#CE2525", // Red for errors
          "error-content": "#FFFFFF",
        },
      },
    ],
  },
}

