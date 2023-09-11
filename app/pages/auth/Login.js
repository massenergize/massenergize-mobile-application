import {View, Text, TouchableOpacity} from 'react-native';
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
        justifyContent: 'center',
      }}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        Welcome, {fireAuth?.displayName || '...'}
      </Text>
      <TouchableOpacity
        onPress={() => signInWithGoogle()}
        style={{
          padding: 15,
          backgroundColor: 'red',
          marginBottom: 10,
        }}>
        <Text
          style={{
            textAlign: 'center',
            color: 'white',
            fontWeight: 'bold',
          }}>
          LOG ME IN
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          toggleModal({
            isVisible: true,
            component: <Text>This is the test modal my gee</Text>,
          })
        }
        style={{
          padding: 15,
          backgroundColor: 'green',
        }}>
        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          TEST MODAL
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => signMeOut()}
        style={{
          padding: 15,
          backgroundColor: 'blue',
          marginTop: 10,
        }}>
        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          SIGN ME OUT
        </Text>
      </TouchableOpacity>
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
