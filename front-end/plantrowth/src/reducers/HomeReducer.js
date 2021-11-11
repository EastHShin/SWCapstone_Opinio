import { GET_HOME_INFO } from "../actions/type";
let initialState = {
    plantList: [],
    result: '',
};

function HomeReducer(state=initialState, action){
    switch (action.type){
        case GET_HOME_INFO:
            return {...state, profile: action.payload};
        default:
            return state;
    }
}

export default HomeReducer;