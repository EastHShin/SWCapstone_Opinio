import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import UserReducer from './reducers/UserReducer';
import DiaryReducer from './reducers/DiaryReducer';
import PlantReducer from './reducers/PlantReducer';
import HomeReducer from './reducers/HomeReducer';
import ShopReducer from './reducers/ShopReducer';
import CommunityReducer from './reducers/CommunityReducer';

const rootReducer = combineReducers({ UserReducer, DiaryReducer, PlantReducer, HomeReducer, ShopReducer, CommunityReducer });


const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
