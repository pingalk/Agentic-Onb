const a = {
  theme: {
    extend: {
      colors: {
        // Primary colors
        "blade-ai-primary": "#030213",
        "blade-ai-accent": "#305EFF",
        "blade-ai-accent-hover": "#2449cc",
        // Semantic colors
        "blade-ai-success": "#22c55e",
        "blade-ai-warning": "#f59e0b",
        "blade-ai-error": "#ef4444",
        "blade-ai-info": "#3b82f6",
        // Text colors
        "blade-ai-text-primary": "#192839",
        "blade-ai-text-secondary": "#40566d",
        "blade-ai-text-tertiary": "#768ea7",
        "blade-ai-text-inverse": "#ffffff",
        // Surface colors
        "blade-ai-surface": "#f8fafc",
        "blade-ai-surface-elevated": "#ffffff",
        "blade-ai-surface-overlay": "rgba(0, 0, 0, 0.5)",
        // Chat bubble colors
        "blade-ai-user-bubble": "#e6eafa",
        "blade-ai-assistant-bubble": "#ffffff",
        // Border colors
        "blade-ai-border": "#e3eaf3",
        "blade-ai-border-strong": "#cbd5e2",
        "blade-ai-border-subtle": "#f1f5f9",
        // Thinking/processing colors
        "blade-ai-thinking": "#6366f1",
        "blade-ai-processing": "#8b5cf6",
        // Code block colors
        "blade-ai-code-bg": "#1e293b",
        "blade-ai-code-text": "#e2e8f0"
      },
      borderRadius: {
        "blade-ai-xs": "2px",
        "blade-ai-sm": "4px",
        "blade-ai-md": "8px",
        "blade-ai-lg": "12px",
        "blade-ai-xl": "16px",
        "blade-ai-2xl": "20px",
        "blade-ai-3xl": "26px",
        "blade-ai-full": "9999px"
      },
      spacing: {
        "blade-ai-xs": "4px",
        "blade-ai-sm": "8px",
        "blade-ai-md": "12px",
        "blade-ai-lg": "16px",
        "blade-ai-xl": "20px",
        "blade-ai-2xl": "24px",
        "blade-ai-3xl": "32px"
      },
      fontSize: {
        "blade-ai-xs": ["11px", { lineHeight: "16px" }],
        "blade-ai-sm": ["12px", { lineHeight: "18px" }],
        "blade-ai-base": ["14px", { lineHeight: "22px" }],
        "blade-ai-md": ["16px", { lineHeight: "24px" }],
        "blade-ai-lg": ["18px", { lineHeight: "28px" }],
        "blade-ai-xl": ["20px", { lineHeight: "30px" }],
        "blade-ai-2xl": ["24px", { lineHeight: "32px" }]
      },
      fontWeight: {
        "blade-ai-normal": "400",
        "blade-ai-medium": "500",
        "blade-ai-semibold": "600",
        "blade-ai-bold": "700"
      },
      boxShadow: {
        "blade-ai-sm": "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        "blade-ai-md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
        "blade-ai-lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
        "blade-ai-xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        "blade-ai-inner": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.05)",
        "blade-ai-glow": "0 0 20px rgba(48, 94, 255, 0.3)"
      },
      animation: {
        "blade-ai-shimmer": "blade-ai-shimmer 2s linear infinite",
        "blade-ai-pulse": "blade-ai-pulse 2s ease-in-out infinite",
        "blade-ai-rotate-step": "blade-ai-rotate-step 2s ease-in-out infinite",
        "blade-ai-fade-in": "blade-ai-fade-in 0.3s ease-out",
        "blade-ai-slide-up": "blade-ai-slide-up 0.3s ease-out",
        "blade-ai-bounce-subtle": "blade-ai-bounce-subtle 0.6s ease-in-out",
        "blade-ai-typing": "blade-ai-typing 1s ease-in-out infinite"
      },
      keyframes: {
        "blade-ai-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        },
        "blade-ai-pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" }
        },
        "blade-ai-rotate-step": {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(90deg)" },
          "50%": { transform: "rotate(180deg)" },
          "75%": { transform: "rotate(270deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "blade-ai-fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        "blade-ai-slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        },
        "blade-ai-bounce-subtle": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "blade-ai-typing": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" }
        }
      },
      transitionDuration: {
        "blade-ai-fast": "150ms",
        "blade-ai-normal": "200ms",
        "blade-ai-slow": "300ms",
        "blade-ai-slower": "500ms"
      },
      transitionTimingFunction: {
        "blade-ai-ease": "cubic-bezier(0.4, 0, 0.2, 1)",
        "blade-ai-ease-in": "cubic-bezier(0.4, 0, 1, 1)",
        "blade-ai-ease-out": "cubic-bezier(0, 0, 0.2, 1)",
        "blade-ai-spring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
      },
      backdropBlur: {
        "blade-ai-sm": "4px",
        "blade-ai-md": "8px",
        "blade-ai-lg": "16px"
      },
      zIndex: {
        "blade-ai-base": "0",
        "blade-ai-dropdown": "10",
        "blade-ai-sticky": "20",
        "blade-ai-fixed": "30",
        "blade-ai-overlay": "40",
        "blade-ai-modal": "50",
        "blade-ai-popover": "60",
        "blade-ai-tooltip": "70"
      }
    }
  }
};
export {
  a as default
};
//# sourceMappingURL=tailwind-preset.js.map
