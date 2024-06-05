/******************************************************************************
 *                            CompleteProfile
 * 
 *      Displays the complete profile page for the user to fill out their
 *      information. This page is shown after the user has authenticated
 *      but has not yet completed their profile.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';
import { createUserProfile } from '../../config/firebase';
import {
  fetchUserProfile,
  setFirebaseAuthenticationAction,
} from '../../config/redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { firebase } from '@react-native-firebase/auth';

const CompleteProfile = ({
  navigation,
  fireAuth,
  activeCommunity,
  putFirebaseUserInRedux,
  fetchMEUser,
}) => {
  const [preferredName, setPreferredName] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [zipcode, setZipcode] = useState('');

  const [loading, setLoading] = useState(false);

  const isValidZipCode = (zip) => {
    return zip.length === 5 && !isNaN(zip);
  }

  // Submit data to backend and update user profile in redux
  const onSubmit = () => {
    console.log('Submitting...');
    setLoading(true);

    const profile = {
      full_name: firstName + " " + lastName,
      preferred_name: preferredName,
      email: fireAuth.email,
      location: ", , " + zipcode,
      is_vendor: false,
      accepts_terms_and_conditions: true,
      subdomain: activeCommunity?.subdomain,
      color: "#000000",
    };

    const errorAndExit = (error) => {
      console.error('ERROR_CREATING_PROFILE:', error);
      Alert.alert('Error creating profile. Please try again');
      navigation.navigate('Login');
    };

    createUserProfile(profile, (response, error) => {
      setLoading(false);
      if (error) {
        errorAndExit(error);
        return;
      }

      fireAuth.reload().then(() => {
        const user = firebase.auth().currentUser;

        console.log('USER:', user);
        putFirebaseUserInRedux(user);
        user?.getIdToken().then(token => {
          fetchMEUser(token, (_, error) => {
            if (error) {
              errorAndExit(error);
              return;
            };
            navigation.navigate('Community');
          });
        });
      });
    })
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
      }}
    >
      <Image
        src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
        alt="Community Logo"
        style={{ width: 120, height: 120, objectFit: 'contain' }}
      />
      <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 20 }}>
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

      {/* Text fields */}
      <View style={{ width: '100%', paddingHorizontal: '10%' }}>
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

        {/* Complete button */}
        <MEButton
          containerStyle={{ width: '100%' }}
          onPress={onSubmit}
          disabled={
            !preferredName || !firstName || !lastName
            || !zipcode || !isValidZipCode(zipcode)
          }
          loading={loading}
        >
          COMPLETE
        </MEButton>
      </View>
    </View>
    // </ScrollView>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putFirebaseUserInRedux: setFirebaseAuthenticationAction,
      fetchMEUser: fetchUserProfile,
    },
    dispatch,
  );
};


const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
  activeCommunity: state.activeCommunity,
});

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfile);
