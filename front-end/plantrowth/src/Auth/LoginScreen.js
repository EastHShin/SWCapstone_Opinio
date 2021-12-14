import React, { useState, createRef, useEffect, useCallback } from 'react';

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
  SafeAreaView,
} from 'react-native';

import { useIsFocused } from '@react-navigation/native';
import * as KakaoLogins from '@react-native-seoul/kakao-login';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Loader from '../Loader';
import { useSelector, useDispatch } from 'react-redux';
import {
  loginUser,
  kakaoLogin,
  kakaoRegister,
  registerUser,
  kakaoUnlink,
  setRegisterState,
  setLoginState,
  findPassword,
  setFindPasswordState,
  checkNickname,
  setCheckNicknameState,
} from '../actions/UserActions';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
const LoginScreen = ({ navigation }) => {
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [email, setEmail] = useState('');
  const [checkedNickName, setCheckedNickName] = useState('');
  const [createPassword, setCreatePassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isFindPwModalVisible, setIsFindPwModalVisible] = useState(false);

  const maximumDate = new Date();

  const passwordInputRef = createRef();

  const dispatch = useDispatch();

  const isLogin = useSelector(state => state.UserReducer.isLogin);
  const kakaoRegisterState = useSelector(
    state => state.UserReducer.kakaoRegisterState,
  );
  const registerState = useSelector(state => state.UserReducer.registerState);
  const findPasswordState = useSelector(
    state => state.UserReducer.findPasswordState,
  );
  const checkNicknameState = useSelector(
    state => state.UserReducer.checkNicknameState,
  );
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isLogin == 'success') {
      setLoading(false);
      navigation.replace('HomeScreen');
    } else if (isLogin == 'failure') {
      setLoading(false);
      setErrortext('로그인 실패');
      dispatch(setLoginState(''));
    }
  }, [isLogin]);

  useEffect(() => {
    if (kakaoRegisterState == 'loading') {
      getFcmToken();
      setIsModalVisible(true);
      setLoading(false);
    } else if (kakaoRegisterState == 'success') {
      const kakaoLoginData = JSON.stringify({
        email: userEmail,
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      dispatch(kakaoLogin(kakaoLoginData));
      dispatch(kakaoRegister(''));
    } else if (kakaoRegisterState == 'failure') {
      dispatch(kakaoRegister(''));
      setErrortext('카카오 회원가입 실패');
    }
  }, [kakaoRegisterState]);

  useEffect(() => {
    if (registerState == 'success' && isFocused) {
      dispatch(kakaoRegister('success'));
      setIsModalVisible(false);

      dispatch(setRegisterState(''));
    } else if (registerState == 'failure' && isFocused) {
      setLoading(false);
      kakaoRegisterFail();
    }
  }, [registerState]);

  useEffect(() => {
    if (checkNicknameState == 'success' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName(userName);
      alert('사용할 수 있는 닉네임입니다.');
    } else if (checkNicknameState == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName('');
      alert('이미 존재하는 닉네임입니다!');
    }
  }, [checkNicknameState]);

  useEffect(() => {
    if (findPasswordState == 'success' && isFocused) {
      setLoading(false);
      alert(
        '이메일로 임시 비밀번호가 전송되었습니다. 로그인 후 비밀번호를 변경하세요.',
      );
      setIsFindPwModalVisible(false);
      dispatch(setFindPasswordState(''));
    } else if (findPasswordState == 'failure' && isFocused) {
      setLoading(false);
      alert('인증에 실패하였습니다. 이메일과 생년월일을 다시 확인해주세요.');
      dispatch(setFindPasswordState(''));
    }
  }, [findPasswordState]);

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    setFcmToken(fcmToken);
  }, []);

  const KakaoLoginActive = async () => {
    try {
      let result = await KakaoLogins.login();
      setLoading(true);
      if (result) {
        const profile = await KakaoLogins.getProfile();
        setUserEmail(profile.email);
        setUserPassword(' ');
        setAccessToken(result.accessToken);
        setRefreshToken(result.refreshToken);

        const kakaoLoginData = JSON.stringify({
          email: profile.email,
          accessToken: result.accessToken,
          refreshToken: result.refreshToken,
        });

        AsyncStorage.setItem('email', profile.email);
        dispatch(kakaoLogin(kakaoLoginData));
      }
    } catch (err) {
      setLoading(false);
      if (err.code === 'E_CANCELLED_OPERATION') {
        console.log(`Login Cancelled:${err.message}`);
      } else {
        console.log(`Login Failed:${err.code} ${err.message}`);
      }
    }
  };

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

    AsyncStorage.setItem('email', userEmail);

    dispatch(loginUser(loginData));
  };

  const register = () => {
    var passwordExp =
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/;

    if (!userName) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!checkedNickName) {
      alert('닉네임을 인증해주세요!');
      return;
    }
    if (checkedNickName != userName) {
      alert('닉네임을 인증해주세요!');
      return;
    }
    if (!userBirth) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    if (!passwordExp.test(createPassword)) {
      alert('비밀번호를 다시 확인해주세요!');
      return;
    }

    setLoading(true);

    const user = JSON.stringify({
      user_name: userName,
      user_birth: userBirth,
      email: userEmail,
      password: createPassword,
      fcm_access_token: fcmToken,
    });

    dispatch(registerUser(user));
  };

  const findUserPassword = () => {
    if (!email) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!userBirth) {
      alert('생년월일을 입력해주세요');
      return;
    }

    setLoading(true);

    const user = JSON.stringify({
      email: email,
      user_birth: userBirth,
    });

    dispatch(findPassword(user));
  };

  const checkUserNickname = () => {
    const str_space = /\s/;
    if(str_space.exec(userName)){
      alert('공백은 사용할 수 없습니다!');
      return;
    } 
    if (!userName) {
      alert('닉네임을 입력해주세요!');
      return;
    }


    setLoading(true);

    dispatch(checkNickname(userName));
  };

  const kakaoRegisterFail = () => {
    dispatch(kakaoUnlink());
    dispatch(kakaoRegister('failure'));
    setUserBirth('');
    setIsModalVisible(false);
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = date => {
    setDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    setUserBirth(year + '-' + month + '-' + day);
  };

  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          flex: 1,
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
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
                <EntypoIcons
                  name="email"
                  size={20}
                  color="#8EB695"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={userEmail => setUserEmail(userEmail)}
                  placeholder="Enter Email"
                  placeholderTextColor="#808080"
                  keyboardType="email-address"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current && passwordInputRef.current.focus()
                  }
                  underlineColorAndroid="#f000"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.section}>
                <EntypoIcons
                  name="key"
                  size={20}
                  color="#8EB695"
                  style={styles.icon}
                />
                <TextInput
                  style={styles.input}
                  onChangeText={UserPassword => setUserPassword(UserPassword)}
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
                <Text style={styles.errorText}>{errortext}</Text>
              ) : null}

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.5}
                onPress={onPressHandler}
              >
                <Text style={styles.buttonText}>LOGIN</Text>
              </TouchableOpacity>
              <TouchableOpacity activeOpacity={0.5} onPress={KakaoLoginActive}>
                <Image
                  source={require('../assets/kakao_login.png')}
                  style={styles.kakaoImage}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: Dimensions.get('window').height * 0.01,
              }}
            >
              <Text style={styles.registerText}>New Here ?</Text>
              <Text
                style={styles.registerTextButton}
                onPress={() => navigation.navigate('RegisterScreen')}
              >
                Register
              </Text>
            </View>
            <Text
              style={styles.passwordTextButton}
              onPress={() => setIsFindPwModalVisible(true)}
            >
              비밀번호를 잃어버리셨나요?
            </Text>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>

      <Modal
        transparent={true}
        animationType={'none'}
        onRequestClose={() => {
          setUserBirth('');
          setIsFindPwModalVisible(false);
        }}
        visible={isFindPwModalVisible}
      >
        <View style={styles.modal}>
          <View style={styles.modalSectionWrapper}>
            <View style={styles.textWrapper}>
              <Text
                style={{
                  marginBottom: Dimensions.get('window').height * 0.015,
                  color: '#000000',
                  fontWeight: 'bold',
                }}
              >
                비밀번호 찾기
              </Text>
              <Text style={{ color: '#000000' }}>
                이메일과 생년월일을 입력해주세요
              </Text>
            </View>
            <View style={styles.section}>
              <EntypoIcons
                name="email"
                size={20}
                color="#8EB695"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onChangeText={email => setEmail(email)}
                placeholder="Enter Email"
                underlineColorAndroid="#f000"
                placeholderTextColor="#808080"
                keyboardType="email-address"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>

            <View style={styles.section}>
              <EntypoIcons
                name="calendar"
                size={20}
                color="#8EB695"
                style={styles.icon}
              />
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
                  maximumDate={
                    new Date(
                      maximumDate.getFullYear(),
                      maximumDate.getMonth(),
                      maximumDate.getDate() - 1,
                    )
                  }
                  onConfirm={handleConfirm}
                  onCancel={() => {
                    setDatePickerVisibility(false);
                  }}
                />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: Dimensions.get('window').height * 0.01,
              }}
            >
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={findUserPassword}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    paddingVertical: 10,
                    fontSize: 10,
                  }}
                >
                  찾기
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={() => {
                  setIsFindPwModalVisible(false);
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    paddingVertical: 10,
                    fontSize: 10,
                  }}
                >
                  취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
            <View style={styles.textWrapper}>
              <Text
                style={{ fontSize: 15, fontWeight: 'bold', color: '#000000' }}
              >
                Register
              </Text>
            </View>
            <View style={styles.section}>
              <EntypoIcons
                name="user"
                size={20}
                color="#8EB695"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onChangeText={UserName => setUserName(UserName)}
                underlineColorAndroid="#f000"
                placeholder="Name"
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />

              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={checkUserNickname}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    paddingVertical: 10,
                    fontSize: 10,
                  }}
                >
                  확인
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <EntypoIcons
                name="calendar"
                size={20}
                color="#8EB695"
                style={styles.icon}
              />
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
                  maximumDate={
                    new Date(
                      maximumDate.getFullYear(),
                      maximumDate.getMonth(),
                      maximumDate.getDate() - 1,
                    )
                  }
                  onConfirm={handleConfirm}
                  onCancel={() => {
                    setDatePickerVisibility(false);
                  }}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.section}>
              <EntypoIcons
                name="key"
                size={20}
                color="#8EB695"
                style={styles.icon}
              />
              <TextInput
                style={styles.input}
                onChangeText={UserPassword => setCreatePassword(UserPassword)}
                underlineColorAndroid="#f000"
                placeholder="8~12자 영문,숫자,특수문자"
                placeholderTextColor="#808080"
                returnKeyType="next"
                secureTextEntry={true}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                marginTop: Dimensions.get('window').height * 0.01,
              }}
            >
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={register}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    paddingVertical: 10,
                    fontSize: 10,
                  }}
                >
                  가입
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={() => {
                  kakaoRegisterFail();
                }}
              >
                <Text
                  style={{
                    color: '#FFFFFF',
                    paddingVertical: 10,
                    fontSize: 10,
                  }}
                >
                  취소
                </Text>
              </TouchableOpacity>
            </View>
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
    shadowRadius: 3.0,
    elevation: 5,
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
    shadowRadius: 3.0,
    elevation: 5,
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
    marginRight: Dimensions.get('window').width * 0.02,
  },
  registerTextButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontSize: 14,
    padding: 1,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  kakaoImage: {
    width: Dimensions.get('window').width * 0.66,
    resizeMode: 'cover',
    height: Dimensions.get('window').height * 0.05,
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 35,
    marginRight: 35,
    marginBottom: 25,
  },
  icon: {
    marginTop: 8,
    marginRight: 10,
    marginLeft: -5,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00000040',
  },
  modalSectionWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height * 0.468,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
  },
  passwordTextButton: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: Dimensions.get('window').height * 0.01,
    fontSize: 12,
  },
  textWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButton: {
    backgroundColor: '#BEE9B4',
    height: 35,
    marginLeft: Dimensions.get('window').width * 0.02,
    width: '20%',
    alignItems: 'center',
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 5,
  },
});
