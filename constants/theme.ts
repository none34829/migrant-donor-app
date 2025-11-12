const theme = {
  colors: {
    primary: '#8B5E34',
    primaryDark: '#6E4B2A',
    secondary: '#C08552',
    accent: '#6B8E62',
    background: '#FAF7F2',
    surface: '#FFFDF8',
    textPrimary: '#3E3A36',
    textSecondary: '#6D665D',
    border: '#E6DED3',
    chipBackground: '#EFE7DB',
    chipSelectedBackground: '#8B5E34',
    chipSelectedText: '#FFFFFF',
    danger: '#B24C3B',
    warning: '#D9A441',
    info: '#7A9E9F',
    muted: '#CFC6B8',
  },
  shadows: {
    card: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 6,
      elevation: 2,
    },
  },
};

export type Theme = typeof theme;

export default theme;
