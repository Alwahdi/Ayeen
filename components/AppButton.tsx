import React from "react";
import {
  GestureResponderEvent,
  Platform,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  ViewStyle,
} from "react-native";
import { getColors } from "../theme/colors";
import { RADII } from "../theme/radii";
import { SHADOWS } from "../theme/shadows";
import { SPACING } from "../theme/spacing";
import AppText from "./AppText";

interface AppButtonProps {
  title: string;
  onPress?: (event: GestureResponderEvent) => void;
  style?: ViewStyle;
  disabled?: boolean;
  accessibilityLabel?: string;
}

export default function AppButton(props: AppButtonProps) {
  const { title, onPress, style, disabled, accessibilityLabel } = props;
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const shadowStyle = {
    ...(scheme === "dark" ? SHADOWS.dark.md : SHADOWS.light.md),
    // borderRadius: RADII.lg, // Removed duplicate, already in shadowStyle
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}
      style={[
        styles.button,
        {
          backgroundColor: disabled ? colors.textDisabled : colors.primary,
          borderRadius: RADII.lg,
          paddingVertical: SPACING.md,
          paddingHorizontal: SPACING.xl,
          ...shadowStyle,
          borderWidth: 1.5,
          borderColor: "rgba(0,0,0,0.04)",
          overflow: Platform.OS === "android" ? "hidden" : "visible",
        },
        style,
      ]}
      activeOpacity={0.85}
    >
      <AppText
        style={{
          color: colors.background,
          fontSize: 18,
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {title}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginVertical: SPACING.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 48,
    minWidth: 120,
  },
});
