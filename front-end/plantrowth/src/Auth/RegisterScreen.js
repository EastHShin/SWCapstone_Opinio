import React, { useEffect,useState, createRef, useCallback } from 'react';

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
} from 'react-native'

import Loader from '../Loader';
import EntypoIcons from 'react-native-vector-icons/Entypo';

import { useIsFocused } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useDispatch,useSelector } from 'react-redux';
import { registerUser,setRegisterState } from '../actions/UserActions';
import messaging from '@react-native-firebase/messaging';

function RegisterScreen({ navigation }) {

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const [userNickName, setUserNickName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userBirth, setUserBirth] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);

  const isFocused = useIsFocused();
  const dispatch = useDispatch();

  const registerState = useSelector(state => state.UserReducer.registerState);
  const passwordInputRef = createRef();

  const maximumDate = new Date();

  useEffect(() => {
    if(registerState == 'success' && isFocused){
      setLoading(false);
      setIsRegistraionSuccess(true);
      dispatch(setRegisterState(''));
    }
    else if(!registerState == 'success' && isFocused){
      setLoading(false);
      setErrortext('회원가입 실패'); //registerState를 여기 
      dispatch(setRegisterState(''));
    }
  }, [registerState])

  const getFcmToken = useCallback(async () => {
    const fcmToken = await messaging().getToken();
    setFcmToken(fcmToken);
  }, []);

  useEffect(() => {
    getFcmToken();
  }, [])
  

  const onPressHandler = () => {
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

    setLoading(true);

    console.log(fcmToken);

    const user = JSON.stringify({
      user_name : userNickName,
      user_birth: userBirth,
      email: userEmail,
      password: userPassword,
      fcm_access_token: fcmToken

    });

    console.log(user);

    dispatch(registerUser(user));
 
  }

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const handleConfirm = (date) => {
    setDatePickerVisibility(false);
    
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setUserBirth(year+ '-' + month + '-' + day);

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#8EB695',alignItems:'center' }}>
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
                placeholder="NickName"
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
                  onConfirm={handleConfirm}
                  minimumDate={new Date(1921, 0, 1)} 
                  maximumDate={new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate()-1)}
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
                  validationPassword
                }
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
    height: Dimensions.get('window').height*0.6,
    width: Dimensions.get('window').width*0.85,
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
    paddingVertical: 10,
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
  }
});