import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  Alert
} from "react-native";
import HMSMap from "@hmscore/react-native-hms-map";

import BasicMap from "./screens/BasicMap";
import CameraControl from "./screens/CameraControl";
import Gestures from "./screens/Gestures";
import Location from "./screens/Location";
import MapLayers from "./screens/MapLayers";
import MapStyle from "./screens/MapStyle";
import Markers from "./screens/Markers";
import AdvancedMap from "./screens/AdvancedMap";
import HeatMap from "./screens/HeatMap";
import DemoPage from "./screens/DemoPage";
import { styles } from "./styles/styles";

import { HmsPushInstanceId } from "@hmscore/react-native-hms-push";

const buttons = [
  {
    title: "Basic Map",
    component: BasicMap,
    description: "The most basic map component to show.",
  },
  {
    title: "Camera Controls",
    component: CameraControl,
    description:
      "Manipulate the camera via move, zoom, tilt, bearing. Animate the camera and stop the animation.",
  },
  {
    title: "Markers",
    component: Markers,
    description:
      "Show markers with default, colored and customized options. Show/hide default and customized info windows, animate markers, apply clustering. Add markers via long click and remove them via long click on ino window.",
  },
  {
    title: "Map Styles",
    component: MapStyle,
    description:
      "Show different ways show to style a map via mapType, mapStyle and tile overlay",
  },
];

export default class App extends React.Component {
  state = {
    currentScreen: buttons[0],
  };

  componentDidMount() {
    HMSMap.module.initializer("DAEDAOD/iTXiwFOeCScoSWDCPIi6brd+phsOkZUsYR4cGjibISr2EU/JuNSmKINiQHcbpUoMkMxh+6N/LDd8emdzKB2J/Aa4w52tkQ==", "en-US");

    // Get Push Token
    HmsPushInstanceId.getToken("")
      .then((result) => {
        console.log("getToken", result);
      })
      .catch((err) => {
        Alert.alert("[getToken] Error/Exception: " + JSON.stringify(err));
        console.log("[getToken] Error/Exception: " + JSON.stringify(err));
      });
  }

  renderButtons() {
    return buttons.map((b) => (
      <View
        key={b.title}
        style={[
          styles.p4,
          styles.m2,
          this.state.currentScreen == b ? customStyle.buttonBorder : null,
        ]}
      >
        <TouchableHighlight
          onPress={() => {
            this.setState({ currentScreen: b });
          }}
        >
          <Text>{b.title}</Text>
        </TouchableHighlight>
      </View>
    ));
  }

  renderScreen() {
    const Map = this.state.currentScreen.component;
    return <Map />;
  }

  render() {
    return (
      <SafeAreaView>
        <View>
          <ScrollView horizontal style={[styles.p4]}>
            {this.renderButtons()}
          </ScrollView>
        </View>

        <View style={customStyle.lineStyle} />
        {this.renderScreen()}
      </SafeAreaView>
    );
  }
}

const customStyle = StyleSheet.create({
  lineStyle: {
    marginTop: 8,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
  },
  buttonBorder: {
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
  },
});
