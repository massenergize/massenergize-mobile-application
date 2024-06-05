/******************************************************************************
 *                            ActionCard
 * 
 *      This page handles the registration process for the user. It is responsible
 *      for rendering the email input, email confirmation, and complete profile
 *      screens.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import React, { useState } from 'react';
import {connect} from 'react-redux';
import EmailInput from './EmailInput';
import ConfirmEmail from './ConfirmEmail';
import CompleteProfile from './CompleteProfile';
import { View } from 'react-native';
import { StyleSheet } from 'react-native';

const Register = ({ navigation }) => {

  const [step, setStep] = useState(0);

  return (
    <View style={{height: '100%', backgroundColor: 'white'}}>

      {/* Render the appropriate screen based on the step */}
      {step === 0 && <EmailInput nextStep={() => setStep(1)} navigation={navigation}/>}
      {step === 1 && <ConfirmEmail nextStep={() => setStep(2)} />}
      {step === 2 && <CompleteProfile navigation={navigation} />}

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.dot, { backgroundColor: step === 0 ? 'gray' : 'white' }]}></View>
        <View style={[styles.dot, { backgroundColor: step === 1 ? 'gray' : 'white' }]}></View>
        <View style={[styles.dot, { backgroundColor: step === 2 ? 'gray' : 'white' }]}></View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Ensure other content is at the top
  },
  stepIndicator: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 5,
  },
});

const mapStateToProps = state => ({
  activeCommunity: state.activeCommunity,
});

export default connect(mapStateToProps)(Register);
