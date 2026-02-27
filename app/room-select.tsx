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

type TabType = "room" | "ground";

const CATEGORY_ICONS: Record<LocationCategory, keyof typeof MaterialCommunityIcons.glyphMap> = {
  "Hotel Services": "concierge",
  "Dining & Drinks": "silverware-fork-knife",
  "Shopping": "shopping",
  "Recreation & Wellness": "pool",
  "Convention Center": "domain",
  "Meeting Rooms": "television-play",
};

const CATEGORY_COLORS: Record<LocationCategory, string> = {
  "Hotel Services": "#1B4332",
  "Dining & Drinks": "#C25B1A",
  "Shopping": "#7B2D8B",
  "Recreation & Wellness": "#0077B6",
  "Convention Center": "#B5451B",
  "Meeting Rooms": "#555",
};

function RoomCard({ room, onSelect }: { room: Room; onSelect: (r: Room) => void }) {
  return (
    <Pressable
      onPress={() => onSelect(room)}
      style={({ pressed }) => [
        styles.roomCard,
        pressed && styles.cardPressed,
      ]}
      accessibilityLabel={`Room ${room.number}, Floor ${room.floor}, ${room.tower} Tower, ${room.type}${room.accessibleRoom ? ", Accessible room" : ""}`}
      accessibilityRole="button"
    >
      <View style={styles.cardLeft}>
        <View style={[
          styles.roomBadge,
          { backgroundColor: room.tower === "North" ? Colors.primary : Colors.primaryLight },
        ]}>
          <Text style={styles.roomBadgeText}>{room.number}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{room.type}</Text>
          <Text style={styles.cardDetail}>
            Floor {room.floor} {"\u00B7"} {room.tower} Tower
          </Text>
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

function LocationCard({
  location,
  onSelect,
}: {
  location: GroundFloorLocation;
  onSelect: (l: GroundFloorLocation) => void;
}) {
  const color = CATEGORY_COLORS[location.category];
  const iconName = location.icon as keyof typeof MaterialCommunityIcons.glyphMap;

  return (
    <Pressable
      onPress={() => onSelect(location)}
      style={({ pressed }) => [styles.locationCard, pressed && styles.cardPressed]}
      accessibilityLabel={`${location.name}. ${location.description}${location.hours ? `. Hours: ${location.hours}` : ""}${location.accessible ? ". Wheelchair accessible." : ""}`}
      accessibilityRole="button"
    >
      <View style={[styles.locationIcon, { backgroundColor: color + "18" }]}>
        <MaterialCommunityIcons name={iconName} size={24} color={color} />
      </View>
      <View style={styles.locationInfo}>
        <Text style={styles.locationName}>{location.name}</Text>
        <Text style={styles.locationDesc} numberOfLines={1}>{location.description}</Text>
        {location.hours && (
          <Text style={styles.locationHours}>{location.hours}</Text>
        )}
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
  const [tab, setTab] = useState<TabType>("room");
  const [search, setSearch] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedTower, setSelectedTower] = useState<"North" | "South" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LocationCategory | null>(null);

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
      locs = locs.filter(
        (l) => l.name.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
      );
    }
    const grouped: Record<string, GroundFloorLocation[]> = {};
    for (const loc of locs) {
      if (!grouped[loc.category]) grouped[loc.category] = [];
      grouped[loc.category].push(loc);
    }
    return Object.entries(grouped).map(([title, data]) => ({ title, data }));
  }, [selectedCategory, search]);

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
      <View style={[styles.headerArea, { paddingTop: insets.top + webTopInset + 12 }]}>
        <View style={styles.headerRow}>
          <Pressable onPress={handleBack} accessibilityLabel="Go back" accessibilityRole="button" hitSlop={12}>
            <Ionicons name="arrow-back" size={26} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">Where to?</Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.tabRow}>
          <Pressable
            onPress={() => switchTab("room")}
            style={[styles.tabChip, tab === "room" && styles.tabChipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "room" }}
          >
            <MaterialCommunityIcons
              name="door"
              size={16}
              color={tab === "room" ? Colors.textLight : Colors.textSecondary}
            />
            <Text style={[styles.tabChipText, tab === "room" && styles.tabChipTextActive]}>
              My Room
            </Text>
          </Pressable>
          <Pressable
            onPress={() => switchTab("ground")}
            style={[styles.tabChip, tab === "ground" && styles.tabChipActive]}
            accessibilityRole="tab"
            accessibilityState={{ selected: tab === "ground" }}
          >
            <MaterialCommunityIcons
              name="map-marker"
              size={16}
              color={tab === "ground" ? Colors.textLight : Colors.textSecondary}
            />
            <Text style={[styles.tabChipText, tab === "ground" && styles.tabChipTextActive]}>
              Ground Floor
            </Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color={Colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder={tab === "room" ? "Room number (e.g. 1205)" : "Search facilities…"}
            placeholderTextColor={Colors.textSecondary}
            value={search}
            onChangeText={setSearch}
            keyboardType={tab === "room" ? "number-pad" : "default"}
            accessibilityLabel={tab === "room" ? "Search by room number" : "Search ground floor facilities"}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
            </Pressable>
          )}
        </View>

        {tab === "room" && (
          <>
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
                  <Text style={[styles.filterChipText, selectedTower === t && styles.filterChipTextActive]}>
                    {t} Tower
                  </Text>
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
          </>
        )}

        {tab === "ground" && (
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
                <Text style={[styles.filterChipText, selectedCategory === cat && styles.filterChipTextActive]}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {tab === "room" ? (
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
      ) : (
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
              <Text style={[styles.sectionHeaderText, { color: CATEGORY_COLORS[title as LocationCategory] }]}>
                {title}
              </Text>
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
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
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
  tabRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  tabChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  tabChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabChipText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.textSecondary },
  tabChipTextActive: { color: Colors.textLight },
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
});
