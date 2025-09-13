import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React, { useEffect, useRef, useState } from "react";
import {
    AccessibilityInfo,
    Alert,
    Animated,
    Dimensions,
    Easing,
    Platform,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    View
} from "react-native";

import AppMicButton from "../components/AppMicButton";
import AppText from "../components/AppText";
import { useSettings } from "../contexts/SettingsContext";
import { getColors } from "../theme/colors";
import { createButtonStyle, createCardStyle } from "../theme/designSystem";
import { haptic } from "../theme/haptics";
import { SPACING } from "../theme/spacing";

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Conditional imports for Expo Go compatibility
let Voice: any = null;
try {
  if (Platform.OS !== 'web') {
    Voice = require('@react-native-voice/voice').default;
  }
} catch (error) {
  console.log('Voice module not available in Expo Go');
}

// Web Speech Recognition types
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    initializeVoice();
    
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  const initializeVoice = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsInitialized(true);
        return;
      }

      // Initialize Voice
      Voice.onSpeechResults = (e: any) => {
        if (isMounted.current && e.value?.[0]) {
          setTranscript(e.value[0]);
        }
      };
      
      Voice.onSpeechEnd = () => {
        if (isMounted.current) {
          setIsListening(false);
        }
      };
      
      Voice.onSpeechError = (e: any) => {
        console.log("Speech error:", e);
        if (isMounted.current) {
          setIsListening(false);
          Alert.alert("خطأ", "حدث خطأ في التعرف على الكلام. حاول مرة أخرى.");
        }
      };
      
      Voice.onSpeechStart = () => {
        console.log("Speech recognition started");
      };

      setIsInitialized(true);
    } catch (error) {
      console.log("Error initializing voice:", error);
      setIsInitialized(true);
    }
  };

  const cleanup = async () => {
    try {
      if (Platform.OS !== 'web') {
        await Voice.destroy();
        Voice.removeAllListeners();
      }
    } catch (error) {
      console.log("Error cleaning up voice:", error);
    }
  };

  const startListening = async () => {
    try {
      if (Platform.OS === 'web') {
        await startWebSpeechRecognition();
      } else {
        await startNativeSpeechRecognition();
      }
    } catch (error) {
      console.log("Error starting speech recognition:", error);
      setIsListening(false);
      Alert.alert("خطأ", "لا يمكن تشغيل الميكروفون. تأكد من السماح للتطبيق بالوصول للميكروفون.");
    }
  };

  const startWebSpeechRecognition = async () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'ar-SA';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        setTranscript(result);
        setIsListening(false);
      };
      
      recognition.onerror = (event: any) => {
        console.log("Speech recognition error:", event.error);
        setIsListening(false);
        Alert.alert("خطأ", "لا يمكن تشغيل الميكروفون على المتصفح.");
      };
      
      recognition.onend = () => {
        setIsListening(false);
      };
      
      setTranscript("");
      setIsListening(true);
      recognition.start();
    } else {
      Alert.alert("خطأ", "المتصفح لا يدعم التعرف على الكلام. جرب على الهاتف المحمول.");
    }
  };

  const startNativeSpeechRecognition = async () => {
    try {
      // For Expo Go, we'll skip permission check since native modules aren't available
      // In a real app, you would request microphone permissions here

      setTranscript("");
      setIsListening(true);
      await Voice.start("ar-SA");
    } catch (error) {
      console.log("Error starting native speech recognition:", error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      if (Platform.OS !== 'web') {
        await Voice.stop();
      }
    } catch (error) {
      console.log("Error stopping speech recognition:", error);
    }
  };

  const clearTranscript = () => {
    setTranscript("");
  };

  return { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    clearTranscript,
    isInitialized 
  };
}

export default function Home() {
  // Speech-to-text state
  const { isListening, transcript, startListening, stopListening, clearTranscript } =
    useSpeechToText();
  
  // Settings context
  const { settings, effectiveTheme, fontScale } = useSettings();
  const colors = getColors(effectiveTheme);
  
  // Enhanced professional color scheme with mobile-first design
  const effectiveColors = settings.highContrast
    ? {
        ...colors,
        background: "#000000",
        backgroundSecondary: "#111111",
        text: "#FFFFFF",
        textSecondary: "#CCCCCC",
        primary: "#00D4FF",
        primaryLight: "#33DDFF",
        accent: "#FF6B6B",
        surface: "#1A1A1A",
        surfaceElevated: "#2A2A2A",
        border: "#333333",
        shadow: "rgba(0, 212, 255, 0.3)",
      }
    : {
        ...colors,
        background: effectiveTheme === 'dark' ? "#0F172A" : "#F8FAFC",
        backgroundSecondary: effectiveTheme === 'dark' ? "#1E293B" : "#FFFFFF",
        text: effectiveTheme === 'dark' ? "#F1F5F9" : "#1E293B",
        textSecondary: effectiveTheme === 'dark' ? "#94A3B8" : "#64748B",
        primary: effectiveTheme === 'dark' ? "#60A5FA" : "#3B82F6",
        primaryLight: effectiveTheme === 'dark' ? "#93C5FD" : "#60A5FA",
        accent: "#EF4444",
        surface: effectiveTheme === 'dark' ? "#1E293B" : "#FFFFFF",
        surfaceElevated: effectiveTheme === 'dark' ? "#334155" : "#F1F5F9",
        border: effectiveTheme === 'dark' ? "#475569" : "#E2E8F0",
        shadow: effectiveTheme === 'dark' ? "rgba(96, 165, 250, 0.2)" : "rgba(59, 130, 246, 0.15)",
      };

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    const userName = "عبدالله";
    if (hour < 12) return `☀️ صباح الخير${userName ? " " + userName : ""}`;
    if (hour < 18) return `🌤️ مساء الخير${userName ? " " + userName : ""}`;
    return `🌙 ليلة سعيدة${userName ? " " + userName : ""}`;
  };

  // Animation for mic glow
  const micGlow = useRef(new Animated.Value(1)).current;
  const animateMic = () => {
    if (settings.hapticEnabled) {
      haptic.heavy();
    }
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
    const announceWelcome = async () => {
      AccessibilityInfo.announceForAccessibility(
        "الصفحة الرئيسية، مرحباً بك في تطبيق عين"
      );
      if (settings.ttsEnabled && settings.autoSpeak) {
        await Speech.speak(
          "مرحباً بك في تطبيق أيين. هذه الصفحة الرئيسية. جميع الخيارات تدعم قارئ الشاشة.",
          { 
            language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
            rate: settings.ttsRate,
            pitch: settings.ttsPitch
          }
        );
      }
    };
    
    announceWelcome();
  }, []);

  // TTS for actions
  const speak = (text: string) => {
    if (settings.ttsEnabled) {
      Speech.speak(text, { 
        language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
        rate: settings.ttsRate,
        pitch: settings.ttsPitch
      });
    }
  };

  // Handle microphone press
  const handleMicPress = async () => {
    animateMic();
    if (settings.hapticEnabled) {
      setTimeout(() => haptic.selection(), 80);
      setTimeout(() => haptic.notification("success"), 180);
    }
    speak("يرجى التحدث الآن. الميكروفون يعمل.");
    await startListening();
  };

  // Handle play text
  const handlePlayText = () => {
    if (transcript && settings.ttsEnabled) {
      Speech.speak(transcript, { 
        language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
        rate: settings.ttsRate,
        pitch: settings.ttsPitch
      });
    }
  };

  // Handle clear text
  const handleClearText = () => {
    if (settings.hapticEnabled) {
      haptic.selection();
    }
    clearTranscript();
    if (settings.ttsEnabled) {
      speak("تم مسح النص");
    }
  };

  // Handle settings navigation
  const handleSettingsPress = () => {
    if (settings.hapticEnabled) {
      haptic.selection();
    }
    router.push('/settings');
  };

  return (
    <View style={[styles.container, { backgroundColor: effectiveColors.background }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, createCardStyle(true), { backgroundColor: effectiveColors.surface }]}>
          <View style={[styles.appIconContainer, { backgroundColor: effectiveColors.primary }]}>
            <AppText style={[styles.appIconText, { color: effectiveColors.surface }]}>
              👁️
            </AppText>
          </View>
          
          <AppText style={[styles.appTitle, { color: effectiveColors.text, fontSize: 32 * fontScale }]}>
            عين
          </AppText>
          
          <AppText style={[styles.greeting, { color: effectiveColors.textSecondary, fontSize: 18 * fontScale }]}>
            {getGreeting()}
          </AppText>
          
          <AppText style={[styles.subtitle, { color: effectiveColors.textSecondary, fontSize: 16 * fontScale }]}>
            مساعدك الذكي للتعرف على الكلام
          </AppText>
        </View>

        {/* Status Card */}
        <View style={[styles.statusCard, createCardStyle(), { backgroundColor: effectiveColors.surface }]}>
          <View style={styles.statusHeader}>
            <View style={[styles.statusIndicator, { backgroundColor: isListening ? effectiveColors.accent : effectiveColors.primary }]} />
            <AppText style={[styles.statusText, { color: effectiveColors.text, fontSize: 18 * fontScale }]}>
              {isListening ? "يستمع الآن..." : "جاهز للاستخدام"}
            </AppText>
          </View>
        </View>

        {/* Professional Mic Button Container */}
        <View style={styles.micContainer}>
          <Animated.View
            style={[
              styles.micButtonWrapper,
              { transform: [{ scale: micGlow }] }
            ]}
            accessible={false}
          >
            {/* Glow Effect */}
            <View style={[
              styles.micGlow,
              { 
                backgroundColor: isListening ? effectiveColors.accent : effectiveColors.primary,
                opacity: isListening ? 0.3 : 0.2,
              }
            ]} />
            
            <AppMicButton
              onPress={handleMicPress}
              accessibilityLabel={
                isListening
                  ? "الميكروفون يستمع الآن. اضغط للإيقاف."
                  : "زر الميكروفون الرئيسي. اضغط للتحدث."
              }
              size={isListening ? 120 : 100}
              color={effectiveColors.surface}
              backgroundColor={isListening ? effectiveColors.accent : effectiveColors.primary}
            />
          </Animated.View>
          
          <AppText
            style={[styles.micHint, { color: effectiveColors.textSecondary }]}
          >
            {isListening ? "تحدث الآن..." : "اضغط للتحدث"}
          </AppText>
          
          {!Voice && Platform.OS !== 'web' && (
            <AppText
              style={[styles.demoNotice, { color: effectiveColors.textSecondary }]}
            >
              عرض توضيحي - للاستخدام الكامل، جرب على الويب أو استخدم تطبيق مخصص
            </AppText>
          )}
        </View>

        {/* Transcript Card */}
        {transcript ? (
          <View style={[styles.transcriptCard, createCardStyle(), { backgroundColor: effectiveColors.surface }]}>
            <View style={styles.transcriptHeader}>
              <MaterialCommunityIcons 
                name="text-box" 
                size={24} 
                color={effectiveColors.primary} 
              />
              <AppText style={[styles.transcriptTitle, { color: effectiveColors.text, fontSize: 18 * fontScale }]}>
                النص المقروء
              </AppText>
            </View>
            
            <AppText style={[styles.transcriptText, { color: effectiveColors.text, fontSize: 16 * fontScale }]}>
              {transcript}
            </AppText>
            
            <View style={styles.transcriptActions}>
              <TouchableOpacity
                style={[styles.playButton, createButtonStyle('medium'), { backgroundColor: effectiveColors.primary }]}
                onPress={handlePlayText}
                accessibilityLabel="تشغيل النص المنطوق"
              >
                <MaterialCommunityIcons
                  name="volume-high"
                  size={20}
                  color={effectiveColors.surface}
                />
                <AppText style={[styles.playButtonText, { color: effectiveColors.surface, fontSize: 16 * fontScale }]}>
                  تشغيل
                </AppText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.clearButton, createButtonStyle('medium'), { backgroundColor: effectiveColors.accent }]}
                onPress={handleClearText}
                accessibilityLabel="مسح النص"
              >
                <MaterialCommunityIcons
                  name="delete"
                  size={20}
                  color={effectiveColors.surface}
                />
                <AppText style={[styles.clearButtonText, { color: effectiveColors.surface, fontSize: 16 * fontScale }]}>
                  مسح
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Quick Actions */}
        <View style={styles.quickActionsSection}>
          <AppText style={[styles.quickActionsTitle, { color: effectiveColors.text, fontSize: 20 * fontScale }]}>
            الإجراءات السريعة
          </AppText>
          
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity 
              style={[styles.quickActionItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}
              onPress={handleSettingsPress}
              accessibilityLabel="فتح الإعدادات"
              accessibilityRole="button"
            >
              <MaterialCommunityIcons name="cog" size={28} color={effectiveColors.primary} />
              <AppText style={[styles.quickActionText, { color: effectiveColors.text, fontSize: 16 * fontScale }]}>
                الإعدادات
              </AppText>
            </TouchableOpacity>
            
            {transcript && (
              <TouchableOpacity 
                style={[styles.quickActionItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}
                onPress={handlePlayText}
                accessibilityLabel="تشغيل النص الأخير"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="volume-high" size={28} color={effectiveColors.primary} />
                <AppText style={[styles.quickActionText, { color: effectiveColors.text, fontSize: 16 * fontScale }]}>
                  تشغيل النص
                </AppText>
              </TouchableOpacity>
            )}
            
            {transcript && (
              <TouchableOpacity 
                style={[styles.quickActionItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}
                onPress={handleClearText}
                accessibilityLabel="مسح النص"
                accessibilityRole="button"
              >
                <MaterialCommunityIcons name="delete-outline" size={28} color={effectiveColors.primary} />
                <AppText style={[styles.quickActionText, { color: effectiveColors.text, fontSize: 16 * fontScale }]}>
                  مسح النص
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Features Section */}
        <View style={styles.featuresSection}>
          <AppText style={[styles.featuresTitle, { color: effectiveColors.text, fontSize: 20 * fontScale }]}>
            المميزات
          </AppText>
          
          <View style={styles.featuresGrid}>
            <View style={[styles.featureItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}>
              <MaterialCommunityIcons name="microphone" size={24} color={effectiveColors.primary} />
              <AppText style={[styles.featureText, { color: effectiveColors.textSecondary, fontSize: 14 * fontScale }]}>
                تعرف على الكلام
              </AppText>
            </View>
            
            <View style={[styles.featureItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}>
              <MaterialCommunityIcons name="volume-high" size={24} color={effectiveColors.primary} />
              <AppText style={[styles.featureText, { color: effectiveColors.textSecondary, fontSize: 14 * fontScale }]}>
                تحويل للنطق
              </AppText>
            </View>
            
            <View style={[styles.featureItem, createCardStyle(), { backgroundColor: effectiveColors.surface }]}>
              <MaterialCommunityIcons name="eye-outline" size={24} color={effectiveColors.primary} />
              <AppText style={[styles.featureText, { color: effectiveColors.textSecondary, fontSize: 14 * fontScale }]}>
                دعم كامل للمكفوفين
              </AppText>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxl,
  },
  heroSection: {
    alignItems: "center",
    paddingVertical: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  headerSection: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 30,
    paddingHorizontal: 24,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  appIconText: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: 36,
    fontWeight: "800",
    fontFamily: "Cairo-Bold",
    marginBottom: 8,
    textAlign: "center",
  },
  greeting: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "Cairo-Regular",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    opacity: 0.8,
  },
  mainContent: {
    flex: 1,
    padding: 24,
  },
  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  statusText: {
    fontSize: 16,
    fontWeight: "600",
  },
  micContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  micButtonWrapper: {
    position: "relative",
    marginBottom: 16,
  },
  micGlow: {
    position: "absolute",
    top: -20,
    left: -20,
    right: -20,
    bottom: -20,
    borderRadius: 999,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
  },
  micHint: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
  },
  demoNotice: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 8,
    opacity: 0.7,
    fontStyle: "italic",
  },
  transcriptCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  transcriptHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  transcriptTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  transcriptText: {
    fontSize: 20,
    fontWeight: "500",
    lineHeight: 28,
    marginBottom: 16,
    textAlign: "right",
  },
  playButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  playButtonText: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  quickActionsSection: {
    marginBottom: SPACING.xl,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  quickActionsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: SPACING.sm,
  },
  quickActionItem: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: SPACING.lg,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    marginTop: SPACING.sm,
  },
  featuresSection: {
    marginTop: "auto",
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  featuresGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featureItem: {
    flex: 1,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 4,
  },
  featureText: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
    marginTop: 8,
  },
  transcriptActions: {
    flexDirection: "row",
    gap: SPACING.md,
    justifyContent: "center",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
