// Shadow system for light and dark mode
export const SHADOWS = {
  light: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.06,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.10,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },
  dark: {
    sm: {
      shadowColor: '#000',
      shadowOpacity: 0.20,
      shadowRadius: 2,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOpacity: 0.30,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 4 },
      elevation: 4,
    },
  },
};
