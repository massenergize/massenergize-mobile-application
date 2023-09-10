import {TOGGLE_UNIVERSAL_MODAL} from './types';

export const test = () => ({type: 'TEST', payload: {value: 'Ankara messi!'}});

export const toggleUniversalModalAction = payload => {
  return {type: TOGGLE_UNIVERSAL_MODAL, payload};
};
