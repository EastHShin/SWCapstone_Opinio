import {REGISTER_USER,LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK,LOGOUT_USER} from "../actions/type";

const initialState = {
    kakaoRegisterState:'',
    isLogin:'',
    registerState:'',
    registerText:''
};

function userReducer(state=initialState, action){
    switch (action.type){
        case REGISTER_USER :
            return {...state, registerState:action.payload};
        case LOGIN_USER:
            return { ...state, isLogin:action.payload};
        case KAKAO_REGISTER:
            return {...state, kakaoRegisterState:action.payload};
        case KAKAO_UNLINK:
            return state;
        case LOGOUT_USER:
            return { ...state, isLogin:action.payload};
        default:
            return state;
    }

}

export default userReducer;