export const colors = {
  bg: '#0B0F1A',
  bgElevated: '#141A2A',
  surface: '#1B2238',
  surfaceAlt: '#252D47',
  border: '#2A3352',
  text: '#F5F7FB',
  textMuted: '#9CA3BF',
  textSubtle: '#6B7390',
  primary: '#5B7CFA',
  primaryHover: '#4A6BE8',
  accent: '#F59E0B',
  success: '#22C55E',
  danger: '#EF4444',
  overlay: 'rgba(11, 15, 26, 0.75)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 14,
  xl: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '800' as const, letterSpacing: -0.5 },
  h2: { fontSize: 24, fontWeight: '700' as const, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '700' as const },
  body: { fontSize: 15, fontWeight: '400' as const },
  bodyBold: { fontSize: 15, fontWeight: '600' as const },
  caption: { fontSize: 12, fontWeight: '500' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
};
