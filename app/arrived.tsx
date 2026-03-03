import React, { useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Platform } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Colors from "@/constants/colors";
import { HOTEL_INFO } from "@/constants/hotel-data";

export default function ArrivedScreen() {
  const insets = useSafeAreaInsets();
  const { roomNumber, tower, locationName, locationDesc, voiceEnabled } =
    useLocalSearchParams<{
      roomNumber: string;
      tower: string;
      locationName: string;
      locationDesc: string;
      voiceEnabled: string;
    }>();

  const isLocation = !!locationName;

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const buttonOpacity = useSharedValue(0);

  useEffect(() => {
    checkScale.value = withDelay(
      200,
      withSequence(
        withTiming(1.2, { duration: 400, easing: Easing.out(Easing.back(2)) }),
        withTiming(1, { duration: 200, easing: Easing.inOut(Easing.ease) })
      )
    );
    checkOpacity.value = withDelay(200, withTiming(1, { duration: 400 }));
    textOpacity.value = withDelay(600, withTiming(1, { duration: 500 }));
    buttonOpacity.value = withDelay(1000, withTiming(1, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (voiceEnabled === "true") {
      const msg = isLocation
        ? `You have arrived at ${locationName}.`
        : `You have arrived at Room ${roomNumber}. Enjoy your stay at the Hilton DoubleTree!`;
      Speech.speak(msg, { language: "en-US", rate: 0.85 });
    }
    return () => {
      Speech.stop();
    };
  }, []);

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkOpacity.value,
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  const handleGoHome = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Speech.stop();
    router.dismissAll();
  };

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
            paddingBottom: insets.bottom + webBottomInset + 32,
          },
        ]}
      >
        <View style={styles.spacer} />

        <View
          style={styles.centerSection}
          accessible={true}
          accessibilityRole="text"
          accessibilityLabel={
            isLocation
              ? `You've arrived at ${locationName}. ${locationDesc || ""}`
              : `You've arrived at Room ${roomNumber}, ${tower} Tower. Welcome to ${HOTEL_INFO.name}. Enjoy your stay!`
          }
          accessibilityLiveRegion="assertive"
        >
          <Animated.View style={[styles.checkCircle, checkStyle]} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
            <Ionicons name="checkmark" size={56} color={Colors.primary} />
          </Animated.View>

          <Animated.View style={[styles.textBlock, textStyle]}>
            <Text style={styles.arrivedTitle} accessibilityRole="header">
              You've Arrived!
            </Text>

            {isLocation ? (
              <>
                <Text style={styles.arrivedDestination}>{locationName}</Text>
                {locationDesc ? (
                  <Text style={styles.arrivedSubtext}>{locationDesc}</Text>
                ) : null}
              </>
            ) : (
              <>
                <Text style={styles.arrivedDestination}>Room {roomNumber}</Text>
                <Text style={styles.arrivedSubtext}>
                  {tower} Tower
                </Text>
                <View style={styles.welcomeBox} accessibilityElementsHidden={true} importantForAccessibility="no-hide-descendants">
                  <MaterialCommunityIcons name="home-city" size={20} color={Colors.accentLight} />
                  <Text style={styles.welcomeText}>
                    Welcome to {HOTEL_INFO.name}
                  </Text>
                </View>
                <Text style={styles.enjoyText}>
                  Enjoy your stay!
                </Text>
              </>
            )}
          </Animated.View>
        </View>

        <Animated.View style={[styles.bottomArea, buttonStyle]}>
          <Pressable
            onPress={handleGoHome}
            style={({ pressed }) => [
              styles.homeButton,
              pressed && styles.homeButtonPressed,
            ]}
            accessibilityLabel="Back to Home"
            accessibilityRole="button"
            accessibilityHint="Double tap to return to the welcome screen"
          >
            <Ionicons name="home" size={22} color={Colors.primary} />
            <Text style={styles.homeButtonText}>Back to Home</Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "space-between",
    alignItems: "center",
  },
  spacer: { flex: 0.3 },
  centerSection: {
    alignItems: "center",
    gap: 24,
  },
  checkCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.surface,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 10,
  },
  textBlock: {
    alignItems: "center",
    gap: 10,
  },
  arrivedTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: Colors.textLight,
    textAlign: "center",
  },
  arrivedDestination: {
    fontFamily: "Inter_700Bold",
    fontSize: 36,
    color: Colors.accentLight,
    textAlign: "center",
    marginTop: 4,
  },
  arrivedSubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: "center",
    lineHeight: 22,
    maxWidth: 280,
  },
  welcomeBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 16,
  },
  welcomeText: {
    fontFamily: "Inter_500Medium",
    fontSize: 15,
    color: Colors.accentLight,
  },
  enjoyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    color: Colors.textLight,
    marginTop: 8,
  },
  bottomArea: {
    width: "100%",
    gap: 12,
  },
  homeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: Colors.surface,
    borderRadius: 18,
    paddingVertical: 20,
    width: "100%",
    minHeight: 64,
  },
  homeButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.9,
  },
  homeButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.primary,
  },
});
