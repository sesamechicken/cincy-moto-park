import React from 'react';
import { StyleSheet, StatusBar, Alert, AppState } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as Location from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';

import SpotMap from './components/MapView';
import ParkingList from './components/ParkingList';
import Controls from './components/Controls';
import LocationNotice from './components/LocationNotice';
import spotsData from './assets/data.json'; // should come from server
import { colors } from './theme';
import { showDirectionsPicker } from './utils/directionsPicker';

const PARKED_STORAGE_KEY = '@cincy_moto_park/parked_spot';

export default class App extends React.Component {
  state = {
    spots: spotsData.spots,
    userLocation: null,
    locationError: null,       // null | 'denied' | 'unavailable'
    locationCanAskAgain: true, // false => only the Settings app can re-enable it
    selectedSpotId: null, // spot currently focused on the map / in the list
    parkedSpotId: null,   // spot the bike is actually left at
    parkedAt: null,       // timestamp (ms) parking started
  };

  mapRef = React.createRef();
  listRef = React.createRef();
  _appStateSub = null;

  componentDidMount() {
    this._getLocationAsync();
    this._restoreParkedSpot();

    // If the user turns location on in Settings and comes back, pick it up.
    this._appStateSub = AppState.addEventListener('change', (status) => {
      if (status === 'active' && !this.state.userLocation) {
        this._getLocationAsync();
      }
    });
  }

  componentWillUnmount() {
    if (this._appStateSub) this._appStateSub.remove();
  }

  _getLocationAsync = async () => {
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        this.setState({
          locationError: 'denied',
          locationCanAskAgain: permission.canAskAgain !== false,
        });
        return;
      }

      // Show a cached fix right away, then refine it with a fresh one.
      const last = await Location.getLastKnownPositionAsync();
      if (last) this.setState({ userLocation: last.coords, locationError: null });

      const current = await Location.getCurrentPositionAsync({});
      this.setState({ userLocation: current.coords, locationError: null });
    } catch (e) {
      // Location services off, timeout, etc. Keep any cached fix we already have.
      if (!this.state.userLocation) this.setState({ locationError: 'unavailable' });
    }
  };

  // If the app was closed while parked, restore that state so the timer
  // and "find my bike" info survive a restart.
  _restoreParkedSpot = async () => {
    try {
      const raw = await AsyncStorage.getItem(PARKED_STORAGE_KEY);
      if (!raw) return;

      const { parkedSpotId, parkedAt } = JSON.parse(raw);
      const spot = this.state.spots.find((s) => s.id === parkedSpotId);
      const valid = spot && typeof parkedAt === 'number' && parkedAt <= Date.now();

      // Saved spot no longer exists (data changed) or the record is corrupt.
      if (!valid) {
        await AsyncStorage.removeItem(PARKED_STORAGE_KEY);
        return;
      }

      // The user may have tapped "Park here" while we were loading; don't overwrite them.
      if (this.state.parkedSpotId) return;

      this.setState({ parkedSpotId, parkedAt, selectedSpotId: parkedSpotId });
    } catch (e) {
      // Non-fatal: worst case the user just has to re-select their spot.
    }
  };

  _handleSelectSpot = (spot) => {
    this.setState({ selectedSpotId: spot.id });
    if (this.mapRef.current) {
      this.mapRef.current.zoomToSpot(spot);
    }
  };

  // Tapping a pin on the map also brings that spot's card into view.
  _handleSelectFromMap = (spot) => {
    this._handleSelectSpot(spot);
    if (this.listRef.current) {
      this.listRef.current.scrollToSpot(spot.id);
    }
  };

  _handlePark = (spot) => {
    const { parkedSpotId, spots } = this.state;

    // Don't silently replace an existing parked spot (and reset its timer).
    if (parkedSpotId && parkedSpotId !== spot.id) {
      const current = spots.find((s) => s.id === parkedSpotId);
      Alert.alert(
        'Move your bike?',
        `You're currently parked at ${current ? current.name : 'another spot'}. Switch to ${spot.name}? This restarts the timer.`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Switch', onPress: () => this._startParking(spot) },
        ]
      );
      return;
    }
    this._startParking(spot);
  };

  _startParking = async (spot) => {
    const parkedAt = Date.now();
    this.setState({ parkedSpotId: spot.id, parkedAt, selectedSpotId: spot.id });
    if (this.mapRef.current) {
      this.mapRef.current.zoomToSpot(spot);
    }
    try {
      await AsyncStorage.setItem(
        PARKED_STORAGE_KEY,
        JSON.stringify({ parkedSpotId: spot.id, parkedAt })
      );
    } catch (e) {
      // If persistence fails, the session still works until the app closes.
    }
  };

  // Navigation is handed off to the rider's own maps app.
  _handleDirections = (spot) => showDirectionsPicker(spot, 'drive');

  _handleWalkToBike = () => {
    const { spots, parkedSpotId } = this.state;
    const parkedSpot = spots.find((s) => s.id === parkedSpotId);
    if (parkedSpot) showDirectionsPicker(parkedSpot, 'walk');
  };

  _handleEndParking = async () => {
    this.setState({ parkedSpotId: null, parkedAt: null });
    try {
      await AsyncStorage.removeItem(PARKED_STORAGE_KEY);
    } catch (e) {
      // Ignore. State is already cleared in memory.
    }
  };

  render() {
    const {
      spots,
      userLocation,
      locationError,
      locationCanAskAgain,
      selectedSpotId,
      parkedSpotId,
      parkedAt,
    } = this.state;
    const parkedSpot = spots.find((s) => s.id === parkedSpotId) || null;

    return (
      <SafeAreaProvider>
        {/* Only the top edge here; ParkingList handles the bottom inset itself. */}
        <SafeAreaView style={styles.container} edges={['top']}>
          <StatusBar barStyle="dark-content" />
          <SpotMap
            ref={this.mapRef}
            spots={spots}
            userLocation={userLocation}
            selectedSpotId={selectedSpotId}
            parkedSpotId={parkedSpotId}
            onSelectSpot={this._handleSelectFromMap}
          />
          <Controls
            parkedSpot={parkedSpot}
            parkedAt={parkedAt}
            onEndParking={this._handleEndParking}
            onWalkToBike={this._handleWalkToBike}
          />
          <LocationNotice
            error={locationError}
            canAskAgain={locationCanAskAgain}
            onRetry={this._getLocationAsync}
          />
          <ParkingList
            ref={this.listRef}
            spots={spots}
            userLocation={userLocation}
            selectedSpotId={selectedSpotId}
            parkedSpotId={parkedSpotId}
            lastVerified={spotsData.lastVerified}
            onSelectSpot={this._handleSelectSpot}
            onPark={this._handlePark}
            onDirections={this._handleDirections}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
