import React, { Component } from 'react';
import { View, Text, Picker, StyleSheet, TextInput, Image, ScrollView } from 'react-native';
import { Constants } from 'expo';

// You can import from local files
import AssetExample from './components/AssetExample';

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

const cities = require('./cities.json');

class WeatherApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      city: '',
      citiesList: cities,
      api_key: 'ab3ed8d6fee36219c895ee0ce7de2fc5',
      loaded: false,
    };
  }

  async callAPI() {
    await fetch(
      'http://api.openweathermap.org/data/2.5/weather?id=' +
        this.state.city +
        '&appid='+ this.state.api_key + '&units=metric'
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState(
          {
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
    this.callAPI();
  };

  search(text) {
    cities.map(item => {
      if (item.name.toLowerCase().startsWith(text.toLowerCase())) {
        {
          this.updateCity(item.id);
        }
        return;
      }
    });
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
            onChangeText={text => this.search(text)}
          />

          <Picker
            selectedValue={this.state.city}           
            onValueChange={itemValue => {
              this.updateCity(itemValue);
            }}>
            {this.state.citiesList.map((v) => {
              return <Picker.Item label={v.name} value={v.id} />;
            })}
          </Picker>
          {this.renderResult()}
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

