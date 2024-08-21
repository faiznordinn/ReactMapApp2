/*
 * Copyright 2020-2023. Huawei Technologies Co., Ltd. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import HMSMap, { MapTypes,HMSMarker, Hue,HMSInfoWindow} from "@hmscore/react-native-hms-map";
import React, { useState } from "react";
import {
  PermissionsAndroid,
  SafeAreaView,
  Switch,
  Text,
  View,
  Image,
  Alert,
  TouchableHighlight,
  Button
} from "react-native";
import { styles } from "../styles/styles";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";


export default class DemoPage extends React.Component {
  static options = {
    topBar: {
      title: {
        text: "Demo Page",
      },
    },
  };

  state = {
    myLocationEnabled: false,
    myLocationButtonEnabled: false,
    myLocationStyleEnabled: false,
    myLocationStyle: null,
    selectedImage: null,
  };

handleMarkerPress = () => {
     Alert.alert("Marker Pressed", "You pressed the marker!");
  };

  openImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        let imageUri = response.uri || response.assets?.[0]?.uri;
        this.setState({ selectedImage: imageUri });
      }
    });
  };


  handleCameraLaunch = () => {
      const options = {
        mediaType: 'photo',
        includeBase64: false,
        maxHeight: 2000,
        maxWidth: 2000,
      };

      launchCamera(options, response => {
        console.log('Response = ', response);
        if (response.didCancel) {
          console.log('User cancelled camera');
        } else if (response.error) {
          console.log('Camera Error: ', response.error);
        } else {
          // Process the captured image
          let imageUri = response.uri || response.assets?.[0]?.uri;
          this.setState({ selectedImage: imageUri });

          // Save the image to the gallery
          CameraRoll.saveToCameraRoll(imageUri, 'photo')
            .then(() => console.log('Image saved to gallery'))
            .catch(error => console.error('Error saving image to gallery: ', error));
        }
      });
    }


  render() {
    return (
      <SafeAreaView>
        <HMSMap
          zoomControlsEnabled
          compassEnabled
          myLocationEnabled={this.state.myLocationEnabled}
          myLocationButtonEnabled={this.state.myLocationButtonEnabled}
          onMyLocationButtonClick={() =>
            console.log("HMSMap onMyLocationButtonClick")
          }
          onMyLocationClick={() => console.log("HMSMap onMyLocationClick")}
          style={styles.height300}
          mapType={MapTypes.NORMAL}
          camera={{
            target: {
              latitude: 41.02155220194891,
              longitude: 29.0037998967586,
            },
            zoom: 2,
          }}
          myLocationStyle={this.state.myLocationStyle}
        >
                  {/* Add your marker here */}
                  <HMSMarker
                    title="Your Marker Title"
                    snippet="Your Marker Snippet"
                    onInfoWindowClick={() => this.handleCameraLaunch()}
                    coordinate={{
                      latitude: 41.008699470240245,
                      longitude: 28.98015976031702,
                    }}
                  />
                </HMSMap>
        <View style={[styles.flexRow, { padding: 4 }]}>
          <View
            style={[styles.flexRow, styles.flex1, { alignItems: "center" }]}
          >
            <Switch
              onValueChange={() => {
                if (this.state.myLocationEnabled) {
                  this.setState({ myLocationEnabled: false });
                  this.setState({ myLocationButtonEnabled: false });
                  this.setState({ myLocationStyleEnabled: false });
                } else {
                  PermissionsAndroid.check(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                  ).then((res) => {
                    res
                      ? this.setState({ myLocationEnabled: true })
                      : PermissionsAndroid.request(
                          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
                        ).then(
                          (granted) =>
                            PermissionsAndroid.RESULTS.GRANTED === granted &&
                            this.setState({ myLocationEnabled: true })
                        );
                  });
                }
              }}
              value={this.state.myLocationEnabled}
            />
            <Text title="My Location">Location</Text>
          </View>
          <View
            style={[styles.flexRow, styles.flex1, { alignItems: "center" }]}
          >
            <Switch
              onValueChange={() =>
                this.setState((state) => ({
                  myLocationButtonEnabled: !state.myLocationButtonEnabled,
                }))
              }
              value={this.state.myLocationButtonEnabled}
            />
            <Text title="My Location Button">Location Button</Text>
          </View>
        </View>
        <View style={[styles.flexRow, { padding: 4 }]}>
          <View
            style={[styles.flexRow, styles.flex1, { alignItems: "center" }]}
          >
            <Switch
              onValueChange={() => {
                console.log(
                  " onValueChange myLocationStyleEnabled is " +
                    this.state.myLocationStyleEnabled
                );
                if (this.state.myLocationStyleEnabled) {
                  this.setState({
                    myLocationStyle: null,
                  });
                } else {
                  this.setState({
                    myLocationStyle: {
                      anchor: [0.1, 0.1],
                      icon: {
                        asset: "plane.png",
                        width: 30,
                        height: 30,
                      },
                    },
                  });
                }
                this.setState((state) => ({
                  myLocationStyleEnabled: !state.myLocationStyleEnabled,
                }));
                console.log(
                  " onValueChange myLocationStyle is " +
                    this.state.myLocationStyle
                );
              }}
              value={this.state.myLocationStyleEnabled}
            />
            <Text title="Style My Location Button">
              {" "}
              Style Location Button
            </Text>
          </View>
          <View
            style={[
              styles.flexRow,
              styles.flex1,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Button title="Choose from Device" onPress={this.openImagePicker} />
          </View>
          <View
            style={[
              styles.flexRow,
              styles.flex1,
              { alignItems: "center", justifyContent: "center" },
            ]}
          >
            <Button title="Open Camera" onPress={this.handleCameraLaunch} />
          </View>
           <View
                      style={[
                        styles.flexRow,
                        styles.flex1,
                        { alignItems: "center", justifyContent: "center" },
                      ]}
                    >
                      <Button title="Alert button" onPress={this.handleMarkerPress} />
                    </View>
        </View>
        {this.state.selectedImage && (
          <Image
            source={{ uri: this.state.selectedImage }}
            style={{ flex: 1, height: 100, width: 100 }}
            resizeMode="contain"
          />
        )}
      </SafeAreaView>
    );
  }
}
//