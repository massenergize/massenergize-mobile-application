import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  setFirebaseAuthenticationAction,
  signOutAction,
  toggleUniversalModalAction,
} from '../../config/redux/actions';
import Textbox from '../../components/textbox/Textbox';

const Login = ({toggleModal, fireAuth, signMeOut, setFireAuth, navigation}) => {
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Create a Firebase credential with the Google Sign-In token
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );

      // Sign-in to Firebase with the Google credential
      const response = await auth().signInWithCredential(googleCredential);
      setFireAuth(response?.user);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
        alt="Community Logo"
        style={{width: 120, height: 120, objectFit: 'contain'}}
      />

      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 20}}>
        Sign in with email & password
      </Text>
      <View style={{width: '100%', paddingHorizontal: '10%'}}>
        <Textbox label="Email" placholder="Enter email here..." />
        <Textbox label="Password" placholder="Enter your password here..." />
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
      signMeOut: signOutAction,
      setFireAuth: setFirebaseAuthenticationAction,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
