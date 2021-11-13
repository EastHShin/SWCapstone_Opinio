import { GET_HOME_INFO } from "../actions/type";
import { logoutUser } from './src/actions/userActions';
let initialState = {
    infoList: {},
    getHomeInfoResult: '',
};


function HomeReducer(state=initialState, action){
    switch (action.type){
        case GET_HOME_INFO:
            return {...state, infoList : action.payload};
        default:
            return state;
    }
}

export default HomeReducer;