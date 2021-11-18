import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import userReducer from './reducers/userReducer';
import diaryReducer from './reducers/diaryReducer';
import PlantReducer from './reducers/PlantReducer';
import HomeReducer from './reducers/HomeReducer';
import ShopReducer from './reducers/ShopReducer';

const rootReducer = combineReducers({ userReducer, diaryReducer, PlantReducer, HomeReducer, ShopReducer });

const Store = createStore(rootReducer, applyMiddleware(thunk));

export default Store;
