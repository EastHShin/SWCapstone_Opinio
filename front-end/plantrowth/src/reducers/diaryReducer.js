import { RESULT_STATE, FETCH_DIARIES, FETCH_DIARY, SAVE_DIARY, EDIT_DIARY ,DELETE_DIARY } from "../actions/type";

const initialState = {
    diaries:[],
    diary:{},
    result:'',
};

function DiaryReducer(state=initialState, action){
    switch (action.type){
        case RESULT_STATE : 
            return {...state, result:action.payload};
        case FETCH_DIARIES :
            return {...state, diaries:action.payload.reverse()};
        case FETCH_DIARY :
            return {...state, diary:action.payload};
        case SAVE_DIARY :
            return {...state, result:action.payload};
        case EDIT_DIARY :
            return {...state, result:action.payload};
        case DELETE_DIARY :
            return {...state, result:action.payload}
        default:
            return state;
    }

}

export default DiaryReducer;