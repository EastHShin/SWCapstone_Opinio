import { RESULT_STATE, FETCH_DIARIES, FETCH_DIARY, SAVE_DIARY, EDIT_DIARY ,DELETE_DIARY, GET_POINT, GET_EXP } from "../actions/type";

const initialState = {
    diaries:[],
    diary:{},
    result:'',
    point: '',
    exp: '',
};


function diaryReducer(state=initialState, action){
    switch (action.type){
        case RESULT_STATE : 
            return {...state, result:action.payload};
        case FETCH_DIARIES :
            return {...state, diaries:action.payload};
        case FETCH_DIARY :
            return {...state, diary:action.payload};
        case SAVE_DIARY :
            return {...state, result:action.payload};
        case EDIT_DIARY :
            return {...state, result:action.payload};
        case DELETE_DIARY :
            return {...state, result:action.payload};
        case GET_POINT: 
            return {...state, point: action.payload};
        case GET_EXP:
            return {...state, exp: action.payload};
        default:
            return state;
    }

}

export default diaryReducer;