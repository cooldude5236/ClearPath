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
  wing: string;
  type: string;
  accessibleRoom: boolean;
}

export const HOTEL_INFO = {
  name: "Hilton DoubleTree",
  subtitle: "at the Entrance to Universal Orlando Resort",
  address: "5780 Major Blvd, Orlando, FL 32819",
};

export const ROOMS: Room[] = [
  { number: "101", floor: 1, wing: "North", type: "King", accessibleRoom: true },
  { number: "102", floor: 1, wing: "North", type: "Double Queen", accessibleRoom: false },
  { number: "103", floor: 1, wing: "North", type: "King", accessibleRoom: false },
  { number: "104", floor: 1, wing: "South", type: "King Suite", accessibleRoom: true },
  { number: "105", floor: 1, wing: "South", type: "Double Queen", accessibleRoom: false },
  { number: "201", floor: 2, wing: "North", type: "King", accessibleRoom: true },
  { number: "202", floor: 2, wing: "North", type: "Double Queen", accessibleRoom: false },
  { number: "203", floor: 2, wing: "North", type: "King", accessibleRoom: false },
  { number: "204", floor: 2, wing: "South", type: "King Suite", accessibleRoom: true },
  { number: "205", floor: 2, wing: "South", type: "Double Queen", accessibleRoom: false },
  { number: "301", floor: 3, wing: "North", type: "King", accessibleRoom: true },
  { number: "302", floor: 3, wing: "North", type: "Double Queen", accessibleRoom: false },
  { number: "303", floor: 3, wing: "North", type: "King", accessibleRoom: false },
  { number: "304", floor: 3, wing: "South", type: "King Suite", accessibleRoom: true },
  { number: "305", floor: 3, wing: "South", type: "Double Queen", accessibleRoom: false },
  { number: "401", floor: 4, wing: "North", type: "King", accessibleRoom: true },
  { number: "402", floor: 4, wing: "North", type: "Double Queen", accessibleRoom: false },
  { number: "403", floor: 4, wing: "North", type: "King", accessibleRoom: false },
  { number: "404", floor: 4, wing: "South", type: "King Suite", accessibleRoom: true },
  { number: "405", floor: 4, wing: "South", type: "Double Queen", accessibleRoom: false },
  { number: "501", floor: 5, wing: "North", type: "King", accessibleRoom: true },
  { number: "502", floor: 5, wing: "North", type: "Double Queen", accessibleRoom: false },
  { number: "503", floor: 5, wing: "North", type: "King", accessibleRoom: false },
  { number: "504", floor: 5, wing: "South", type: "King Suite", accessibleRoom: true },
  { number: "505", floor: 5, wing: "South", type: "Double Queen", accessibleRoom: false },
];

export type RouteType = "accessible" | "standard";

export function getDirections(room: Room, routeType: RouteType): DirectionStep[] {
  const isAccessible = routeType === "accessible";
  const steps: DirectionStep[] = [];
  let stepId = 1;

  steps.push({
    id: stepId++,
    instruction: "Enter through the main lobby doors",
    landmark: "Main Entrance",
    icon: "door-open",
    distance: "Start",
    accessibleNote: isAccessible ? "Automatic doors available on the right side" : undefined,
  });

  steps.push({
    id: stepId++,
    instruction: "Walk straight ahead past the front desk on your left",
    landmark: "Front Desk & Lobby",
    icon: "desk",
    distance: "50 ft",
    accessibleNote: isAccessible ? "Wide, flat pathway with no obstacles" : undefined,
  });

  if (room.floor === 1) {
    if (room.wing === "North") {
      steps.push({
        id: stepId++,
        instruction: "Continue straight past the gift shop",
        landmark: "Gift Shop",
        icon: "shopping-outline",
        distance: "80 ft",
      });
      steps.push({
        id: stepId++,
        instruction: "Turn right at the hallway intersection",
        landmark: "North Wing Hallway",
        icon: "arrow-right",
        distance: "30 ft",
        accessibleNote: isAccessible ? "Hallway is 6 feet wide, wheelchair accessible" : undefined,
      });
      steps.push({
        id: stepId++,
        instruction: `Your room ${room.number} is on the ${parseInt(room.number) % 2 === 0 ? "right" : "left"} side`,
        landmark: `Room ${room.number}`,
        icon: "door",
        distance: "40 ft",
        accessibleNote: room.accessibleRoom ? "Accessible room with wide door and grab bars" : undefined,
        floor: 1,
      });
    } else {
      steps.push({
        id: stepId++,
        instruction: "Continue straight past the gift shop",
        landmark: "Gift Shop",
        icon: "shopping-outline",
        distance: "80 ft",
      });
      steps.push({
        id: stepId++,
        instruction: "Turn left at the hallway intersection",
        landmark: "South Wing Hallway",
        icon: "arrow-left",
        distance: "30 ft",
        accessibleNote: isAccessible ? "Hallway is 6 feet wide, wheelchair accessible" : undefined,
      });
      steps.push({
        id: stepId++,
        instruction: `Your room ${room.number} is on the ${parseInt(room.number) % 2 === 0 ? "right" : "left"} side`,
        landmark: `Room ${room.number}`,
        icon: "door",
        distance: "60 ft",
        accessibleNote: room.accessibleRoom ? "Accessible room with wide door and grab bars" : undefined,
        floor: 1,
      });
    }
  } else {
    if (isAccessible) {
      steps.push({
        id: stepId++,
        instruction: "Turn right and head to the elevators",
        landmark: "Elevator Bay",
        icon: "elevator-passenger",
        distance: "60 ft",
        accessibleNote: "Elevators have Braille buttons and audible floor announcements",
      });
      steps.push({
        id: stepId++,
        instruction: `Take the elevator to floor ${room.floor}`,
        landmark: `Floor ${room.floor}`,
        icon: "elevator-up",
        distance: "",
        accessibleNote: "Elevator doors stay open for 8 seconds. Press and hold to extend.",
      });
    } else {
      steps.push({
        id: stepId++,
        instruction: "Continue past the lobby seating area",
        landmark: "Lobby Seating",
        icon: "sofa-outline",
        distance: "40 ft",
      });
      steps.push({
        id: stepId++,
        instruction: `Take the elevators or stairs to floor ${room.floor}`,
        landmark: `Floor ${room.floor}`,
        icon: "elevator-passenger",
        distance: "60 ft",
      });
    }

    if (room.wing === "North") {
      steps.push({
        id: stepId++,
        instruction: "Exit the elevator and turn right",
        landmark: `Floor ${room.floor} - North Wing`,
        icon: "arrow-right",
        distance: "10 ft",
        accessibleNote: isAccessible ? "Textured floor guide available along the hallway" : undefined,
      });
      steps.push({
        id: stepId++,
        instruction: "Follow the hallway straight ahead",
        landmark: "North Wing Corridor",
        icon: "arrow-up",
        distance: "80 ft",
        accessibleNote: isAccessible ? "Wide corridor with handrails on both sides" : undefined,
      });
    } else {
      steps.push({
        id: stepId++,
        instruction: "Exit the elevator and turn left",
        landmark: `Floor ${room.floor} - South Wing`,
        icon: "arrow-left",
        distance: "10 ft",
        accessibleNote: isAccessible ? "Textured floor guide available along the hallway" : undefined,
      });
      steps.push({
        id: stepId++,
        instruction: "Follow the hallway straight ahead",
        landmark: "South Wing Corridor",
        icon: "arrow-up",
        distance: "100 ft",
        accessibleNote: isAccessible ? "Wide corridor with handrails on both sides" : undefined,
      });
    }

    steps.push({
      id: stepId++,
      instruction: `Your room ${room.number} is on the ${parseInt(room.number) % 2 === 0 ? "right" : "left"} side`,
      landmark: `Room ${room.number}`,
      icon: "door",
      distance: "20 ft",
      accessibleNote: room.accessibleRoom ? "Accessible room with wide door, lowered peephole, and grab bars" : undefined,
      floor: room.floor,
    });
  }

  return steps;
}
