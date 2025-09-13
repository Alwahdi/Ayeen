import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    GestureResponderEvent,
    Platform,
    StyleSheet,
    TextStyle,
    TouchableOpacity,
    useColorScheme,
    ViewStyle,
} from "react-native";
import { getColors } from "../theme/colors";
import { haptic } from "../theme/haptics";
import { RADII } from "../theme/radii";
import { SHADOWS } from "../theme/shadows";
import { SPACING } from "../theme/spacing";
import AppText from "./AppText";

interface AppButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
  loading?: boolean;
  variant?: "primary" | "secondary" | "outline" | "success" | "danger";
  size?: "small" | "medium" | "large";
  accessibilityLabel?: string;
  accessibilityHint?: string;
  icon?: string;
  fullWidth?: boolean;
}

export default function AppButton(props: AppButtonProps) {
  const { 
    title, 
    onPress, 
    style, 
    textStyle,
    disabled = false, 
    loading = false,
    variant = "primary",
    size = "medium",
    accessibilityLabel,
    accessibilityHint,
    icon,
    fullWidth = false,
  } = props;
  
  const scheme = useColorScheme();
  const colors = getColors(scheme);

  const handlePress = (event: GestureResponderEvent) => {
    if (!disabled && !loading && onPress) {
      haptic.selection();
      onPress(event);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          textColor: colors.surface,
        };
      case "secondary":
        return {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          textColor: colors.text,
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: colors.primary,
          textColor: colors.primary,
        };
      case "success":
        return {
          backgroundColor: "#4CAF50",
          borderColor: "#4CAF50",
          textColor: "#fff",
        };
      case "danger":
        return {
          backgroundColor: colors.accent,
          borderColor: colors.accent,
          textColor: colors.surface,
        };
      default:
        return {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
          textColor: colors.surface,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case "small":
        return {
          paddingVertical: SPACING.sm,
          paddingHorizontal: SPACING.md,
          minHeight: 36,
          fontSize: 14,
        };
      case "medium":
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          minHeight: 48,
          fontSize: 16,
        };
      case "large":
        return {
          paddingVertical: SPACING.lg,
          paddingHorizontal: SPACING.xl,
          minHeight: 56,
          fontSize: 18,
        };
      default:
        return {
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.lg,
          minHeight: 48,
          fontSize: 16,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();
  const shadowStyle = {
    ...(scheme === "dark" ? SHADOWS.dark.md : SHADOWS.light.md),
  };

  const buttonStyle = [
    styles.button,
    {
      backgroundColor: disabled ? colors.textDisabled : variantStyles.backgroundColor,
      borderColor: variantStyles.borderColor,
      borderRadius: RADII.lg,
      paddingVertical: sizeStyles.paddingVertical,
      paddingHorizontal: sizeStyles.paddingHorizontal,
      minHeight: sizeStyles.minHeight,
      width: fullWidth ? "100%" as const : undefined,
      ...shadowStyle,
      borderWidth: variant === "outline" ? 2 : 1.5,
      overflow: Platform.OS === "android" ? "hidden" as const : "visible" as const,
    },
    style,
  ];

  const textStyleFinal = [
    {
      color: disabled ? colors.textSecondary : variantStyles.textColor,
      fontSize: sizeStyles.fontSize,
      fontWeight: "700" as const,
      textAlign: "center" as const,
    },
    textStyle,
  ];

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      style={buttonStyle}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variantStyles.textColor}
          size="small"
        />
      ) : (
        <>
          {icon && (
            <MaterialCommunityIcons
              name={icon as any}
              size={sizeStyles.fontSize + 4}
              color={variantStyles.textColor}
              style={{ marginRight: SPACING.sm }}
            />
          )}
          <AppText style={textStyleFinal} allowFontScaling={true}>
            {title}
          </AppText>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    minWidth: 120,
  },
});
