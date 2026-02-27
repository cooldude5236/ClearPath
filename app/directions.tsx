import React, { useState, useRef, useCallback, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Speech from "expo-speech";
import Colors from "@/constants/colors";
import { ROOMS, getDirections, DirectionStep, RouteType } from "@/constants/hotel-data";

function StepCard({
  step,
  isActive,
  isCompleted,
  onPress,
  totalSteps,
}: {
  step: DirectionStep;
  isActive: boolean;
  isCompleted: boolean;
  onPress: () => void;
  totalSteps: number;
}) {
  const getIconName = (icon: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    const iconMap: Record<string, keyof typeof MaterialCommunityIcons.glyphMap> = {
      "door-open": "door-open",
      desk: "desk",
      "shopping-outline": "shopping-outline",
      "arrow-right": "arrow-right-bold",
      "arrow-left": "arrow-left-bold",
      "arrow-up": "arrow-up-bold",
      door: "door",
      "elevator-passenger": "elevator-passenger",
      "elevator-up": "elevator-up",
      "sofa-outline": "sofa-outline",
      "silverware-fork-knife": "silverware-fork-knife",
    };
    return iconMap[icon] || "map-marker";
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.stepCard,
        isActive && styles.stepCardActive,
        isCompleted && styles.stepCardCompleted,
        pressed && { opacity: 0.9 },
      ]}
      accessibilityLabel={`Step ${step.id} of ${totalSteps}: ${step.instruction}${step.distance ? `, ${step.distance}` : ""}${step.accessibleNote ? `. Accessibility note: ${step.accessibleNote}` : ""}`}
      accessibilityRole="button"
      accessibilityState={{ selected: isActive }}
    >
      <View style={styles.stepRow}>
        <View style={styles.stepTimeline}>
          <View
            style={[
              styles.stepDot,
              isActive && styles.stepDotActive,
              isCompleted && styles.stepDotCompleted,
            ]}
          >
            {isCompleted ? (
              <Ionicons name="checkmark" size={14} color={Colors.textLight} />
            ) : (
              <Text
                style={[
                  styles.stepDotText,
                  (isActive || isCompleted) && styles.stepDotTextLight,
                ]}
              >
                {step.id}
              </Text>
            )}
          </View>
          {step.id < totalSteps && (
            <View
              style={[
                styles.stepLine,
                isCompleted && styles.stepLineCompleted,
              ]}
            />
          )}
        </View>

        <View style={styles.stepContent}>
          <View style={styles.stepHeader}>
            <View
              style={[
                styles.stepIconBg,
                isActive && { backgroundColor: Colors.primary },
              ]}
            >
              <MaterialCommunityIcons
                name={getIconName(step.icon)}
                size={22}
                color={isActive ? Colors.textLight : Colors.primary}
              />
            </View>
            <View style={styles.stepTextArea}>
              <Text style={styles.stepLandmark}>{step.landmark}</Text>
              {!!step.distance && (
                <Text style={styles.stepDistance}>{step.distance}</Text>
              )}
            </View>
          </View>

          <Text
            style={[
              styles.stepInstruction,
              isActive && styles.stepInstructionActive,
            ]}
          >
            {step.instruction}
          </Text>

          {!!step.accessibleNote && (
            <View style={styles.accessibleNote}>
              <MaterialCommunityIcons
                name="wheelchair-accessibility"
                size={15}
                color={Colors.accessible}
              />
              <Text style={styles.accessibleNoteText}>
                {step.accessibleNote}
              </Text>
            </View>
          )}
        </View>
      </View>
    </Pressable>
  );
}

export default function DirectionsScreen() {
  const insets = useSafeAreaInsets();
  const { roomNumber, tower, routeType } = useLocalSearchParams<{
    roomNumber: string;
    tower: string;
    routeType: string;
  }>();
  const [currentStep, setCurrentStep] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const room = ROOMS.find(
    (r) => r.number === roomNumber && r.tower === (tower as "North" | "South")
  );
  const steps = room
    ? getDirections(room, (routeType as RouteType) || "accessible")
    : [];

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const speakStep = useCallback(
    (step: DirectionStep) => {
      if (!voiceEnabled) return;
      Speech.stop();
      let text = step.instruction;
      if (step.accessibleNote) {
        text += `. Accessibility note: ${step.accessibleNote}`;
      }
      setIsSpeaking(true);
      Speech.speak(text, {
        language: "en-US",
        rate: 0.85,
        pitch: 1.0,
        onDone: () => setIsSpeaking(false),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    },
    [voiceEnabled]
  );

  useEffect(() => {
    if (voiceEnabled && steps[currentStep]) {
      speakStep(steps[currentStep]);
    }
  }, [currentStep, voiceEnabled]);

  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  const scrollToStep = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
      viewOffset: 80,
    });
  };

  const handleStepPress = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrentStep(index);
    scrollToStep(index);
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const next = currentStep + 1;
      setCurrentStep(next);
      scrollToStep(next);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      if (voiceEnabled) {
        Speech.speak(
          `You have arrived at Room ${roomNumber}. Enjoy your stay at the Hilton DoubleTree!`,
          { language: "en-US", rate: 0.85 }
        );
      }
      Alert.alert(
        "You've Arrived!",
        `Welcome to Room ${roomNumber}, ${tower} Tower.\n\nEnjoy your stay at the Hilton DoubleTree at Universal Orlando!`,
        [{ text: "Done", onPress: () => router.dismissAll() }]
      );
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      const prev = currentStep - 1;
      setCurrentStep(prev);
      scrollToStep(prev);
    }
  };

  const toggleVoice = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (voiceEnabled) {
      Speech.stop();
      setIsSpeaking(false);
    }
    setVoiceEnabled(!voiceEnabled);
  };

  const handleBack = () => {
    Speech.stop();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const progress = steps.length ? ((currentStep + 1) / steps.length) * 100 : 0;

  if (!room) {
    return (
      <View style={[styles.container, { paddingTop: insets.top + webTopInset + 20 }]}>
        <View style={styles.errorState}>
          <Ionicons name="alert-circle-outline" size={48} color={Colors.warning} />
          <Text style={styles.errorText}>Room not found</Text>
          <Pressable onPress={() => router.back()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.header,
          { paddingTop: insets.top + webTopInset + 8 },
        ]}
      >
        <View style={styles.headerTop}>
          <Pressable
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={26} color={Colors.text} />
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              Room {roomNumber} · {tower} Tower
            </Text>
            <Text style={styles.headerSubtitle}>
              {routeType === "accessible" ? "Accessible" : "Standard"} Route · Floor {room.floor}
            </Text>
          </View>
          <Pressable
            onPress={toggleVoice}
            accessibilityLabel={voiceEnabled ? "Turn off voice guidance" : "Turn on voice guidance"}
            accessibilityRole="button"
            style={[
              styles.voiceButton,
              voiceEnabled && styles.voiceButtonActive,
            ]}
          >
            <MaterialCommunityIcons
              name={voiceEnabled ? "volume-high" : "volume-off"}
              size={22}
              color={voiceEnabled ? Colors.textLight : Colors.textSecondary}
            />
          </Pressable>
        </View>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            Step {currentStep + 1} of {steps.length}
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={steps}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item, index }) => (
          <StepCard
            step={item}
            isActive={index === currentStep}
            isCompleted={index < currentStep}
            onPress={() => handleStepPress(index)}
            totalSteps={steps.length}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: 120 + insets.bottom + webBottomInset },
        ]}
        scrollEnabled={!!steps.length}
        showsVerticalScrollIndicator={false}
        onScrollToIndexFailed={(info) => {
          setTimeout(() => {
            flatListRef.current?.scrollToIndex({
              index: info.index,
              animated: true,
              viewOffset: 80,
            });
          }, 100);
        }}
      />

      <View
        style={[
          styles.bottomBar,
          { paddingBottom: insets.bottom + webBottomInset + 12 },
        ]}
      >
        <View style={styles.navButtons}>
          <Pressable
            onPress={handlePrevious}
            disabled={currentStep === 0}
            style={({ pressed }) => [
              styles.navButton,
              styles.prevButton,
              currentStep === 0 && styles.navButtonDisabled,
              pressed && currentStep > 0 && { opacity: 0.8 },
            ]}
            accessibilityLabel="Previous step"
            accessibilityRole="button"
            accessibilityState={{ disabled: currentStep === 0 }}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={currentStep === 0 ? Colors.textSecondary : Colors.primary}
            />
            <Text
              style={[
                styles.navButtonText,
                styles.prevButtonText,
                currentStep === 0 && styles.navButtonTextDisabled,
              ]}
            >
              Back
            </Text>
          </Pressable>

          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.navButton,
              styles.nextButton,
              pressed && { opacity: 0.9, transform: [{ scale: 0.98 }] },
            ]}
            accessibilityLabel={
              currentStep === steps.length - 1 ? "You have arrived" : "Next step"
            }
            accessibilityRole="button"
          >
            <Text style={styles.nextButtonText}>
              {currentStep === steps.length - 1 ? "Arrived" : "Next"}
            </Text>
            <Ionicons
              name={currentStep === steps.length - 1 ? "checkmark-circle" : "arrow-forward"}
              size={22}
              color={Colors.textLight}
            />
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerCenter: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
    textAlign: "center",
  },
  headerSubtitle: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  voiceButtonActive: {
    backgroundColor: Colors.accessible,
  },
  progressContainer: {
    gap: 6,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.success,
    borderRadius: 3,
  },
  progressText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  stepCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  stepCardActive: {
    borderColor: Colors.primary,
    borderWidth: 2,
    backgroundColor: "#F0F7F3",
  },
  stepCardCompleted: {
    opacity: 0.65,
    borderColor: Colors.stepCompleted,
  },
  stepRow: {
    flexDirection: "row",
  },
  stepTimeline: {
    alignItems: "center",
    paddingTop: 18,
    paddingLeft: 14,
    width: 46,
  },
  stepDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stepDotCompleted: {
    backgroundColor: Colors.stepCompleted,
    borderColor: Colors.stepCompleted,
  },
  stepDotText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepDotTextLight: {
    color: Colors.textLight,
  },
  stepLine: {
    width: 2,
    flex: 1,
    minHeight: 16,
    backgroundColor: Colors.border,
    marginTop: 4,
    marginBottom: -6,
  },
  stepLineCompleted: {
    backgroundColor: Colors.stepCompleted,
  },
  stepContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 12,
    gap: 8,
  },
  stepHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  stepIconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
  },
  stepTextArea: {
    flex: 1,
    gap: 2,
  },
  stepLandmark: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  stepDistance: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
  },
  stepInstruction: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: Colors.text,
    lineHeight: 24,
  },
  stepInstructionActive: {
    fontFamily: "Inter_700Bold",
    color: Colors.primary,
  },
  accessibleNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: Colors.accessibleBg,
    padding: 10,
    borderRadius: 10,
  },
  accessibleNoteText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.accessible,
    flex: 1,
    lineHeight: 19,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  navButtons: {
    flexDirection: "row",
    gap: 12,
  },
  navButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
    borderRadius: 14,
    minHeight: 56,
  },
  prevButton: {
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    backgroundColor: Colors.primary,
    flex: 1.5,
  },
  navButtonDisabled: {
    opacity: 0.4,
  },
  navButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 17,
  },
  prevButtonText: {
    color: Colors.primary,
  },
  nextButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.textLight,
  },
  navButtonTextDisabled: {
    color: Colors.textSecondary,
  },
  errorState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 20,
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
  retryButtonText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.textLight,
  },
});
