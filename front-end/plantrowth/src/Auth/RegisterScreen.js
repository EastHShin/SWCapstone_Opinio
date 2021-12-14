import React, { useEffect, useState, createRef, useCallback } from 'react';

import {
  StyleSheet,
  TextInput,
  SafeAreaView,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Modal,
} from 'react-native'

import Loader from '../Loader';
import EntypoIcons from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, setRegisterState, emailAuthentication, codeVerification, setEmialTransState, setCodeVerificationState, checkNickname, setCheckNicknameState } from '../actions/UserActions';
import messaging from '@react-native-firebase/messaging';

function RegisterScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const [userNickName, setUserNickName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
  const [checkEmailCode, setCheckEmailCode] = useState(false);
  const [checkedNickName, setCheckedNickName] = useState('');

  const [inputAuthCode, setInputAuthCode] = useState("");
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const registerState = useSelector(state => state.UserReducer.registerState);
  const registerText = useSelector(state => state.UserReducer.registerText);
  const emailTrans = useSelector(state => state.UserReducer.emailTrans);
  const codeVerificationState = useSelector(state => state.UserReducer.codeVerificationState);
  const checkNicknameState = useSelector(state => state.UserReducer.checkNicknameState);
  const passwordInputRef = createRef();

  const maximumDate = new Date();

  useEffect(() => {
    if (registerState == 'success' && isFocused) {
      setLoading(false);
      setIsRegistraionSuccess(true);
      setErrortext('');
      dispatch(setRegisterState(''));
      setCheckEmailCode(false);
    }
    else if (registerState == 'failure' && isFocused) {
      setLoading(false);
      setErrortext(registerText);
      dispatch(setRegisterState(''));
      setCheckEmailCode(false);
    }
  }, [registerState])

  useEffect(() => {
    if (checkNicknameState == 'success' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName(userNickName);
      alert('사용할 수 있는 닉네임입니다.');
    }
    else if (checkNicknameState == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName('');
      alert('이미 존재하는 닉네임입니다!');
    }
  }, [checkNicknameState])

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    setFcmToken(fcmToken);
  }, []);

  useEffect(() => {
    getFcmToken();
  }, [])

  useEffect(() => {

    if (emailTrans == "success" && isFocused) {
      setLoading(false);
      setIsModalVisible(true);
      dispatch(setEmialTransState(''));
    }
    else if (emailTrans == "failure" && isFocused) {
      setLoading(false);
      alert('이메일 전송에 실패하였습니다!');
      dispatch(setEmialTransState(''));
    }

  }, [emailTrans])

  useEffect(() => {
    if (codeVerificationState == 'success' && isFocused) {
      setLoading(false);
      setCheckEmailCode(true);
      alert('인증성공 !!!');
      dispatch(setCodeVerificationState(""));
      setIsModalVisible(false);
    }
    else if (codeVerificationState == 'failure' && isFocused) {
      setLoading(false);
      alert('인증코드를 다시 확인해주세요.');
      dispatch(setCodeVerificationState(""));
    }
  }, [codeVerificationState])


  const onPressHandler = () => {
    var passwordExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/

    setErrortext('');

    if (!userNickName) {
      alert('닉네임을 입력해주세요.');
      return;
    }
    if (!userBirth) {
      alert('생년월일을 입력해주세요.');
      return;
    }
    if (!userEmail) {
      alert('이메일을 입력해주세요.');
      return;
    }
    if (!userPassword) {
      alert('비밀번호를 입력해주세요.');
      return;
    }
    if (!checkEmailCode) {
      alert('이메일을 인증해주세요!');
      return;
    }
    if (!checkedNickName) {
      alert('닉네임을 인증해주세요!');
      return;
    }
    if (checkedNickName != userNickName) {
      alert('닉네임을 인증해주세요!');
      return;
    }
    if (!passwordExp.test(userPassword)) {
      alert('비밀번호를 다시 확인해주세요!');
      return;
    }
    

    setLoading(true);

    const user = JSON.stringify({
      user_name: userNickName,
      user_birth: userBirth,
      email: userEmail,
      password: userPassword,
      fcm_access_token: fcmToken

    });

    dispatch(registerUser(user));

  }

  const checkUserNickname = () => {
    const str_space = /\s/;
    if(str_space.exec(userNickName)){
      alert('공백은 사용할 수 없습니다!');
      return;
    } 
    if (!userNickName) {
      alert('닉네임을 입력해주세요!');
      return;
    }

    setLoading(true);

    dispatch(checkNickname(userNickName));
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

  const validationEmail = (e) => {

    var emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if (!emailExp.test(e.nativeEvent.text)) {
      setCheckEmail(false);
    }
    else {
      setCheckEmail(true);
    }

  }

  const validationPassword = (e) => {


    var passwordExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/
    if (!passwordExp.test(e.nativeEvent.text)) {
      setCheckPassword(false);
    }
    else {
      setCheckPassword(true);
    }
  }

  const sendCheckEmail = () => {
    var emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if(!emailExp.test(userEmail)){
      alert('이메일 형식을 확인해주세요!');
      return;
    }
    else{
      dispatch(emailAuthentication(userEmail));
      setLoading(true);
    }
  }

  if (isRegistraionSuccess) {
    return (
      <SafeAreaView style={{
        flex: 1,
        backgroundColor: '#8EB695',
        justifyContent: 'center'
      }}>
        <Image
          source={require('../assets/plantrowth.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center'
          }} />

        <Text style={styles.successText}>
          회원가입 성공
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Login Now</Text>
        </TouchableOpacity>

      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8EB695', alignItems: 'center' }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
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
        <KeyboardAvoidingView enabled>
          <View style={styles.sectionWrapper}>
            <View style={styles.section}>
              <EntypoIcons name='user' size={20} color="#8EB695" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={(UserNickName) => setUserNickName(UserNickName)}
                underlineColorAndroid="#f000"
                placeholder="Nickname"
                placeholderTextColor="#808080"
                onSubmitEditing={
                  Keyboard.dismiss
                }
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={checkUserNickname}>
                <Text style={{
                  color: '#FFFFFF',
                  paddingVertical: 10, fontSize: 10
                }}>중복확인</Text>
              </TouchableOpacity>
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
                  onConfirm={handleConfirm}
                  maximumDate={new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate() - 1)}
                  onCancel={() => {
                    setDatePickerVisibility(false);
                  }} />
              </TouchableOpacity>

            </View>
            <View style={styles.section}>
              <EntypoIcons name='email' size={20} color="#8EB695" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                underlineColorAndroid="#f000"
                placeholder="abc@ajou.ac.kr"
                placeholderTextColor="#808080"
                keyboardType="email-address"
                returnKeyType="next"
                onEndEditing={
                  validationEmail
                }
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
              <TouchableOpacity
                style={styles.smallButton}
                activeOpacity={0.5}
                onPress={sendCheckEmail}>
                <Text style={{
                  color: '#FFFFFF',
                  paddingVertical: 10, fontSize: 10
                }}>인증</Text>
              </TouchableOpacity>

              <Modal
                transparent={true}
                animationType={'none'}
                onRequestClose={() => {
                  console.log("close");
                  setIsModalVisible(false);
                }}
                visible={isModalVisible}
              >
                <View style={styles.modal}>
                  <View style={styles.modalSectionWrapper}>
                    <Text>이메일이 전송되었습니다!</Text>
                    <Text>인증번호를 입력해주세요.</Text>
                    <View style={styles.section}>
                      <Ionicons name='ios-mail-open-outline' size={20} color="#8EB695" style={styles.icon} />
                      <TextInput
                        style={styles.input}
                        onChangeText={(code) => setInputAuthCode(code)}
                        underlineColorAndroid="#f000"
                        keyboardType="number-pad"
                        placeholder="verification code"
                        placeholderTextColor="#808080"
                        onSubmitEditing={
                          Keyboard.dismiss
                        }
                        blurOnSubmit={false}
                      />
                    </View>
                    <View style={{ flexDirection: "row", marginTop:Dimensions.get('window').height*0.01 }}>
                      <TouchableOpacity
                        style={styles.smallButton}
                        activeOpacity={0.5}
                        onPress={() => {
                          setLoading(true);
                          dispatch(codeVerification(inputAuthCode));
                        }
                        }>
                        <Text style={{
                          color: '#FFFFFF',
                          paddingVertical: 10, fontSize: 10
                        }}>확인</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.smallButton}
                        activeOpacity={0.5}
                        onPress={() => {
                          alert('인증을 취소합니다.')
                          setIsModalVisible(false);
                        }}>
                        <Text style={{
                          color: '#FFFFFF',
                          paddingVertical: 10, fontSize: 10
                        }}>취소</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>


            </View>
            {checkEmail == false ? (
              <Text style={styles.errorText}>
                이메일을 다시 확인해주세요.
              </Text>
            ) : null}

            <View style={styles.section}>
              <EntypoIcons name='key' size={20} color="#8EB695" style={styles.icon} />
              <TextInput
                style={styles.input}
                onChangeText={(UserPassword) =>
                  setUserPassword(UserPassword)
                }
                underlineColorAndroid="#f000"
                placeholder="8~12자 영문,숫자,특수문자"
                placeholderTextColor="#808080"
                ref={passwordInputRef}
                returnKeyType="next"
                secureTextEntry={true}
                onEndEditing={
                  validationPassword}
                onSubmitEditing={
                  Keyboard.dismiss
                }
                blurOnSubmit={false}
              />
            </View>
            {checkPassword == false ? (
              <Text style={styles.errorText}>
                비밀번호를 다시 확인해주세요.
              </Text>
            ) : null}


            {errortext != '' ? (
              <Text style={styles.errorText}>
                {errortext}
              </Text>
            ) : null}

            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.5}
              onPress={onPressHandler}>
              <Text style={styles.buttonText}>Join</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  )
}

export default RegisterScreen;


const styles = StyleSheet.create({
  sectionWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height * 0.6,
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
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
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
    paddingVertical: 9,
    fontSize: 16,

  },
  input: {
    flex: 1,
    color: '#000000',
    paddingLeft: 15,
    paddingRight: 45,
    borderWidth: 1,
    borderRadius: 30,
    borderColor: '#BEE9B4',
    fontSize: 13
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  successText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
  icon: {
    marginTop: 8,
    marginRight: 10,
    marginLeft: -5
  },
  smallButton: {
    backgroundColor: '#BEE9B4',
    height: 35,
    marginLeft: Dimensions.get('window').width * 0.02,
    width: "20%",
    alignItems: 'center',
    borderRadius: 30,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.00,
    elevation: 5

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
    height: Dimensions.get('window').height * 0.35,
    width: Dimensions.get('window').width * 0.85,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },

});