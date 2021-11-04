import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import diaryReducer from './reducers/diaryReducer';

const rootReducer = combineReducers({ userReducer,diaryReducer });

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
