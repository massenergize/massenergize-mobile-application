import {SET_FIREBASE_AUTH, TOGGLE_UNIVERSAL_MODAL} from './types';

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
