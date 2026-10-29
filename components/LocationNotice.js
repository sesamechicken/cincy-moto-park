import React from 'react';
import { Text, View, StyleSheet, Pressable, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, typography, MIN_TOUCH } from '../theme';

// Small banner shown when we couldn't get the user's location.
// error: 'denied' | 'unavailable'
export default function LocationNotice({ error, canAskAgain, onRetry }) {
  if (!error) return null;

  const denied = error === 'denied';
  const message = denied
    ? 'Location is off, so distances are hidden.'
    : "Couldn't get your location, so distances are hidden.";

  // If the OS won't prompt again, the only way back is the Settings app.
  const openSettings = denied && !canAskAgain;
  const buttonLabel = openSettings ? 'Open Settings' : denied ? 'Allow' : 'Try again';

  return (
    <View style={styles.container} accessibilityRole="alert">
      <MaterialCommunityIcons name="map-marker-off-outline" size={18} color={colors.danger} />
      <Text style={styles.text}>{message}</Text>
      <Pressable
        style={styles.button}
        onPress={openSettings ? () => Linking.openSettings() : onRetry}
        accessibilityRole="button"
        accessibilityLabel={buttonLabel}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.dangerBg,
    paddingLeft: spacing.lg,
    paddingRight: spacing.sm,
    paddingVertical: spacing.xs,
  },
  text: {
    ...typography.body,
    color: colors.danger,
    flex: 1,
  },
  button: {
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
  },
  buttonText: {
    ...typography.caption,
    color: colors.danger,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
