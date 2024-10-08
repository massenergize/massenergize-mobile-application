/******************************************************************************
 *                            Login
 * 
 *      This page is responsible for allowing the user to login with their email
 *      and password
 * 
 *      Written by: William Soylemez and Frimpong Opoku-Agyemang
 *      Last edited: July 16, 2023
 * 
 *****************************************************************************/

import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  fetchUserProfile,
  setFirebaseAuthenticationAction,
  signOutAction,
  toggleUniversalModalAction,
} from '../../config/redux/actions';
import Textbox from '../../components/textbox/Textbox';
import { COLOR_SCHEME } from '../../stylesheet';
import MEButton from '../../components/button/MEButton';
import Snackbar from 'react-native-snackbar';
import { showError, showSnackBar, showSuccess } from '../../utils/common';
import { authenticateWithEmailAndPassword } from '../../config/firebase';

const Login = ({
  navigation,
  activeCommunity,
  putFirebaseUserInRedux,
  fetchMEUser,
  fireAuth,
}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Check form validity
  const notReadyToSubmit = () => {
    if (!email || !password) return true;
  };

  // Authenticates, retrieves user profile and puts user in redux,
  // then navigates to community page
  const signUserIn = () => {
    setLoading(true);
    authenticateWithEmailAndPassword(email, password, (response, error) => {
      setLoading(false);
      if (!response) return showError(error);
      console.log("USER LOGGED IN");
      const user = response.user;
      putFirebaseUserInRedux(user);
      user?.getIdToken().then(token => {
        fetchMEUser(token, (_, error) => {
          if (error) {
            console.error('ERROR_FETCHING_USER_PROFILE:', error);
            showError('Error fetching user profile. Please try again.');
            return;
          };
          // console.log('LOGIN_TOKEN:', token);
          navigation.navigate('Community');
        });
      });
    });
  };

  // Go to registration flow if already authenticated (but not registered)
  useEffect(() => {
    if (fireAuth) {
      navigation.navigate('Register');
    }
  }, []);

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
      }}
    >

      {/* Title and logo */}
      <Image
        src={activeCommunity?.logo?.url}
        alt="Community Logo"
        style={{ width: 120, height: 120, objectFit: 'contain' }}
      />
      <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 20 }}>
        Sign in with email & password
      </Text>

      {/* Email and password input */}
      <View style={{ width: '100%', paddingHorizontal: '10%' }}>
        <Textbox
          value={email}
          generics={{ keyboardType: 'email-address' }}
          onChange={text => setEmail(text)}
          label="Email"
          placeholder="Enter email here..."
        />
        <Textbox
          value={password}
          onChange={text => setPassword(text)}
          generics={{ keyboardType: 'visible-password', secureTextEntry: true }}
          label="Password"
          placeholder="Enter your password here..."
        />

        {/* Forgot password */}
        <MEButton asLink onPress={() => navigation.navigate("ForgotPassword")} style={{ fontSize: 16 }}>
          Forgot password
        </MEButton>

        {/* Login button */}
        <MEButton
          disabled={notReadyToSubmit()}
          loading={loading}
          onPress={() => signUserIn()}
        >
          LOGIN
        </MEButton>

        {/* Register */}
        <MEButton
          containerStyle={{ marginVertical: 10 }}
          style={{ color: COLOR_SCHEME.ORANGE, fontSize: 16 }}
          iconStyle={{ color: COLOR_SCHEME.ORANGE }}
          asLink
          onPress={() => navigation.navigate('Register')}
        >
          Haven't joined yet? Make an account{' '}
        </MEButton>
      </View>
    </View>
  );
};

const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
  activeCommunity: state.activeCommunity,
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      toggleModal: toggleUniversalModalAction,
      signMeOut: signOutAction,
      // setFireAuth: setFirebaseAuthenticationAction,
      putFirebaseUserInRedux: setFirebaseAuthenticationAction,
      fetchMEUser: fetchUserProfile,
    },
    dispatch,
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
