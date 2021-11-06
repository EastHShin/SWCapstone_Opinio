import { FETCH_DIARIES, FETCH_DIARY } from "../actions/type";


const initialState = {
    diaries:[],
    diary:{},

};

function diaryReducer(state=initialState, action){
    switch (action.type){
        case FETCH_DIARIES :
            return {...state, diaries:action.payload};
        case FETCH_DIARY :
            return {...state, diary:action.payload};
        default:
            return state;
    }

}

export default diaryReducer;