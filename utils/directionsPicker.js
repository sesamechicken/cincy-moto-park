import { Alert, ActionSheetIOS, Linking, Platform } from 'react-native';

import { PROVIDER_LABELS, buildDirectionsUrl, providersFor } from './directions';

async function openProvider(provider, spot, mode) {
  const url = buildDirectionsUrl(provider, spot, mode);
  try {
    if (!url) throw new Error('No URL');
    await Linking.openURL(url);
  } catch (e) {
    Alert.alert(
      "Couldn't open maps",
      `We couldn't open ${PROVIDER_LABELS[provider]}. Try another maps app.`
    );
  }
}

// Asks which maps app to use, then hands off to it.
// mode: 'drive' (ride to a spot) or 'walk' (walk back to your parked bike).
export function showDirectionsPicker(spot, mode = 'drive') {
  if (!spot) return;

  const providers = providersFor(Platform.OS, mode);
  const title = mode === 'walk' ? `Walk to your bike on ${spot.name}` : `Directions to ${spot.name}`;

  if (Platform.OS === 'ios') {
    const labels = providers.map((p) => PROVIDER_LABELS[p]);
    ActionSheetIOS.showActionSheetWithOptions(
      { title, options: [...labels, 'Cancel'], cancelButtonIndex: labels.length },
      (index) => {
        if (index < providers.length) openProvider(providers[index], spot, mode);
      }
    );
    return;
  }

  Alert.alert(
    title,
    'Open in:',
    providers.map((p) => ({ text: PROVIDER_LABELS[p], onPress: () => openProvider(p, spot, mode) })),
    { cancelable: true }
  );
}
