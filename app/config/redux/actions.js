import {apiCall} from '../../api/functions';
import {firebaseSignOut} from '../firebase';
import {
  ACTIVE_COMMUNITY,
  COMMUNITIES,
  SET_ABOUT_US_INFO,
  SET_ACTION_LIST,
  SET_COMMUNITY_INFO,
  SET_COMPLETED_ACTIONS,
  SET_EVENT_LIST,
  SET_FIREBASE_AUTH,
  SET_GRAPHS_DATA,
  SET_HOMEPAGE_INFO,
  SET_TEAMSPAGE_INFO,
  SET_TEAMS_STATS,
  SET_TESTIMONIALS_LIST,
  SET_TESTIMONIALS_PAGE_INFO,
  SET_VENDORS_LIST,
  SET_VENDORS_PAGE_INFO,
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

export const setActionWithValue = (type, payload) => {
  return {type, payload};
};
export const fetchAllCommunityData = (body, cb) => dispatch => {
  Promise.all([
    apiCall('communities.info', body),
    apiCall('actions.list', body),
    apiCall('events.list', body),
    apiCall('vendors.list', body),
    apiCall('testimonials.list', body),
    apiCall('graphs.actions.completed', body),
    apiCall('communities.actions.completed', body),
    apiCall('about_us_page_settings.info', body),
    apiCall('teams.stats', body),
    apiCall('home_page_settings.info', body),
    apiCall('teams_page_settings.info', body),
    apiCall('testimonials_page_settings.info', body),
    apiCall('vendors_page_settings.info', body),
  ])
    .then(response => {
      const [
        communityInfo,
        actions,
        events,
        vendors,
        testimonials,
        graphs,
        completedActions,
        aboutAsPage,
        teamsStats,
        homePageSettings,
        teamsPageSettings,
        testimonialsPageSettings,
        vendorsPageSettings,
      ] = response;

      dispatch(setActionWithValue(SET_COMMUNITY_INFO, communityInfo.data));
      dispatch(setActionWithValue(SET_ACTION_LIST, actions.data));
      dispatch(setActionWithValue(SET_EVENT_LIST, events.data));
      dispatch(setActionWithValue(SET_VENDORS_LIST, vendors.data));
      dispatch(setActionWithValue(SET_TESTIMONIALS_LIST, testimonials.data));
      dispatch(setActionWithValue(SET_GRAPHS_DATA, graphs.data));
      dispatch(
        setActionWithValue(SET_COMPLETED_ACTIONS, completedActions.data),
      );

      dispatch(setActionWithValue(SET_ABOUT_US_INFO, aboutAsPage.data));
      dispatch(setActionWithValue(SET_TEAMS_STATS, teamsStats.data));
      dispatch(setActionWithValue(SET_HOMEPAGE_INFO, homePageSettings.data));
      dispatch(setActionWithValue(SET_TEAMSPAGE_INFO, teamsPageSettings.data));
      dispatch(
        setActionWithValue(
          SET_TESTIMONIALS_PAGE_INFO,
          testimonialsPageSettings.data,
        ),
      );
      dispatch(
        setActionWithValue(SET_VENDORS_PAGE_INFO, vendorsPageSettings.data),
      );
      cb && cb(response);
    })
    .catch(error => {
      console.log('ERROR_LOADING_COMMUNITY_DATA', error);
      cb && cb(null, error?.toString());
    });
};
export const signOutAction = () => dispatch => {
  return firebaseSignOut(() => {
    console.log('Yes we just signed out!');
    dispatch({type: SIGN_OUT, payload: null});
  });
};
