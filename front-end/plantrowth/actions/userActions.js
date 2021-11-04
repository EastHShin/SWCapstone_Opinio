import { REGISTER_USER, LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK,LOGOUT_USER } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import axios from "axios";

export const registerUser = (user) =>  {

    return async dispatch =>{
        return await axios.post('https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/join',user)
        .then(function(res){
            dispatch({
                type:REGISTER_USER,
                payload:res.data.message,
            })})
            .catch(function (error){
                console.log(error);
            })
        }
}

export const setRegisterState = state => dispatch=>{
    dispatch({
        type:REGISTER_USER,
        payload:state
    })
}

export const loginUser = (user) => {

    return async dispatch =>{
        return await axios.post("https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/login",user)
        .then(function(res){
            if(res.data.accessToken){
                AsyncStorage.setItem('accessToken', res.data.accessToken);
                AsyncStorage.setItem('userId', res.data.user_id);
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
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
        })
        .catch(function(err){
            console.log(err);
        })
    }
};

export const kakaoLogin = (email) => {

    return async dispatch => {
        return await axios.post('https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/kakao',email)
        .then(function(res){
            if (res.data.accessToken) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.accessToken}`;
                AsyncStorage.setItem('accessToken', res.data.accessToken);
                AsyncStorage.setItem('userId', res.data.user_id);
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
        }).catch(function(err){
            console.log(err);
        })
    }
   
}

export const kakaoRegister = register => dispatch =>{

    if(register=='success'){
        AsyncStorage.getItem('userEmail').then(value=>{
            dispatch(kakaoLogin(value));
            dispatch({
                type: KAKAO_REGISTER,
                payload : register,
            });
        });
    }
    else{
    dispatch({
        type: KAKAO_REGISTER,
        payload : register,
    });
    }
}

export const logoutUser = (email) => {

    return async dispatch => {
        return await axios.post('https://ddc5935c-e447-4f84-bb74-3549e177f250.mock.pstmn.io/logout',email)
        .then(function(res){
            axios.defaults.headers.common['Authorization'] = undefined
            AsyncStorage.getItem('kakaoLogin').then((value)=>{
                AsyncStorage.clear();
                dispatch({
                    type: LOGOUT_USER,
                    payload: 'end',
                });

                if(value){
                    KakaoLogins.logout().then(result=>{
                         console.log(result);
                         
                    })   
                } 
            });
        }).catch(function(err){
            console.log(err);
        })
    }

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










