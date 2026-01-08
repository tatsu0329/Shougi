/**
 * グローバルテーマ設定
 * 色・フォント・余白を一元管理
 */

export const theme = {
  colors: {
    // 将棋盤の色
    board: {
      light: '#F5E6D3',
      dark: '#D4A574',
      border: '#8B4513',
      grid: '#8B4513',
    },
    // 駒の色
    piece: {
      player: '#FFFFFF',
      enemy: '#000000',
      selected: '#FFD700',
      highlight: '#90EE90',
    },
    // UI色
    ui: {
      primary: '#2C3E50',
      secondary: '#34495E',
      accent: '#E74C3C',
      success: '#27AE60',
      warning: '#F39C12',
      background: '#ECF0F1',
      surface: '#FFFFFF',
      text: {
        primary: '#2C3E50',
        secondary: '#7F8C8D',
        inverse: '#FFFFFF',
      },
    },
  },
  fonts: {
    family: {
      primary: "'Noto Sans JP', 'Helvetica Neue', Arial, sans-serif",
      mono: "'Courier New', monospace",
    },
    size: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    weight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },
  spacing: {
    xs: '0.25rem',   // 4px
    sm: '0.5rem',    // 8px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },
  borderRadius: {
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
} as const;

export type Theme = typeof theme;

