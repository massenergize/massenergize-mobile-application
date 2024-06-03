import {View, Text, ScrollView} from 'react-native';
import React, { useState } from 'react';
import {Image} from 'react-native';
import Textbox from '../../components/textbox/Textbox';
import MEButton from '../../components/button/MEButton';
import { connect } from 'react-redux';
import { registerWithEmailAndPassword } from '../../config/firebase';
import { showError } from '../../utils/common';


const EmailInput = ({navigation, activeCommunity, nextStep}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const isValidPassword = (password) => {
    return password.length >= 8;
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  const readyToSubmit = () => {
    return (
      email && password && confirmPassword && isValidEmail(email)
      && isValidPassword(password) && password === confirmPassword
    );
  }

  const registerUser = () => {
    if (!readyToSubmit()) return;
    
    setLoading(true);

    registerWithEmailAndPassword(email, password, (error) => {
      setLoading(false);
      if (error) {
        console.error('ERROR_REGISTERING_USER:', error);
        showError('Error registering user. Please try again');
        return;
      }
      console.log('USER_REGISTERED:');
      nextStep();
    });
  }

  return (
    // <ScrollView vertical style={{height: '100%'}}>
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        paddingBottom: 50
      }}>
      <Image
        src={activeCommunity?.logo?.url}
        alt="Community Logo"
        style={{width: 120, height: 120, objectFit: 'contain'}}
      />
      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 20}}>
        Welcome!
      </Text>
      <Text
        style={{
          fontWeight: '500',
          paddingHorizontal: 25,
          fontSize: 14,
          marginBottom: 20,
        }}>
        When you join, we can count your impact. We do not collect sensitive
        personal data and do not share data.
      </Text>

      <View style={{width: '100%', paddingHorizontal: '10%'}}>
        { email.length > 0 && !isValidEmail(email) &&
          <Text style={{color: 'red'}}>
            Please enter a valid email address
          </Text>
        }
        <Textbox
          label="Email"
          placeholder="Enter email address..."
          value={email}
          onChange={(text) => setEmail(text)}
        />
        { password.length > 0 && !isValidPassword(password) &&
          <Text style={{color: 'red'}}>
            Password must have at least 8 characters
            </Text>
        }
        <Textbox 
          label="Password"
          placeholder="Enter password here..."
          value={password}
          onChange={(text) => setPassword(text)}
          generics={
            {keyboardType: 'visible-password', secureTextEntry: true}
          }
        />
        { confirmPassword.length > 0 && password !== confirmPassword &&
          <Text style={{color: 'red'}}>Passwords don't match</Text>
        }
        <Textbox
          label="Confirm Password"
          placeholder="Re-enter password here..."
          value={confirmPassword}
          onChange={(text) => setConfirmPassword(text)}
          generics={
            {keyboardType: 'visible-password', secureTextEntry: true}
          }
        />
        <MEButton
          containerStyle={{width: '100%'}}
          onPress={registerUser}
          disabled={!readyToSubmit()}
          loading={loading}
        >
          REGISTER
        </MEButton>
        <MEButton
          asLink
          style={{marginVertical: 5}}
          onPress={() => navigation.navigate("Login")}
        >
          Login Instead
        </MEButton>
      </View>
    </View>
    // </ScrollView>
  );
};

const mapStateToProps = state => ({
  activeCommunity: state.activeCommunity,
});

export default connect(mapStateToProps)(EmailInput);
