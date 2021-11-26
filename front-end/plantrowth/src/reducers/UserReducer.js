import { REGISTER_USER, LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK, LOGOUT_USER, CODE_VERIFICATION, SEND_EMAIL, USER_DELETE, USER_EDIT, USER_INFO, DIAGNOSIS_LIST, FIND_PASSWORD, CHECK_PASSWORD, CHECK_NICKNAME } from "../actions/type";

const initialState = {
    kakaoRegisterState: '',
    isLogin: '',
    registerState: '',
    registerText: '',
    emailTrans: '',
    codeVerificationState: '',
    userDeleteState: '',
    userInfoState: '',
    userEditState: '',
    userInfo: {},
    diagnosisList: [],
    findPasswordState: '',
    checkPasswordState: '',
    checkNicknameState: ''
};

function UserReducer(state = initialState, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, registerState: action.payload, registerText: action.text };
        case LOGIN_USER:
            return { ...state, isLogin: action.payload };
        case KAKAO_REGISTER:
            return { ...state, kakaoRegisterState: action.payload };
        case KAKAO_UNLINK:
            return state;
        case LOGOUT_USER:
            return { ...state, isLogin: action.payload };
        case SEND_EMAIL:
            return { ...state, emailTrans: action.payload };
        case CODE_VERIFICATION:
            return { ...state, codeVerificationState: action.payload };
        case USER_INFO:
            return { ...state, userInfoState: action.payload, userInfo: action.data };
        case USER_EDIT:
            return { ...state, userEditState: action.payload };
        case USER_DELETE:
            return { ...state, userDeleteState: action.payload };
        case DIAGNOSIS_LIST:
            return { ...state, diagnosisList: action.payload };
        case FIND_PASSWORD:
            return { ...state, findPasswordState: action.payload };
        case CHECK_PASSWORD:
            return { ...state, checkPasswordState: action.payload };
        case CHECK_NICKNAME:
            return { ...state, checkNicknameState: action.payload };
        default:
            return state;
    }

}

export default UserReducer;