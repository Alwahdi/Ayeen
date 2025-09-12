import { Picker } from "@react-native-picker/picker";
import * as Haptics from "expo-haptics";
import { useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import AppButton from "../components/AppButton";
import AppCard from "../components/AppCard";
import AppText from "../components/AppText";
import { getColors } from "../theme/colors";
import { SPACING } from "../theme/spacing";

export default function Index() {
  const systemScheme = useColorScheme();
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");
  const colorScheme = theme === "auto" ? systemScheme : theme;
  const colors = getColors(colorScheme);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, padding: SPACING.lg },
      ]}
    >
      <AppText
        style={[
          styles.title,
          {
            color: colors.primary,
            fontSize: 28,
            fontWeight: "bold",
            marginBottom: SPACING.md,
          },
        ]}
      >
        إعدادات المظهر
      </AppText>
      <AppCard>
        <AppText
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
            marginBottom: SPACING.sm,
          }}
        >
          اختر وضع العرض:
        </AppText>
        <Picker
          selectedValue={theme}
          style={[
            styles.picker,
            { color: colors.text, marginBottom: SPACING.md },
          ]}
          onValueChange={(itemValue: "light" | "dark" | "auto") =>
            setTheme(itemValue)
          }
        >
          <Picker.Item label="تلقائي (حسب النظام)" value="auto" />
          <Picker.Item label="وضع ليلي" value="dark" />
          <Picker.Item label="وضع نهاري" value="light" />
        </Picker>
        <AppText
          style={[
            styles.currentMode,
            { color: colors.accent, marginBottom: SPACING.sm },
          ]}
        >
          الوضع الحالي: {colorScheme === "dark" ? "ليلي" : "نهاري"}
        </AppText>
      </AppCard>

      <AppCard>
        <AppText
          style={{
            color: colors.text,
            fontSize: 18,
            fontWeight: "700",
            marginBottom: SPACING.sm,
          }}
        >
          تجربة الزر الاحترافي
        </AppText>
        <AppButton
          title="زر احترافي بنظام التصميم"
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          }}
        />
      </AppCard>

      <AppCard>
        <AppText
          style={{
            color: colors.textSecondary,
            fontSize: 15,
            marginBottom: SPACING.sm,
          }}
        >
          هذا النظام اللوني يدعم التباين العالي، سهولة التخصيص، والامتداد لأي
          عدد من الثيمات أو الحالات.
        </AppText>
      </AppCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    width: 200,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "bold",
  },
  currentMode: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: "500",
  },
});

// ...existing code...
