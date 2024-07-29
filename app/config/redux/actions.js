/******************************************************************************
 *                            Actions (redux)
 * 
 *      This file contains all the actions that are used in the redux store.
 * 
 *      Written by: William Soylemez and Frimpong Opoku-Agyemang
 *      Last edited: June 11, 2023
 * 
 *****************************************************************************/

import {apiCall} from '../../api/functions';
import {showError} from '../../utils/common';
import {firebaseSignOut} from '../firebase';
import store from './store';
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
  SET_ME_USER_COMPLETED,
  SET_ME_USER_PROFILE,
  SET_ME_USER_TODO,
  SET_QUESTIONNAIRE_INFO,
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
import auth from '@react-native-firebase/auth';
import { setUserActionsCompleted, setUserPropertiesFromUser } from '../../api/analytics';

/* Test action */
export const test = () => ({type: 'TEST', payload: {value: 'Ankara messi!'}});

/* Basic actions */
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
export const setActiveCommunityAction = payload => {
  return {type: ACTIVE_COMMUNITY, payload};
};
export const setUserProfile = payload => {
  return {type: SET_ME_USER_PROFILE, payload};
};
export const setQuestionnaireInfo = payload => {
  return {type: SET_QUESTIONNAIRE_INFO, payload};
};
export const setActionWithValue = (type, payload) => {
  return {type, payload};
};

/* Actions that don't require API calls */
export const removeTestimonialAction = (testimonial_id) => (dispatch, getState) => {
  const state = getState(); // Access the current state
  const updatedTestimonials = state.testimonials.filter(
    testimonial => testimonial.id !== testimonial_id
  );
  dispatch(
    setActionWithValue(
      SET_TESTIMONIALS_LIST,
      updatedTestimonials
    )
  );
};


/* Actions with API calls */

/* Fetches the user profile from the backend and sets it in the redux store */
export const fetchUserProfile = (idToken, cb) => dispatch => {
  const body = {idToken};
  apiCall('auth.login', body)
    .then(response => {
      console.log('ME USER LOADED IN!');
      if (!response.success) {
        console.warn('ERROR_FETCHING_USER_PROFILE', response.error);
        cb && cb(null, response.error);
        return;
      }
      
      /* Update analytics profile */
      setUserPropertiesFromUser(response.data);

      cb && cb(response.data);
      dispatch(setUserProfile(response.data));
    })
    .catch(err => {
      const error = err?.toString();
      cb && cb(null, error);
      console.error('ERROR_FETCHING_USER_PROFILE', error);
      // showError("Error fetching user profile!");
    });
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

/* Fetches all the data for a community */
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
        aboutUsPage,
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

      dispatch(setActionWithValue(SET_ABOUT_US_INFO, aboutUsPage.data));
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

/* Signs out the user and removes information from redux */
export const signOutAction = () => dispatch => {
  return firebaseSignOut(() => {
    apiCall('auth.logout')
      .then(response => {
        console.log('USER_SIGNED_OUT');
        dispatch({type: SET_FIREBASE_AUTH, payload: null});
        dispatch({type: SET_ME_USER_PROFILE, payload: null});
      })
      .catch(error => {
        console.error('ERROR_SIGNING_OUT', error);
      });
  });
};

/* Fetches all the information for the user (profile, todo, and completed lists) */
export const fetchAllUserInfo = cb => dispatch => {
  Promise.all([
    apiCall('users.info'),
    apiCall('users.actions.todo.list'),
    apiCall('users.actions.completed.list'),
  ])
    .then(response => {
      const [profile, todo, completed] = response;
      
      /* Update analytics profile */
      setUserPropertiesFromUser(profile.data);
      setUserActionsCompleted(completed.data);

      dispatch(setActionWithValue(SET_ME_USER_PROFILE, profile.data));
      dispatch(setActionWithValue(SET_ME_USER_TODO, todo.data));
      dispatch(setActionWithValue(SET_ME_USER_COMPLETED, completed.data));
      cb && cb(response);
    })
    .catch(error => {
      console.error('ERROR_FETCHING_USER_INFO', error);
      cb && cb(null, error?.toString());
    });
}

/* Deletes a user from the database */
export const deleteUserAction = (user_id, cb) => dispatch => {
  auth().currentUser.delete();
  apiCall('users.delete', {user_id})
    .then(response => {
      if (!response.success) {
        cb && cb(null, response.error);
        return;
      }
      dispatch(signOutAction());
      console.log('USER_DELETED');
      cb && cb(response.data);
    })
    .catch(error => {
      console.error('ERROR_DELETING_USER', error);
      cb && cb(null, error?.toString());
    });
}

/* Updates the user's profile in the backend and in the redux store */
export const updateUserAction = (endpoint, body, callback) => {
  apiCall(endpoint, body) // update the user in the backend
    .then(response => {
      if (!response.success) {
        callback && callback(null, response.error);
        return;
      }
      store.dispatch(fetchAllUserInfo(
        () => callback && callback(response.data)
      )); // update the user in the redux store
    });
}