import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { Constants } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';
// import cities from './cities.json';

const cities = require('./cities.json');

class WeatherApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      city: '',
      citiesList: cities,
      loaded: false,
    };
  }

  async componentDidMount() {
    await fetch(
      'http://api.openweathermap.org/data/2.5/weather?id=' +
        this.state.city +
        '&appid=79d5e0edb70d1c555c69198eb4ceb656&units=metric'
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
            dataSource: responseJson,
            name: responseJson.name,
            temp: responseJson.main.temp,
            pressure: responseJson.main.pressure,
            humidity: responseJson.main.humidity,
            img: responseJson.weather[0].icon,
            loaded: true,
          },
          function() {
            console.log(this.state.temp);
          }
        );
      })
      .catch(error => {
        console.error(error);
      });
  }

  updateCity = async city => {
    await this.setState({ city: city });
    this.componentDidMount();
  };

  search(user_input, city_list) {
    var i;
    console.log('a')
    console.log(city_list);
    // for (i; i < city_list; i++) {
    //   console.log(city_list[i])
    // }
  }

  renderResult() {
    if (this.state.loaded) {
      return (
        <View style={styles.weather_data}>
          <Text style={styles.detail}>City: {this.state.name}</Text>
          <Image
            style={{width: 100, height: 100}}
            source={{uri: 'http://openweathermap.org/img/w/'+this.state.img+'.png'}}
          />
          <Text style={styles.detail}>Temperature: {this.state.temp} C</Text>
          <Text style={styles.detail}>Pressure: {this.state.pressure} P</Text>
          <Text style={styles.detail}>Humidity: {this.state.humidity} %</Text>
        </View>
      );
    }
  }
  

  render() {
    return (
      <ScrollView>
        <View>
          <View style={styles.header}>
            <Text style={styles.app_name}>Weather App</Text>
          </View>

          <Text style={styles.caption}>Weather Statistics</Text>

          <TextInput
            style={styles.input_box}
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
          />

          <Picker
            selectedValue={this.state.city}
            
            onValueChange={itemValue => {
              this.updateCity(itemValue);
            }}>
            {this.state.citiesList.map((v, i) => {
              return <Picker.Item label={v.name} value={v.id} />;
            })}
          </Picker>
          {this.renderResult()}
          {this.search(this.state.text, cities)}
        </View>
      </ScrollView>
    );
  }
}
export default WeatherApp;

const styles = StyleSheet.create({

  caption: {
    alignSelf: 'center',
    fontSize: 20,
    marginTop: 20,
  },
  
  input_box: {
    marginTop: 20,
    alignSelf: 'center',
    height: 40,
    width: 200,
    borderColor: '#cccccc',
    borderWidth: 1,
  },

  detail: {
    fontSize: 20,
    margin: 10,
    color: 'white',
  },

  weather_data: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#4dd2ff',
    width: 300,
  },

  header: {
    display: 'flex',
    height: 80,
    backgroundColor: '#4dd2ff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  app_name: {
    marginTop: 10,
    color: 'white',
    fontSize: 30,
    fonWeight: 20,
  },
});
