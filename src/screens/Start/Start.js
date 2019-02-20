import React, { Component } from "react";
import { Navigation } from "react-native-navigation";
import {
  View,
  Modal,
  ActivityIndicator,
  AsyncStorage,
  Image,
  StatusBar
} from "react-native";
import {
  Container,
  Header,
  Title,
  Content,
  Footer,
  FooterTab,
  Button,
  Body,
  Text
} from "native-base";
import { Col, Grid } from "react-native-easy-grid";

class StartScreen extends Component {
  state = {
    activityDisplay: false,
    weather: ""
  };

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  componentDidMount() {
    console.log("Component Did Mount -> Start Screen");
  }

  async storeItem(key, item) {
    try {
      var jsonOfItem = await AsyncStorage.setItem(key, JSON.stringify(item));
      return jsonOfItem;
    } catch (error) {
      console.log(error.message);
    }
  }

  goToScreenTabless = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName,
        options: {
          bottomTabs: {
            visible: false,
            drawBehind: true, // for Android
            animate: true
          }
        }
      }
    });
  };

  goToScreen = screenName => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName,
        options: {
          bottomTabs: {
            visible: true,
            drawBehind: false,
            animate: true
          }
        }
      }
    });
  };

  getTheWeather = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        activityDisplay: true
      };
    });
    navigator.geolocation.getCurrentPosition(
      position => {
        fetch(
          "https://www.metaweather.com/api/location/search/?lattlong=" +
            position.coords.latitude +
            "," +
            position.coords.longitude,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }
        ).then(response => {
          let lat = position.coords.latitude;
          let lng = position.coords.longitude;
          let data = JSON.parse(response._bodyText);

          fetch("https://www.metaweather.com/api/location/" + data[0].woeid, {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json"
            }
          }).then(weather => {
            let result =
              "Latitude: " +
              lat +
              "\n\nLongitude:" +
              lng +
              "\n\nLocation: " +
              data[0].title +
              "\n\nJSON: " +
              weather._bodyText;
            this.setState(prevState => {
              return {
                ...prevState,
                activityDisplay: false,
                weather: result
              };
            });
          });
        });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.activityDisplay}
        >
          <View style={{ flex: 1, justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#000000" />
          </View>
        </Modal>
        <Header>
          <Body>
            <Title>MetaWeather Test App</Title>
          </Body>
        </Header>
        <Content
          contentContainerStyle={{
            alignItems: "center"
          }}
        >
          <Image
            style={{
              width: 100,
              height: 100,
              marginVertical: 15,
              marginHorizontal: 15
            }}
            source={require("../../assets/images/metaweather.png")}
          />
          <Grid>
            <Col size={10} />
            <Col size={80}>
              <Button full rounded onPress={() => this.getTheWeather()}>
                <Text>Get the weather on my location!</Text>
              </Button>
            </Col>
            <Col size={10} />
          </Grid>
          <Grid style={{ marginTop: 20 }}>
            <Col size={10} />
            <Col size={80}>
              <Text style={{ textAlign: "justify" }}>{this.state.weather}</Text>
            </Col>
            <Col size={10} />
          </Grid>
        </Content>
        <Footer>
          <FooterTab>
            <Button full>
              <Text>Footer</Text>
            </Button>
          </FooterTab>
        </Footer>
      </Container>
    );
  }
}

export default StartScreen;
