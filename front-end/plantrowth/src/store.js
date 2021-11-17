import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import UserReducer from './reducers/UserReducer';
import DiaryReducer from './reducers/DiaryReducer';
import PlantReducer from './reducers/PlantReducer';
import HomeReducer from './reducers/HomeReducer';

const rootReducer = combineReducers({ UserReducer, DiaryReducer, PlantReducer, HomeReducer });

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
