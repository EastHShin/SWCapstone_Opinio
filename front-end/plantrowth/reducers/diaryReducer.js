import { FETCH_DIARIES } from "../actions/type";


const initialState = {
    diaries:[],
    diary:{},

};


function diaryReducer(state=initialState, action){
    switch (action.type){
        case FETCH_DIARIES :
            return {...state, diaries:action.payload};
        default:
            return state;
    }

}

export default diaryReducer;