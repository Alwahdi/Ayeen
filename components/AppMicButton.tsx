import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { Platform, StyleSheet, TouchableOpacity } from "react-native";
import { haptic } from "../theme/haptics";
import { SPACING } from "../theme/spacing";
import AppText from "./AppText";

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
      activeOpacity={0.8}
      style={[
        styles.micButton,
        { width: size + 24, height: size + 24, backgroundColor },
        Platform.OS === "ios" ? styles.iosShadow : styles.androidShadow,
      ]}
    >
      <MaterialCommunityIcons name="microphone" size={size} color={color} />
      <AppText style={styles.label}>تحدث الآن</AppText>
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
  },
  androidShadow: {
    elevation: 8,
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
