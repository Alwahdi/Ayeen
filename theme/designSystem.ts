import { Platform } from 'react-native';
import { SPACING } from './spacing';

// Design System based on the beautiful mic button styling
// Define constants first to avoid circular references
const RADIUS = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

const SHADOWS = {
  light: Platform.OS === 'ios' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  } : {
    elevation: 2,
  },
  
  medium: Platform.OS === 'ios' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  } : {
    elevation: 6,
  },
  
  heavy: Platform.OS === 'ios' ? {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  } : {
    elevation: 12,
  },
  
  glow: Platform.OS === 'ios' ? {
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
  } : {
    elevation: 8,
  },
};

export const DESIGN_SYSTEM = {
  // Spacing scale
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  // Border radius scale
  radius: RADIUS,
  
  // Shadow configurations
  shadows: SHADOWS,
  
  // Animation durations
  animation: {
    fast: 150,
    normal: 250,
    slow: 350,
  },
  
  // Component styles
  components: {
    // Large rounded button (like mic button)
    largeButton: {
      borderRadius: RADIUS.full,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      alignSelf: 'center' as const,
      minHeight: 64,
      minWidth: 64,
      paddingHorizontal: SPACING.lg,
      paddingVertical: SPACING.md,
      ...SHADOWS.heavy,
    },
    
    // Medium rounded button
    mediumButton: {
      borderRadius: RADIUS.xl,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: 48,
      minWidth: 48,
      paddingHorizontal: SPACING.md,
      paddingVertical: SPACING.sm,
      ...SHADOWS.medium,
    },
    
    // Small rounded button
    smallButton: {
      borderRadius: RADIUS.lg,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      minHeight: 40,
      minWidth: 40,
      paddingHorizontal: SPACING.sm,
      paddingVertical: SPACING.xs,
      ...SHADOWS.light,
    },
    
    // Card styling
    card: {
      borderRadius: RADIUS.xl,
      padding: SPACING.lg,
      ...SHADOWS.medium,
    },
    
    // Floating action button
    fab: {
      position: 'absolute' as const,
      bottom: SPACING.xl,
      right: SPACING.xl,
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center' as const,
      alignItems: 'center' as const,
      ...SHADOWS.heavy,
    },
  },
};

// Helper function to create consistent button styles
export const createButtonStyle = (size: 'small' | 'medium' | 'large' = 'medium') => {
  return [
    DESIGN_SYSTEM.components[`${size}Button`],
    {
      flexDirection: 'row' as const,
      gap: SPACING.sm,
    }
  ];
};

// Helper function for card styles
export const createCardStyle = (elevated: boolean = false) => {
  return [
    DESIGN_SYSTEM.components.card,
    elevated ? DESIGN_SYSTEM.shadows.heavy : DESIGN_SYSTEM.shadows.medium,
  ];
};
