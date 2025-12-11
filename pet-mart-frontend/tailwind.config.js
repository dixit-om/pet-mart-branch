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
          // Primary: Orange (#FF9B00) - Main actions, header, primary buttons
          "primary": "#FF9B00",
          "primary-content": "#FFFFFF", // White text for better contrast on orange
          
          // Secondary: Bright Yellow (#FFE100) - Cards, secondary backgrounds
          "secondary": "#FFE100",
          "secondary-content": "#1a1a1a", // Dark text on yellow
          
          // Accent: Golden Yellow (#FFC900) - Highlights, badges, accents
          "accent": "#FFC900",
          "accent-content": "#1a1a1a", // Dark text on golden yellow
          
          // Neutral: Darker orange for footer and contrast elements
          "neutral": "#E67E00", // Slightly darker orange
          "neutral-content": "#FFFFFF", // White text on dark orange
          
          // Base colors: Light cream (#EBE389) for main background
          "base-100": "#EBE389", // Main background - light cream
          "base-200": "#FFE100", // Cards and elevated surfaces - bright yellow
          "base-300": "#FFC900", // Subtle backgrounds - golden yellow
          "base-content": "#1a1a1a", // Dark text on light backgrounds
          
          // Status colors
          "info": "#FFE100", // Yellow for info
          "info-content": "#1a1a1a",
          "success": "#FFC900", // Golden for success
          "success-content": "#1a1a1a",
          "warning": "#FF9B00", // Orange for warnings
          "warning-content": "#FFFFFF",
          "error": "#D32F2F", // Red for errors (better visibility)
          "error-content": "#FFFFFF",
        },
      },
    ],
  },
}

