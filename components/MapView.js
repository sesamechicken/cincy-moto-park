import React from 'react';
import { Text, View, StyleSheet, Image, Button } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';

export default class Map extends React.Component {
 state = {
    mapRegion: null,
    hasLocationPermissions: false,
    locationResult: null,
  };

  mapRef = React.createRef();

  componentDidMount() {
    this._getLocationAsync();
  }
  
_getLocationAsync = async () => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    this.setState({ locationResult: 'Permission to access location was denied' });
    return;
  }
  this.setState({ hasLocationPermissions: true });
  let location = await Location.getCurrentPositionAsync({});
  this.setState({ locationResult: location.coords });
};

 // Zoom to an arbitrary lat/lng
  _zoomToLocation = (latitude, longitude, latitudeDelta = 0.01, longitudeDelta = 0.01) => {
    if (this.mapRef.current) {
      this.mapRef.current.animateToRegion(
        { latitude, longitude, latitudeDelta, longitudeDelta },
        1000 // animation duration in ms
      );
    }
  };

  // Zoom specifically to the user's current location
  _zoomToUser = () => {
    const { locationResult } = this.state;
    if (locationResult) {
      this._zoomToLocation(locationResult.latitude, locationResult.longitude);
    }
  };

  // Zoom to fit all spot markers on screen
  _zoomToFitSpots = () => {
    const { spots = [] } = this.props;
    if (this.mapRef.current && spots.length > 0) {
      this.mapRef.current.fitToCoordinates(
        spots.map(spot => ({ latitude: spot.latitude, longitude: spot.longitude })),
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  };

  render() {
    const { spots = [] } = this.props;
    return (
        <MapView
          ref={this.mapRef}
          style={{ height: '50%' }}
          showsUserLocation={true}
          initialRegion={{
            latitude: 39.1028937,
            longitude: -84.5137708,
            latitudeDelta: 0.015,
            longitudeDelta: 0.015,
          }}
          showsIndoors={false}>
          {spots.map(spot => (
            <Marker
              key={spot.id ?? spot.name}
              coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
              title={spot.name}
              onPress={() => this._zoomToLocation(spot.latitude, spot.longitude)}
            />
          ))}
        </MapView>
          // <Button title="Zoom to my location" onPress={this._zoomToUser} />
    );
  }
}
