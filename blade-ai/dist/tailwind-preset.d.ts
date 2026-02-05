/**
 * Blade AI Tailwind CSS Preset
 *
 * Usage in consumer app:
 * ```javascript
 * // tailwind.config.js
 * import bladeAiPreset from '@aspect-ui/blade-ai/tailwind-preset';
 *
 * export default {
 *   presets: [bladeAiPreset],
 *   // ...
 * };
 * ```
 */
declare const bladeAiPreset: {
    theme: {
        extend: {
            colors: {
                'blade-ai-primary': string;
                'blade-ai-accent': string;
                'blade-ai-accent-hover': string;
                'blade-ai-success': string;
                'blade-ai-warning': string;
                'blade-ai-error': string;
                'blade-ai-info': string;
                'blade-ai-text-primary': string;
                'blade-ai-text-secondary': string;
                'blade-ai-text-tertiary': string;
                'blade-ai-text-inverse': string;
                'blade-ai-surface': string;
                'blade-ai-surface-elevated': string;
                'blade-ai-surface-overlay': string;
                'blade-ai-user-bubble': string;
                'blade-ai-assistant-bubble': string;
                'blade-ai-border': string;
                'blade-ai-border-strong': string;
                'blade-ai-border-subtle': string;
                'blade-ai-thinking': string;
                'blade-ai-processing': string;
                'blade-ai-code-bg': string;
                'blade-ai-code-text': string;
            };
            borderRadius: {
                'blade-ai-xs': string;
                'blade-ai-sm': string;
                'blade-ai-md': string;
                'blade-ai-lg': string;
                'blade-ai-xl': string;
                'blade-ai-2xl': string;
                'blade-ai-3xl': string;
                'blade-ai-full': string;
            };
            spacing: {
                'blade-ai-xs': string;
                'blade-ai-sm': string;
                'blade-ai-md': string;
                'blade-ai-lg': string;
                'blade-ai-xl': string;
                'blade-ai-2xl': string;
                'blade-ai-3xl': string;
            };
            fontSize: {
                'blade-ai-xs': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-sm': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-base': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-md': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-lg': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-xl': (string | {
                    lineHeight: string;
                })[];
                'blade-ai-2xl': (string | {
                    lineHeight: string;
                })[];
            };
            fontWeight: {
                'blade-ai-normal': string;
                'blade-ai-medium': string;
                'blade-ai-semibold': string;
                'blade-ai-bold': string;
            };
            boxShadow: {
                'blade-ai-sm': string;
                'blade-ai-md': string;
                'blade-ai-lg': string;
                'blade-ai-xl': string;
                'blade-ai-inner': string;
                'blade-ai-glow': string;
            };
            animation: {
                'blade-ai-shimmer': string;
                'blade-ai-pulse': string;
                'blade-ai-rotate-step': string;
                'blade-ai-fade-in': string;
                'blade-ai-slide-up': string;
                'blade-ai-bounce-subtle': string;
                'blade-ai-typing': string;
            };
            keyframes: {
                'blade-ai-shimmer': {
                    '0%': {
                        backgroundPosition: string;
                    };
                    '100%': {
                        backgroundPosition: string;
                    };
                };
                'blade-ai-pulse': {
                    '0%, 100%': {
                        opacity: string;
                    };
                    '50%': {
                        opacity: string;
                    };
                };
                'blade-ai-rotate-step': {
                    '0%': {
                        transform: string;
                    };
                    '25%': {
                        transform: string;
                    };
                    '50%': {
                        transform: string;
                    };
                    '75%': {
                        transform: string;
                    };
                    '100%': {
                        transform: string;
                    };
                };
                'blade-ai-fade-in': {
                    '0%': {
                        opacity: string;
                    };
                    '100%': {
                        opacity: string;
                    };
                };
                'blade-ai-slide-up': {
                    '0%': {
                        opacity: string;
                        transform: string;
                    };
                    '100%': {
                        opacity: string;
                        transform: string;
                    };
                };
                'blade-ai-bounce-subtle': {
                    '0%, 100%': {
                        transform: string;
                    };
                    '50%': {
                        transform: string;
                    };
                };
                'blade-ai-typing': {
                    '0%, 100%': {
                        opacity: string;
                    };
                    '50%': {
                        opacity: string;
                    };
                };
            };
            transitionDuration: {
                'blade-ai-fast': string;
                'blade-ai-normal': string;
                'blade-ai-slow': string;
                'blade-ai-slower': string;
            };
            transitionTimingFunction: {
                'blade-ai-ease': string;
                'blade-ai-ease-in': string;
                'blade-ai-ease-out': string;
                'blade-ai-spring': string;
            };
            backdropBlur: {
                'blade-ai-sm': string;
                'blade-ai-md': string;
                'blade-ai-lg': string;
            };
            zIndex: {
                'blade-ai-base': string;
                'blade-ai-dropdown': string;
                'blade-ai-sticky': string;
                'blade-ai-fixed': string;
                'blade-ai-overlay': string;
                'blade-ai-modal': string;
                'blade-ai-popover': string;
                'blade-ai-tooltip': string;
            };
        };
    };
};
export default bladeAiPreset;

export { }
