/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Stellar Brand Colors
        stellar: {
          gold: '#FDDA24',
          black: '#0F0F0F',
          white: '#F6F7F8',
          blue: '#59b7e9',
          'blue-light': '#99b7cf',
          violet: '#4d246f',
          purple: '#8c5ca4',
          'deep-blue': '#303958',
          'steel-blue': '#afafd7',
        },
        // Semantic colors
        primary: '#FDDA24',
        secondary: '#59b7e9',
        accent: '#8c5ca4',
        dark: '#0F0F0F',
        light: '#F6F7F8',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'gradient': 'gradient 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { 
            boxShadow: '0 0 20px rgba(253, 218, 36, 0.5)',
          },
          '50%': { 
            boxShadow: '0 0 40px rgba(253, 218, 36, 0.8), 0 0 60px rgba(89, 183, 233, 0.5)',
          },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pulseGlow: {
          '0%, 100%': { 
            boxShadow: '0 0 15px rgba(253, 218, 36, 0.3)',
          },
          '50%': { 
            boxShadow: '0 0 30px rgba(253, 218, 36, 0.6)',
          },
        },
        gradient: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-stellar': 'linear-gradient(135deg, #FDDA24 0%, #59b7e9 50%, #8c5ca4 100%)',
        'gradient-gold': 'linear-gradient(135deg, #FDDA24 0%, #FFA500 100%)',
        'gradient-blue': 'linear-gradient(135deg, #59b7e9 0%, #4d246f 100%)',
        'gradient-purple': 'linear-gradient(135deg, #8c5ca4 0%, #4d246f 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(253, 218, 36, 0.5)',
        'glow-lg': '0 0 40px rgba(253, 218, 36, 0.6)',
        'blue-glow': '0 0 20px rgba(89, 183, 233, 0.5)',
        'purple-glow': '0 0 20px rgba(140, 92, 164, 0.5)',
        'neon': '0 0 5px theme(colors.stellar.gold), 0 0 20px theme(colors.stellar.gold)',
      },
    },
  },
  plugins: [],
}
