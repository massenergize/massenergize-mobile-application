/******************************************************************************
 *                            ImagePicker
 * 
 *      This file contains a component to select and display an image. It should
 *      be given a value and a function to update the value.
 * 
 *      Written by: Will Soylemez
 *      Last edited: 2024
 * 
 * *****************************************************************************/


import React, { useState } from 'react';
import { Image, View, Text, Platform } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import { Button } from '@gluestack-ui/themed-native-base';

const ImagePicker = ({ value, onChange }) => {
  const [imageUri, setImageUri] = useState(value?.url ?? null);

  const pickImage = async () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const pickedImage = response.assets[0];
        setImageUri(pickedImage.uri);
        onChange({
          uri: Platform.OS === 'android' ? pickedImage.uri : pickedImage.uri.replace('file://', ''),
          type: pickedImage.type.replace('jpg', 'jpeg'),
          name: pickedImage.fileName,
        });
      }
    });
  };

  return (
    <View style={{ alignItems: 'center' }}>
      <Button
        style={{
          width: "50%",
          marginTop: 10,
          textAlign: "center",
        }}
        onPress={pickImage}
      >
        Pick an image
      </Button>
      {imageUri && <Image source={{ uri: imageUri }} style={{ width: 200, height: 200, margin: 20 }} />}
    </View>
  );
};

export default ImagePicker;
