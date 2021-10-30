import {REGISTER_USER} from "../actions/type";

const initialState = {
   
};

function userReducer(state=initialState, action){
        switch (action.type){
            case REGISTER_USER :
                return state;
            default:
                return state;
        }

}

export default userReducer;