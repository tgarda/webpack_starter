
import { createStore, applyMiddleware, combineReducers } from 'redux';
import logger from 'redux-logger';
//import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';
import usersReducer from './reducers/users';
import userProfile from './reducers/userProfile';


//const store = createStore(userReducer, applyMiddleware(logger, thunk));
export default createStore(
  combineReducers({
    usersReducer,
    userProfile
  }),
  applyMiddleware(
    logger,
    promise()
  )
);
