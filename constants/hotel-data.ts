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

export type LocationCategory =
  | "Hotel Services"
  | "Dining & Drinks"
  | "Shopping"
  | "Recreation & Wellness"
  | "Convention Center"
  | "Meeting Rooms";

export interface GroundFloorLocation {
  id: string;
  name: string;
  category: LocationCategory;
  description: string;
  icon: string;
  hours?: string;
  accessible: boolean;
}

export const GROUND_FLOOR_LOCATIONS: GroundFloorLocation[] = [
  {
    id: "front-desk",
    name: "Front Desk / Check-In",
    category: "Hotel Services",
    description: "Hotel check-in, check-out, key cards, and guest services",
    icon: "desk",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "bell-desk",
    name: "Bell Desk",
    category: "Hotel Services",
    description: "Luggage assistance, storage, and porter services",
    icon: "bag-suitcase",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "parking-desk",
    name: "Parking Desk",
    category: "Hotel Services",
    description: "Parking passes, validation, and parking assistance",
    icon: "car",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "valet",
    name: "Valet",
    category: "Hotel Services",
    description: "Valet parking drop-off and pick-up at the hotel entrance",
    icon: "key-variant",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "business-center",
    name: "Business Center",
    category: "Hotel Services",
    description: "Computers, printing, fax, and office supplies",
    icon: "laptop",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "guest-laundry",
    name: "Guest Laundry",
    category: "Hotel Services",
    description: "Self-service washers and dryers for hotel guests",
    icon: "washing-machine",
    hours: "Open 24 hours",
    accessible: true,
  },
  {
    id: "avis",
    name: "AVIS Car Rental",
    category: "Hotel Services",
    description: "On-site car rental counter for reservations and pick-up",
    icon: "car-key",
    hours: "8:00 AM – 6:00 PM",
    accessible: true,
  },
  {
    id: "executive-offices",
    name: "Executive Offices",
    category: "Hotel Services",
    description: "Hotel management and guest relations offices near South Tower",
    icon: "briefcase",
    hours: "Mon–Fri 9:00 AM – 5:00 PM",
    accessible: true,
  },
  {
    id: "american-grill",
    name: "American Grill",
    category: "Dining & Drinks",
    description: "Full-service restaurant serving American cuisine, breakfast through dinner",
    icon: "silverware-fork-knife",
    hours: "6:30 AM – 11:00 PM",
    accessible: true,
  },
  {
    id: "starbucks",
    name: "Starbucks Coffee Shop",
    category: "Dining & Drinks",
    description: "Full Starbucks café with coffees, teas, pastries, and light bites",
    icon: "coffee",
    hours: "6:00 AM – 10:00 PM",
    accessible: true,
  },
  {
    id: "restaurant",
    name: "Restaurant (Pool Terrace)",
    category: "Dining & Drinks",
    description: "Casual poolside dining and bar service on the upper terrace",
    icon: "food",
    hours: "11:00 AM – 9:00 PM",
    accessible: true,
  },
  {
    id: "gift-shop",
    name: "Gift Shop",
    category: "Shopping",
    description: "Souvenirs, snacks, sundries, and Universal Orlando merchandise",
    icon: "shopping",
    hours: "8:00 AM – 11:00 PM",
    accessible: true,
  },
  {
    id: "pool",
    name: "Pool & Pool Terrace",
    category: "Recreation & Wellness",
    description: "Outdoor heated pool with sun deck and lounge seating on the terrace level",
    icon: "pool",
    hours: "7:00 AM – 10:00 PM",
    accessible: true,
  },
  {
    id: "childrens-pool",
    name: "Children's Pool",
    category: "Recreation & Wellness",
    description: "Shallow pool area designed for young children, adjacent to the main pool",
    icon: "baby-face-outline",
    hours: "7:00 AM – 10:00 PM",
    accessible: true,
  },
  {
    id: "spa",
    name: "Spa",
    category: "Recreation & Wellness",
    description: "Full-service spa offering massages, facials, and wellness treatments",
    icon: "spa",
    hours: "9:00 AM – 7:00 PM",
    accessible: true,
  },
  {
    id: "courtyard",
    name: "Courtyard",
    category: "Recreation & Wellness",
    description: "Outdoor courtyard garden between the hotel towers — seating and walking paths",
    icon: "tree",
    hours: "Open all day",
    accessible: true,
  },
  {
    id: "game-room",
    name: "Game Room",
    category: "Recreation & Wellness",
    description: "Arcade games and entertainment, located near the Guest Laundry",
    icon: "controller-classic",
    hours: "10:00 AM – 11:00 PM",
    accessible: true,
  },
  {
    id: "convention-entrance",
    name: "Convention Center Entrance",
    category: "Convention Center",
    description: "Main entrance to the DoubleTree Convention Center from the hotel lobby",
    icon: "domain",
    accessible: true,
  },
  {
    id: "registration",
    name: "Registration Desk",
    category: "Convention Center",
    description: "Convention and event registration desk near the Seminole Ballroom entrance",
    icon: "clipboard-list",
    accessible: true,
  },
  {
    id: "seminole-office",
    name: "Seminole Office",
    category: "Convention Center",
    description: "Convention center administrative office",
    icon: "office-building",
    accessible: true,
  },
  {
    id: "seminole-ballroom",
    name: "Seminole Ballroom",
    category: "Convention Center",
    description: "Large ballroom for events, galas, and conferences — seats up to 1,000 guests",
    icon: "star",
    accessible: true,
  },
  {
    id: "space-coast-i",
    name: "Space Coast I",
    category: "Meeting Rooms",
    description: "Meeting room adjacent to the Seminole Ballroom, upper row",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "space-coast-ii",
    name: "Space Coast II",
    category: "Meeting Rooms",
    description: "Meeting room adjacent to the Seminole Ballroom, middle row",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "space-coast-iii",
    name: "Space Coast III",
    category: "Meeting Rooms",
    description: "Meeting room adjacent to the Seminole Ballroom, lower row",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "gold-coast-i",
    name: "Gold Coast I",
    category: "Meeting Rooms",
    description: "Meeting room in the Gold Coast row, first room",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "gold-coast-ii",
    name: "Gold Coast II",
    category: "Meeting Rooms",
    description: "Meeting room in the Gold Coast row, second room",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "gold-coast-iii",
    name: "Gold Coast III",
    category: "Meeting Rooms",
    description: "Meeting room in the Gold Coast row, third room",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "gold-coast-iv",
    name: "Gold Coast IV",
    category: "Meeting Rooms",
    description: "Meeting room in the Gold Coast row, fourth room",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-a",
    name: "Universal A",
    category: "Meeting Rooms",
    description: "Universal Center meeting room A — central convention area",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-b",
    name: "Universal B",
    category: "Meeting Rooms",
    description: "Universal Center meeting room B",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-c",
    name: "Universal C",
    category: "Meeting Rooms",
    description: "Universal Center meeting room C",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-d",
    name: "Universal D",
    category: "Meeting Rooms",
    description: "Universal Center meeting room D",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-e",
    name: "Universal E",
    category: "Meeting Rooms",
    description: "Universal Center meeting room E",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "universal-f",
    name: "Universal F",
    category: "Meeting Rooms",
    description: "Universal Center meeting room F",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "sun-surf-i",
    name: "Sun & Surf I",
    category: "Meeting Rooms",
    description: "Sun & Surf meeting room I — leftmost wing of the convention center",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "sun-surf-ii",
    name: "Sun & Surf II",
    category: "Meeting Rooms",
    description: "Sun & Surf meeting room II",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "sun-surf-iii",
    name: "Sun & Surf III",
    category: "Meeting Rooms",
    description: "Sun & Surf meeting room III",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "sun-surf-iv",
    name: "Sun & Surf IV",
    category: "Meeting Rooms",
    description: "Sun & Surf meeting room IV",
    icon: "television-play",
    accessible: true,
  },
  {
    id: "sun-surf-v",
    name: "Sun & Surf V",
    category: "Meeting Rooms",
    description: "Sun & Surf meeting room V — farthest from the lobby",
    icon: "television-play",
    accessible: true,
  },
];

export function getLocationDirections(location: GroundFloorLocation): DirectionStep[] {
  const steps: DirectionStep[] = [];
  let id = 1;

  const start: DirectionStep = {
    id: id++,
    instruction: "Enter through the hotel's main entrance on Major Blvd",
    landmark: "Hotel Entrance",
    icon: "door-open",
    distance: "Start",
    accessibleNote: "Automatic sliding doors. Push-button opener on the right pillar.",
  };

  const lobby: DirectionStep = {
    id: id++,
    instruction: "Walk straight through the lobby toward the front desk",
    landmark: "Hotel Lobby",
    icon: "desk",
    distance: "60 ft",
    accessibleNote: "Level, wide pathway. Bell desk is on the right for luggage assistance.",
  };

  switch (location.id) {
    case "front-desk":
      steps.push(start, lobby, {
        id: id++,
        instruction: "The front desk is directly ahead of you as you enter the lobby",
        landmark: "Front Desk",
        icon: "desk",
        distance: "You've arrived",
        accessibleNote: "Lowered check-in counter available on the left side of the desk.",
      });
      break;

    case "bell-desk":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Look to your right — Bell Desk is just past the main entrance, near the lobby doors",
        landmark: "Bell Desk",
        icon: "bag-suitcase",
        distance: "You've arrived",
        accessibleNote: "Staff can assist with wheelchair-accessible luggage carts.",
      });
      break;

    case "parking-desk":
    case "valet":
      steps.push(start, {
        id: id++,
        instruction: location.id === "valet"
          ? "Valet is right outside the main entrance — hand your keys to the attendant"
          : "Parking Desk is just inside the main entrance on the right",
        landmark: location.name,
        icon: location.id === "valet" ? "key-variant" : "car",
        distance: "You've arrived",
        accessibleNote: "Accessible parking spaces are in the nearest row. Ask the valet or parking desk for assistance.",
      });
      break;

    case "american-grill":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Continue past the front desk — the American Grill is straight ahead in the center of the floor",
        landmark: "American Grill",
        icon: "silverware-fork-knife",
        distance: "80 ft",
        accessibleNote: "Wide entrance, accessible seating available throughout. Please inform host of any needs.",
      });
      break;

    case "starbucks":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Pass the front desk and turn right toward the South Tower side of the lobby",
        landmark: "South Lobby Area",
        icon: "arrow-right",
        distance: "60 ft",
        accessibleNote: "Wide, level path — no steps.",
      }, {
        id: id++,
        instruction: "Starbucks is on your left between the Gift Shop and the Restaurant",
        landmark: "Starbucks Coffee Shop",
        icon: "coffee",
        distance: "40 ft",
        accessibleNote: "Mobile order available on the Starbucks app for quicker pick-up.",
      });
      break;

    case "restaurant":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Pass the front desk and turn right, heading toward the far-right end of the hotel",
        landmark: "Right side of lobby",
        icon: "arrow-right",
        distance: "70 ft",
      }, {
        id: id++,
        instruction: "The Pool Terrace Restaurant is at the far right of the ground floor, near the Business Center",
        landmark: "Pool Terrace Restaurant",
        icon: "food",
        distance: "60 ft",
        accessibleNote: "Accessible entrance. Ask staff to seat you at an accessible table.",
      });
      break;

    case "gift-shop":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Pass the front desk and turn right toward the South Tower",
        landmark: "South Lobby",
        icon: "arrow-right",
        distance: "60 ft",
      }, {
        id: id++,
        instruction: "Gift Shop is on your left, just before the South Tower elevators",
        landmark: "Gift Shop",
        icon: "shopping",
        distance: "30 ft",
        accessibleNote: "Wide aisles and accessible entrance.",
      });
      break;

    case "business-center":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Turn right past the front desk and head toward the far-right corner of the hotel",
        landmark: "Right side of hotel",
        icon: "arrow-right",
        distance: "70 ft",
      }, {
        id: id++,
        instruction: "Business Center is in the far-right corner, next to the Restaurant",
        landmark: "Business Center",
        icon: "laptop",
        distance: "50 ft",
        accessibleNote: "Adjustable-height workstations available. Ask staff for assistance.",
      });
      break;

    case "guest-laundry":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Continue past the front desk toward the center of the hotel floor",
        landmark: "Central Corridor",
        icon: "arrow-up",
        distance: "80 ft",
      }, {
        id: id++,
        instruction: "Guest Laundry is in the central area of the hotel, adjacent to the Game Room",
        landmark: "Guest Laundry",
        icon: "washing-machine",
        distance: "40 ft",
        accessibleNote: "Front-loading machines are accessible from a wheelchair.",
      });
      break;

    case "game-room":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Continue past the front desk toward the center of the hotel floor",
        landmark: "Central Corridor",
        icon: "arrow-up",
        distance: "80 ft",
      }, {
        id: id++,
        instruction: "Game Room is in the central area of the hotel, next to the Guest Laundry",
        landmark: "Game Room",
        icon: "controller-classic",
        distance: "40 ft",
        accessibleNote: "Some games are wheelchair accessible. Ask staff for adapted play options.",
      });
      break;

    case "avis":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Turn right past the front desk toward the South Tower side",
        landmark: "South Side of Lobby",
        icon: "arrow-right",
        distance: "60 ft",
      }, {
        id: id++,
        instruction: "AVIS Car Rental counter is on the right side, near the South Tower elevators",
        landmark: "AVIS Car Rental",
        icon: "car-key",
        distance: "40 ft",
        accessibleNote: "Accessible vehicles available — request when booking or at the counter.",
      });
      break;

    case "executive-offices":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Pass the front desk and walk right toward the South Tower",
        landmark: "South Tower Area",
        icon: "arrow-right",
        distance: "80 ft",
      }, {
        id: id++,
        instruction: "Executive Offices are on the far-right side, near the South Tower elevators",
        landmark: "Executive Offices",
        icon: "briefcase",
        distance: "30 ft",
      });
      break;

    case "pool":
    case "childrens-pool":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Head toward the North Tower elevators, past the American Grill",
        landmark: "North Tower Elevators",
        icon: "elevator-passenger",
        distance: "90 ft",
        accessibleNote: "Elevator available. Press P for Pool Level or follow the Pool Terrace signs.",
      }, {
        id: id++,
        instruction: "Take the elevator or follow Pool Terrace signs up to the pool level",
        landmark: "Pool Level",
        icon: "elevator-up",
        distance: "",
        accessibleNote: "Pool lift available for wheelchair access into the water. Ask a pool attendant.",
      }, {
        id: id++,
        instruction: location.id === "childrens-pool"
          ? "Children's Pool is to the right of the main pool, in the shallow end near the Spa"
          : "The main Pool and Pool Terrace are directly ahead — follow the deck walkway",
        landmark: location.name,
        icon: "pool",
        distance: "You've arrived",
        accessibleNote: "Pool deck is flat and non-slip. Towels available at the attendant station.",
      });
      break;

    case "spa":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Head toward the North Tower elevators, past the American Grill",
        landmark: "North Tower Elevators",
        icon: "elevator-passenger",
        distance: "90 ft",
      }, {
        id: id++,
        instruction: "Take the elevator or stairs to the Pool Terrace level",
        landmark: "Pool Terrace Level",
        icon: "elevator-up",
        distance: "",
      }, {
        id: id++,
        instruction: "Spa is on the upper terrace, adjacent to the pool — look for the Spa sign on your right",
        landmark: "Spa",
        icon: "spa",
        distance: "You've arrived",
        accessibleNote: "Accessible entrance with wide doorway. Call ahead to arrange accessible treatment rooms.",
      });
      break;

    case "courtyard":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Continue past the front desk toward the American Grill",
        landmark: "Central Hotel Floor",
        icon: "arrow-up",
        distance: "80 ft",
      }, {
        id: id++,
        instruction: "The Courtyard entrance is on your left, between the North and South Tower sides",
        landmark: "Courtyard",
        icon: "tree",
        distance: "You've arrived",
        accessibleNote: "Paved pathways throughout the courtyard — fully wheelchair accessible.",
      });
      break;

    case "convention-entrance":
    case "registration":
    case "seminole-office":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Turn left at the front desk and walk toward the Convention Center wing",
        landmark: "Convention Center Corridor",
        icon: "arrow-left",
        distance: "60 ft",
        accessibleNote: "Wide corridor, level surface, no steps. Handrails on left wall.",
      }, {
        id: id++,
        instruction: location.id === "registration"
          ? "Registration Desk is on the right side just inside the Convention Center entrance"
          : location.id === "seminole-office"
          ? "Seminole Office is on the left, past the Registration Desk"
          : "Convention Center main entrance doors are straight ahead",
        landmark: location.name,
        icon: location.id === "convention-entrance" ? "domain" : "clipboard-list",
        distance: "You've arrived",
        accessibleNote: "Accessible entrance. Ask at Registration for accessible seating in any event space.",
      });
      break;

    case "seminole-ballroom":
      steps.push(start, lobby, {
        id: id++,
        instruction: "Turn left at the front desk toward the Convention Center",
        landmark: "Convention Center Corridor",
        icon: "arrow-left",
        distance: "60 ft",
        accessibleNote: "Level, wide corridor with handrails on the left.",
      }, {
        id: id++,
        instruction: "Pass through the Convention Center entrance — the Seminole Ballroom is straight ahead, the largest space in the center",
        landmark: "Seminole Ballroom",
        icon: "star",
        distance: "~100 ft",
        accessibleNote: "Multiple accessible entrances to the Ballroom. Ask staff for the nearest accessible door to your event table.",
      });
      break;

    default: {
      const isSpaceCoast = location.id.startsWith("space-coast");
      const isGoldCoast = location.id.startsWith("gold-coast");
      const isUniversal = location.id.startsWith("universal-");
      const isSunSurf = location.id.startsWith("sun-surf");

      const roomNum = location.id.split("-").pop() ?? "";

      steps.push(start, lobby, {
        id: id++,
        instruction: "Turn left at the front desk and head into the Convention Center corridor",
        landmark: "Convention Center Entrance",
        icon: "arrow-left",
        distance: "60 ft",
        accessibleNote: "Level, wide path. No steps into the Convention Center.",
      });

      if (isSpaceCoast) {
        steps.push({
          id: id++,
          instruction: "Pass through the Ballroom lobby — Space Coast rooms are on the right side of the Seminole Ballroom",
          landmark: "Space Coast Area",
          icon: "arrow-right",
          distance: "40 ft",
          accessibleNote: "Accessible entrances marked on the right wall.",
        }, {
          id: id++,
          instruction: `Look for the ${location.name} sign on the right wall`,
          landmark: location.name,
          icon: "television-play",
          distance: "You've arrived",
        });
      } else if (isGoldCoast) {
        steps.push({
          id: id++,
          instruction: "Continue past the Space Coast rooms — Gold Coast rooms are further along the right-side corridor",
          landmark: "Gold Coast Area",
          icon: "arrow-up",
          distance: "60 ft",
          accessibleNote: "Accessible entrances on right wall.",
        }, {
          id: id++,
          instruction: `${location.name} is on the right — look for the room sign`,
          landmark: location.name,
          icon: "television-play",
          distance: "You've arrived",
        });
      } else if (isUniversal) {
        const letter = roomNum.toUpperCase();
        steps.push({
          id: id++,
          instruction: "Walk into the Universal Center area — the center section of the Convention Center",
          landmark: "Universal Center",
          icon: "arrow-up",
          distance: "80 ft",
          accessibleNote: "Open, wide floor plan. Room signs are at hallway intersections.",
        }, {
          id: id++,
          instruction: `Universal ${letter} is in the Universal Center section — look for the ${letter} sign on the partition wall`,
          landmark: `Universal ${letter}`,
          icon: "television-play",
          distance: "You've arrived",
        });
      } else if (isSunSurf) {
        steps.push({
          id: id++,
          instruction: "Continue through the Convention Center to the far-left wing — Sun & Surf rooms are at the far end",
          landmark: "Sun & Surf Wing",
          icon: "arrow-left",
          distance: "120 ft",
          accessibleNote: "Long corridor — accessible seating benches are on the left wall halfway through.",
        }, {
          id: id++,
          instruction: `${location.name} is in the far-left wing — look for the numbered sign on the door`,
          landmark: location.name,
          icon: "television-play",
          distance: "You've arrived",
        });
      }
      break;
    }
  }

  return steps;
}

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
