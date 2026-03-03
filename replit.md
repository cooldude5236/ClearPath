# RoomFinder - Hotel Navigation App

## Overview

RoomFinder is a mobile navigation app built with Expo/React Native for the Hilton DoubleTree hotel at Universal Orlando Resort. The app helps guests find their rooms by providing step-by-step directions from the lobby, supporting both standard and accessible routes. It features a multi-screen flow: Welcome → Room Selection → Route Choice → Turn-by-Turn Directions with voice narration.

The app is structured as a cross-platform Expo application (iOS, Android, Web) with a companion Express.js backend server. Hotel room and direction data is stored as static constants client-side — no dynamic room data is fetched from the server.

**Screens:**
- `index.tsx` — Welcome/landing screen with animated UI
- `room-select.tsx` — Searchable room list with floor/tower/accessibility info
- `route-choice.tsx` — Choose standard or accessible route
- `directions.tsx` — Step-by-step directions with haptics and text-to-speech
- `arrived.tsx` — "You've Arrived" celebration screen with animated checkmark and home button

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend (Expo / React Native)

- **Framework:** Expo SDK ~54, using Expo Router v6 for file-based navigation
- **Navigation:** Stack-based navigation via expo-router. Five main screens defined in `app/` directory. Routes: `/`, `/room-select`, `/route-choice`, `/directions`, `/arrived`
- **UI:** Custom design system using `constants/colors.ts` (warm hotel palette: deep green primary, tan accent). Inter font family loaded via `@expo-google-fonts/inter`
- **Animations:** `react-native-reanimated` for smooth shared value animations (pulse effects on welcome screen)
- **Accessibility:** Accessible room filtering, accessibility labels on all interactive elements, accessible route option in navigation
- **Haptics:** `expo-haptics` for tactile feedback on all navigation actions
- **Voice:** `expo-speech` for reading direction steps aloud

### Hotel Data Layer

- All room and direction data lives in `constants/hotel-data.ts` as static TypeScript constants
- Hotel has 17 floors, 36 rooms per floor, two towers (North/South)
- Rooms have sides (A/B/C/D), types (Double Queen, King, Corner Suite, Accessible King), and accessibility flags
- `getDirections()` function generates step-by-step instructions based on room and route type

### Backend (Express.js)

- **Server:** Express 5 in `server/index.ts`
- **Routes:** Defined in `server/routes.ts` — currently a scaffold with no active API routes (all prefixed `/api`)
- **Storage:** `server/storage.ts` uses in-memory storage (`MemStorage`) for user data. Implements `IStorage` interface for easy swapping to a database-backed implementation
- **CORS:** Configured to allow Replit dev/deployment domains and localhost for Expo web dev
- **Static serving:** In production, serves the Expo static web build

### Database (Drizzle ORM + PostgreSQL)

- Schema defined in `shared/schema.ts` using Drizzle ORM
- Currently only a `users` table (id, username, password) — basic scaffold
- `drizzle.config.ts` points to `DATABASE_URL` environment variable (PostgreSQL)
- Validation schemas generated from Drizzle schema using `drizzle-zod`
- Run `npm run db:push` to sync schema to the database

### Data Fetching

- `@tanstack/react-query` is set up via `lib/query-client.ts` with a configured `QueryClient`
- `apiRequest()` helper wraps `fetch` with base URL resolution from `EXPO_PUBLIC_DOMAIN` env var
- Currently the app doesn't fetch dynamic data — static hotel constants are used directly

### Build & Deployment

- Dev: Run Expo dev server + Express backend concurrently (separate `expo:dev` and `server:dev` scripts)
- Production: `scripts/build.js` builds the Expo static web bundle, served by Express
- Server bundled via `esbuild` for production

## External Dependencies

| Dependency | Purpose |
|---|---|
| `expo-router` | File-based navigation for React Native |
| `react-native-reanimated` | High-performance animations |
| `expo-haptics` | Tactile feedback on device interactions |
| `expo-speech` | Text-to-speech for direction narration |
| `expo-linear-gradient` | Gradient backgrounds on welcome screen |
| `expo-location` | Location services (imported, not yet actively used) |
| `expo-image-picker` | Image selection (imported, not yet actively used) |
| `@tanstack/react-query` | Server state management and data fetching |
| `drizzle-orm` | Type-safe ORM for PostgreSQL |
| `drizzle-zod` | Schema validation from Drizzle table definitions |
| `express` | Backend API server |
| `pg` | PostgreSQL client for Node.js |
| `react-native-keyboard-controller` | Keyboard-aware scroll behavior |
| `react-native-gesture-handler` | Native gesture handling |
| `@expo-google-fonts/inter` | Inter font family |
| `@expo/vector-icons` | Icon library (MaterialCommunityIcons, Ionicons, Feather) |

### Environment Variables Required

- `DATABASE_URL` — PostgreSQL connection string (for server/drizzle)
- `EXPO_PUBLIC_DOMAIN` — Base domain for API requests from the Expo client
- `REPLIT_DEV_DOMAIN` — Auto-set by Replit, used for CORS and dev server config
- `REPLIT_DOMAINS` — Auto-set by Replit, comma-separated deployment domains for CORS