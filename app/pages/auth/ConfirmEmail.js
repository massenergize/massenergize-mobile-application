import React, { useState } from 'react';
import {View, Text} from 'react-native';
import { showError } from '../../utils/common';
import { Button } from 'native-base';
import { connect } from 'react-redux';
import firebase from '@react-native-firebase/app';

const ConfirmEmail = ({ fireAuth, nextStep }) => {

  const [loading, setLoading] = useState(false);

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
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 40}}>
        Check your email
      </Text>
      <Text>
        We sent a link to {fireAuth?.email}. Please click that link to continue.
        Not in your inbox? Please check your SPAM and Promotions folders.
      </Text>
      <Button
        onPress={confirmEmail}
        style={{marginTop: 20, width: '80%', justifyContent: 'center'}}
        loading={loading}
      >
        I've confirmed my email
      </Button>
      
    </View>
  );
}
 
const mapStateToProps = state => ({
  fireAuth: state.fireAuth,
});

export default connect(mapStateToProps)(ConfirmEmail);