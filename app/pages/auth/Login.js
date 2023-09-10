import {View, Text, TouchableOpacity} from 'react-native';
import React, {useEffect} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';

GoogleSignin.configure({
  webClientId:
    '738582671182-6b94m9ot6jq3srhglag94atpjrhnhc7g.apps.googleusercontent.com',
});

const Login = () => {
  useEffect(() => {
    console.log("JUST ENTERED USEEFFECT")
    // Check if the user is already signed in (for auto-login)
    const subscriber = auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        console.log('User is signed in:', user.displayName);
      } else {
        // No user is signed in.
        console.log('No user is signed in');
      }
    });

    return subscriber; // Unsubscribe on unmount
  }, []);
  const signInWithGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      // Create a Firebase credential with the Google Sign-In token
      const googleCredential = auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );

      // Sign-in to Firebase with the Google credential
      await auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.error('Google Sign-In Error:', error);
    }
  };
  return (
    <View
      style={{
        height: '100%',
        // backgroundColor: 'green',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <TouchableOpacity
        onPress={() => signInWithGoogle()}
        style={{
          padding: 15,
          backgroundColor: 'red',
        }}>
        <Text style={{textAlign: 'center', color: 'white', fontWeight: 'bold'}}>
          LOG ME IN
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => {
  return bindActionCreators({}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
