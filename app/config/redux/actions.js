import {firebaseSignOut} from '../firebase';
import {SET_FIREBASE_AUTH, SIGN_OUT, TOGGLE_UNIVERSAL_MODAL} from './types';

export const test = () => ({type: 'TEST', payload: {value: 'Ankara messi!'}});

export const toggleUniversalModalAction = payload => {
  return {type: TOGGLE_UNIVERSAL_MODAL, payload};
};
export const setFirebaseAuthenticationAction = payload => {
  return {type: SET_FIREBASE_AUTH, payload};
};
export const signOutAction = () => dispatch => {
  return firebaseSignOut(() => {
    console.log('Yes we just signed out!');
    dispatch({type: SIGN_OUT, payload: null});
  });
};
