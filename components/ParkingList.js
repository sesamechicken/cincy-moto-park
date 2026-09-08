import * as React from 'react';
import { Text, View, ScrollView, StyleSheet, Image } from 'react-native';
import SpotCard from './SpotCard';

import json from '../assets/data.json' // should come from server

export default class ParkingList extends React.Component {
  constructor(props){
    super(props);
    this.handlePress = this.handlePress.bind(this);
  }

  handlePress(spot) {
    console.log('card pressed. spot: ', spot)
  }
  render() {
    return (
        <View style={styles.container}>
          <ScrollView>
            {json.spots.map((spot) => {
              return <SpotCard style={styles.checkIn} handlePress={(spot) => this.handlePress(spot) } {...spot} />
            })}
          </ScrollView>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '50%',
    width: '100%',
    padding: 6,
    // flex: 1,
    // marginBottom: -5
  },
  checkIn: {
    marginRight: 0
  }
});