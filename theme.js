// Central design tokens. Change a value here and it updates everywhere.
// Text/background pairs below were chosen to meet WCAG AA (4.5:1 for small text).
export const colors = {
  // Brand
  primary: '#0B3D66',      // deep navy: headings, primary text, parked panel
  primaryLight: '#BFD9EE', // light tint for small labels on top of `primary`
  accent: '#C2410C',       // burnt orange: CTAs, "Park here", selection highlight

  // Surfaces
  background: '#EFF3F8',
  surface: '#FFFFFF',
  border: '#E2E8F0',

  // Text
  textPrimary: '#14213D',
  textSecondary: '#64748B',
  textOnPrimary: '#FFFFFF',
  textMuted: '#52606F',    // description text on `disabledBg`

  // Status
  success: '#1E7B3A',
  successBg: '#E6F6EA',
  warning: '#8A5300',
  warningBg: '#FFF3E0',
  danger: '#B42318',
  dangerBg: '#FEECEA',
  disabled: '#5A6878',     // "Unavailable" pill (white text on top)
  disabledBg: '#F1F3F6',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 18,
  pill: 999,
};

export const typography = {
  title: { fontSize: 20, fontWeight: '700' },
  subtitle: { fontSize: 15, fontWeight: '600' },
  body: { fontSize: 14, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '500' },
};

// Minimum comfortable touch target (iOS HIG 44pt / Material 48dp).
export const MIN_TOUCH = 44;

export const shadow = {
  card: {
    shadowColor: '#0B3D66',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
};
