# Cincy Moto Park: Product & Engineering Spec

Living document. Update it whenever behavior, decisions, or the roadmap change, and attach it (with the project zip) when starting a new AI-assistant conversation so it has full context.

_Last updated: 2026-10-29_

## 1. Purpose

A mobile app for motorcycle riders in Cincinnati to find legal parking spots, see how far each is, get directions to one, and track how long the bike has been parked (plus a walk back to it).

**Audience:** riders on a phone, often outdoors and in sunlight, often one-handed. Glanceable UI and big touch targets matter more than feature depth.

## 2. Stack

- Expo SDK 53, React Native 0.79, React 19, class components (no hooks, no TypeScript)
- `react-native-maps` (native only, no web), `expo-location`, `@react-native-async-storage/async-storage`, `react-native-safe-area-context`, `@expo/vector-icons`
- No backend, no network calls of our own. Spot data is bundled in `assets/data.json`.
- Tests: Node's built-in runner (`npm test`, Node 20.19+ or 22.12+). Covers pure helpers, data validity, and theme contrast. UI is not covered by automated tests.

## 3. Features (current)

| Feature | Behavior |
|---|---|
| Map | Pins for available spots; selected = orange, parked = green. "Center on me" button when location is known. |
| Spot list | Sorted by distance when location is known; unavailable spots sink to the bottom. Tapping a card zooms the map; tapping a pin scrolls the list to its card. |
| Park here | Records `{parkedSpotId, parkedAt}` in AsyncStorage (no coordinates stored). Asks before switching from one parked spot to another. Restored on app restart; stale or corrupt records are cleared. |
| Parked panel | Elapsed-time timer (ticks only while parked, refreshes on foreground), "Walk to bike", "Got my bike". |
| Directions | "Directions" on each available, non-parked card opens a picker, then hands off to a maps app (see section 5). |
| Location | Permission and failure handling with a banner (Allow / Open Settings / Try again). Cached position shown first, then refined. |
| Disclaimer | Footer: rules can change, check signs. Shows `lastVerified` from the data when set. |

## 4. Data model (`assets/data.json`)

```json
{
  "lastVerified": null,
  "spots": [
    {
      "id": "sycamore-st",
      "name": "SYCAMORE ST",
      "description": "Next to the Taft Theatre (left side)",
      "parkOnSidewalk": true,
      "policeBlock": false,
      "latitude": 39.101526,
      "longitude": -84.507995,
      "unavailable": false
    }
  ]
}
```

- `id` must be unique and **stable**. It is persisted for the parked spot, so renaming an id orphans a saved parked state (the app clears it on next launch).
- `unavailable: true` (or the legacy `construction: true`, or missing/0,0 coordinates) hides the pin and disables actions.
- `lastVerified`: free text date shown to users. Currently `null`; the owner must fill it in.
- `parkOnSidewalk` / `policeBlock` are legal/safety claims riders rely on. Treat accuracy as a trust and liability issue.

## 5. Key decisions

1. **Navigation is a handoff, not in-app.** The app opens Apple Maps, Google Maps, Waze, or the Android system handler with the spot's coordinates. Reasons: free, no API keys or SDK, works in Expo Go, riders already have a preferred nav app (often tied to a headset or mount), and the app's value is knowing *where* to park. In-app turn-by-turn would need a navigation SDK, a custom dev build, background location, audio, and ongoing cost.
   - Ride mode uses `driving`. Google's `travelmode=two-wheeler` exists but routing support varies by region, so it is not used.
   - Waze has no walking mode, so it's omitted for walk-back.
   - Android's `Alert` allows 3 buttons max, so the Android provider list is capped at 3 (Google, Waze, Other).
   - The picker appears every time; a remembered preference is a possible future improvement.
2. **Native maps only; web deferred.** `react-native-maps` doesn't support web. If web is wanted later, add `components/MapView.web.js` (Leaflet + OpenStreetMap was the proposed approach) plus `react-dom` and `react-native-web`. Not worth the upkeep without a specific web audience.
3. **Spot data is bundled** (comment in `App.js`: "should come from server"). If it moves to a server: cache the last good copy offline, validate the schema and coordinates, and use `FlatList` if the list grows large.
4. **Privacy:** no analytics, no accounts, no outbound requests except map tiles and handoff links. Location is used only on-device. Parked state stores a spot id and timestamp only.
5. **Accessibility is a requirement.** Text/background pairs must meet WCAG AA (4.5:1). `__tests__/data-and-theme.test.js` enforces this, so changing theme colors can fail the test. Buttons are at least 44pt tall and have labels. Card info and the park action are separate accessible elements on purpose (nested accessible views are swallowed by screen readers).
6. **Class component named `SpotMap`** (file `components/MapView.js`), to avoid shadowing JS `Map`. Marker `tracksViewChanges` is intentionally left at default because pin appearance changes with selection.

## 6. Layout / file map

```
App.js                       state, permissions, persistence, wiring
components/MapView.js        SpotMap: map, pins, center-on-me
components/ParkingList.js    sorted list, scrollToSpot, disclaimer, bottom inset
components/SpotCard.js       one spot: info, badges, Park here / Directions
components/Controls.js       empty banner or parked panel (timer, walk, end)
components/LocationNotice.js location-problem banner
utils/distance.js            distance, formatting, coordinate/availability checks
utils/directions.js          PURE URL builders per maps provider (tested)
utils/directionsPicker.js    action sheet / alert + Linking handoff
utils/time.js                elapsed-time formatting
theme.js                     colors, spacing, type, MIN_TOUCH
assets/data.json             spot data
__tests__/                   node:test unit tests
```

## 7. Open items / owner to-dos

- [ ] Fill in `lastVerified` in `assets/data.json`.
- [ ] Before any store build: set real `ios.bundleIdentifier` and `android.package` (currently `com.example.cincymotopark`), add a Google Maps API key for Android builds, and review the location permission text.
- [ ] Verify the sidewalk/enforcement info for every spot, and decide how corrections are reported.
- [ ] Test on real iOS and Android devices. Unverified so far: the directions picker (action sheet / alert and maps handoff), the safe-area layout, the location banner states, and the parked-panel layout with two buttons.

## 8. Ideas, not committed

- Remember the preferred maps app and skip the picker
- Route preview line and ETA on the map (still handing off for guidance)
- Reminder notification after N hours parked
- Spots from a server with offline cache, user-submitted corrections
- Web version (see decision 2)
- Cluster markers if spot count grows large

## 9. Conventions

- Keep logic that can be pure in `utils/` with no React Native imports, so it's testable under Node. Use explicit `.js` extensions on imports between `utils/` files that tests load.
- Colors and spacing come from `theme.js`. Don't hard-code them in components.
- Run `npm test` and `npx expo install --check` after changing dependencies or the theme.
