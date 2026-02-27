export interface DirectionStep {
  id: number;
  instruction: string;
  landmark: string;
  icon: string;
  distance: string;
  accessibleNote?: string;
  floor?: number;
}

export interface Room {
  number: string;
  floor: number;
  roomNum: number;
  tower: "North" | "South";
  side: "A" | "B" | "C" | "D";
  type: string;
  accessibleRoom: boolean;
}

export const HOTEL_INFO = {
  name: "Hilton DoubleTree",
  subtitle: "at the Entrance to Universal Orlando Resort",
  address: "5780 Major Blvd, Orlando, FL 32819",
};

const FLOORS = 17;
const ROOMS_PER_FLOOR = 36;

function getRoomSide(roomNum: number): "A" | "B" | "C" | "D" {
  if (roomNum <= 9) return "A";
  if (roomNum <= 18) return "B";
  if (roomNum <= 27) return "C";
  return "D";
}

function getRoomType(roomNum: number, accessible: boolean): string {
  if (accessible) return "Accessible King";
  const corners = [1, 9, 10, 18, 19, 27, 28, 36];
  if (corners.includes(roomNum)) return "Corner Suite";
  if (roomNum % 3 === 0) return "King";
  return "Double Queen";
}

function isAccessibleRoom(roomNum: number): boolean {
  return roomNum === 1 || roomNum === 19;
}

function generateRooms(): Room[] {
  const rooms: Room[] = [];
  const towers: Array<"North" | "South"> = ["North", "South"];

  for (const tower of towers) {
    for (let floor = 1; floor <= FLOORS; floor++) {
      for (let roomNum = 1; roomNum <= ROOMS_PER_FLOOR; roomNum++) {
        const accessible = isAccessibleRoom(roomNum);
        rooms.push({
          number: `${floor}${String(roomNum).padStart(2, "0")}`,
          floor,
          roomNum,
          tower,
          side: getRoomSide(roomNum),
          type: getRoomType(roomNum, accessible),
          accessibleRoom: accessible,
        });
      }
    }
  }
  return rooms;
}

export const ROOMS: Room[] = generateRooms();

export type RouteType = "accessible" | "standard";

const SIDE_LABELS: Record<string, { corridor: string; turn: string; oppositeTurn: string; distance: string }> = {
  A: { corridor: "East Corridor",  turn: "Turn left out of the elevator",      oppositeTurn: "right", distance: `${4 * 12} – ${9 * 12} ft` },
  B: { corridor: "North Corridor", turn: "Walk to the end of the east hall and turn left", oppositeTurn: "right", distance: `${10 * 12} – ${18 * 12} ft` },
  C: { corridor: "West Corridor",  turn: "Turn right out of the elevator",     oppositeTurn: "left",  distance: `${4 * 12} – ${9 * 12} ft` },
  D: { corridor: "South Corridor", turn: "Walk to the end of the west hall and turn right", oppositeTurn: "left",  distance: `${10 * 12} – ${18 * 12} ft` },
};

const SOUTH_SIDE_LABELS: Record<string, { corridor: string; turn: string; oppositeTurn: string; distance: string }> = {
  A: { corridor: "East Corridor",  turn: "Turn right out of the elevator",     oppositeTurn: "left",  distance: `${4 * 12} – ${9 * 12} ft` },
  B: { corridor: "North Corridor", turn: "Walk to the end of the east hall and turn right", oppositeTurn: "left",  distance: `${10 * 12} – ${18 * 12} ft` },
  C: { corridor: "West Corridor",  turn: "Turn left out of the elevator",      oppositeTurn: "right", distance: `${4 * 12} – ${9 * 12} ft` },
  D: { corridor: "South Corridor", turn: "Walk to the end of the west hall and turn left", oppositeTurn: "right", distance: `${10 * 12} – ${18 * 12} ft` },
};

function getRoomSideOnWall(roomNum: number): number {
  return ((roomNum - 1) % 9) + 1;
}

function getRoomSide_direction(roomNum: number): "left" | "right" {
  const pos = getRoomSideOnWall(roomNum);
  return pos % 2 === 1 ? "left" : "right";
}

export function getDirections(room: Room, routeType: RouteType): DirectionStep[] {
  const isAccessible = routeType === "accessible";
  const steps: DirectionStep[] = [];
  let stepId = 1;

  const sideInfo = room.tower === "North"
    ? SIDE_LABELS[room.side]
    : SOUTH_SIDE_LABELS[room.side];

  const roomSideOnWall = getRoomSideOnWall(room.roomNum);
  const doorSide = getRoomSide_direction(room.roomNum);
  const walkDistance = Math.round(roomSideOnWall * 14);
  const isCorner = [1, 9, 10, 18, 19, 27, 28, 36].includes(room.roomNum);

  steps.push({
    id: stepId++,
    instruction: "Enter through the hotel's main entrance on Major Blvd",
    landmark: "Hotel Entrance",
    icon: "door-open",
    distance: "Start",
    accessibleNote: isAccessible
      ? "Automatic sliding doors are available. Push-button door opener on the right pillar."
      : undefined,
  });

  steps.push({
    id: stepId++,
    instruction: "Walk straight through the lobby toward the front desk",
    landmark: "Hotel Lobby",
    icon: "desk",
    distance: "60 ft",
    accessibleNote: isAccessible
      ? "Level, wide pathway. Bell desk is on the right if you need luggage assistance."
      : undefined,
  });

  if (room.tower === "North") {
    steps.push({
      id: stepId++,
      instruction: "Pass the American Grill restaurant on your right, continue toward the North Tower",
      landmark: "American Grill / North Tower",
      icon: "silverware-fork-knife",
      distance: "80 ft",
      accessibleNote: isAccessible
        ? "The pathway widens past the restaurant. No steps or obstacles."
        : undefined,
    });

    if (room.floor === 1) {
      steps.push({
        id: stepId++,
        instruction: `${sideInfo.turn} to enter the ground-floor corridor`,
        landmark: sideInfo.corridor,
        icon: room.side === "A" || room.side === "D" ? "arrow-left" : "arrow-right",
        distance: "20 ft",
        accessibleNote: isAccessible
          ? "Corridor is 6 feet wide with smooth flooring. Handrails are on both sides."
          : undefined,
      });

      if (room.side === "B" || room.side === "D") {
        steps.push({
          id: stepId++,
          instruction: `Turn at the corner and continue along the ${sideInfo.corridor}`,
          landmark: "Corner Turn",
          icon: "arrow-up",
          distance: "~40 ft to corner",
          accessibleNote: isAccessible
            ? "Gentle corner — no sharp turns. Handrails continue around."
            : undefined,
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Walk ${walkDistance} ft along the corridor`,
        landmark: sideInfo.corridor,
        icon: "arrow-up",
        distance: `~${walkDistance} ft`,
        accessibleNote: isAccessible
          ? "Rooms on both sides of the corridor. Look for the room number plaques at eye and wheelchair level."
          : undefined,
      });
    } else {
      if (isAccessible) {
        steps.push({
          id: stepId++,
          instruction: "Head to the North Tower elevator bank just past the American Grill",
          landmark: "North Tower Elevators",
          icon: "elevator-passenger",
          distance: "30 ft",
          accessibleNote:
            "Elevators have Braille buttons, raised floor indicators, and audible floor announcements. Doors stay open 8 seconds — press and hold the Door Open button if you need more time.",
        });
      } else {
        steps.push({
          id: stepId++,
          instruction: "Head to the North Tower elevator or stairwell",
          landmark: "North Tower Elevators / Stairs",
          icon: "elevator-passenger",
          distance: "30 ft",
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Take the elevator to Floor ${room.floor}`,
        landmark: `Floor ${room.floor}`,
        icon: "elevator-up",
        distance: "",
        accessibleNote: isAccessible
          ? `Press button ${room.floor}. An audio announcement will confirm the floor.`
          : undefined,
        floor: room.floor,
      });

      steps.push({
        id: stepId++,
        instruction: `${sideInfo.turn} when you exit the elevator`,
        landmark: `${sideInfo.corridor} — Floor ${room.floor}`,
        icon: room.side === "A" || room.side === "D" ? "arrow-left" : "arrow-right",
        distance: "10 ft",
        accessibleNote: isAccessible
          ? "Hallway has tactile floor strips guiding you along the corridor. Handrails on both walls."
          : undefined,
      });

      if (room.side === "B" || room.side === "D") {
        steps.push({
          id: stepId++,
          instruction: `Turn at the corner to continue along the ${sideInfo.corridor}`,
          landmark: "Corner Turn",
          icon: "arrow-up",
          distance: "~40 ft to corner",
          accessibleNote: isAccessible
            ? "Rounded corner. Handrails continue. Look for the directional sign on the wall."
            : undefined,
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Walk approximately ${walkDistance} ft down the corridor`,
        landmark: sideInfo.corridor,
        icon: "arrow-up",
        distance: `~${walkDistance} ft`,
        accessibleNote: isAccessible
          ? "Room numbers are marked on plaques at both standing and wheelchair height."
          : undefined,
      });
    }
  } else {
    steps.push({
      id: stepId++,
      instruction: "Pass the front desk and turn right toward the Gift Shop and South Tower",
      landmark: "Gift Shop / South Tower",
      icon: "shopping-outline",
      distance: "70 ft",
      accessibleNote: isAccessible
        ? "Wide, level path. Gift shop is on your left."
        : undefined,
    });

    if (room.floor === 1) {
      steps.push({
        id: stepId++,
        instruction: `${sideInfo.turn} to enter the ground-floor corridor`,
        landmark: sideInfo.corridor,
        icon: room.side === "A" || room.side === "B" ? "arrow-right" : "arrow-left",
        distance: "20 ft",
        accessibleNote: isAccessible
          ? "Corridor is 6 feet wide with smooth flooring. Handrails on both sides."
          : undefined,
      });

      if (room.side === "B" || room.side === "D") {
        steps.push({
          id: stepId++,
          instruction: `Turn at the corner to continue along the ${sideInfo.corridor}`,
          landmark: "Corner Turn",
          icon: "arrow-up",
          distance: "~40 ft to corner",
          accessibleNote: isAccessible
            ? "Gentle corner with continuous handrails."
            : undefined,
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Walk ${walkDistance} ft along the corridor`,
        landmark: sideInfo.corridor,
        icon: "arrow-up",
        distance: `~${walkDistance} ft`,
        accessibleNote: isAccessible
          ? "Room numbers on both standing and wheelchair-height plaques."
          : undefined,
      });
    } else {
      if (isAccessible) {
        steps.push({
          id: stepId++,
          instruction: "Head to the South Tower elevator bank near the Executive Offices",
          landmark: "South Tower Elevators",
          icon: "elevator-passenger",
          distance: "40 ft",
          accessibleNote:
            "Elevators have Braille buttons, raised floor indicators, and audible floor announcements. Doors stay open 8 seconds.",
        });
      } else {
        steps.push({
          id: stepId++,
          instruction: "Head to the South Tower elevator or stairwell",
          landmark: "South Tower Elevators / Stairs",
          icon: "elevator-passenger",
          distance: "40 ft",
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Take the elevator to Floor ${room.floor}`,
        landmark: `Floor ${room.floor}`,
        icon: "elevator-up",
        distance: "",
        accessibleNote: isAccessible
          ? `Press button ${room.floor}. An audio announcement will confirm the floor.`
          : undefined,
        floor: room.floor,
      });

      steps.push({
        id: stepId++,
        instruction: `${sideInfo.turn} when you exit the elevator`,
        landmark: `${sideInfo.corridor} — Floor ${room.floor}`,
        icon: room.side === "A" || room.side === "B" ? "arrow-right" : "arrow-left",
        distance: "10 ft",
        accessibleNote: isAccessible
          ? "Hallway has tactile floor strips. Handrails on both walls."
          : undefined,
      });

      if (room.side === "B" || room.side === "D") {
        steps.push({
          id: stepId++,
          instruction: `Turn at the corner to continue along the ${sideInfo.corridor}`,
          landmark: "Corner Turn",
          icon: "arrow-up",
          distance: "~40 ft to corner",
          accessibleNote: isAccessible
            ? "Rounded corner with continuous handrails."
            : undefined,
        });
      }

      steps.push({
        id: stepId++,
        instruction: `Walk approximately ${walkDistance} ft down the corridor`,
        landmark: sideInfo.corridor,
        icon: "arrow-up",
        distance: `~${walkDistance} ft`,
        accessibleNote: isAccessible
          ? "Room numbers on plaques at standing and wheelchair height."
          : undefined,
      });
    }
  }

  steps.push({
    id: stepId++,
    instruction: isCorner
      ? `Room ${room.number} is the ${doorSide}-side corner room`
      : `Room ${room.number} is on your ${doorSide}`,
    landmark: `Room ${room.number}`,
    icon: "door",
    distance: "You've arrived",
    accessibleNote: room.accessibleRoom
      ? "Accessible room: wide entry door (36\"), lowered peephole, roll-in shower, and grab bars. Call the front desk if you need additional accommodations."
      : undefined,
    floor: room.floor,
  });

  return steps;
}
