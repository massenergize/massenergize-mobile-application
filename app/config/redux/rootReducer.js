// store/reducers/index.js
import {combineReducers} from 'redux';
import {
  firebaseAuthReducer,
  reducerForSettingCommunties,
  reducerForZipCodeOptions,
  testReducer,
  universalModalReducer,
} from './reducers';

const rootReducer = combineReducers({
  test: testReducer,
  modalOptions: universalModalReducer,
  fireAuth: firebaseAuthReducer,
  zipcodeOptions: reducerForZipCodeOptions,
  communities: reducerForSettingCommunties,
});

export default rootReducer;
