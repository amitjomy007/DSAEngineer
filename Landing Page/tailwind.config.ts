import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        // Glass System
        "glass-bg": "hsl(var(--glass-bg))",
        "glass-border": "hsl(var(--glass-border))",
        "glass-hover": "hsl(var(--glass-hover))",

        // Premium Colors
        primary: {
          DEFAULT: "hsl(var(--primary))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: "hsl(var(--secondary))",
        "accent-gold": "hsl(var(--accent-gold))",

        // Text Hierarchy
        "text-primary": "hsl(var(--text-primary))",
        "text-secondary": "hsl(var(--text-secondary))",
        "text-muted": "hsl(var(--text-muted))",

        // Interactive
        ring: "hsl(var(--ring))",
        "ring-glow": "hsl(var(--ring-glow))",
      },
      backgroundImage: {
        "gradient-primary": "var(--gradient-primary)",
        "gradient-secondary": "var(--gradient-secondary)",
        "gradient-accent": "var(--gradient-accent)",
      },
      boxShadow: {
        glass: "var(--shadow-glass)",
        "glow-primary": "var(--glow-primary)",
        "glow-secondary": "var(--glow-secondary)",
      },
      backdropBlur: {
        glass: "15px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0", opacity: "0" },
          to: { height: "var(--radix-accordion-content-height)", opacity: "1" },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
            opacity: "1",
          },
          to: { height: "0", opacity: "0" },
        },
        "fade-in-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "glow-pulse": {
          "0%, 100%": {
            "box-shadow": "0 0 20px hsl(var(--primary) / 0.3)",
          },
          "50%": {
            "box-shadow":
              "0 0 40px hsl(var(--primary) / 0.6), 0 0 60px hsl(var(--primary-glow) / 0.4)",
          },
        },
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-100%)" },
        },
        "gradient-shift": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        slideUp: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-20px)" },
        },
        slideDown: {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(20px)" },
        },
        "infinite-scroll-up": {
          "0%": { transform: "translateY(0)" },
          "100%": { transform: "translateY(-50%)" }, // Changed from -100%
        },
        "infinite-scroll-down": {
          "0%": { transform: "translateY(-50%)" }, // Changed from -100%
          "100%": { transform: "translateY(0)" },
        },
        "slow-flow": {
          from: { "background-position": "0% 50%" },
          to: { "background-position": "200% 50%" },
        },
        "spin-around": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "spin-around": "spin-around 7s linear infinite",
        "slow-flow": "slow-flow 5s linear infinite",
        "accordion-down": "accordion-down 0.3s ease-out",
        "accordion-up": "accordion-up 0.3s ease-out",
        "fade-in-up": "fade-in-up 0.6s ease-out forwards",
        "glow-pulse": "glow-pulse 2s ease-in-out infinite",
        marquee: "marquee 30s linear infinite",
        "gradient-shift": "gradient-shift 6s ease infinite",
        "infinite-scroll-up": "infinite-scroll-up 30s linear infinite",
        "infinite-scroll-down": "infinite-scroll-down 30s linear infinite",
      },
      transitionTimingFunction: {
        smooth: "var(--transition-smooth)",
        spring: "var(--transition-spring)",
      },
      backgroundSize: {
        "200%": "200%",
        "300%": "300%",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
