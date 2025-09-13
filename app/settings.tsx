import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Speech from "expo-speech";
import React from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View
} from "react-native";
import AppButton from "../components/AppButton";
import AppText from "../components/AppText";
import { useSettings } from "../contexts/SettingsContext";
import { getColors } from "../theme/colors";
import { createCardStyle } from "../theme/designSystem";
import { haptic } from "../theme/haptics";
import { SPACING } from "../theme/spacing";

export default function SettingsScreen() {
  const { settings, updateSetting, effectiveTheme, fontScale } = useSettings();

  const handleSettingChange = (key: keyof typeof settings, value: any) => {
    updateSetting(key, value);
    haptic.selection();
    
    // Announce changes for accessibility
    if (settings.ttsEnabled) {
      Speech.speak("تم حفظ الإعدادات", { 
        language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
        rate: settings.ttsRate,
        pitch: settings.ttsPitch,
        quality: 'enhanced'
      });
    }
  };

  const speakSetting = (text: string) => {
    if (settings.ttsEnabled) {
      Speech.speak(text, { 
        language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
        rate: settings.ttsRate,
        pitch: settings.ttsPitch,
        quality: 'enhanced'
      });
    }
  };

  const colors = getColors(effectiveTheme);
  
  const SettingItem = ({ 
    title, 
    subtitle, 
    onPress, 
    rightElement, 
    icon,
    testSetting 
  }: {
    title: string;
    subtitle?: string;
    onPress?: () => void;
    rightElement?: React.ReactNode;
    icon: string;
    testSetting?: () => void;
  }) => (
    <TouchableOpacity
      style={[
        styles.settingItem,
        createCardStyle(),
        { backgroundColor: colors.surface }
      ]}
      onPress={() => {
        haptic.selection();
        speakSetting(title);
        onPress?.();
        testSetting?.();
      }}
      accessibilityLabel={title}
      accessibilityHint={subtitle}
      accessibilityRole="button"
    >
      <View style={styles.settingLeft}>
        <MaterialCommunityIcons 
          name={icon as any} 
          size={24} 
          color={colors.primary} 
        />
        <View style={styles.settingText}>
          <AppText style={[styles.settingTitle, { color: colors.text, fontSize: 16 * fontScale }]}>
            {title}
          </AppText>
          {subtitle && (
            <AppText style={[styles.settingSubtitle, { color: colors.textSecondary, fontSize: 14 * fontScale }]}>
              {subtitle}
            </AppText>
          )}
        </View>
      </View>
      {rightElement}
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <AppText style={[styles.sectionHeader, { color: colors.primary, fontSize: 20 * fontScale }]}>
      {title}
    </AppText>
  );

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: colors.surfaceElevated }]}
          onPress={() => {
            haptic.selection();
            router.replace('/');
          }}
          accessibilityLabel="العودة للصفحة الرئيسية"
          accessibilityRole="button"
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        
        <View style={styles.headerContent}>
          <AppText style={[styles.headerTitle, { color: colors.text, fontSize: 32 * fontScale }]}>
            الإعدادات
          </AppText>
          <AppText style={[styles.headerSubtitle, { color: colors.textSecondary, fontSize: 16 * fontScale }]}>
            تخصيص تجربتك في تطبيق عين
          </AppText>
        </View>
      </View>

      {/* Theme Settings */}
      <SectionHeader title="المظهر" />
      <SettingItem
        title="الوضع المظلم"
        subtitle={settings.theme === 'dark' ? 'مفعل' : settings.theme === 'light' ? 'معطل' : 'تلقائي'}
        icon="theme-light-dark"
        rightElement={
          <Switch
            value={settings.theme === 'dark'}
            onValueChange={(value) => handleSettingChange('theme', value ? 'dark' : 'auto')}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.theme === 'dark' ? '#fff' : colors.textSecondary}
          />
        }
        onPress={() => {
          const nextTheme = settings.theme === 'dark' ? 'light' : 
                           settings.theme === 'light' ? 'auto' : 'dark';
          handleSettingChange('theme', nextTheme);
        }}
      />

      <SettingItem
        title="التباين العالي"
        subtitle="تحسين الرؤية للمستخدمين ضعاف البصر"
        icon="contrast-box"
        rightElement={
          <Switch
            value={settings.highContrast}
            onValueChange={(value) => handleSettingChange('highContrast', value)}
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor={settings.highContrast ? '#fff' : colors.textSecondary}
          />
        }
      />

      {/* Accessibility Settings */}
      <SectionHeader title="إمكانية الوصول" />
      <SettingItem
        title="حجم الخط"
        subtitle={`الحالي: ${settings.fontSize}`}
        icon="format-size"
        onPress={() => {
          const sizes = ['small', 'medium', 'large', 'extra-large'];
          const currentIndex = sizes.indexOf(settings.fontSize);
          const nextSize = sizes[(currentIndex + 1) % sizes.length];
          handleSettingChange('fontSize', nextSize);
        }}
      />

      <SettingItem
        title="تفعيل قارئ الشاشة"
        subtitle={settings.ttsEnabled ? 'مفعل' : 'معطل'}
        icon="text-to-speech"
        rightElement={
          <Switch
            value={settings.ttsEnabled}
            onValueChange={(value) => handleSettingChange('ttsEnabled', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.ttsEnabled ? '#fff' : colors.textSecondary}
          />
        }
        testSetting={() => {
          if (settings.ttsEnabled) {
            Speech.speak("تم تفعيل قارئ الشاشة", { 
              language: 'ar-SA', 
              rate: settings.ttsRate,
              pitch: settings.ttsPitch,
              quality: 'enhanced'
            });
          }
        }}
      />

      <SettingItem
        title="التحدث التلقائي"
        subtitle="قراءة النصوص تلقائياً"
        icon="auto-fix"
        rightElement={
          <Switch
            value={settings.autoSpeak}
            onValueChange={(value) => handleSettingChange('autoSpeak', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.autoSpeak ? '#fff' : colors.textSecondary}
          />
        }
      />

      {/* Voice Settings */}
      <SectionHeader title="إعدادات الصوت" />
      <SettingItem
        title="سرعة الكلام"
        subtitle={`الحالية: ${Math.round(settings.ttsRate * 100)}%`}
        icon="speedometer"
        onPress={() => {
          const rates = [0.5, 0.7, 0.9, 1.1, 1.3];
          const currentIndex = rates.indexOf(settings.ttsRate);
          const nextRate = rates[(currentIndex + 1) % rates.length];
          handleSettingChange('ttsRate', nextRate);
        }}
        testSetting={() => {
          if (settings.ttsEnabled) {
            Speech.speak(`سرعة الكلام ${Math.round(settings.ttsRate * 100)} بالمئة`, { 
              language: 'ar-SA', 
              rate: settings.ttsRate,
              pitch: settings.ttsPitch,
              quality: 'enhanced'
            });
          }
        }}
      />

      <SettingItem
        title="نبرة الصوت"
        subtitle={`الحالية: ${Math.round(settings.ttsPitch * 100)}%`}
        icon="music-note"
        onPress={() => {
          const pitches = [0.5, 0.8, 1.0, 1.2, 1.5];
          const currentIndex = pitches.indexOf(settings.ttsPitch);
          const nextPitch = pitches[(currentIndex + 1) % pitches.length];
          handleSettingChange('ttsPitch', nextPitch);
        }}
        testSetting={() => {
          if (settings.ttsEnabled) {
            Speech.speak(`نبرة الصوت ${Math.round(settings.ttsPitch * 100)} بالمئة`, { 
              language: 'ar-SA', 
              rate: settings.ttsRate,
              pitch: settings.ttsPitch,
              quality: 'enhanced'
            });
          }
        }}
      />

      <SettingItem
        title="اللغة"
        subtitle={settings.language === 'ar' ? 'العربية' : 'English'}
        icon="translate"
        onPress={() => {
          const nextLang = settings.language === 'ar' ? 'en' : 'ar';
          handleSettingChange('language', nextLang);
        }}
      />

      {/* Interaction Settings */}
      <SectionHeader title="التفاعل" />
      <SettingItem
        title="الاهتزاز"
        subtitle="ردود فعل لمسية"
        icon="vibrate"
        rightElement={
          <Switch
            value={settings.hapticEnabled}
            onValueChange={(value) => handleSettingChange('hapticEnabled', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.hapticEnabled ? '#fff' : colors.textSecondary}
          />
        }
      />

      <SettingItem
        title="الأصوات"
        subtitle="أصوات التأكيد والتفاعل"
        icon="volume-high"
        rightElement={
          <Switch
            value={settings.soundEffects}
            onValueChange={(value) => handleSettingChange('soundEffects', value)}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={settings.soundEffects ? '#fff' : colors.textSecondary}
          />
        }
      />

      {/* Test Voice Button */}
      <View style={styles.testSection}>
        <AppButton
          title="اختبار الصوت"
          onPress={() => {
            if (settings.ttsEnabled) {
              Speech.speak(
                "مرحباً، هذا اختبار لجودة الصوت في تطبيق عين. كيف يبدو الصوت لك؟",
                { 
                  language: settings.language === 'ar' ? 'ar-SA' : 'en-US', 
                  rate: settings.ttsRate,
                  pitch: settings.ttsPitch,
                  quality: 'enhanced'
                }
              );
            } else {
              Alert.alert("تنبيه", "يرجى تفعيل قارئ الشاشة أولاً");
            }
          }}
          style={styles.testButton}
        />
      </View>

      {/* Reset Button */}
      <View style={styles.resetSection}>
        <AppButton
          title="إعادة تعيين الإعدادات"
          onPress={() => {
            Alert.alert(
              "تأكيد",
              "هل أنت متأكد من إعادة تعيين جميع الإعدادات؟",
              [
                { text: "إلغاء", style: "cancel" },
                { 
                  text: "إعادة تعيين", 
                  style: "destructive",
                  onPress: () => {
                    // Reset all settings to default values
                    Object.keys(settings).forEach(key => {
                      const defaultValues = {
                        theme: 'auto',
                        highContrast: false,
                        fontSize: 'medium',
                        ttsEnabled: true,
                        ttsRate: 0.9,
                        ttsPitch: 1.0,
                        hapticEnabled: true,
                        autoSpeak: true,
                        language: 'ar',
                        soundEffects: true,
                      };
                      handleSettingChange(key as keyof typeof settings, defaultValues[key as keyof typeof defaultValues]);
                    });
                  }
                }
              ]
            );
          }}
          style={[styles.resetButton, { borderColor: colors.accent }]}
          textStyle={{ color: colors.accent }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
    alignItems: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    top: 0,
    right: 0,
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
  headerContent: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    fontFamily: "Cairo-Bold",
    textAlign: "center",
    marginBottom: SPACING.sm,
  },
  headerSubtitle: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: SPACING.lg,
    marginBottom: SPACING.md,
    fontFamily: "Cairo-Bold",
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: SPACING.lg,
    marginBottom: SPACING.sm,
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: SPACING.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Cairo-Regular",
  },
  settingSubtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.7,
  },
  testSection: {
    marginTop: SPACING.xl,
    marginBottom: SPACING.lg,
  },
  testButton: {
    backgroundColor: "#4CAF50",
  },
  resetSection: {
    marginTop: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  resetButton: {
    backgroundColor: "transparent",
    borderWidth: 2,
  },
});
