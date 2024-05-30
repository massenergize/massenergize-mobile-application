import {View, Text, Alert} from 'react-native';
import React, { useState } from 'react';
import {Image} from 'react-native';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';

const CompleteProfile = () => {
  const [preferredName, setPreferredName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipcode, setZipcode] = useState('');

  const isValidZipCode = (zip) => {
    return zip.length === 5 && !isNaN(zip);
  }

  const onSubmit = () => {
    if (!preferredName || !firstName || !lastName || !zipcode) {
      Alert.alert('Please fill out all fields');
      return;
    } else if (!isValidZipCode(zipcode)) {
      Alert.alert('Please enter a valid zipcode');
      return;
    }
    console.log('Submitting...');
  }

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
          placeholder="Enter preferred name..."
          value={preferredName}
          onChange={(text) => setPreferredName(text)}
        />
        <Textbox
          label="First Name"
          placeholder="Enter firstname here..."
          value={firstName}
          onChange={(text) => setFirstName(text)}
        />
        <Textbox
          label="Last Name"
          placeholder="Enter last Name here..."
          value={lastName}
          onChange={(text) => setLastName(text)}  
        />
        <Textbox 
          label="Zipcode" 
          placeholder="Enter your zipcode here......"
          value={zipcode}
          onChange={(text) => setZipcode(text)}
        />
        <MEButton containerStyle={{width: '100%'}} onPress={onSubmit}>
          COMPLETE
        </MEButton>
      </View>
    </View>
    // </ScrollView>
  );
};

export default CompleteProfile;
