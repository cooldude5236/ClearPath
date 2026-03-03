import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useSettings, LANGUAGES } from "@/contexts/SettingsContext";
import type { Language, Units } from "@/contexts/SettingsContext";

type SettingsUnits = Units;

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { language, setLanguage, units, setUnits } = useSettings();

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const handleLanguageSelect = (code: Language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setLanguage(code);
  };

  const handleUnitsSelect = (u: SettingsUnits) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setUnits(u);
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + webTopInset + 12 },
        ]}
      >
        <Pressable
          onPress={handleBack}
          style={styles.backButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <Ionicons name="arrow-back" size={24} color={Colors.textLight} />
        </Pressable>
        <Text style={styles.headerTitle} accessibilityRole="header">
          Settings
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + webBottomInset + 32 },
        ]}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.aboutLine}>Team 2-1016-1</Text>
            <Text style={styles.aboutLine}>TSA Software Development</Text>
            <View style={styles.aboutDivider} />
            <Text style={styles.aboutDetail}>Revision 8</Text>
            <Text style={styles.aboutDetail}>Build Ver. 21016.033.08.01</Text>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="language" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Language</Text>
          </View>
          <View style={styles.card}>
            {LANGUAGES.map((lang, index) => (
              <Pressable
                key={lang.code}
                onPress={() => handleLanguageSelect(lang.code)}
                style={[
                  styles.optionRow,
                  index < LANGUAGES.length - 1 && styles.optionRowBorder,
                ]}
                accessibilityLabel={`${lang.label}. ${language === lang.code ? "Selected" : "Not selected"}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: language === lang.code }}
              >
                <View style={styles.optionInfo}>
                  <Text style={styles.optionLabel}>{lang.label}</Text>
                  <Text style={styles.optionNative}>{lang.native}</Text>
                </View>
                <View
                  style={[
                    styles.radio,
                    language === lang.code && styles.radioSelected,
                  ]}
                >
                  {language === lang.code && (
                    <View style={styles.radioInner} />
                  )}
                </View>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="map-marker-distance" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Units</Text>
          </View>
          <View style={styles.card}>
            <View style={styles.unitsRow}>
              <Pressable
                onPress={() => handleUnitsSelect("imperial")}
                style={[
                  styles.unitButton,
                  units === "imperial" && styles.unitButtonActive,
                ]}
                accessibilityLabel={`Imperial, feet. ${units === "imperial" ? "Selected" : "Not selected"}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: units === "imperial" }}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    units === "imperial" && styles.unitButtonTextActive,
                  ]}
                >
                  ft
                </Text>
                <Text
                  style={[
                    styles.unitButtonSub,
                    units === "imperial" && styles.unitButtonSubActive,
                  ]}
                >
                  Imperial
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleUnitsSelect("metric")}
                style={[
                  styles.unitButton,
                  units === "metric" && styles.unitButtonActive,
                ]}
                accessibilityLabel={`Metric, metres. ${units === "metric" ? "Selected" : "Not selected"}`}
                accessibilityRole="radio"
                accessibilityState={{ selected: units === "metric" }}
              >
                <Text
                  style={[
                    styles.unitButtonText,
                    units === "metric" && styles.unitButtonTextActive,
                  ]}
                >
                  m
                </Text>
                <Text
                  style={[
                    styles.unitButtonSub,
                    units === "metric" && styles.unitButtonSubActive,
                  ]}
                >
                  Metric
                </Text>
              </Pressable>
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
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: Colors.primary,
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.textLight,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 24,
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 4,
  },
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  aboutLine: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
    textAlign: "center",
  },
  aboutDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  aboutDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 56,
  },
  optionRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  optionInfo: {
    gap: 2,
  },
  optionLabel: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  optionNative: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  unitsRow: {
    flexDirection: "row",
    gap: 12,
  },
  unitButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    gap: 4,
    minHeight: 80,
  },
  unitButtonActive: {
    backgroundColor: Colors.primary,
  },
  unitButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 24,
    color: Colors.text,
  },
  unitButtonTextActive: {
    color: Colors.textLight,
  },
  unitButtonSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  unitButtonSubActive: {
    color: "rgba(255,255,255,0.8)",
  },
});
