import React from 'react';
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, shadow, MIN_TOUCH } from '../theme';
import { formatDistance } from '../utils/distance';

export default class SpotCard extends React.Component {
  _a11yLabel() {
    const { spot, isSelected, isParked } = this.props;
    const { name, description, parkOnSidewalk, policeBlock, distance, unavailable } = spot;
    const parts = [name];
    if (distance != null) parts.push(`${formatDistance(distance)} away`);
    if (description) parts.push(description);
    if (parkOnSidewalk && !unavailable) parts.push('Sidewalk parking OK');
    if (policeBlock) parts.push('Watch for enforcement');
    if (isParked) parts.push('Your bike is here');
    else if (isSelected) parts.push('Selected');
    return parts.join('. ');
  }

  render() {
    const { spot, isSelected, isParked, onPress, onPark, onDirections } = this.props;
    const { name, description, parkOnSidewalk, policeBlock, distance, unavailable } = spot;

    return (
      <View
        style={[
          styles.card,
          isSelected && styles.cardSelected,
          isParked && styles.cardParked,
          unavailable && styles.cardUnavailable,
        ]}
      >
        {/* The info area is one accessible button; the action below is separate so
            screen readers can reach both (nested accessible views get swallowed). */}
        <Pressable
          onPress={unavailable ? undefined : onPress}
          disabled={unavailable}
          accessibilityRole="button"
          accessibilityLabel={this._a11yLabel()}
          accessibilityHint={unavailable ? undefined : 'Shows this spot on the map'}
          accessibilityState={{ selected: Boolean(isSelected), disabled: Boolean(unavailable) }}
        >
          <View style={styles.topRow}>
            {isSelected && !isParked && (
              <MaterialCommunityIcons
                name="map-marker-check"
                size={16}
                color={colors.accent}
                style={styles.selectedIcon}
              />
            )}
            <Text style={[styles.title, unavailable && styles.textMuted]} numberOfLines={1}>
              {name}
            </Text>
            {distance != null && <Text style={styles.distance}>{formatDistance(distance)}</Text>}
          </View>

          {!!description && (
            <Text style={[styles.description, unavailable && styles.textMuted]}>
              {description}
            </Text>
          )}

          <View style={styles.badgeRow}>
            {parkOnSidewalk && !unavailable && (
              <View style={styles.badge}>
                <MaterialCommunityIcons name="check-circle-outline" size={13} color={colors.success} />
                <Text style={styles.badgeText}>Sidewalk parking OK</Text>
              </View>
            )}
            {policeBlock && (
              <View style={[styles.badge, styles.badgeWarning]}>
                <MaterialCommunityIcons name="alert-circle-outline" size={13} color={colors.warning} />
                <Text style={[styles.badgeText, styles.badgeTextWarning]}>Watch for enforcement</Text>
              </View>
            )}
          </View>
        </Pressable>

        {unavailable ? (
          <View style={styles.actionRow}>
            <View style={styles.actionUnavailable}>
              <Text style={styles.actionUnavailableText}>Unavailable</Text>
            </View>
          </View>
        ) : isParked ? (
          <View style={styles.actionRow}>
            <View style={styles.actionParked}>
              <MaterialCommunityIcons name="motorbike" size={16} color={colors.textOnPrimary} />
              <Text style={styles.actionParkedText}>Your bike is here</Text>
            </View>
          </View>
        ) : (
          <View style={styles.actionRow}>
            <Pressable
              style={styles.actionButton}
              onPress={onPark}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`Park here at ${name}`}
            >
              <Text style={styles.actionButtonText}>Park here</Text>
            </Pressable>
            <Pressable
              style={styles.directionsButton}
              onPress={onDirections}
              hitSlop={6}
              accessibilityRole="button"
              accessibilityLabel={`Directions to ${name}`}
              accessibilityHint="Opens your maps app"
            >
              <MaterialCommunityIcons name="directions" size={16} color={colors.primary} />
              <Text style={styles.directionsButtonText}>Directions</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }
}

const pill = {
  borderRadius: radius.pill,
  paddingHorizontal: spacing.lg,
  minHeight: MIN_TOUCH,
  justifyContent: 'center',
};

const styles = StyleSheet.create({
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  directionsButton: {
    ...pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  directionsButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadow.card,
  },
  cardSelected: {
    borderColor: colors.accent,
    borderWidth: 2,
  },
  cardParked: {
    borderColor: colors.success,
    borderWidth: 2,
  },
  cardUnavailable: {
    backgroundColor: colors.disabledBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedIcon: {
    marginRight: spacing.xs,
  },
  title: {
    ...typography.subtitle,
    color: colors.textPrimary,
    flexShrink: 1,
    flexGrow: 1,
  },
  distance: {
    ...typography.caption,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
  },
  description: {
    ...typography.body,
    color: colors.textSecondary,
    marginTop: 2,
  },
  textMuted: {
    color: colors.textMuted,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: spacing.sm,
    gap: spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.successBg,
    borderRadius: radius.pill,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    gap: 4,
  },
  badgeWarning: {
    backgroundColor: colors.warningBg,
  },
  badgeText: {
    ...typography.caption,
    color: colors.success,
  },
  badgeTextWarning: {
    color: colors.warning,
  },
  actionButton: {
    ...pill,
    backgroundColor: colors.accent,
  },
  actionButtonText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  actionParked: {
    ...pill,
    backgroundColor: colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionParkedText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  actionUnavailable: {
    ...pill,
    backgroundColor: colors.disabled,
  },
  actionUnavailableText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
});
