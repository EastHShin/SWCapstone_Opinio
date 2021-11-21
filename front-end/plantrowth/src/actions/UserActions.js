import { REGISTER_USER, LOGIN_USER, KAKAO_REGISTER, KAKAO_UNLINK, LOGOUT_USER, SEND_EMAIL, CODE_VERIFICATION, USER_DELETE, USER_INFO, USER_EDIT, DIAGNOSIS_LIST } from "./type";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import axios from "axios";

let timer;

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
};

const setLogoutTimer = (expirationTime) => dispatch => {

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
                        text: ""
                    })
                }
                if(res.status == "NOT_ACCEPTABLE"){
                    dispatch({
                        type: REGISTER_USER,
                        payload: "failure",
                        text: res.data.message
                    })
                }
            })
            .catch(function (error) {
               console.log(error);
                dispatch({
                    type: REGISTER_USER,
                    payload: "failure",
                    text: ""  
                })
            })
    }
}

export const setRegisterState = state => dispatch => {
    dispatch({
        type: REGISTER_USER,
        payload: state        
    })   
}

export const emailAuthentication = (email) =>{
    return async dispatch => {
        return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/email', email, {
            headers: { "Content-Type": `application/json` }
        }).then(function(res){
            console.log(res);
            if(res.status==200){
            dispatch({
                type:SEND_EMAIL,
                payload:"success"
            })
        }
        }).catch(function(err){
            dispatch({
                type:SEND_EMAIL,
                payload:"failure"
            })
            console.log(err);
        })
    }

}

export const codeVerification = (code) => {
    return async dispatch => {
        console.log(code);
        return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/verify',JSON.stringify(code), {
            headers: { "Content-Type": `application/json` }
        }).then(function(res){
            if(res.status==200){
            dispatch({
                type:CODE_VERIFICATION,
                payload:"success"
            })
        }
        }).catch(function(err){
            dispatch({
                type:CODE_VERIFICATION,
                payload:"failure"
            })
            console.log(err);
        })
    }
}

export const setEmialTransState = state => dispatch => {
    dispatch({
        type:SEND_EMAIL,
        payload:state
    })
}

export const setCodeVerificationState = state => dispatch =>{
    dispatch({
        type:CODE_VERIFICATION,
        payload:state
    })
}

export const loginUser = (user) => {

    return async dispatch => {
        return await axios.post("http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/login", user, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                console.log(res.headers.authorization);
                if (res.status == 200) {
                    dispatch(setLogoutTimer(3600000));

                    AsyncStorage.setItem('userId', JSON.stringify(res.data.data));
                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.headers.authorization}`;
                   

                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
                    });

                }

            })
            .catch(function (error) {
                dispatch({
                    type: LOGIN_USER,
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

                    axios.defaults.headers.common['Authorization'] = `Bearer ${res.headers.authorization}`;
                    dispatch(setLogoutTimer(3600000));
                    AsyncStorage.setItem('userId', JSON.stringify(res.data.data));
                    AsyncStorage.setItem('kakaoLogin', 'yes');

                    dispatch({
                        type: LOGIN_USER,
                        payload: "success"
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
        return await axios.post('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/auth/logout', email, {
            headers: { "Content-Type": `application/json` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    console.log("tq");
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
                dispatch({
                    type: LOGOUT_USER,
                    payload: 'failure',
                });
            })
    }

};

export const setLogoutState = state => dispatch =>{

    dispatch({
        type:LOGOUT_USER,
        payload:state
    })
}


export const kakaoUnlink = () => dispatch => {
    try {

        KakaoLogins.unlink().then(result => {
            console.log("카카오 탈퇴 결과"+result);
            if (result) {
                dispatch({
                    type: KAKAO_UNLINK,
                    payload: '',
                })
            }
        })

    } catch (error) {
        console.log(error);
        dispatch({
            type: KAKAO_UNLINK,
            payload: "failure"
        })
    }
};

export const deleteUser = (userId, password) =>{
    return async dispatch => {
        console.log(userId + "    "+ password);
        return await axios.delete(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/user/${userId}`,
        {
            headers: { "Content-Type": `application/json` }
        })
        .then(function(res){
            if(res.status==200){
                axios.defaults.headers.common['Authorization'] = undefined
                    AsyncStorage.getItem('kakaoLogin').then((value) => {
                        clearLogoutTimer();
                        
                        dispatch({
                            type:USER_DELETE,
                            payload:"success"
                        })


                        if (value) {
                            dispatch(kakaoUnlink());
                        }
                    });
                

            }

        })
        .catch(function(err){
            console.log(err);
            dispatch({
                type:USER_DELETE,
                payload:"failure"
            })
        })
    }

}

export const infoUser = (userId) => {
    return async dispatch => {
        return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/user/${userId}`)
        .then(function(res){
            if(res.status==200){
                console.log(res.data.data);
                        dispatch({
                            type:USER_INFO,
                            payload:"success",
                            data:res.data.data
                        })
            }

        })
        .catch(function(err){
            console.log(err);
            dispatch({
                type:USER_INFO,
                payload:"failure",
                data:{}
            })
        })
    }
}

export const editUser = (userId, data) => {
    console.log(userId + "   " + data);
    return async dispatch => {
        return await axios.put(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/user/${userId}`,data,
        {
            headers: { "Content-Type": `application/json` }
        })
        .then(function(res){
            if (res.status == 200) {

                dispatch({
                    type: USER_EDIT,
                    payload: "success"
                })
            }

        })
        .catch(function(err){
            console.log(err);
            dispatch({
                type:USER_EDIT,
                payload:"failure"
            })
        })
    }

}

export const setUserDeleteState = state => dispatch =>{
    dispatch({
        type:USER_DELETE,
        payload:state
    })
}

export const setUserEditState = state => dispatch => {
    dispatch({
        type:USER_EDIT,
        payload : state
    })
}

export const setUserInfoState = state => dispatch => {
    dispatch({
        type:USER_INFO,
        payload : state
    })
}

export const getDiagnosisList = (plantId) => {

    return async dispatch => {
        return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diagnosis/${plantId}`)
        .then(function(res){
            if (res.status == 200) {
                dispatch({
                    type: DIAGNOSIS_LIST,
                    payload: res.data.data
                })
            }

        })
        .catch(function(err){
            console.log(err);
            dispatch({
                type:DIAGNOSIS_LIST,
                payload:[]
            })
        })
    }
  
}












