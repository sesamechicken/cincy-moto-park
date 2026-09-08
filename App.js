import React from 'react';
import { Text, Button, View, StyleSheet, Platform } from 'react-native';
import { Location, Permissions } from 'expo';
import Constants from 'expo-constants';
import Map from './components/MapView';
import ParkingList from './components/ParkingList';
import Controls from './components/Controls';
import json from './assets/data.json' // should come from server

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default class App extends React.Component {
  state = {
    errorMessage: null,
  };


  render() {
    return (
      <View style={styles.container}>
        <View>
          <Map spots={json.spots} />
          <ParkingList spots={json.spots} />
        </View>
        <Controls />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#DCE1E9',
  }
});
