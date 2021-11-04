import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';

const rootReducer = combineReducers({ userReducer });

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
