import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { haptic } from "../theme/haptics";
import { SPACING } from "../theme/spacing";

interface AppMicButtonProps {
  onPress: () => void;
  accessibilityLabel?: string;
  size?: number;
  color?: string;
  backgroundColor?: string;
}

const AppMicButton: React.FC<AppMicButtonProps> = ({
  onPress,
  accessibilityLabel = "زر الميكروفون",
  size = 96,
  color = "#fff",
  backgroundColor = "#007AFF",
}) => {
  return (
    <TouchableOpacity
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={() => {
        haptic.heavy();
        haptic.notification("success");
        onPress();
      }}
      activeOpacity={0.7}
      style={[
        styles.micButton,
        { 
          width: size + 32, 
          height: size + 32, 
          backgroundColor,
          borderRadius: (size + 32) / 2,
        },
        Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
      ]}
    >
      <MaterialCommunityIcons name="microphone" size={size * 0.6} color={color} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  micButton: {
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: SPACING.lg,
  },
  iosShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  androidShadow: {
    elevation: 12,
  },
  label: {
    marginTop: SPACING.sm,
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
  },
});

export default AppMicButton;
