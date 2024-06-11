import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import store from '../redux/store';
import { apiCall } from '../../api/functions';

export const isUserAuthenticated = cb => {
  const subscriber = auth().onAuthStateChanged(user => {
    if (user) cb && cb(true, user);
    else cb && cb(false, null);
  });
  return subscriber; 
};

export const registerWithEmailAndPassword = (email, password, cb) => {
  auth()
    .createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      const user = userCredential.user;
      return user.sendEmailVerification();
    })
    .then(() => {
      cb && cb(null);
    })
    .catch(e => cb && cb(e?.toString()));
};

/**
   * Creates a user profile in the backend and calls the callback function with the response.
   * @param {Object} profile {full_name, preferred_name, email, location, is_vendor, accepts_terms_and_conditions, subdomain, color}
   * @param {CallableFunction} callBackFn callback function to be called after the user is created or if there is an error.
   */
export const createUserProfile = (profile, callBackFn = null) => {
  apiCall("users.create", profile)
    .then(async (response) => {
      if (response?.success && response?.data) {
        // TODO: figure out what to do with the response
        // handleSignIn();
        // navigation.navigate("dashboard", { userEmail: userEmail, userName: userName });
        
        if (callBackFn) callBackFn(response, null);
      } else {
        console.log("Error creating user profile: ", response?.error);
      }
    })
    .catch((error) => {
      if (callBackFn) callBackFn(null, error?.toString());
    });
};

export const authenticateWithEmailAndPassword = (email, password, cb) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => cb && cb(response))
    .catch(e => cb && cb(null, e?.toString()));
};

export const authenticateWithEmailOnly = (email, cb) => {
  const actionCodeSettings = {
    handleCodeInApp: true,
    url: 'https://massenergize.org/'
  }

  auth()
    .sendSignInLinkToEmail(email, actionCodeSettings)
    .then(response => cb && cb(response))
    .catch(e => cb && cb(null, e?.message));
}

export const authenticateWithGmail = async cb => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    const response = await auth().signInWithCredential(googleCredential);
    // setFireAuth(response?.user);
    cb && cb(response);
  } catch (error) {
    console.error('GOOGLE_SIGN_IN_ERROR:', error);
    cb && cb(null, error?.toString());
  }
};

export const firebaseSignOut = cb => {
  if (!auth().currentUser) {
    cb && cb();
    return;
  }
  auth().signOut().then(cb);
};
