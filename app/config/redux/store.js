// store/index.js
import {createStore, applyMiddleware, compose} from 'redux';
import rootReducer from './rootReducer';
import thunk from 'redux-thunk';

const logger = store => next => action => {
  console.log('all state keys:', Object.keys(store.getState()));
  return result;
};

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk),
    // applyMiddleware(logger)
  ),
);

export default store;
