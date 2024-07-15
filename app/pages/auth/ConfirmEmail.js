/******************************************************************************
 *                            ConfirmEmail
 * 
 *      Page that waits for the user to confirm their email address. If the
 *      user has already confirmed their email, they can proceed to the next
 *      step.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import React, { useEffect, useState } from 'react';
import {View, Text} from 'react-native';
import { showError, showSuccess } from '../../utils/common';
import MEButton from '../../components/button/MEButton';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';
import { deleteFirebaseUser } from '../../config/firebase';
import { useNavigation } from '@react-navigation/native';
import { signOutAction } from '../../config/redux/actions';

const ConfirmEmail = ({ fireAuth, nextStep, signMeOut }) => {
  const [loading, setLoading] = useState(false);

  const navigation = useNavigation();

  // Checks for email verification and proceeds to the next step
  const confirmEmail = () => {
    setLoading(true);
    fireAuth.reload()
      .then(() => {
        setLoading(false);
        const fireAuth = firebase.auth().currentUser;
        if (!fireAuth.email) {
          showError('No email found');
          return;
        }
        if (!fireAuth.emailVerified) {
          showError('Email not verified yet!');
          return;
        }
        nextStep();
      })
      .catch(error => {
        setLoading(false);
        console.error('ERROR_RELOADING_FIREAUTH:', error);
        showError('Error reloading email. Please try again');
      });
  }

  // Resends the email verification
  const resendEmail = () => {
    fireAuth.sendEmailVerification()
      .then(() => {
        console.log('EMAIL_RESENT');
        showSuccess('Email verification sent');
      })
      .catch(error => {
        console.error('ERROR_RESENDING_EMAIL:', error);
        showError('Email resend failed. Please wait a few moments and try again!');
      });
  }

  // Cancel button
  const cancel = () => {
    deleteFirebaseUser((response, error) => {
      if (error) {
        console.error('ERROR_DELETING_USER:', error);
        showError('Error deleting user. Please try again');
        return;
      }
      signMeOut();
      console.log('USER_DELETED');
      navigation.navigate('Login');
      showSuccess('User deleted');
    })
  }

  // Move to the next step if the email is already verified
  useEffect(() => {
    if (fireAuth.emailVerified) {
      nextStep();
    }
  }, []);

  return (
    <View style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: 'white',
      paddingBottom: 50,
      paddingTop: 25,
      paddingHorizontal: 10
      }}
    >
      {/* Title */}
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 40}}>
        Check your email
      </Text>
      <Text>
        We sent a link to {fireAuth?.email}. Please click that link to continue.
        Not in your inbox? Please check your SPAM and Promotions folders.
      </Text>

      {/* Resend */}
      <MEButton
        onPress={resendEmail}
        style={{marginTop: 20, justifyContent: 'center'}}
        asLink
      >
        Resend email
      </MEButton>

      {/* Confirm */}
      <MEButton
        onPress={confirmEmail}
        style={{marginTop: 0, justifyContent: 'center'}}
        loading={loading}
      >
        I've confirmed my email
      </MEButton>

      {/* Cancel */}
      <MEButton
        onPress={cancel}
        style={{marginTop: 20, justifyContent: 'center', color: 'red'}}
        asLink
      >
        Cancel registration
      </MEButton>
      
    </View>
  );
}
 
const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
});

const mapDispatchToProps = dispatch => ({
  signMeOut: () => dispatch(signOutAction()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ConfirmEmail);