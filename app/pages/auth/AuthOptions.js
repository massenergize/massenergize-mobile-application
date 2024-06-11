/******************************************************************************
 *                            AuthOptions
 * 
 *      Renders a list of authentication options for the user to choose from.
 * 
 *      Written by: Frimpong Opoku-Agyemang
 *      Last edited: 
 * 
 *****************************************************************************/

import {View, Text, TouchableOpacity, ScrollView} from 'react-native';
import React from 'react';

import {FontAwesomeIcon} from '../../components/icons';
import {COLOR_SCHEME} from '../../stylesheet';
import {useNavigation} from '@react-navigation/native';
import {bindActionCreators} from 'redux';
import {authenticateWithGmail} from '../../config/firebase';
import {connect} from 'react-redux';
import {showError} from '../../utils/common';
import {
  fetchUserProfile,
  setFirebaseAuthenticationAction,
} from '../../config/redux/actions';

const AuthOptions = ({closeModal, fetchMEUser, putFirebaseUserInRedux}) => {
  const navigation = useNavigation();

  // Function to authenticate with Gmail
  const doGoogleAuth = () => {
    console.log('Authenticating with Gmail...');
    authenticateWithGmail((response, error) => {
      if (error && !response) return showError(error?.toString());
      const firebaseUser = response?.user;
      putFirebaseUserInRedux(firebaseUser);
      firebaseUser
        ?.getIdToken()
        .then(token => {
          fetchMEUser(token, (user, error) => {
            closeModal();
            console.log(user, error);
            if (!user) return navigation.navigate('Register');
            navigation.navigate('Community');
          });
        })
        .catch(e => showError(e?.toString()));
    });
  };

  // List of authentication options
  const options = [
    {
      key: 'email-only',
      name: 'With Email Only (No Password)',
      icon: 'envelope',
      disabled: true,
    },
    {key: 'Login', name: 'Email & Password', icon: 'lock'},
    {
      key: 'google',
      name: 'Gmail',
      icon: 'google',
      theme: {text: {color: 'red'}, icon: {color: 'red'}},
      onPress: doGoogleAuth,
    },
    {
      key: 'facbeook',
      name: 'Facebook',
      icon: 'facebook',
      theme: {text: {color: '#1877F2'}, icon: {color: '#1877F2'}},
      disabled: true,
    },
  ];

  
  return (
    <ScrollView vertical>
      {options.map(option => {
        const {theme, disabled, onPress} = option;
        return (
          <TouchableOpacity
            onPress={() => {
              if (onPress) return onPress();
              navigation.navigate(option.key);
              closeModal && closeModal();
            }}
            disabled={disabled}
            key={option.key}
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 15,
              paddingRight: 20,
              borderBottomWidth: 1,
              borderColor: COLOR_SCHEME.LIGHT_GREY,
              opacity: disabled ? 0.2 : 1,
            }}>
            <FontAwesomeIcon
              name={option.icon}
              size={21}
              style={{...(theme?.icon || {})}}
            />
            <Text
              style={{
                fontWeight: 'bold',
                fontSize: 15,
                marginLeft: 20,
                ...(theme?.text || {}),
              }}>
              {option.name}
            </Text>
            <FontAwesomeIcon
              size={22}
              name="long-arrow-right"
              style={{marginLeft: 'auto', color: COLOR_SCHEME.LIGHT_GREY}}
            />
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      fetchMEUser: fetchUserProfile,
      putFirebaseUserInRedux: setFirebaseAuthenticationAction,
    },
    dispatch,
  );
};
export default connect(null, mapDispatchToProps)(AuthOptions);
