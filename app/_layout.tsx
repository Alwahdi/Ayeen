import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import {
    I18nManager,
    Platform,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";
import AppText from "../components/AppText";
import { SettingsProvider, useSettings } from "../contexts/SettingsContext";
import { getColors } from "../theme/colors";
import { haptic } from "../theme/haptics";
import { SPACING } from "../theme/spacing";
import { ThemeProvider } from "../theme/ThemeProvider";

// Header component that can access settings context
function AppHeader() {
  const { settings, effectiveTheme, fontScale } = useSettings();
  const colors = getColors(effectiveTheme);

  const handleSettingsPress = () => {
    haptic.selection();
    router.push('/settings');
  };

  return (
    <View
      style={[
        styles.headerContainer,
        {
          backgroundColor: colors.primary,
          shadowColor: colors.accent,
          borderBottomLeftRadius: 32,
          borderBottomRightRadius: 32,
        },
      ]}
      accessible
      accessibilityRole="header"
    >
      <View style={[styles.appIcon, { backgroundColor: colors.surface }]}>
        <AppText style={[styles.appIconText, { color: colors.primary }]}>
          👁️
        </AppText>
      </View>
      <AppText
        style={[
          styles.headerTitle,
          {
            color: colors.surface,
            fontSize: 32 * fontScale,
            fontWeight: "bold",
          },
        ]}
        accessibilityRole="header"
        allowFontScaling
      >
        عين
      </AppText>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={handleSettingsPress}
        accessibilityLabel="فتح الإعدادات"
        accessibilityRole="button"
      >
        <MaterialCommunityIcons 
          name="cog" 
          size={24} 
          color={colors.text} 
        />
      </TouchableOpacity>
    </View>
  );
}

export default function RootLayout() {
  // Force RTL for Arabic
  useEffect(() => {
    I18nManager.forceRTL(true);
  }, []);

  // Load Cairo font
  const [fontsLoaded] = useFonts({
    "Cairo-Regular": require("../assets/fonts/Cairo-Regular.ttf"),
    "Cairo-Bold": require("../assets/fonts/Cairo-Bold.ttf"),
  });

  if (!fontsLoaded) {
    return <AppText>...جاري تحميل الخط</AppText>;
  }

  return (
    <SettingsProvider>
      <ThemeProvider>
        <Stack
          screenOptions={{
            header: AppHeader,
            headerStyle: {
              backgroundColor: 'transparent',
              shadowColor: "transparent",
              elevation: 0,
              borderBottomWidth: 0,
            },
            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />
      </ThemeProvider>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Platform.OS === "ios" ? SPACING.xl * 1.5 : SPACING.lg,
    paddingBottom: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
    minHeight: 90,
    gap: 14,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  appIconText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  headerTitle: {
    fontFamily: "Cairo-Bold",
    fontSize: 32,
    textAlign: "center",
    letterSpacing: 1,
    flex: 1,
  },
  settingsButton: {
    position: "absolute",
    right: SPACING.lg,
    top: Platform.OS === "ios" ? SPACING.xl * 1.5 : SPACING.lg,
    padding: SPACING.sm,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
});
