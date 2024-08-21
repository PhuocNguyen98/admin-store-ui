import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import customerReducer from './reducers/customerReducer';

const reducer = combineReducers({
  customer: customerReducer,
});

const store = createStore(reducer, applyMiddleware(thunk));
export default store;
