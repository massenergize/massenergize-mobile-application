import {View, Text, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import {
  fetchUserProfile,
  setFirebaseAuthenticationAction,
  signOutAction,
  toggleUniversalModalAction,
} from '../../config/redux/actions';
import Textbox from '../../components/textbox/Textbox';
import {COLOR_SCHEME} from '../../stylesheet';
import MEButton from '../../components/button/MEButton';
import Snackbar from 'react-native-snackbar';
import {showError, showSnackBar, showSuccess} from '../../utils/common';
import {authenticateWithEmailAndPassword} from '../../config/firebase';

const Login = ({
  toggleModal,
  fireAuth,
  signMeOut,
  setFireAuth,
  navigation,
  activeCommunity,
  putFirebaseUserInRedux,
  fetchMEUser,
}) => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const notReadyToSubmit = () => {
    if (!email || !password) return true;
  };
  const signUserIn = () => {
    setLoading(true);
    authenticateWithEmailAndPassword(email, password, (response, error) => {
      setLoading(false);
      if (!response) return showError(error);
      const user = response.user;
      putFirebaseUserInRedux(user);
      user?.getIdToken().then(token => {
        fetchMEUser(token, (_, error) => {
          if (error) return;
          // console.log('LOGIN_TOKEN:', token);
          navigation.navigate('Community');
        });
      });
    });
  };

  return (
    <View
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
      }}>
      <Image
        src={activeCommunity?.logo?.url}
        // src="https://massenergize-prod-files.s3.amazonaws.com/media/energizewayland_resized.jpg"
        alt="Community Logo"
        style={{width: 120, height: 120, objectFit: 'contain'}}
      />

      <Text style={{fontWeight: '600', fontSize: 18, marginBottom: 20}}>
        Sign in with email & password
      </Text>
      <View style={{width: '100%', paddingHorizontal: '10%'}}>
        <Textbox
          value={email}
          generics={{keyboardType: 'email-address'}}
          onChange={text => setEmail(text)}
          label="Email"
          placholder="Enter email here..."
        />
        <Textbox
          value={password}
          onChange={text => setPassword(text)}
          generics={{keyboardType: 'visible-password', secureTextEntry: true}}
          label="Password"
          placholder="Enter your password here..."
        />
        <MEButton asLink>Forgot Password</MEButton>
        {/* <TouchableOpacity
          style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              textDecorationStyle: 'solid',
              color: COLOR_SCHEME.GREEN,
              fontWeight: 'bold',
            }}>
            Forgot Password
          </Text>
          <FontAwesomeIcon
            name="long-arrow-right"
            style={{color: COLOR_SCHEME.GREEN, marginLeft: 10}}
          />
        </TouchableOpacity> */}

        <MEButton
          disabled={notReadyToSubmit()}
          loading={loading}
          onPress={() => signUserIn()}>
          LOGIN
        </MEButton>

        <MEButton
          containerStyle={{marginVertical: 5}}
          style={{color: COLOR_SCHEME.ORANGE, fontSize: 16}}
          iconStyle={{color: COLOR_SCHEME.ORANGE}}
          asLink
          onPress={() => navigation.navigate('Register')}
        >
          Haven't joined yet? Join{' '}
          
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
