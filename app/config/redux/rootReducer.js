// store/reducers/index.js
import {combineReducers} from 'redux';
import {
  firebaseAuthReducer,
  reducerForSettingActiveCommunity,
  reducerForSettingCommunties,
  reducerForZipCodeOptions,
  testReducer,
  universalModalReducer,
} from './reducers';

const rootReducer = combineReducers({
  test: testReducer,
  modalOptions: universalModalReducer, //
  fireAuth: firebaseAuthReducer, // the firebaser user object that is returned after every auth
  zipcodeOptions: reducerForZipCodeOptions, // content from the zipcode bottom sheet that users use is sotred here
  communities: reducerForSettingCommunties, // list of communities loaded for community selection page,
  activeCommunity: reducerForSettingActiveCommunity, // Current active community
});

export default rootReducer;
