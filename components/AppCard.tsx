import { StyleSheet, useColorScheme, View, ViewStyle } from "react-native";
import { getColors } from "../theme/colors";
import { RADII } from "../theme/radii";
import { SHADOWS } from "../theme/shadows";
import { SPACING } from "../theme/spacing";

interface AppCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function AppCard({ children, style }: AppCardProps) {
  const scheme = useColorScheme();
  const colors = getColors(scheme);
  const shadow = scheme === "dark" ? SHADOWS.dark.md : SHADOWS.light.md;
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderRadius: RADII.lg,
          borderColor: colors.border,
          borderWidth: 1,
          ...shadow,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: SPACING.lg,
    marginVertical: SPACING.md,
    marginHorizontal: SPACING.md,
    minWidth: 200,
    minHeight: 60,
  },
});
