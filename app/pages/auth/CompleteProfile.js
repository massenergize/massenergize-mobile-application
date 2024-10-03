/******************************************************************************
 *                            CompleteProfile
 * 
 *      Displays the complete profile page for the user to fill out their
 *      information. This page is shown after the user has authenticated
 *      but has not yet completed their profile.
 * 
 *      Written by: William Soylemez
 *      Last edited: July 15, 2023
 * 
 *****************************************************************************/

import { View, Text, Alert, SafeAreaView, ScrollView, Platform, KeyboardAvoidingView } from 'react-native';
import React, { useState } from 'react';
import { Image } from 'react-native';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';
import { createUserProfile, deleteFirebaseUser } from '../../config/firebase';
import {
  fetchUserProfile,
  setFirebaseAuthenticationAction,
  signOutAction,
} from '../../config/redux/actions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { firebase } from '@react-native-firebase/auth';
import { showSuccess, showError } from '../../utils/common';

const CompleteProfile = ({
  navigation,
  fireAuth,
  activeCommunity,
  putFirebaseUserInRedux,
  fetchMEUser,
  signMeOut
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
      showError('Error creating profile. Please try again');
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

        putFirebaseUserInRedux(user);
        user?.getIdToken().then(token => {
          fetchMEUser(token, (_, error) => {
            if (error) {
              errorAndExit(error);
              return;
            };
            showSuccess('Profile created!');
            navigation.navigate('Community');
          });
        });
      });
    })
  }

  // Cancel button
  const cancel = () => {
    const deleteUser = () => {
      deleteFirebaseUser((response, error) => {
        if (error) {
          console.error('ERROR_DELETING_USER:', error);
          showError('Error deleting user. Please try again');
          return;
        }
        signMeOut();
        console.log('USER_DELETED');
        navigation.navigate('CommunityPages');
        showSuccess('User deleted');
      });
    }

    Alert.alert(
      'Are you sure you want to cancel registration?',
      'This will delete your account and all associated data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: deleteUser,
          style: 'destructive',
        },
      ],
    );
  }

  return (
    // <ScrollView vertical style={{height: '100%'}}>
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

              {/* Cancel button */}
              <MEButton
                containerStyle={{ width: '100%' }}
                onPress={cancel}
                style={{ marginTop: 20, justifyContent: 'center', color: 'red' }}
                asLink
              >
                Cancel registration
              </MEButton>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      putFirebaseUserInRedux: setFirebaseAuthenticationAction,
      fetchMEUser: fetchUserProfile,
      signMeOut: signOutAction,
    },
    dispatch,
  );
};


const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
  activeCommunity: state.activeCommunity,
});

export default connect(mapStateToProps, mapDispatchToProps)(CompleteProfile);
