import React, { useState } from "react";
import { SafeAreaView, View, Text, TouchableHighlight, Alert, Button,Image, Linking  } from "react-native";
import HMSMap, { MapTypes, Gravity, HMSMarker, HMSInfoWindow } from "@hmscore/react-native-hms-map";
import HMSLocation from "@hmscore/react-native-hms-location";
import { styles } from "../styles/styles";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { CameraRoll } from "@react-native-camera-roll/camera-roll";

const DEFAULT_LOCATION = { latitude: 41.02155220194891, longitude: 29.0037998967586 };

const BasicMap = () => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [savedPhotoPath, setSavedPhotoPath] = useState(null);
   const [displayedPhoto, setDisplayedPhoto] = useState(null);
   const [showModal, setShowModal] = useState(false);

  const getCurrentLocation = async () => {
    try {
      const location = await HMSLocation.FusedLocation.Native.getLastLocation();
      if (location) {
        setCurrentLocation(location);
      } else {
        console.warn("Location is null, using default location");
      }
    } catch (error) {
      console.error('Failed to get current location', error);
    }
  };

  const handleButtonPress = () => {
    getCurrentLocation(); // Update the current location
  };

  const handleCameraLaunch = () => {
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
          setSelectedImage(imageUri);

          // Save the image to the gallery
          CameraRoll.saveToCameraRoll(imageUri, 'photo')
            .then(() => {
              console.log('Image saved to gallery');
              // Get the path of the saved image
              CameraRoll.getPhotos({ first: 1, assetType: 'Photos', groupTypes: 'All', })
                .then((photos) => {
                  const lastPhoto = photos.edges[0].node.image.uri;
                  console.log('Path of the saved image:', lastPhoto);
                  // Now you have the path of the saved image
                   setSavedPhotoPath(lastPhoto);
                })
                .catch((error) => console.error('Error getting latest photo: ', error));
            })
            .catch(error => console.error('Error saving image to gallery: ', error));

            getCurrentLocation();
        }
      });
    };
    const handleDisplayPhoto = () => {
        if (savedPhotoPath) {
          console.log('Displaying saved photo:', savedPhotoPath);
          setDisplayedPhoto(savedPhotoPath);
          setShowModal(true);
        } else {
          console.log('No saved photo to display');
        }
      };


const handleInfoWindowClick = () => {
  CameraRoll.getPhotos({ first: 1, assetType: 'Photos', groupTypes: 'All' })
    .then(photos => {
      if (photos.edges.length > 0) {
        const lastPhoto = photos.edges[0].node.image.uri;
        // Open the URL of the last saved image
        Linking.openURL(lastPhoto)
          .catch(err => console.error('Failed to open URL: ', err));
      }
    })
    .catch(err => console.error('Error getting latest photo: ', err));
};

  return (
    <SafeAreaView>
      <Button title="Pin to Current Location" onPress={handleButtonPress} />
      <Button title="Open Camera" onPress={handleCameraLaunch} />
      <Button title="Display Saved Photo" onPress={handleDisplayPhoto} />
      {displayedPhoto && (
          <>
            <Image source={{ uri: displayedPhoto }} style={{ width: 370, height: 500 }} />
            <Button title="Back" onPress={() => setDisplayedPhoto(null)} />
          </>
        )}
      <HMSMap
        style={styles.fullHeight}
        mapType={MapTypes.NORMAL}
        liteMode={false}
        darkMode={false}
        camera={{
          target: currentLocation || DEFAULT_LOCATION,
          zoom: 2, // Adjust the zoom level according to your preference
        }}
        logoPosition={Gravity.TOP | Gravity.START}
        logoPadding={{
          paddingStart: 0,
          paddingTop: 0,
          paddingBottom: 0,
          paddingEnd: 0,
        }}
      >
        {currentLocation && (
          <HMSMarker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Current Location"
            snippet={`Latitude: ${currentLocation.latitude}, Longitude: ${currentLocation.longitude}`}
            onInfoWindowClick={handleDisplayPhoto}
           // onInfoWindowLongClick={() => console.log("Marker onInfoWindowLongClick")}
          />
        )}
        <HMSInfoWindow>
          <TouchableHighlight
            onPress={() => Alert.alert("InfoWindow Pressed", "You pressed the InfoWindow!")}
            onLongPress={() => console.log("InfoWindow long pressed")}
          >
           <View style={{ backgroundColor: "yellow", padding: 10 }}>
                         {selectedImage && <Image source={{ uri: selectedImage }} style={{ width: 100, height: 100 }} />}
                         <Text style={{ backgroundColor: "orange" }}>Hello</Text>
                         <Text>I am a marker</Text>
                       </View>
          </TouchableHighlight>
        </HMSInfoWindow>
      </HMSMap>
    </SafeAreaView>
  );
};

export default BasicMap;
