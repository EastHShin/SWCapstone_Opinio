import { ADD_PLANT, DELETE_PLANT, UPDATE_PLANT, GET_PLANT_PROFILE, WATER_PLANT, DIAGNOSIS_PLANT, GET_POINT, GET_EXP, SAVE_DIAGNOSIS_CHART, LEVEL_UP, EARN} from "../actions/type";
let initialState = {
    profile: {},
    diagnosisChart: {},
    point: '',
    exp: '',
    addResult: '',
    deleteResult: '',
    updateResult: '',
    levelUp : false,
    wateringResult: '',
    diagnosisResult: '',
    earn: false,
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
        case LEVEL_UP:
            return {...state, levelUp:action.payload}
        case WATER_PLANT:
            return { ...state, wateringResult: action.payload};
        case DIAGNOSIS_PLANT:
            return { ...state, diagnosisResult: action.payload};
        case SAVE_DIAGNOSIS_CHART:
            return { ...state, diagnosisChart: action.payload};
        case GET_POINT:
            return { ...state, point: action.payload};
        case GET_EXP:
            return { ...state, exp: action.payload};
        case EARN:
            return { ...state, earn: action.payload};
        default:
            return state;
    }
}

export default PlantReducer;