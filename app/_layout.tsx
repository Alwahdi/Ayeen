import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { I18nManager, Text } from "react-native";
import { ThemeProvider } from "../theme/ThemeProvider";

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
    return <Text>...جاري تحميل الخط</Text>;
  }

  return (
    <ThemeProvider>
      <Stack />
    </ThemeProvider>
  );
}
