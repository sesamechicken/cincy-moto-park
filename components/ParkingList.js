import React from 'react';
import { View, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';

import SpotCard from './SpotCard';
import { colors, spacing, typography } from '../theme';
import { distanceInMiles, isSpotUnavailable } from '../utils/distance';

export default class ParkingList extends React.Component {
  // Lets us read the bottom inset (home indicator / gesture bar) so the last
  // card isn't hidden underneath it.
  static contextType = SafeAreaInsetsContext;

  scrollRef = React.createRef();
  _cardY = {}; // spot id -> y offset inside the ScrollView

  // Called by the parent when a pin is tapped on the map.
  scrollToSpot = (spotId) => {
    const y = this._cardY[spotId];
    if (y != null && this.scrollRef.current) {
      this.scrollRef.current.scrollTo({ y: Math.max(0, y - spacing.sm), animated: true });
    }
  };

  _sortedSpots() {
    const { spots, userLocation } = this.props;

    const withDistance = spots.map((spot) => {
      const unavailable = isSpotUnavailable(spot);
      const distance =
        userLocation && !unavailable
          ? distanceInMiles(
              userLocation.latitude,
              userLocation.longitude,
              spot.latitude,
              spot.longitude
            )
          : null;
      return { ...spot, distance, unavailable };
    });

    // Unavailable spots always sink to the bottom; otherwise sort by distance
    // when we have the user's location, and fall back to the original order.
    return withDistance.sort((a, b) => {
      if (a.unavailable !== b.unavailable) return a.unavailable ? 1 : -1;
      if (a.distance == null || b.distance == null) return 0;
      return a.distance - b.distance;
    });
  }

  render() {
    const { selectedSpotId, parkedSpotId, onSelectSpot, onPark, onDirections, lastVerified } = this.props;
    const sortedSpots = this._sortedSpots();
    const bottomInset = this.context ? this.context.bottom : 0;

    return (
      <View style={styles.container}>
        <Text style={styles.header} accessibilityRole="header">
          Nearby spots
        </Text>
        <ScrollView
          ref={this.scrollRef}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: spacing.lg + bottomInset }}
        >
          {sortedSpots.map((spot) => (
            <View
              key={spot.id}
              onLayout={(e) => {
                this._cardY[spot.id] = e.nativeEvent.layout.y;
              }}
            >
              <SpotCard
                spot={spot}
                isSelected={spot.id === selectedSpotId}
                isParked={spot.id === parkedSpotId}
                onPress={() => onSelectSpot(spot)}
                onPark={() => onPark(spot)}
                onDirections={() => onDirections(spot)}
              />
            </View>
          ))}

          <Text style={styles.disclaimer}>
            Parking rules can change. Always check posted signs before you leave your bike.
            {lastVerified ? ` Spot info last verified ${lastVerified}.` : ''}
          </Text>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
  header: {
    ...typography.subtitle,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  disclaimer: {
    ...typography.caption,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.md,
  },
});
