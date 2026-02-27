import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  FlatList,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { ROOMS, Room } from "@/constants/hotel-data";

function RoomCard({ room, onSelect }: { room: Room; onSelect: (r: Room) => void }) {
  return (
    <Pressable
      onPress={() => onSelect(room)}
      style={({ pressed }) => [
        styles.roomCard,
        pressed && styles.roomCardPressed,
      ]}
      accessibilityLabel={`Room ${room.number}, Floor ${room.floor}, ${room.tower} Tower, ${room.type}${room.accessibleRoom ? ", Accessible room" : ""}`}
      accessibilityRole="button"
    >
      <View style={styles.roomLeft}>
        <View style={[
          styles.roomNumberBadge,
          { backgroundColor: room.tower === "North" ? Colors.primary : Colors.primaryLight },
        ]}>
          <Text style={styles.roomNumber}>{room.number}</Text>
        </View>
        <View style={styles.roomInfo}>
          <Text style={styles.roomType}>{room.type}</Text>
          <Text style={styles.roomDetail}>
            Floor {room.floor} {"\u00B7"} {room.tower} Tower
          </Text>
        </View>
      </View>
      <View style={styles.roomRight}>
        {room.accessibleRoom && (
          <View style={styles.accessibleTag}>
            <MaterialCommunityIcons
              name="wheelchair-accessibility"
              size={16}
              color={Colors.accessible}
            />
          </View>
        )}
        <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
      </View>
    </Pressable>
  );
}

export default function RoomSelectScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [selectedTower, setSelectedTower] = useState<"North" | "South" | null>(null);

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  const floors = useMemo(() => {
    const floorSet = new Set(ROOMS.map((r) => r.floor));
    return Array.from(floorSet).sort((a, b) => a - b);
  }, []);

  const filteredRooms = useMemo(() => {
    let result = ROOMS;
    if (selectedTower) {
      result = result.filter((r) => r.tower === selectedTower);
    }
    if (selectedFloor !== null) {
      result = result.filter((r) => r.floor === selectedFloor);
    }
    if (search.trim()) {
      result = result.filter((r) => r.number.startsWith(search.trim()));
    }
    return result;
  }, [selectedTower, selectedFloor, search]);

  const handleSelectRoom = (room: Room) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/route-choice",
      params: { roomNumber: room.number, tower: room.tower },
    });
  };

  const handleBack = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.back();
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.headerArea,
          { paddingTop: insets.top + webTopInset + 12 },
        ]}
      >
        <View style={styles.headerRow}>
          <Pressable
            onPress={handleBack}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            hitSlop={12}
          >
            <Ionicons name="arrow-back" size={26} color={Colors.text} />
          </Pressable>
          <Text style={styles.headerTitle} accessibilityRole="header">
            Select Your Room
          </Text>
          <View style={{ width: 26 }} />
        </View>

        <View style={styles.searchRow}>
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
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={20} color={Colors.textSecondary} />
              </Pressable>
            )}
          </View>
        </View>

        <View style={styles.towerFilter}>
          {(["North", "South"] as const).map((t) => (
            <Pressable
              key={t}
              onPress={() => {
                setSelectedTower(selectedTower === t ? null : t);
                Haptics.selectionAsync();
              }}
              style={[
                styles.towerChip,
                selectedTower === t && styles.towerChipActive,
              ]}
              accessibilityLabel={`Filter by ${t} Tower`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedTower === t }}
            >
              <MaterialCommunityIcons
                name="office-building"
                size={14}
                color={selectedTower === t ? Colors.textLight : Colors.textSecondary}
              />
              <Text style={[
                styles.towerChipText,
                selectedTower === t && styles.towerChipTextActive,
              ]}>
                {t} Tower
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.floorFilter}>
          <Pressable
            onPress={() => {
              setSelectedFloor(null);
              Haptics.selectionAsync();
            }}
            style={[
              styles.floorChip,
              selectedFloor === null && styles.floorChipActive,
            ]}
            accessibilityLabel="Show all floors"
            accessibilityRole="button"
            accessibilityState={{ selected: selectedFloor === null }}
          >
            <Text style={[
              styles.floorChipText,
              selectedFloor === null && styles.floorChipTextActive,
            ]}>
              All Floors
            </Text>
          </Pressable>
          {floors.map((floor) => (
            <Pressable
              key={floor}
              onPress={() => {
                setSelectedFloor(floor === selectedFloor ? null : floor);
                Haptics.selectionAsync();
              }}
              style={[
                styles.floorChip,
                selectedFloor === floor && styles.floorChipActive,
              ]}
              accessibilityLabel={`Floor ${floor}`}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedFloor === floor }}
            >
              <Text style={[
                styles.floorChipText,
                selectedFloor === floor && styles.floorChipTextActive,
              ]}>
                {floor}
              </Text>
            </Pressable>
          ))}
        </View>

        {filteredRooms.length > 0 && (
          <Text style={styles.resultCount}>
            {filteredRooms.length} room{filteredRooms.length !== 1 ? "s" : ""} found
          </Text>
        )}
      </View>

      <FlatList
        data={filteredRooms}
        keyExtractor={(item) => `${item.tower}-${item.number}`}
        renderItem={({ item }) => (
          <RoomCard room={item} onSelect={handleSelectRoom} />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + webBottomInset + 16 },
        ]}
        scrollEnabled={!!filteredRooms.length}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="bed-outline" size={48} color={Colors.textSecondary} />
            <Text style={styles.emptyText}>No rooms found</Text>
            <Text style={styles.emptySubtext}>
              Try a different room number, floor, or tower
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
    marginBottom: 16,
  },
  headerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 20,
    color: Colors.text,
  },
  searchRow: {
    marginBottom: 12,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surfaceAlt,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    color: Colors.text,
    padding: 0,
  },
  towerFilter: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 10,
  },
  towerChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  towerChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  towerChipText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  towerChipTextActive: {
    color: Colors.textLight,
  },
  floorFilter: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    marginBottom: 8,
  },
  floorChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: Colors.surfaceAlt,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  floorChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  floorChipText: {
    fontFamily: "Inter_500Medium",
    fontSize: 13,
    color: Colors.textSecondary,
  },
  floorChipTextActive: {
    color: Colors.textLight,
  },
  resultCount: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    gap: 10,
  },
  roomCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 8,
  },
  roomCardPressed: {
    backgroundColor: Colors.surfaceAlt,
    transform: [{ scale: 0.98 }],
  },
  roomLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  roomNumberBadge: {
    width: 56,
    height: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  roomNumber: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.textLight,
  },
  roomInfo: {
    gap: 4,
  },
  roomType: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
    color: Colors.text,
  },
  roomDetail: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
  },
  roomRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  accessibleTag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.accessibleBg,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 18,
    color: Colors.text,
  },
  emptySubtext: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
  },
});
