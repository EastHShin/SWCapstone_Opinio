import { REGISTER_USER, LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK,LOGOUT_USER } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KakaoLogins from "@react-native-seoul/kakao-login";

export function registerUser(user) {

    const req = fetch('http://localhost:8080/api/auth/join', {
        method: 'POST',
        body: user,
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());
    return { type: REGISTER_USER, payload: req }

}

export const loginUser = (user) => {
    return async dispatch => {
        return await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            body: user,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(data => {
                if (data.accessToken) {
                    AsyncStorage.setItem('accessToken', data.accessToken);
                    AsyncStorage.setItem('userEmail',user.email);
                    
                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
                    });
                }
                else{
                    dispatch({
                        type: LOGIN_USER,
                        payload: "failure"
                    });
                }
                
            }).catch(err => {
                console.log(err);
            })

    }
};

export const kakaoLogin = (email) => {
    return async dispatch => {
        return await fetch('http://localhost:8080/api/auth/kakao', {
            method: 'POST',
            body:email,
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .then(data => {
                if (data.accessToken) {
                    AsyncStorage.setItem('accessToken', data.accessToken);
                    AsyncStorage.setItem('kakaoLogin', 'yes');
                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
                    }); 
                }
                  else{
                    dispatch({
                        type: KAKAO_REGISTER,
                        payload : 'loading',
                    });
                  } 
            }).catch(err => {
                console.log(err);
            })
    }
}


export const kakaoRegister = register => dispatch =>{

    if(register=='success'){
        dispatch(kakaoLogin(AsyncStorage.getItem('userEmail')));
    }
    dispatch({
        type: KAKAO_REGISTER,
        payload : register,
    });
}

export const logoutUser = () => dispatch => {
    //서버 post 요청 필요
    AsyncStorage.getItem('kakaoLogin').then((value)=>{
           if(value){
               KakaoLogins.logout().then(result=>{
                    console.log(result);
               })   
           }
    });

    AsyncStorage.clear();
    
    dispatch({
        type: LOGOUT_USER,
        payload: '',
    });
};

export const kakaoUnlink = () => dispatch => {
    try {
        AsyncStorage.clear();
        KakaoLogins.unlink().then(result =>{
            if(result){
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










