# Cincy Moto Park

Find motorcycle parking spots in Cincinnati, see how far away they are, and track how long your bike has been parked.

Built with Expo (SDK 53) and React Native.

See [SPEC.md](SPEC.md) for product decisions, data model, and roadmap.

## Run it

```bash
npm install
npx expo start
```

Open it in Expo Go on a phone (iOS or Android). The map uses `react-native-maps`, which has no web support, so web isn't enabled.

After changing dependencies, run `npx expo install --check` to confirm versions still match the SDK.

## Tests

```bash
npm test
```

Uses Node's built-in test runner (Node 20.19+ or 22.12+). Covers distance/format helpers, elapsed-time formatting, spot data validity, and theme color contrast (WCAG AA).

## Project layout

| Path | What it is |
|---|---|
| `App.js` | State, location permission, parked-spot persistence |
| `components/MapView.js` | `SpotMap`: native map, pins, "center on me" button |
| `components/ParkingList.js` | Sorted list of spots, disclaimer footer |
| `components/SpotCard.js` | One spot: info, badges, park action |
| `components/Controls.js` | Parked-for timer / empty banner |
| `components/LocationNotice.js` | Banner when location is off or unavailable |
| `utils/distance.js` | Distance math, formatting, spot validity |
| `utils/directions.js` | Builds maps-app links (Apple, Google, Waze, Android `geo:`) |
| `utils/directionsPicker.js` | Picker UI and handoff to the maps app |
| `utils/time.js` | Elapsed-time formatting |
| `theme.js` | Colors, spacing, type (contrast-checked by tests) |
| `assets/data.json` | Spot data |

## Spot data

Each spot in `assets/data.json` has `id`, `name`, `description`, `latitude`, `longitude`, `parkOnSidewalk`, and `policeBlock`. Set `"unavailable": true` to show a spot as unavailable (for example during construction); it is then hidden from the map and sorted to the bottom of the list.

Set the top-level `lastVerified` (for example `"June 2026"`) whenever you re-check the rules. It is shown under the list.

## Before making a store build

- Change `ios.bundleIdentifier` and `android.package` in `app.json` (currently `com.example.cincymotopark`).
- For Android builds, add a Google Maps API key under `android.config.googleMaps.apiKey` and enable the Maps SDK for Android. Expo Go doesn't need one.
- Review the location permission text in the `expo-location` plugin entry.
