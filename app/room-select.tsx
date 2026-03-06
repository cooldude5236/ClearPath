import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
  TextInput,
  SectionList,
  Alert,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import {
  ROOMS,
  Room,
  GROUND_FLOOR_LOCATIONS,
  GroundFloorLocation,
  LocationCategory,
} from "@/constants/hotel-data";

type TabType = "keypad" | "room" | "ground";

const CATEGORY_ICONS: Record<LocationCategory, keyof typeof MaterialCommunityIcons.glyphMap> = {
  "Hotel Services": "concierge",
  "Dining & Drinks": "silverware-fork-knife",
  Shopping: "shopping",
  "Recreation & Wellness": "pool",
  "Convention Center": "domain",
  "Meeting Rooms": "television-play",
};

const CATEGORY_COLORS: Record<LocationCategory, string> = {
  "Hotel Services": "#1B4332",
  "Dining & Drinks": "#C25B1A",
  Shopping: "#7B2D8B",
  "Recreation & Wellness": "#0077B6",
  "Convention Center": "#B5451B",
  "Meeting Rooms": "#555",
};

const KEYPAD_KEYS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["C", "0", "⌫"],
];

function RoomCard({ room, onSelect }: { room: Room; onSelect: (r: Room) => void }) {
  return (
    <Pressable
      onPress={() => onSelect(room)}
      style={({ pressed }) => [styles.roomCard, pressed && styles.cardPressed]}
      accessibilityLabel={`Room ${room.number}, Floor ${room.floor}, ${room.tower} Tower, ${room.type}${room.accessibleRoom ? ", Accessible room" : ""}`}
      accessibilityRole="button"
      accessibilityHint="Double tap to choose a route to this room"
    >
      <View style={styles.cardLeft}>
        <View style={[styles.roomBadge, { backgroundColor: room.tower === "North" ? Colors.primary : Colors.primaryLight }]}>
          <Text style={styles.roomBadgeText}>{room.number}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{room.type}</Text>
          <Text style={styles.cardDetail}>Floor {room.floor} {"\u00B7"} {room.tower} Tower</Text>
        </View>
      </View>
      <View style={styles.cardRight}>
        {room.accessibleRoom && (
          <View style={styles.accessibleTag}>
            <MaterialCommunityIcons name="wheelchair-accessibility" size={16} color={Colors.accessible} />
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </Pressable>
  );
}

function LocationCard({ location, onSelect }: { location: GroundFloorLocation; onSelect: (l: GroundFloorLocation) => void }) {
  const color = CATEGORY_COLORS[location.category];
  const iconName = location.icon as keyof typeof MaterialCommunityIcons.glyphMap;
  return (
    <Pressable
      onPress={() => onSelect(location)}
      style={({ pressed }) => [styles.locationCard, pressed && styles.cardPressed]}
      accessibilityLabel={`${location.name}. ${location.description}${location.hours ? `. Hours: ${location.hours}` : ""}${location.accessible ? ". Wheelchair accessible." : ""}`}
      accessibilityRole="button"
      accessibilityHint="Double tap to get directions to this location"
    >
      <View style={[styles.locationIcon, { backgroundColor: color + "18" }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationDesc} numberOfLines={1}>{location.description}</Text>
        {location.hours && <Text style={styles.locationHours}>{location.hours}</Text>}
      </View>
      <View style={styles.locationRight}>
        {location.accessible && (
          <MaterialCommunityIcons name="wheelchair-accessibility" size={16} color={Colors.accessible} style={{ marginBottom: 4 }} />
        )}
        <Ionicons name="chevron-forward" size={18} color={Colors.textSecondary} />
      </View>
    </Pressable>
  );
}

export default function RoomSelectScreen() {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabType>("keypad");
  const [search, setSearch] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedTower, setSelectedTower] = useState<"North" | "South" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | null>(null);

  const [keypadValue, setKeypadValue] = useState("");
  const [keypadTower, setKeypadTower] = useState<"North" | "South">("North");

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const floors = useMemo(() => Array.from(new Set(ROOMS.map((r) => r.floor))).sort((a, b) => a - b), []);
  const categories = useMemo(
    () => Array.from(new Set(GROUND_FLOOR_LOCATIONS.map((l) => l.category))) as LocationCategory[],
    []
  );

  const filteredRooms = useMemo(() => {
    let result = ROOMS;
    if (selectedTower) result = result.filter((r) => r.tower === selectedTower);
    if (selectedFloor !== null) result = result.filter((r) => r.floor === selectedFloor);
    if (search.trim()) result = result.filter((r) => r.number.startsWith(search.trim()));
    return result;
  }, [selectedTower, selectedFloor, search]);

  const locationSections = useMemo(() => {
    let locs = GROUND_FLOOR_LOCATIONS;
    if (selectedCategory) locs = locs.filter((l) => l.category === selectedCategory);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      locs = locs.filter((l) => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q));
    }
    const grouped: Record<string, GroundFloorLocation[]> = {};
    for (const loc of locs) {
      if (!grouped[loc.category]) grouped[loc.category] = [];
      grouped[loc.category].push(loc);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [selectedCategory, search]);

  const keypadMatch = useMemo(() => {
    if (!keypadValue) return null;
    return ROOMS.find((r) => r.number === keypadValue && r.tower === keypadTower) ?? null;
  }, [keypadValue, keypadTower]);

  const handleKeyPress = (key: string) => {
    if (key === "C") {
      setKeypadValue("");
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else if (key === "⌫") {
      setKeypadValue((v) => v.slice(0, -1));
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } else {
      if (keypadValue.length < 4) {
        setKeypadValue((v) => v + key);
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }
    }
  };

  const handleKeypadGo = () => {
    if (!keypadValue) return;
    const room = ROOMS.find((r) => r.number === keypadValue && r.tower === keypadTower);
    if (room) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.push({ pathname: "/route-choice", params: { roomNumber: room.number, tower: room.tower } });
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        "Room Not Found",
        `Room ${keypadValue} was not found in the ${keypadTower} Tower. Please check your room number and tower, then try again.`,
        [{ text: "OK" }]
      );
    }
  };

  const handleSelectRoom = (room: Room) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/route-choice", params: { roomNumber: room.number, tower: room.tower } });
  };

  const handleSelectLocation = (loc: GroundFloorLocation) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({ pathname: "/directions", params: { locationId: loc.id } });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  const switchTab = (t: TabType) => {
    setTab(t);
    setSearch("");
    Haptics.selectionAsync();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerArea, { paddingTop: insets.top + webTopInset + 8 }]}>
        <Text style={styles.appBrand}>CLEARPATH</Text>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack} accessibilityLabel="Go back to home screen" accessibilityRole="button" accessibilityHint="Double tap to return to the welcome screen" hitSlop={12}>
            <Ionicons name="arrow-back" size={26} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">Where to?</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.tabRow}>
          {([
            { key: "keypad" as TabType, label: "Keypad", icon: "dialpad" as keyof typeof MaterialCommunityIcons.glyphMap },
            { key: "room" as TabType, label: "Browse", icon: "format-list-bulleted" as keyof typeof MaterialCommunityIcons.glyphMap },
            { key: "ground" as TabType, label: "Ground", icon: "map-marker" as keyof typeof MaterialCommunityIcons.glyphMap },
          ]).map((t) => (
            <Pressable
              key={t.key}
              onPress={() => switchTab(t.key)}
              style={[styles.tabChip, tab === t.key && styles.tabChipActive]}
              accessibilityRole="tab"
              accessibilityLabel={`${t.label} tab`}
              accessibilityState={{ selected: tab === t.key }}
              accessibilityHint={`Double tap to switch to ${t.label} view`}
            >
              <MaterialCommunityIcons
                name={t.icon}
                size={16}
                color={tab === t.key ? Colors.textLight : Colors.textSecondary}
              />
              <Text style={[styles.tabChipText, tab === t.key && styles.tabChipTextActive]}>
                {t.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === "keypad" && (
        <ScrollView
          contentContainerStyle={[styles.keypadContainer, { paddingBottom: insets.bottom + webBottomInset + 20 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Text style={styles.keypadPrompt}>Enter your room number</Text>

          <View style={styles.displayBox}>
            <Text
              style={[styles.displayText, !keypadValue && styles.displayPlaceholder]}
              accessibilityLabel={keypadValue ? `Room number ${keypadValue}` : "No room number entered"}
              accessibilityRole="text"
            >
              {keypadValue || "_ _ _ _"}
            </Text>
            {keypadMatch && (
              <View style={styles.displayMatchRow} accessible={true} accessibilityRole="text" accessibilityLabel={`Room found: ${keypadMatch.type}, Floor ${keypadMatch.floor}`} accessibilityLiveRegion="polite">
                <MaterialCommunityIcons name="check-circle" size={16} color={Colors.success} />
                <Text style={styles.displayMatchText}>
                  {keypadMatch.type} · Floor {keypadMatch.floor}
                </Text>
              </View>
            )}
            {keypadValue.length > 0 && !keypadMatch && (
              <View style={styles.displayMatchRow} accessible={true} accessibilityRole="text" accessibilityLabel={keypadValue.length < 3 ? "Keep typing" : `Room not found in ${keypadTower} Tower`} accessibilityLiveRegion="polite">
                <MaterialCommunityIcons name="alert-circle-outline" size={16} color={Colors.warning} />
                <Text style={styles.displayNoMatch}>
                  {keypadValue.length < 3 ? "Keep typing…" : `Not found in ${keypadTower} Tower`}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.towerSelector}>
            {(["North", "South"] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => { setKeypadTower(t); Haptics.selectionAsync(); }}
                style={[styles.towerBtn, keypadTower === t && styles.towerBtnActive]}
                accessibilityLabel={`${t} Tower`}
                accessibilityRole="radio"
                accessibilityState={{ selected: keypadTower === t }}
                accessibilityHint={`Double tap to select ${t} Tower`}
              >
                <MaterialCommunityIcons
                  name="office-building"
                  size={16}
                  color={keypadTower === t ? Colors.textLight : Colors.textSecondary}
                />
                <Text style={[styles.towerBtnText, keypadTower === t && styles.towerBtnTextActive]}>
                  {t} Tower
                </Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.keypadGrid}>
            {KEYPAD_KEYS.map((row, ri) => (
              <View key={ri} style={styles.keypadRow}>
                {row.map((key) => {
                  const isSpecial = key === "C" || key === "⌫";
                  return (
                    <Pressable
                      key={key}
                      onPress={() => handleKeyPress(key)}
                      style={({ pressed }) => [
                        styles.keypadKey,
                        isSpecial && styles.keypadKeySpecial,
                        pressed && styles.keypadKeyPressed,
                      ]}
                      accessibilityLabel={
                        key === "⌫" ? "Delete" : key === "C" ? "Clear all" : `Number ${key}`
                      }
                      accessibilityRole="button"
                    >
                      {key === "⌫" ? (
                        <Ionicons name="backspace-outline" size={26} color={Colors.warning} />
                      ) : (
                        <Text style={[styles.keypadKeyText, isSpecial && styles.keypadKeyTextSpecial]}>
                          {key}
                        </Text>
                      )}
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>

          <Pressable
            onPress={handleKeypadGo}
            disabled={!keypadValue}
            style={({ pressed }) => [
              styles.goButton,
              !keypadValue && styles.goButtonDisabled,
              pressed && keypadValue ? { opacity: 0.9, transform: [{ scale: 0.98 }] } : undefined,
            ]}
            accessibilityLabel={keypadValue ? `Find room ${keypadValue} in ${keypadTower} Tower` : "Find My Room, enter a room number first"}
            accessibilityRole="button"
            accessibilityState={{ disabled: !keypadValue }}
            accessibilityHint={keypadValue ? "Double tap to get directions to this room" : ""}
          >
            <MaterialCommunityIcons name="magnify" size={22} color={Colors.textLight} />
            <Text style={styles.goButtonText}>Find My Room</Text>
          </Pressable>
        </ScrollView>
      )}

      {tab === "room" && (
        <>
          <View style={styles.filtersArea}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Room number (e.g. 1205)"
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                keyboardType="number-pad"
                accessibilityLabel="Search by room number"
                accessibilityHint="Type a room number to filter the list"
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </Pressable>
              )}
            </View>
            <View style={styles.filterRow}>
              {(["North", "South"] as const).map((t) => (
                <Pressable
                  key={t}
                  onPress={() => { setSelectedTower(selectedTower === t ? null : t); Haptics.selectionAsync(); }}
                  style={[styles.filterChip, styles.filterChipWide, selectedTower === t && styles.filterChipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedTower === t }}
                >
                  <MaterialCommunityIcons name="office-building" size={13} color={selectedTower === t ? Colors.textLight : Colors.textSecondary} />
                  <Text style={[styles.filterChipText, selectedTower === t && styles.filterChipTextActive]}>{t} Tower</Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.filterRow, { flexWrap: "wrap" }]}>
              <Pressable
                onPress={() => { setSelectedFloor(null); Haptics.selectionAsync(); }}
                style={[styles.filterChip, selectedFloor === null && styles.filterChipAccent]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedFloor === null }}
              >
                <Text style={[styles.filterChipText, selectedFloor === null && styles.filterChipTextActive]}>All</Text>
              </Pressable>
              {floors.map((floor) => (
                <Pressable
                  key={floor}
                  onPress={() => { setSelectedFloor(floor === selectedFloor ? null : floor); Haptics.selectionAsync(); }}
                  style={[styles.filterChip, selectedFloor === floor && styles.filterChipAccent]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedFloor === floor }}
                >
                  <Text style={[styles.filterChipText, selectedFloor === floor && styles.filterChipTextActive]}>{floor}</Text>
                </Pressable>
              ))}
            </View>
            <Text style={styles.resultCount}>{filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""}</Text>
          </View>
          <FlatList
            data={filteredRooms}
            keyExtractor={(item) => `${item.tower}-${item.number}`}
            renderItem={({ item }) => <RoomCard room={item} onSelect={handleSelectRoom} />}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + webBottomInset + 16 }]}
            scrollEnabled={!!filteredRooms.length}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <Ionicons name="bed-outline" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>No rooms found</Text>
                <Text style={styles.emptySubtext}>Try a different room number, floor, or tower</Text>
              </View>
            }
          />
        </>
      )}

      {tab === "ground" && (
        <>
          <View style={styles.filtersArea}>
            <View style={styles.searchBox}>
              <Ionicons name="search" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search facilities…"
                placeholderTextColor={Colors.textSecondary}
                value={search}
                onChangeText={setSearch}
                accessibilityLabel="Search ground floor facilities"
                accessibilityHint="Type to filter locations by name"
                returnKeyType="search"
              />
              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")} hitSlop={8}>
                  <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
                </Pressable>
              )}
            </View>
            <View style={[styles.filterRow, { flexWrap: "wrap" }]}>
              <Pressable
                onPress={() => { setSelectedCategory(null); Haptics.selectionAsync(); }}
                style={[styles.filterChip, selectedCategory === null && styles.filterChipActive]}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedCategory === null }}
              >
                <Text style={[styles.filterChipText, selectedCategory === null && styles.filterChipTextActive]}>All</Text>
              </Pressable>
              {categories.map((cat) => (
                <Pressable
                  key={cat}
                  onPress={() => { setSelectedCategory(selectedCategory === cat ? null : cat); Haptics.selectionAsync(); }}
                  style={[styles.filterChip, selectedCategory === cat && styles.filterChipActive]}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedCategory === cat }}
                >
                  <MaterialCommunityIcons
                    name={CATEGORY_ICONS[cat]}
                    size={13}
                    color={selectedCategory === cat ? Colors.textLight : Colors.textSecondary}
                  />
                  <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>{cat}</Text>
                </Pressable>
              ))}
            </View>
          </View>
          <SectionList
            sections={locationSections}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <LocationCard location={item} onSelect={handleSelectLocation} />}
            renderSectionHeader={({ section: { title } }) => (
              <View style={styles.sectionHeader}>
                <MaterialCommunityIcons
                  name={CATEGORY_ICONS[title as LocationCategory]}
                  size={16}
                  color={CATEGORY_COLORS[title as LocationCategory]}
                />
                <Text style={[styles.sectionHeaderText, { color: CATEGORY_COLORS[title as LocationCategory] }]}>{title}</Text>
              </View>
            )}
            contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + webBottomInset + 16 }]}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="map-search" size={48} color={Colors.textSecondary} />
                <Text style={styles.emptyText}>Nothing found</Text>
                <Text style={styles.emptySubtext}>Try a different search term or category</Text>
              </View>
            }
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  appBrand: {
    fontFamily: "Inter_500Medium",
    fontSize: 11,
    color: "rgba(0,0,0,0.35)",
    textAlign: "center",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headerArea: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  tabRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  tabChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  tabChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  tabChipText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  tabChipTextActive: { color: Colors.textLight },
  filtersArea: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    gap: 10,
    marginBottom: 10,
  },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.text, padding: 0 },
  filterRow: { flexDirection: "row", gap: 6, marginBottom: 8 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: "transparent",
    marginBottom: 4,
  },
  filterChipWide: { flex: 1, justifyContent: "center" },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipAccent: { backgroundColor: Colors.accent, borderColor: Colors.accent },
  filterChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterChipTextActive: { color: Colors.textLight },
  resultCount: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, marginTop: 2 },
  listContent: { padding: 16 },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
    gap: 12,
  },
  cardPressed: { transform: [{ scale: 0.98 }], opacity: 0.9 },
  cardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  roomBadge: {
    width: 52,
    height: 48,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  roomBadgeText: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.textLight },
  cardInfo: { gap: 3, flex: 1 },
  cardTitle: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  cardDetail: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  cardRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  accessibleTag: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accessibleBg,
    alignItems: "center",
    justifyContent: "center",
  },
  locationIcon: {
    width: 50,
    height: 50,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  locationInfo: { flex: 1, gap: 3 },
  locationName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  locationDesc: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  locationHours: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.success },
  locationRight: { alignItems: "center", gap: 2 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: Colors.background,
    paddingVertical: 8,
    paddingHorizontal: 2,
    marginBottom: 4,
    marginTop: 8,
  },
  sectionHeaderText: { fontFamily: "Inter_700Bold", fontSize: 13, letterSpacing: 0.4, textTransform: "uppercase" },
  emptyState: { alignItems: "center", justifyContent: "center", paddingVertical: 60, gap: 8 },
  emptyText: { fontFamily: "Inter_600SemiBold", fontSize: 18, color: Colors.text },
  emptySubtext: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary, textAlign: "center" },

  keypadContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  keypadPrompt: {
    fontFamily: "Inter_500Medium",
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 14,
  },
  displayBox: {
    width: "100%",
    backgroundColor: Colors.surface,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: Colors.border,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 16,
    minHeight: 90,
    justifyContent: "center",
  },
  displayText: {
    fontFamily: "Inter_700Bold",
    fontSize: 44,
    color: Colors.text,
    letterSpacing: 12,
    textAlign: "center",
  },
  displayPlaceholder: {
    color: Colors.border,
    letterSpacing: 16,
  },
  displayMatchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
  },
  displayMatchText: {
    fontFamily: "Inter_500Medium",
    fontSize: 14,
    color: Colors.success,
  },
  displayNoMatch: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  towerSelector: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 18,
  },
  towerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 2,
    borderColor: "transparent",
  },
  towerBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  towerBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 15,
    color: Colors.textSecondary,
  },
  towerBtnTextActive: {
    color: Colors.textLight,
  },
  keypadGrid: {
    width: "100%",
    gap: 10,
    marginBottom: 18,
  },
  keypadRow: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
  },
  keypadKey: {
    flex: 1,
    aspectRatio: 1.6,
    maxHeight: 64,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  keypadKeySpecial: {
    backgroundColor: Colors.surfaceAlt,
    borderColor: Colors.surfaceAlt,
  },
  keypadKeyPressed: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primaryLight,
  },
  keypadKeyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 26,
    color: Colors.text,
  },
  keypadKeyTextSpecial: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  goButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 18,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    minHeight: 60,
  },
  goButtonDisabled: {
    backgroundColor: Colors.border,
    opacity: 0.6,
  },
  goButtonText: {
    fontFamily: "Inter_700Bold",
    fontSize: 18,
    color: Colors.textLight,
  },
});
