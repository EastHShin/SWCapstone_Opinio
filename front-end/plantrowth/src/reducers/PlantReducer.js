import { ADD_PLANT, GET_PLANT_LIST, GET_PLANT_PROFILE } from "../actions/type";
let initialState = {
    plantList: [],
    profile: {},
    result: '',
};

function PlantReducer(state=initialState, action){
    switch (action.type){
        case GET_PLANT_LIST:
            return {...state, plantList: action.payload};
        case GET_PLANT_PROFILE:
            return {...state, profile: action.payload};
        case ADD_PLANT:
            return {...state, result: action.payload};
        default:
            return state;
    }
}

export default PlantReducer;