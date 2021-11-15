import { REGISTER_USER, LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK, LOGOUT_USER } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import axios from "axios";
//email, 닉네임 존재여부 서버에서 message로 받아서 
//실패 시 해당 text 뜨도록 
let timer;

const clearLogoutTimer = () => {
    if (timer) {
   
        clearTimeout(timer);
    }
};

const setLogoutTimer = (expirationTime) => dispatch=> {
       
        timer = setTimeout(() => {
            dispatch(logoutUser());
        }, expirationTime);
};


export const registerUser = (user) => {

    return async dispatch => {
        return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/join', user, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: REGISTER_USER,
                        payload: "success",
                    })
                }
                else {
                    dispatch({
                        type: REGISTER_USER,
                        payload: "failure",
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
                //에러 메시지 어떻게 오는지 확인
            })
    }
}

export const setRegisterState = state => dispatch => {
    dispatch({
        type: REGISTER_USER,
        payload: state
    })
}

export const loginUser = (user) => {

    return async dispatch => {
        return await axios.post("http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/login", user, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch(setLogoutTimer(6000000));
                    AsyncStorage.setItem('userId',JSON.stringify(res.data.data));
                    // axios.defaults.headers.common['Authorization'] = `Bearer ${res.headers.get('x-auth-token')}`;
                    //위에 두개는 서버에서 넘겨주면 코드 수정 
                    //헤더로 잘 넘어오는지 체크하기
                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
                    });

                }
                else {
                    dispatch({
                        type: LOGIN_USER,
                        payload: "failure"
                    });
                }
            })
            .catch(function (error) {
                dispatch({
                    type:LOGIN_USER,
                    payload: "failure"
                })
                console.log(error);
                
            })
    }
};

export const kakaoLogin = (data) => {

    return async dispatch => {
        return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/kakao', data,
            {
                headers: { "Content-Type": `application/json` }
            })
            .then(function (res) {

                if (res.status == 200) {
                
                    // axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                    // AsyncStorage.setItem('accessToken', res.data.accessToken);
                    AsyncStorage.setItem('userId', JSON.stringify(res.data.data));
                    AsyncStorage.setItem('kakaoLogin', 'yes');

                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
                    });
                }
                else {
                    dispatch({
                        type: KAKAO_REGISTER,
                        payload: 'loading',
                    });
                }
            }).catch(function (err) {
                dispatch({
                    type: KAKAO_REGISTER,
                    payload: 'loading',
                });
            })
    }

}

export const kakaoRegister = (register) => dispatch => {

        dispatch({
            type: KAKAO_REGISTER,
            payload: register,
        });

}



export const logoutUser = (email) => {


    return async dispatch => {
        return await axios.post('https://74082338-1633-4d47-ae4e-cdf8a285f9f2.mock.pstmn.io/logout', email, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    axios.defaults.headers.common['Authorization'] = undefined
                    AsyncStorage.getItem('kakaoLogin').then((value) => {
                        clearLogoutTimer();
                        AsyncStorage.clear();
                        dispatch({
                            type: LOGOUT_USER,
                            payload: 'end',
                        });

                        if (value) {
                            KakaoLogins.logout().then(result => {
                                console.log(result);

                            })
                        }
                    });
                }
            }).catch(function (err) {
                console.log(err);
            })
    }

};


export const kakaoUnlink = () => dispatch => {
    try {
        AsyncStorage.clear();
        KakaoLogins.unlink().then(result => {
            if (result) {
                dispatch({
                    type: KAKAO_UNLINK,
                    payload: '',
                })
            }
        })

    } catch (error) {
        console.log(error);
    }

};










