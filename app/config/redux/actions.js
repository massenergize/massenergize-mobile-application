import {firebaseSignOut} from '../firebase';
import {
  COMMUNITIES,
  SET_FIREBASE_AUTH,
  SIGN_OUT,
  TOGGLE_UNIVERSAL_MODAL,
  ZIP_CODE_OPTIONS,
} from './types';

export const test = () => ({type: 'TEST', payload: {value: 'Ankara messi!'}});

export const toggleUniversalModalAction = payload => {
  return {type: TOGGLE_UNIVERSAL_MODAL, payload};
};
export const setFirebaseAuthenticationAction = payload => {
  return {type: SET_FIREBASE_AUTH, payload};
};
export const setZipCodeOptions = payload => {
  return {type: ZIP_CODE_OPTIONS, payload};
};
export const setCommunitiesAction = payload => {
  return {type: COMMUNITIES, payload};
};
export const signOutAction = () => dispatch => {
  return firebaseSignOut(() => {
    console.log('Yes we just signed out!');
    dispatch({type: SIGN_OUT, payload: null});
  });
};
