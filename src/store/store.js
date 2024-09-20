import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
// import customerReducer from './reducers/customerReducer';
import staffReducer from './reducers/staffReducer';
import staffRoleReducer from './reducers/staffRoleReducer';

const reducer = combineReducers({
  // customer: customerReducer,
  staff: staffReducer,
  role: staffRoleReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));
export default store;
