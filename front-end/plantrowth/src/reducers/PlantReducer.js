import { ADD_PLANT, DELETE_PLANT, UPDATE_PLANT, GET_PLANT_PROFILE } from "../actions/type";
let initialState = {
    profile: {},
    addResult: '',
    deleteResult: '',
    updateResult: '',
};

function PlantReducer(state = initialState, action) {
    switch (action.type) {
        case GET_PLANT_PROFILE:
            return { ...state, profile: action.payload };
        case ADD_PLANT:
            return { ...state, addResult: action.payload };
        case DELETE_PLANT:
            return { ...state, deleteResult: action.payload };
        case UPDATE_PLANT:
            return { ...state, updateResult: action.payload };
        default:
            return state;
    }
}

export default PlantReducer;