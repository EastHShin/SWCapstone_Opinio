import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import UserReducer from './reducers/UserReducer';
import DiaryReducer from './reducers/DiaryReducer';
import PlantReducer from './reducers/PlantReducer';
import HomeReducer from './reducers/HomeReducer';
import ShopReducer from './reducers/ShopReducer';

const rootReducer = combineReducers({ userReducer, diaryReducer, PlantReducer, HomeReducer, ShopReducer });


const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
