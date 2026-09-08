import * as React from 'react';
import { Text,
         View,
         ScrollView,
         StyleSheet,
         Image, TouchableHighlight, TouchableOpacity, Alert, Button, Switch } from 'react-native';

export default class SpotCard extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      isEnabled: false
    }
    this._toggleSwitch = this._toggleSwitch.bind(this);
  }

  _toggleSwitch(){
    console.log('i did it')
    this.setState({ isEnabled: !this.state.isEnabled })
    // this.props.handlePress('data');
  }

  _cardPress = (props) => {
    console.log('zoom map to location')
    console.log('PROPS.TYPE: ', props)
  }

  _handleSpotPress(data) {
    console.log('card was pressed')
    console.log(this.props)
  }

  render() {
    // console.log('props: ', this.props)
    const { name, description, parkOnSidewalk } = this.props;
    const { isEnabled } = this.state;

    return (
      <TouchableHighlight onPress={this._cardPress} underlayColor='none'>
        <View style={styles.card}>
          <View style={styles.detail}>
            <Text style={styles.title}>{ name }</Text>
            <Text>{ description }</Text>
            <Text>Park on sidewalk? { parkOnSidewalk ? '✅' : '🚫' }</Text>
          </View>
          <View style={styles.checkInSwitch}>
            <Switch
              style={styles.checkInSwitch}
                ios_backgroundColor="#6e6e6e"
                onValueChange={() => this._toggleSwitch()}
                value={isEnabled}
              />
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    marginTop: 3,
    padding: 12,
    backgroundColor: '#ffffff',
    borderColor: '#cccccc',
    borderRadius: 12,
    borderWidth: 1,
    fontWeight: 'bold',
    textAlign: 'center',
    display: 'block',
    flexDirection: 'row'
  },
  detail: {
    marginLeft: 10
  },
  title: {
    fontSize: 20,
  },
  checkInSwitch: {
    marginLeft: 'auto'
  }
});