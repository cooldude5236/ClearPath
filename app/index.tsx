import React, { useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  AccessibilityInfo,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { HOTEL_INFO } from "@/constants/hotel-data";

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.6, { duration: 1200, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const handleNfcTap = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/room-select");
  };

  const handleManualEntry = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push("/room-select");
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight, "#3A7D5C"]}
      style={styles.container}
    >
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + webTopInset + 40,
            paddingBottom: insets.bottom + webBottomInset + 24,
          },
        ]}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/settings");
            }}
            style={styles.settingsButton}
            accessibilityLabel="Settings and Info"
            accessibilityRole="button"
            accessibilityHint="Opens settings for language, units, and app info"
          >
            <Ionicons name="settings-outline" size={18} color={Colors.textLight} />
            <Text style={styles.settingsLabel}>Settings / Info</Text>
          </Pressable>
          <MaterialCommunityIcons
            name="home-city"
            size={32}
            color={Colors.accentLight}
            accessibilityElementsHidden={true}
            importantForAccessibility="no-hide-descendants"
          />
          <Text
            style={styles.hotelName}
            accessibilityRole="header"
          >
            {HOTEL_INFO.name}
          </Text>
          <Text style={styles.hotelSubtitle} accessibilityRole="text">{HOTEL_INFO.subtitle}</Text>
        </View>

        <View style={styles.nfcSection} accessible={true} accessibilityRole="text" accessibilityLabel="Find Your Room. Tap your key card or enter your room number.">
          <Text style={styles.tapTitle}>Find Your Room</Text>
          <Text style={styles.tapSubtitle}>
            Tap your key card or enter your room number
          </Text>

          <Pressable
            onPress={handleNfcTap}
            style={({ pressed }) => [
              styles.nfcButton,
              pressed && styles.nfcButtonPressed,
            ]}
            accessibilityLabel="Tap Key Card"
            accessibilityRole="button"
            accessibilityHint="Double tap to scan your hotel key card and go to room selection"
          >
            <Animated.View style={[styles.nfcPulse, pulseStyle]} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants" />
            <View style={styles.nfcInner} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
              <MaterialCommunityIcons
                name="nfc"
                size={56}
                color={Colors.primary}
              />
              <Text style={styles.nfcText}>Tap Key Card</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.bottomSection}>
          <View style={styles.dividerRow} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Pressable
            onPress={handleManualEntry}
            style={({ pressed }) => [
              styles.manualButton,
              pressed && styles.manualButtonPressed,
            ]}
            accessibilityLabel="Enter Room Number"
            accessibilityRole="button"
            accessibilityHint="Double tap to type in your room number using a keypad"
          >
            <Ionicons name="keypad-outline" size={22} color={Colors.textLight} />
            <Text style={styles.manualButtonText}>Enter Room Number</Text>
          </Pressable>

          <View style={styles.accessibilityBadge} accessible={true} accessibilityRole="text" accessibilityLabel="Accessibility-friendly directions available">
            <MaterialCommunityIcons
              name="wheelchair-accessibility"
              size={18}
              color={Colors.accessible}
            />
            <Text style={styles.accessibilityText}>
              Accessibility-friendly directions available
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "space-between",
  },
  header: {
    alignItems: "center",
    gap: 6,
  },
  settingsButton: {
    position: "absolute",
    top: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.12)",
    zIndex: 10,
  },
  settingsLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: Colors.textLight,
  },
  hotelName: {
    fontFamily: "Inter_700Bold",
    fontSize: 26,
    color: Colors.textLight,
    textAlign: "center",
    marginTop: 8,
  },
  hotelSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    maxWidth: 260,
    lineHeight: 20,
  },
  nfcSection: {
    alignItems: "center",
    gap: 12,
  },
  tapTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.textLight,
    textAlign: "center",
  },
  tapSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 22,
  },
  nfcButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  nfcButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  nfcPulse: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  nfcInner: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  nfcText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.primary,
  },
  bottomSection: {
    gap: 16,
    alignItems: "center",
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  dividerText: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.3)",
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    width: "100%",
    minHeight: 60,
  },
  manualButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.25)",
  },
  manualButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.textLight,
  },
  accessibilityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  accessibilityText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
});
