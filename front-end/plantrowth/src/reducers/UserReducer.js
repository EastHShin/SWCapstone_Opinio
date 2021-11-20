import {REGISTER_USER,LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK,LOGOUT_USER, CODE_VERIFICATION, SEND_EMAIL,USER_DELETE} from "../actions/type";

const initialState = {
    kakaoRegisterState:'',
    isLogin:'',
    registerState:'',
    registerText:'',
    emailTrans:'',
    codeVerificationState:'',
    userDeleteState:''
};

function UserReducer(state=initialState, action){
    switch (action.type){
        case REGISTER_USER :
            return {...state, registerState:action.payload, registerText:action.text};
        case LOGIN_USER:
            return { ...state, isLogin:action.payload};
        case KAKAO_REGISTER:
            return {...state, kakaoRegisterState:action.payload};
        case KAKAO_UNLINK:
            return state;
        case LOGOUT_USER:
            return { ...state, isLogin:action.payload};
        case SEND_EMAIL:
            return { ...state, emailTrans: action.payload };
        case CODE_VERIFICATION:
            return { ...state, codeVerificationState: action.payload };
        case USER_DELETE:
            return {...state, userDeleteState: action.payload};
        default:
            return state;
    }

}

export default UserReducer;