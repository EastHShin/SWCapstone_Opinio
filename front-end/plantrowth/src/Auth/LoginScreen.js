import React, { useState, createRef, useEffect, useCallback} from 'react';

import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Modal,
  Dimensions,
  SafeAreaView
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import * as KakaoLogins from "@react-native-seoul/kakao-login";
import EntypoIcons from 'react-native-vector-icons/Entypo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loader from '../Loader';
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, kakaoLogin, kakaoRegister, registerUser, kakaoUnlink,setRegisterState } from '../actions/userActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = ({ navigation }) => {

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [fcmToken, setFcmToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
 
  const maximumDate = new Date();

  const passwordInputRef = createRef();

  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.userReducer.isLogin);
  const kakaoRegisterState = useSelector(state => state.userReducer.kakaoRegisterState);
  const registerState = useSelector(state => state.userReducer.registerState);
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isLogin == 'success') {
      setLoading(false);
      navigation.replace('HomeScreen');
    } else if (isLogin == 'failure') {
      setLoading(false);
      setErrortext('로그인 실패');
    }
  }, [isLogin])

  useEffect(() => {
    if (kakaoRegisterState == 'loading') {
      console.log('ddd');
      setIsModalVisible(true);
      setLoading(false);
    }
    else if (kakaoRegisterState == 'success') {

      const kakaoLoginData = JSON.stringify({
        email: userEmail,
        access_token : accessToken,
        refresh_token : refreshToken
      });

      dispatch(kakaoLogin(kakaoLoginData));
      dispatch(kakaoRegister(''));
    }
    else if (kakaoRegisterState == 'failure') {
      setErrortext('회원가입 실패');
    }
  }, [kakaoRegisterState])

  useEffect(()=>{
    
    if(registerState == 'success'&& isFocused){
      dispatch(kakaoRegister('success'));
      setIsModalVisible(false);
      dispatch(setRegisterState(''));
    }
    else if(registerState =='failure' && isFocused){
      setLoading(false);
      kakaoRegisterFail();
    }
  
  },[registerState])

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    setFcmToken(fcmToken);

  }, []);

  useEffect(() => {
    getFcmToken();
  }, [])


  const KakaoLoginActive = async () => {
    try {
      let result = await KakaoLogins.login();
      setLoading(true);
      if (result) {
        const profile = await KakaoLogins.getProfile();
        setUserEmail(profile.email);
        setUserPassword(' '); //협의 후 작성 
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);
        //삭제
        
        const kakaoLoginData = JSON.stringify({
          email: profile.email,
          accessToken : result.accessToken,
          refreshToken : result.refreshToken
        });

        dispatch(kakaoLogin(kakaoLoginData));

    }
    } catch (err) {
      setLoading(false);
      if (err.code === "E_CANCELLED_OPERATION") {
        console.log(`Login Cancelled:${err.message}`);
      } else {
        console.log(`Login Failed:${err.code} ${err.message}`);
      }
    }
  }

  const onPressHandler = () => {
    setErrortext('');
    if (!userEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    setLoading(true);

    const loginData = JSON.stringify({
      email: userEmail,
      password: userPassword,
    });

    dispatch(loginUser(loginData));

  }

  const register = () => {
    
    if (!userName) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!userBirth) {
      alert('생년월일을 입력해주세요.');
      return;
    }

    setLoading(true);

  

    const user = JSON.stringify({
      user_name: userName,
      user_birth: userBirth,
      email: userEmail,
      password: userPassword,
      fcm_access_token: fcmToken
    });

    console.log(user);

    dispatch(registerUser(user));

  }

  const kakaoRegisterFail = () => {
    dispatch(kakaoUnlink());
    dispatch(kakaoRegister('failure'));
    setIsModalVisible(false);
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    setUserBirth(year + '-' + month + '-' + day);
  }

  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../assets/plantrowth.png')}
                style={{
                  width: '50%',
                  height: 100,
                  resizeMode: 'contain',
                  margin: 30,
                }}
              />
            </View>
            <View style={styles.sectionWrapper}>
              <View style={styles.section}>
                <EntypoIcons name='email' size={20} color="#8EB695" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  onChangeText={(userEmail) =>
                    setUserEmail(userEmail)
                  }
                  placeholder="Enter Email"
                  placeholderTextColor="#808080"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.section}>
                <EntypoIcons name='key' size={20} color="#8EB695" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  onChangeText={(UserPassword) =>
                    setUserPassword(UserPassword)
                  }
                  placeholder="Enter Password"
                  placeholderTextColor="#808080"
                  keyboardType="default"
                  ref={passwordInputRef}
                  onSubmitEditing={Keyboard.dismiss}
                  blurOnSubmit={false}
                  secureTextEntry={true}
                  underlineColorAndroid="#f000"
                  returnKeyType="next"
                />
              </View>
              {errortext != '' ? (
                <Text style={styles.errorText}>
                  {errortext}
                </Text>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.5}
                onPress={onPressHandler}>
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={KakaoLoginActive}>
                <Image source={require('../assets/kakao_login.png')}
                  style={styles.kakaoImage} />
              </TouchableOpacity>
            </View>
            <Text
              style={styles.registerText}
              onPress={() => navigation.navigate('RegisterScreen')}>
              New Here ? Register
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType={'none'}
        onRequestClose={() => {
          kakaoRegisterFail();
        }}
        visible={isModalVisible}
      >
        <View style={styles.modal}>
          <View style={styles.modalSectionWrapper}>
            <View style={styles.section}>
              <EntypoIcons name='user' size={20} color="#8EB695" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={(UserName) => setUserName(UserName)}
                underlineColorAndroid="#f000"
                placeholder="Name"
                placeholderTextColor="#808080"
                onSubmitEditing={
                  Keyboard.dismiss
                }
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.section}>
              <EntypoIcons name='calendar' size={20} color="#8EB695" style={styles.icon} />
              <TouchableOpacity onPress={showDatePicker}>
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  underlineColorAndroid="#f000"
                  placeholder="Date of birth"
                  placeholderTextColor="#808080"
                  editable={false}
                  blurOnSubmit={false}
                  value={userBirth}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  maximumDate={new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate()-1)} //
                  minimumDate = {new Date(1921, 0, 1)}
                  onConfirm={handleConfirm}
                  onCancel={() => {
                    setDatePickerVisibility(false);
                  }} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={register}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  body: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#8EB695',
    alignItems: 'center',
  },
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height * 0.45,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 5
  },
  section: {
    flexDirection: 'row',
    height: 40,
    marginTop: 20,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  button: {
    backgroundColor: '#BEE9B4',
    borderWidth: 0,
    height: 35,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 25,
    marginBottom: 15,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 5
  },
  buttonText: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 13,
  },
  input: {
    flex: 1,
    color: '#000000',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#BEE9B4',
  },
  registerText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    alignSelf: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  kakaoImage: {
    width: '78%',
    resizeMode: 'contain',
    height: 40,
    alignItems: 'center',
    borderRadius: 40,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 25,
  },
  icon: {
    marginTop: 8,
    marginRight: 10,
    marginLeft: -5
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  modalSectionWrapper:
  {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height * 0.40,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center'
  },
 
});