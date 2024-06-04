// store/reducers/index.js
import {combineReducers} from 'redux';
import {
  firebaseAuthReducer,
  reducerForAboutUsPageInfo,
  reducerForActionList,
  reducerForCommunityInfo,
  reducerForCompletedActions,
  reducerForEventsList,
  reducerForGraphData,
  reducerForHomepageInfo,
  reducerForSettingActiveCommunity,
  reducerForSettingCommunties,
  reducerForTeamsStats,
  reducerForTestimonialList,
  reducerForTestimonialsPageInfo,
  reducerForUserCompleted,
  reducerForUserProfile,
  reducerForUserTodo,
  reducerForVendorList,
  reducerForVendorsPageInfo,
  reducerForZipCodeOptions,
  testReducer,
  universalModalReducer,
} from './reducers';

const rootReducer = combineReducers({
  test: testReducer,
  modalOptions: universalModalReducer, 
  user: reducerForUserProfile,// Profile object that we collect from ME Backend... (very different from the firebase objedt)
  fireAuth: firebaseAuthReducer, // the firebaser user object that is returned after every auth
  zipcodeOptions: reducerForZipCodeOptions, // content from the zipcode bottom sheet that users use is sotred here
  communities: reducerForSettingCommunties, // list of communities loaded for community selection page,
  activeCommunity: reducerForSettingActiveCommunity, // Current active community
  communityInfo: reducerForCommunityInfo,
  actions: reducerForActionList,
  events: reducerForEventsList,
  vendors: reducerForVendorList,
  testimonials: reducerForTestimonialList,
  graphData: reducerForGraphData,
  completedActions: reducerForCompletedActions,
  aboutUsPage: reducerForAboutUsPageInfo,
  teamsStats: reducerForTeamsStats,
  homePage: reducerForHomepageInfo,
  vendorsPage: reducerForVendorsPageInfo,
  testimonialsPage: reducerForTestimonialsPageInfo,
  userTodo: reducerForUserTodo,
  userCompleted: reducerForUserCompleted,
});

export default rootReducer;
