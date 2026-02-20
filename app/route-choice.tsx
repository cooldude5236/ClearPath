import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { ROOMS } from "@/constants/hotel-data";

export default function RouteChoiceScreen() {
  const insets = useSafeAreaInsets();
  const { roomNumber } = useLocalSearchParams<{ roomNumber: string }>();

  const room = ROOMS.find((r) => r.number === roomNumber);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const handleRouteSelect = (routeType: "accessible" | "standard") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/directions",
      params: { roomNumber, routeType },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  if (!room) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopInset + 20 }]}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.warning} />
          <Text style={styles.errorText}>Room not found</Text>
          <Pressable onPress={handleBack} style={styles.retryButton}>
            <Text style={styles.retryText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.topSection,
          { paddingTop: insets.top + webTopInset + 12 },
        ]}
      >
        <Pressable
          onPress={handleBack}
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={12}
        >
          <Ionicons name="arrow-back" size={26} color={Colors.text} />
        </Pressable>
      </View>

      <View style={styles.roomSummary}>
        <View style={styles.roomBadge}>
          <MaterialCommunityIcons name="door" size={28} color={Colors.textLight} />
        </View>
        <Text style={styles.roomTitle} accessibilityRole="header">
          Room {room.number}
        </Text>
        <Text style={styles.roomSubtitle}>
          Floor {room.floor} {"\u00B7"} {room.wing} Wing {"\u00B7"} {room.type}
        </Text>
        {room.accessibleRoom && (
          <View style={styles.accessibleIndicator}>
            <MaterialCommunityIcons
              name="wheelchair-accessibility"
              size={16}
              color={Colors.accessible}
            />
            <Text style={styles.accessibleLabel}>Accessible Room</Text>
          </View>
        )}
      </View>

      <View style={styles.choiceSection}>
        <Text style={styles.choiceTitle}>Choose Your Route</Text>
        <Text style={styles.choiceSubtitle}>
          Select the route that works best for you
        </Text>

        <View style={styles.cardsContainer}>
          <Pressable
            onPress={() => handleRouteSelect("accessible")}
            style={({ pressed }) => [
              styles.routeCard,
              styles.accessibleCard,
              pressed && styles.cardPressed,
            ]}
            accessibilityLabel="Accessible route with elevator access, wider paths, and detailed guidance for mobility needs"
            accessibilityRole="button"
          >
            <View style={styles.cardIconRow}>
              <View style={[styles.cardIcon, { backgroundColor: Colors.accessibleBg }]}>
                <MaterialCommunityIcons
                  name="wheelchair-accessibility"
                  size={30}
                  color={Colors.accessible}
                />
              </View>
              <View style={styles.recommendedBadge}>
                <Ionicons name="star" size={12} color={Colors.accent} />
                <Text style={styles.recommendedText}>Recommended</Text>
              </View>
            </View>
            <Text style={styles.cardTitle}>Accessible Route</Text>
            <Text style={styles.cardDescription}>
              Elevator access, wider paths, detailed audio guidance, and mobility-friendly directions
            </Text>
            <View style={styles.cardFeatures}>
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="elevator-passenger" size={16} color={Colors.accessible} />
                <Text style={styles.featureText}>Elevator preferred</Text>
              </View>
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="volume-high" size={16} color={Colors.accessible} />
                <Text style={styles.featureText}>Voice guidance</Text>
              </View>
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="hand-wave" size={16} color={Colors.accessible} />
                <Text style={styles.featureText}>Handrail info</Text>
              </View>
            </View>
          </Pressable>

          <Pressable
            onPress={() => handleRouteSelect("standard")}
            style={({ pressed }) => [
              styles.routeCard,
              pressed && styles.cardPressed,
            ]}
            accessibilityLabel="Standard route, shortest path to your room"
            accessibilityRole="button"
          >
            <View style={styles.cardIconRow}>
              <View style={[styles.cardIcon, { backgroundColor: Colors.surfaceAlt }]}>
                <MaterialCommunityIcons
                  name="walk"
                  size={30}
                  color={Colors.primary}
                />
              </View>
            </View>
            <Text style={styles.cardTitle}>Standard Route</Text>
            <Text style={styles.cardDescription}>
              Shortest path to your room with basic turn-by-turn directions
            </Text>
            <View style={styles.cardFeatures}>
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="map-marker-path" size={16} color={Colors.primary} />
                <Text style={styles.featureText}>Shortest path</Text>
              </View>
              <View style={styles.featureRow}>
                <MaterialCommunityIcons name="stairs" size={16} color={Colors.primary} />
                <Text style={styles.featureText}>Stairs or elevator</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      <View style={{ paddingBottom: insets.bottom + webBottomInset + 16 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topSection: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  roomSummary: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 6,
  },
  roomBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  roomTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    color: Colors.text,
  },
  roomSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
  },
  accessibleIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: Colors.accessibleBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 4,
  },
  accessibleLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.accessible,
  },
  choiceSection: {
    paddingHorizontal: 20,
    gap: 8,
  },
  choiceTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: Colors.text,
  },
  choiceSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  cardsContainer: {
    gap: 14,
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 10,
  },
  accessibleCard: {
    borderColor: Colors.accessible,
    borderWidth: 2,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  cardIconRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  recommendedBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFF8EC",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  recommendedText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: Colors.accent,
  },
  cardTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  cardDescription: {
    fontFamily: "Inter_400Regular",
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  cardFeatures: {
    gap: 8,
    marginTop: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  featureText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.text,
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  errorText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.text,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: Colors.primary,
    borderRadius: 12,
  },
  retryText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.textLight,
  },
});
