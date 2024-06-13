/******************************************************************************
 *                            firebase
 * 
 *      This page contains all the functions that interact with Firebase Auth.
 * 
 *      Written by: William Soylemez
 *      Last edited: June 5, 2023
 * 
 *****************************************************************************/

import auth from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import store from '../redux/store';
import { apiCall } from '../../api/functions';

/**
 * Checks if the user is authenticated and calls the callback function with the result.
 * @param {CallableFunction} cb - Callback function to be called with authentication status and user data if authenticated.
 * @returns {Function} - Subscriber function to unsubscribe from the auth state listener.
 */
export const isUserAuthenticated = cb => {
  const subscriber = auth().onAuthStateChanged(user => {
    if (user) cb && cb(true, user);
    else cb && cb(false, null);
  });
  return subscriber; 
};

/**
 * Registers a new user with email and password, sends a verification email, and calls the callback function.
 * @param {string} email - The email address of the new user.
 * @param {string} password - The password for the new user.
 * @param {CallableFunction} cb - Callback function to be called after registration or if there is an error.
 */
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
 * @param {Object} profile - User profile object containing details such as full_name, preferred_name, email, etc.
 * @param {CallableFunction} callBackFn - Callback function to be called after the user profile is created or if there is an error.
 */
export const createUserProfile = (profile, callBackFn = null) => {
  apiCall("users.create", profile)
    .then(async (response) => {
      if (response?.success && response?.data) {
        if (callBackFn) callBackFn(response, null);
      } else {
        console.error("Error creating user profile: ", response?.error);
      }
    })
    .catch((error) => {
      if (callBackFn) callBackFn(null, error?.toString());
    });
};

/**
 * Authenticates a user with email and password and calls the callback function with the response.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {CallableFunction} cb - Callback function to be called after authentication or if there is an error.
 */
export const authenticateWithEmailAndPassword = (email, password, cb) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then(response => cb && cb(response))
    .catch(e => cb && cb(null, e?.toString()));
};

/**
 * Sends a sign-in link to the specified email address for email-only authentication.
 * @param {string} email - The email address to send the sign-in link to.
 * @param {CallableFunction} cb - Callback function to be called after sending the link or if there is an error.
 */
export const authenticateWithEmailOnly = (email, cb) => {
  const actionCodeSettings = {
    handleCodeInApp: true,
    url: 'https://massenergize.org/'
  }

  auth()
    .sendSignInLinkToEmail(email, actionCodeSettings)
    .then(response => cb && cb(response))
    .catch(e => cb && cb(null, e?.message));
};

/**
 * Authenticates a user with Google Sign-In and calls the callback function with the response.
 * @param {CallableFunction} cb - Callback function to be called after authentication or if there is an error.
 */
export const authenticateWithGmail = async cb => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(
      userInfo.idToken,
    );
    const response = await auth().signInWithCredential(googleCredential);
    cb && cb(response);
  } catch (error) {
    console.error('GOOGLE_SIGN_IN_ERROR:', error);
    cb && cb(null, error?.toString());
  }
};

/**
 * Signs out the current user and calls the callback function after signing out.
 * @param {CallableFunction} cb - Callback function to be called after signing out.
 */
export const firebaseSignOut = cb => {
  if (!auth().currentUser) {
    cb && cb();
    return;
  }
  auth().signOut().then(cb);
};

/**
 * Re-authenticates the current user with email and password.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise} - A promise that resolves after re-authentication.
 */
export const reauthnticateWithEmail = (email, password) => {
  const credential = auth.EmailAuthProvider.credential(email, password);
  return auth().currentUser.reauthenticateWithCredential(credential);
};

/**
 * Re-authenticates the current user with Google Sign-In.
 * @returns {Promise} - A promise that resolves after re-authentication.
 */
export const reauthenticateWithGoogle = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  const credential = auth.GoogleAuthProvider.credential(userInfo.idToken);

  return auth().currentUser.reauthenticateWithCredential(credential);
};
