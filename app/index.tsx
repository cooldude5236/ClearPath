import React, { useEffect, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Dimensions,
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
  withDelay,
  Easing,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { HOTEL_INFO } from "@/constants/hotel-data";

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

const PARTICLE_COUNT = 24;

function seededRandom(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

interface ParticleConfig {
  startX: number;
  startY: number;
  size: number;
  opacity: number;
  driftX: number;
  driftY: number;
  duration: number;
  delay: number;
}

function generateParticles(): ParticleConfig[] {
  const particles: ParticleConfig[] = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const r1 = seededRandom(i + 1);
    const r2 = seededRandom(i + 100);
    const r3 = seededRandom(i + 200);
    const r4 = seededRandom(i + 300);
    const r5 = seededRandom(i + 400);
    const r6 = seededRandom(i + 500);
    particles.push({
      startX: r1 * SCREEN_W * 0.9,
      startY: r2 * SCREEN_H * 0.9,
      size: 4 + r3 * 18,
      opacity: 0.04 + r4 * 0.1,
      driftX: (r5 - 0.5) * 90,
      driftY: (r6 - 0.5) * 120,
      duration: 3000 + r3 * 5000,
      delay: r1 * 3000,
    });
  }
  return particles;
}

function FloatingParticle({ config }: { config: ParticleConfig }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.7);
  const opacity = useSharedValue(config.opacity * 0.3);

  useEffect(() => {
    translateX.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftX, { duration: config.duration, easing: Easing.inOut(Easing.ease) }),
          withTiming(-config.driftX * 0.6, { duration: config.duration * 0.8, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: config.duration * 0.5, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    translateY.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.driftY, { duration: config.duration * 1.1, easing: Easing.inOut(Easing.ease) }),
          withTiming(-config.driftY * 0.7, { duration: config.duration * 0.9, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: config.duration * 0.6, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(1.3, { duration: config.duration * 0.7, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.7, { duration: config.duration * 0.7, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    opacity.value = withDelay(
      config.delay,
      withRepeat(
        withSequence(
          withTiming(config.opacity, { duration: config.duration * 0.5, easing: Easing.inOut(Easing.ease) }),
          withTiming(config.opacity * 0.3, { duration: config.duration * 0.5, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: config.startX,
          top: config.startY,
          width: config.size,
          height: config.size,
          borderRadius: config.size / 2,
          backgroundColor: "#FFFFFF",
        },
        animStyle,
      ]}
      accessibilityElementsHidden={true}
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.6);
  const particles = useMemo(() => generateParticles(), []);

  const shimmer1Y = useSharedValue(0);
  const shimmer2Y = useSharedValue(0);
  const shimmer1Opacity = useSharedValue(0);
  const shimmer2Opacity = useSharedValue(0);

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

    shimmer1Y.value = withRepeat(
      withSequence(
        withTiming(-SCREEN_H * 0.15, { duration: 8000, easing: Easing.inOut(Easing.ease) }),
        withTiming(SCREEN_H * 0.15, { duration: 8000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    shimmer1Opacity.value = withRepeat(
      withSequence(
        withTiming(0.06, { duration: 5000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.02, { duration: 5000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    shimmer2Y.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          withTiming(SCREEN_H * 0.12, { duration: 10000, easing: Easing.inOut(Easing.ease) }),
          withTiming(-SCREEN_H * 0.12, { duration: 10000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
    shimmer2Opacity.value = withDelay(
      3000,
      withRepeat(
        withSequence(
          withTiming(0.05, { duration: 7000, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.01, { duration: 7000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      )
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  const shimmer1Style = useAnimatedStyle(() => ({
    transform: [{ translateY: shimmer1Y.value }],
    opacity: shimmer1Opacity.value,
  }));

  const shimmer2Style = useAnimatedStyle(() => ({
    transform: [{ translateY: shimmer2Y.value }],
    opacity: shimmer2Opacity.value,
  }));

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/room-select");
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <LinearGradient
      colors={[Colors.primary, Colors.primaryLight, "#3A7D5C"]}
      style={styles.container}
    >
      <View style={styles.particleLayer} pointerEvents="none" accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
        {particles.map((p, i) => (
          <FloatingParticle key={i} config={p} />
        ))}

        <Animated.View
          style={[
            styles.shimmerBlob,
            { top: "15%", left: "-20%", width: SCREEN_W * 1.2, height: SCREEN_H * 0.35 },
            shimmer1Style,
          ]}
        />
        <Animated.View
          style={[
            styles.shimmerBlob,
            { top: "55%", right: "-15%", width: SCREEN_W * 0.9, height: SCREEN_H * 0.3 },
            shimmer2Style,
          ]}
        />
      </View>

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

        <View style={styles.nfcSection}>
          <Text style={styles.tapTitle}>Find Your Room</Text>
          <Text style={styles.tapSubtitle}>
            Enter your room number to get step-by-step directions
          </Text>

          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.circleButton,
              pressed && styles.circleButtonPressed,
            ]}
            accessibilityLabel="Get Started"
            accessibilityRole="button"
            accessibilityHint="Double tap to enter your room number and get directions"
          >
            <Animated.View style={[styles.circlePulse, pulseStyle]} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants" />
            <View style={styles.circleInner} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
              <MaterialCommunityIcons
                name="map-marker-path"
                size={48}
                color={Colors.primary}
              />
              <Text style={styles.circleText}>Get Started</Text>
            </View>
          </Pressable>
        </View>

        <View style={styles.bottomSection}>
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

          <Pressable
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              router.push("/settings");
            }}
            style={({ pressed }) => [
              styles.settingsBottomButton,
              pressed && styles.settingsBottomButtonPressed,
            ]}
            accessibilityLabel="Settings and Info"
            accessibilityRole="button"
            accessibilityHint="Opens settings for language, units, and app info"
          >
            <Ionicons name="settings-outline" size={18} color={Colors.textLight} />
            <Text style={styles.settingsBottomText}>Settings / Info</Text>
          </Pressable>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  particleLayer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  shimmerBlob: {
    position: "absolute",
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.04)",
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
  settingsBottomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "stretch",
  },
  settingsBottomButtonPressed: {
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  settingsBottomText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
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
    fontSize: 13,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    lineHeight: 18,
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
  circleButton: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignItems: "center",
    justifyContent: "center",
  },
  circleButtonPressed: {
    transform: [{ scale: 0.95 }],
  },
  circlePulse: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  circleInner: {
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
  circleText: {
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
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: "stretch",
  },
  accessibilityText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
  },
});
