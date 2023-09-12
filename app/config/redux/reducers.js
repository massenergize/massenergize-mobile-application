import {LOADING} from '../../utils/values';
import {
  COMMUNITIES,
  SET_FIREBASE_AUTH,
  TOGGLE_UNIVERSAL_MODAL,
  ZIP_CODE_OPTIONS,
} from './types';

const DEFAULTS = {
  ZIPCODES: {zipcode: '01778', miles: 10},
};
export const testReducer = (state = {name: 'Just A Test!'}, action) => {
  if (action?.type === 'TEST') return action.payload;
  return state;
};

export const universalModalReducer = (state = {isVisible: false}, action) => {
  if (action?.type === TOGGLE_UNIVERSAL_MODAL) return action.payload;
  return state;
};
export const firebaseAuthReducer = (state = {isVisible: false}, action) => {
  if (action?.type === SET_FIREBASE_AUTH) return action.payload;
  return state;
};
export const reducerForZipCodeOptions = (state = DEFAULTS.ZIPCODES, action) => {
  if (action?.type === ZIP_CODE_OPTIONS) return action.payload;
  return state;
};
export const reducerForSettingCommunties = (state = LOADING, action) => {
  if (action?.type === COMMUNITIES) return action.payload;
  return state;
};
export const reducerForSettingActiveCommunity = (state = null, action) => {
  if (action?.type === COMMUNITIES) return action.payload;
  return state;
};
