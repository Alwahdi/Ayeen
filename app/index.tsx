import { haptic } from "../theme/haptics";
// @ts-ignore: No type definitions for expo-speech
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useEffect, useState as useLocalState, useRef, useState } from "react";
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import AppMicButton from "../components/AppMicButton";
import AppText from "../components/AppText";
import { getColors } from "../theme/colors";
import { SPACING } from "../theme/spacing";
// --- Speech-to-text placeholder (replace with real implementation if available) ---
function useSpeechToTextMock() {
  const [isListening, setIsListening] = useLocalState(false);
  const [transcript, setTranscript] = useLocalState("");
  const startListening = async () => {
    setIsListening(true);
    setTranscript("");
    setTimeout(() => {
      setTranscript("مرحباً! هذا نص تجريبي من الميكروفون.");
      setIsListening(false);
    }, 2500);
  };
  const stopListening = async () => setIsListening(false);
  return { isListening, transcript, startListening, stopListening };
}

export default function Home() {
  // Speech-to-text state
  const { isListening, transcript, startListening, stopListening } =
    useSpeechToTextMock();
  const scheme = useColorScheme();
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [fontScale, setFontScale] = useState(1);
  // TODO: Replace with real user name if available
  const userName = "عبدالله";
  const colors = getColors(scheme);
  const effectiveColors = highContrast
    ? {
        ...colors,
        background: "#000",
        text: "#fff",
        primary: "#FFD600",
        accent: "#FF1744",
        surface: "#222",
      }
    : colors;

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return `☀️ صباح الخير${userName ? " " + userName : ""}`;
    if (hour < 18) return `🌤️ مساء الخير${userName ? " " + userName : ""}`;
    return `🌙 ليلة سعيدة${userName ? " " + userName : ""}`;
  };
  // Set custom screen title for Expo Router (if using)
  // (Navigation options should be set in your navigation config, not here)

  // Animation for mic glow
  const micGlow = useRef(new Animated.Value(1)).current;
  const animateMic = () => {
    Animated.sequence([
      Animated.timing(micGlow, {
        toValue: 1.15,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }),
      Animated.timing(micGlow, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
        easing: Easing.in(Easing.ease),
      }),
    ]).start();
  };

  // Announce page for screen readers
  useEffect(() => {
    AccessibilityInfo.announceForAccessibility(
      "الصفحة الرئيسية، مرحباً بك في تطبيق أيين"
    );
    if (ttsEnabled) {
      Speech.speak(
        "مرحباً بك في تطبيق أيين. هذه الصفحة الرئيسية. جميع الخيارات تدعم قارئ الشاشة.",
        { language: "ar", rate: 0.9 }
      );
    }
  }, [ttsEnabled]);

  // TTS for actions
  const speak = (text: string) => {
    if (ttsEnabled) {
      Speech.speak(text, { language: "ar", rate: 0.95 });
    }
  };

  // Minimal quick actions (only one, more in other screens)
  const quickActions = [
    {
      title: "المزيد من الخيارات",
      onPress: () => {
        haptic.selection();
        haptic.notification("success");
        speak("المزيد من الخيارات");
        // TODO: Navigate to actions/explore screen
      },
      accessibilityLabel: "زر المزيد من الخيارات",
      icon: "➕",
    },
  ];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: effectiveColors.background },
      ]}
    >
      {/* Header: App logo + greeting */}
      <View style={{ alignItems: "center", marginBottom: SPACING.lg }}>
        {/* You can replace this with your app logo if available */}
        <AppText
          style={{
            fontSize: 40 * fontScale,
            fontWeight: "bold",
            color: effectiveColors.primary,
            textAlign: "center",
            marginBottom: SPACING.sm,
          }}
          accessibilityRole="header"
          allowFontScaling
        >
          👁️ أيين
        </AppText>
        <AppText
          style={{
            fontSize: 28 * fontScale,
            fontWeight: "700",
            color: effectiveColors.text,
            textAlign: "center",
          }}
          accessibilityRole="header"
          allowFontScaling
        >
          {getGreeting()}
        </AppText>
      </View>

      {/* Big Mic Button */}

      {/* Animated Mic Button with Glow */}
      <Animated.View
        style={{
          alignSelf: "center",
          transform: [{ scale: micGlow }],
          shadowColor: isListening
            ? effectiveColors.accent
            : effectiveColors.primary,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: isListening ? 0.95 : 0.7,
          shadowRadius: isListening ? 48 : 32,
        }}
        accessible={false}
      >
        <AppMicButton
          onPress={async () => {
            animateMic();
            // Special haptic for mic: heavy + selection + notification
            haptic.heavy();
            setTimeout(() => haptic.selection(), 80);
            setTimeout(() => haptic.notification("success"), 180);
            speak("يرجى التحدث الآن. الميكروفون يعمل.");
            await startListening();
          }}
          accessibilityLabel={
            isListening
              ? "الميكروفون يستمع الآن. اضغط للإيقاف."
              : "زر الميكروفون الرئيسي. اضغط للتحدث."
          }
          size={isListening ? 170 : 148}
          color={isListening ? effectiveColors.accent : "#fff"}
          backgroundColor={
            isListening ? effectiveColors.surface : effectiveColors.primary
          }
        />
      </Animated.View>

      {/* Mic hint and transcript */}
      <AppText
        style={{
          color: isListening
            ? effectiveColors.accent
            : effectiveColors.textSecondary,
          fontSize: 18 * fontScale,
          textAlign: "center",
          marginTop: -SPACING.sm,
          marginBottom: SPACING.sm,
          fontWeight: isListening ? "700" : "400",
        }}
      >
        {isListening
          ? "الميكروفون يستمع... تحدث الآن"
          : "اضغط على الميكروفون وابدأ التحدث فوراً"}
      </AppText>
      {transcript ? (
        <View
          style={{
            backgroundColor: effectiveColors.surface,
            borderRadius: 20,
            padding: SPACING.md,
            marginHorizontal: SPACING.md,
            marginBottom: SPACING.md,
            alignSelf: "center",
            maxWidth: 420,
            shadowColor: effectiveColors.primary,
            shadowOpacity: 0.12,
            shadowRadius: 8,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <AppText
            style={{
              color: effectiveColors.text,
              fontSize: 20 * fontScale,
              textAlign: "center",
              fontWeight: "600",
              flex: 1,
            }}
          >
            {transcript}
          </AppText>
          <TouchableOpacity
            onPress={() => {
              haptic.selection();
              haptic.notification("success");
              Speech.speak(transcript, { language: "ar", rate: 0.95 });
            }}
            accessibilityLabel="تشغيل النص المنطوق"
            style={{
              marginLeft: 8,
              padding: 8,
              borderRadius: 999,
              backgroundColor: effectiveColors.primary,
            }}
          >
            <MaterialCommunityIcons
              name="volume-high"
              size={28}
              color={effectiveColors.surface}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      {/* Concise help/hint */}
      <AppText
        style={{
          color: effectiveColors.textSecondary,
          fontSize: 16 * fontScale,
          textAlign: "center",
          marginTop: SPACING.md,
        }}
      >
        هذا التطبيق يدعم المكفوفين بالكامل — تحدث أو استخدم قارئ الشاشة.
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "stretch",
    padding: SPACING.lg,
  },
  heading: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: SPACING.xl,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#181A20",
    marginBottom: SPACING.md,
    textAlign: "center",
  },
  card: {
    marginBottom: SPACING.xl,
  },
});
