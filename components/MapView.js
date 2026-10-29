import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { colors, shadow, MIN_TOUCH } from '../theme';
import { isSpotUnavailable } from '../utils/distance';

const CINCINNATI_REGION = {
  latitude: 39.1028937,
  longitude: -84.5137708,
  latitudeDelta: 0.015,
  longitudeDelta: 0.015,
};

// Named SpotMap (not `Map`) so it doesn't shadow JavaScript's built-in Map.
// Note: Marker contents change with selection/parked state, so we leave
// `tracksViewChanges` at its default. Freezing it would stop pins updating.
export default class SpotMap extends React.Component {
  mapRef = React.createRef();

  zoomToSpot = (spot, latitudeDelta = 0.006, longitudeDelta = 0.006) => {
    if (this.mapRef.current && spot) {
      this.mapRef.current.animateToRegion(
        { latitude: spot.latitude, longitude: spot.longitude, latitudeDelta, longitudeDelta },
        400
      );
    }
  };

  zoomToUser = () => {
    const { userLocation } = this.props;
    if (userLocation) {
      this.zoomToSpot(userLocation, 0.01, 0.01);
    }
  };

  render() {
    const { spots = [], selectedSpotId, parkedSpotId, onSelectSpot, userLocation } = this.props;

    return (
      <View style={styles.wrapper}>
        <MapView
          ref={this.mapRef}
          showsUserLocation
          showsMyLocationButton={false} // we draw our own button (works on iOS too)
          style={styles.map}
          initialRegion={CINCINNATI_REGION}
        >
          {spots.map((spot) => {
            if (isSpotUnavailable(spot)) return null; // don't plot spots without real coords

            const isParked = spot.id === parkedSpotId;
            const isSelected = spot.id === selectedSpotId;

            return (
              <Marker
                key={spot.id}
                coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
                title={spot.name}
                onPress={() => onSelectSpot(spot)}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View
                  style={[
                    styles.pin,
                    isSelected && styles.pinSelected,
                    isParked && styles.pinParked,
                  ]}
                >
                  <MaterialCommunityIcons
                    name="motorbike"
                    size={16}
                    color={colors.textOnPrimary}
                  />
                </View>
              </Marker>
            );
          })}
        </MapView>

        {userLocation ? (
          <Pressable
            style={styles.locateButton}
            onPress={this.zoomToUser}
            accessibilityRole="button"
            accessibilityLabel="Center map on my location"
          >
            <MaterialCommunityIcons name="crosshairs-gps" size={22} color={colors.primary} />
          </Pressable>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  wrapper: {
    height: '45%',
    width: '100%',
    backgroundColor: colors.border, // neutral placeholder while tiles load
  },
  map: {
    flex: 1,
  },
  locateButton: {
    position: 'absolute',
    right: 12,
    bottom: 12,
    width: MIN_TOUCH,
    height: MIN_TOUCH,
    borderRadius: MIN_TOUCH / 2,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.card,
  },
  pin: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.surface,
  },
  pinSelected: {
    backgroundColor: colors.accent,
    transform: [{ scale: 1.15 }],
  },
  pinParked: {
    backgroundColor: colors.success,
    transform: [{ scale: 1.15 }],
  },
});
