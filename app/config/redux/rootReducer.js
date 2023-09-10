// store/reducers/index.js
import {combineReducers} from 'redux';
import {
  firebaseAuthReducer,
  testReducer,
  universalModalReducer,
} from './reducers';

const rootReducer = combineReducers({
  test: testReducer,
  modalOptions: universalModalReducer,
  fireAuth: firebaseAuthReducer,
});

export default rootReducer;
