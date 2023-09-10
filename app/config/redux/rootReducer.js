// store/reducers/index.js
import {combineReducers} from 'redux';
import {testReducer, universalModalReducer} from './reducers';

const rootReducer = combineReducers({
  test: testReducer,
  modalOptions: universalModalReducer,
});

export default rootReducer;
