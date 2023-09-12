import {View, Text, Checkbox} from 'react-native';
import React from 'react';
import Textbox from '../../components/textbox/Textbox';
import Slider from '@react-native-community/slider';
import MEButton from '../../components/button/MEButton';

const ZipCodeInput = () => {
  return (
    <View style={{padding: 20}}>
      <Textbox
        label="What's your community's zipcode? *"
        placholder="Enter zipcode here..."
      />
      <Text>Include nearby communities (Optional) </Text>
      <Slider></Slider>
      <Text>Within 10 Miles</Text>
      <MEButton>SEARCH</MEButton>
    </View>
  );
};

export default ZipCodeInput;
