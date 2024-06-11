import { Image } from '@gluestack-ui/themed-native-base';
import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { connect } from 'react-redux';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';
import { authenticateWithEmailOnly } from '../../config/firebase';

const EmailOnly = ({ activeCommunity }) => {

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendEmail = () => {
    authenticateWithEmailOnly(email, (response, error) => {
      if (error) {
        console.error('ERROR_SENDING_EMAIL:', error);
        return;
      }
      console.log('EMAIL_SENT:', response);
    });
  }

  const confirmEmail = () => {
    console.log('Confirming email:', email);
  }


  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: 50,
        height: '100%',
      }}>

      {/* Logo and title */}
      <Image
        src={activeCommunity?.logo?.url}
        alt="Community Logo"
        style={{ width: 120, height: 120, objectFit: 'contain' }}
      />
      <Text style={{ fontWeight: '600', fontSize: 18, marginBottom: 20 }}>
        Sign in with email
      </Text>
      <Text
        style={{
          fontWeight: '500',
          paddingHorizontal: 25,
          fontSize: 14,
          marginBottom: 20,
        }}>
        Enter your email address and we'll send you a link to sign in.
      </Text>

      {/* Email and password inputs */}
      <View style={{ width: '100%', paddingHorizontal: '10%' }}>
        {email.length > 0 && !isValidEmail(email) &&
          <Text style={{ color: 'red' }}>
            Please enter a valid email address
          </Text>
        }
        <Textbox
          label="Email"
          placeholder="Enter email address..."
          value={email}
          onChange={(text) => setEmail(text)}
        />

        {/* Send email */}
        <MEButton
          containerStyle={{ width: '100%' }}
          onPress={sendEmail}
          disabled={!isValidEmail(email)}
          loading={loading}
        >
          Send email
        </MEButton>

        {/* Confirm Email */}
        <MEButton
          onPress={confirmEmail}
        >
          Confirm email
        </MEButton>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    activeCommunity: state.activeCommunity,
  };
}

export default connect(mapStateToProps)(EmailOnly);