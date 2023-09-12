import {apiCall} from '../../api/functions';
import {firebaseSignOut} from '../firebase';
import {
  ACTIVE_COMMUNITY,
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

export const fetchCommunities = (data, cb) => dispatch => {
  apiCall('communities.list', data)
    .then(response => {
      if (!response.success) return cb && cb(null, response.error);

      dispatch(setCommunitiesAction(response.data));
      cb && cb(response.data);
    })
    .catch(e => {
      cb && cb(null, e?.toString());
      dispatch(setCommunitiesAction({}));
    });
};

export const setActiveCommunityAction = payload => {
  return {type: ACTIVE_COMMUNITY, payload};
};

export const fetchAllCommunityData = (id, cb) => {};
export const signOutAction = () => dispatch => {
  return firebaseSignOut(() => {
    console.log('Yes we just signed out!');
    dispatch({type: SIGN_OUT, payload: null});
  });
};
