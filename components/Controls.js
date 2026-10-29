import React from 'react';
import { Text, View, StyleSheet, Pressable, AppState } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, spacing, radius, typography, shadow, MIN_TOUCH } from '../theme';
import { formatElapsed } from '../utils/time';

const TICK_MS = 15000;

export default class Controls extends React.Component {
  state = { now: Date.now() };

  _interval = null;
  _appStateSub = null;

  componentDidMount() {
    // JS timers pause while the app is backgrounded, so refresh immediately
    // when the user comes back instead of showing a stale time.
    this._appStateSub = AppState.addEventListener('change', (status) => {
      if (status === 'active') this.setState({ now: Date.now() });
    });
    this._syncTimer();
  }

  componentDidUpdate(prevProps) {
    if (Boolean(prevProps.parkedSpot) !== Boolean(this.props.parkedSpot)) {
      this._syncTimer();
    }
  }

  componentWillUnmount() {
    clearInterval(this._interval);
    if (this._appStateSub) this._appStateSub.remove();
  }

  // Only tick while a bike is actually parked.
  _syncTimer() {
    clearInterval(this._interval);
    this._interval = null;
    if (this.props.parkedSpot) {
      this.setState({ now: Date.now() });
      this._interval = setInterval(() => this.setState({ now: Date.now() }), TICK_MS);
    }
  }

  render() {
    const { parkedSpot, parkedAt, onEndParking, onWalkToBike } = this.props;
    const { now } = this.state;

    if (!parkedSpot) {
      return (
        <View style={styles.emptyContainer}>
          <MaterialCommunityIcons name="motorbike" size={18} color={colors.textOnPrimary} />
          <Text style={styles.emptyText}>Pick a spot below and tap "Park here" to start tracking</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.details}>
          <Text style={styles.label}>Parked for</Text>
          <Text style={styles.elapsed}>{formatElapsed(now - parkedAt)}</Text>
          <Text style={styles.location}>on {parkedSpot.name}</Text>
        </View>

        <View style={styles.buttons}>
          <Pressable
            style={styles.walkButton}
            onPress={onWalkToBike}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel={`Walking directions to your bike on ${parkedSpot.name}`}
            accessibilityHint="Opens your maps app"
          >
            <MaterialCommunityIcons name="walk" size={18} color={colors.textOnPrimary} />
            <Text style={styles.walkButtonText}>Walk to bike</Text>
          </Pressable>

          <Pressable
            style={styles.endButton}
            onPress={onEndParking}
            hitSlop={4}
            accessibilityRole="button"
            accessibilityLabel="Got my bike. Stop tracking parking"
          >
            <MaterialCommunityIcons name="check" size={18} color={colors.primary} />
            <Text style={styles.endButtonText}>Got my bike</Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...shadow.card,
  },
  details: {
    flexShrink: 1,
  },
  label: {
    ...typography.caption,
    color: colors.primaryLight,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  elapsed: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textOnPrimary,
    marginTop: 2,
  },
  location: {
    ...typography.subtitle,
    color: colors.textOnPrimary,
    marginTop: 2,
  },
  buttons: {
    gap: spacing.sm,
  },
  walkButton: {
    borderRadius: radius.pill,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderWidth: 1.5,
    borderColor: colors.textOnPrimary,
  },
  walkButtonText: {
    ...typography.caption,
    color: colors.textOnPrimary,
    fontWeight: '700',
  },
  endButton: {
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  endButtonText: {
    ...typography.caption,
    color: colors.primary,
    fontWeight: '700',
  },
  emptyContainer: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyText: {
    ...typography.body,
    color: colors.textOnPrimary,
    flexShrink: 1,
  },
});
