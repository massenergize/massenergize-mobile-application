import {View, Text, ScrollView} from 'react-native';
import React from 'react';
import {Image} from 'react-native';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';

const CompletProfile = () => {
  return (
    // <ScrollView vertical style={{height: '100%'}}>
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
        alt="Community Logo"
        style={{width: 120, height: 120, objectFit: 'contain'}}
      />
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 20}}>
        Complete Your Profile!
      </Text>
      {/* <Text
        style={{
          fontWeight: '500',
          paddingHorizontal: 25,
          fontSize: 14,
          marginBottom: 20,
        }}>
        When you join, we can count your impact. We do not collect sensitive
        personal data and do not share data.
      </Text> */}

      <View style={{width: '100%', paddingHorizontal: '10%'}}>
        <Textbox
          label="Preferred Name (unique)"
          placholder="Enter preferred name..."
        />
        <Textbox label="First Name" placholder="Enter firstname here..." />
        <Textbox label="Last Name" placholder="Enter last Name here..." />
        <Textbox label="Zipcode" placholder="Enter your zipcode here......" />
        <MEButton containerStyle={{width: '100%'}}>COMPLETE</MEButton>
      </View>
    </View>
    // </ScrollView>
  );
};

export default CompletProfile;
