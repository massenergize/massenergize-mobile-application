 /******************************************************************************
 *                            Store (redux)
 * 
 *      This file sets up the redux store.
 * 
 *      Written by: Frimpong Opoku-Agyemang
 *      Last edited: June 11, 2023
 * 
 *****************************************************************************/
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
