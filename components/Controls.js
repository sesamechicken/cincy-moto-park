import * as React from 'react';
import { Text, View, StyleSheet, Image, Pressable } from 'react-native';
import LottieView from 'lottie-react-native';

export default class Controls extends React.Component {
  handler = () => {
    console.log('pressed')
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.details}>
          <View>
            <Text style={{fontSize: 20, color: '#00497A', fontWeight: ''}}>
              Parked for
            </Text>
            <Text style={{fontSize: 30, color: 'white', fontWeight: 'bold'}}>
              2 hrs 19 min
            </Text>
            <Text style={{fontSize: 20, color: '#00497A', fontWeight: 'bold'}}>
              on Sycamore St
            </Text>
          </View>
          
          <Text style={{marginLeft: 'auto'}}>
            <Pressable onPress={this.handler}>
              <LottieView
                ref={animation => {
                  this.animation = animation;
                }}
                style={{width: 100}}
                autoPlay
                source={require('../assets/setting.json')}
              />
            </Pressable>
          </Text>
            
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
 container: {
    backgroundColor: '#66C3FF',
    padding: 10,
    // margin: 0,
    height: '30%',
    // height: '15%',
    shadowColor: '#333',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowRadius: 10,
    shadowOpacity: .8,
    // flex: 1,
    // flexDirection: 'column',
  },
  details: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'no-wrap',
    // justifyCntent: 'space-between'
    alignContent: 'center'
  }
});
