/******************************************************************************
 *                            Reducers (redux)
 * 
 *      This file contains all the reducers that are used in the redux store.
 * 
 *      Written by: Frimpong Opoku-Agyemang
 *      Last edited: June 11, 2023
 * 
 *****************************************************************************/

import {LOADING} from '../../utils/values';
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
  SET_TEAMS_STATS,
  SET_TESTIMONIALS_LIST,
  SET_TESTIMONIALS_PAGE_INFO,
  SET_VENDORS_LIST,
  SET_VENDORS_PAGE_INFO,
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

export const reducerForUserProfile = (state = null, action) => {
  if (action?.type === SET_ME_USER_PROFILE) return action.payload;
  return state;
};
export const universalModalReducer = (state = {isVisible: false}, action) => {
  if (action?.type === TOGGLE_UNIVERSAL_MODAL) return action.payload;
  return state;
};
export const firebaseAuthReducer = (state = null, action) => {
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
  if (action?.type === ACTIVE_COMMUNITY) return action.payload;
  return state;
};
export const reducerForCommunityInfo = (state = null, action) => {
  if (action?.type === SET_COMMUNITY_INFO) return action.payload;
  return state;
};
export const reducerForActionList = (state = null, action) => {
  if (action?.type === SET_ACTION_LIST) return action.payload;
  return state;
};
export const reducerForEventsList = (state = null, action) => {
  if (action?.type === SET_EVENT_LIST) return action.payload;
  return state;
};
export const reducerForVendorList = (state = null, action) => {
  if (action?.type === SET_VENDORS_LIST) return action.payload;
  return state;
};
export const reducerForTestimonialList = (state = null, action) => {
  if (action?.type === SET_TESTIMONIALS_LIST) return action.payload;
  return state;
};
export const reducerForGraphData = (state = null, action) => {
  if (action?.type === SET_GRAPHS_DATA) return action.payload;
  return state;
};
export const reducerForCompletedActions = (state = null, action) => {
  if (action?.type === SET_COMPLETED_ACTIONS) return action.payload;
  return state;
};
export const reducerForAboutUsPageInfo = (state = null, action) => {
  if (action?.type === SET_ABOUT_US_INFO) return action.payload;
  return state;
};
export const reducerForTeamsStats = (state = null, action) => {
  if (action?.type === SET_TEAMS_STATS) return action.payload;
  return state;
};
export const reducerForHomepageInfo = (state = null, action) => {
  if (action?.type === SET_HOMEPAGE_INFO) return action.payload;
  return state;
};
export const reducerForVendorsPageInfo = (state = null, action) => {
  if (action?.type === SET_VENDORS_PAGE_INFO) return action.payload;
  return state;
};
export const reducerForTestimonialsPageInfo = (state = null, action) => {
  if (action?.type === SET_TESTIMONIALS_PAGE_INFO) return action.payload;
  return state;
};
export const reducerForUserTodo = (state = null, action) => {
  if (action?.type === SET_ME_USER_TODO) return action.payload;
  return state;
}
export const reducerForUserCompleted = (state = null, action) => {
  if (action?.type === SET_ME_USER_COMPLETED) return action.payload;
  return state;
}