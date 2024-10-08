/******************************************************************************
 *                            ForgotPassword
 * 
 *      This page is responsible displaying the forgot password page for the user
 *      input an email address to reset their password.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import { View, Text, Image } from 'react-native';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import Textbox from '../../components/textbox/Textbox';
import { COLOR_SCHEME } from '../../stylesheet';
import MEButton from '../../components/button/MEButton';
import { showError, showSuccess } from '../../utils/common';

const ForgotPassword = ({
  navigation,
  activeCommunity,
}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');

  // Functions for checking form validity
  const isValidateEmail = email => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const notReadyToSubmit = () => (!email || !isValidateEmail(email));

  // Sends a password reset email to the user
  const resetPassword = () => {
    setLoading(true);
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        setLoading(false);
        showSuccess('Password reset email sent!');
        navigation.navigate('Login');
      })
      .catch(error => {
        setLoading(false);
        showError(error.message);
      });
  }


  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>

      {/* Logo and title */}
      <Image
        src={activeCommunity?.logo?.url}
        // src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
        alt="Community Logo"
        style={{ width: 120, height: 120, objectFit: 'contain' }}
      />
      <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 20 }}>
        Forgot your password? Enter your email and we'll send you a link to reset it.
      </Text>

      {/* Email input */}
      <View style={{ width: '100%', paddingHorizontal: '10%' }}>
        <Textbox
          value={email}
          generics={{ keyboardType: 'email-address' }}
          onChange={text => setEmail(text)}
          label="Email"
          placeholder="Enter your email"
        />
      </View>

      {/* Reset password button */}
      <MEButton
        loading={loading}
        onPress={() => resetPassword()}
        disabled={notReadyToSubmit()}
        // style={{ width: '80%', backgroundColor: COLOR_SCHEME.primary  }}
      >
        Reset Password
      </MEButton>
    </View>
  );
};

const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
  activeCommunity: state.activeCommunity,
});


export default connect(mapStateToProps)(ForgotPassword);
