import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  TextInput,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../Loader';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { editUser, setUserEditState } from '../actions/UserActions';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AccountEditScreen = ({ route, navigation }) => {

  const { userId, userInfo } = route.params;

  // const [userId, setUserId] = useState('');
  const [birth, setUserBirth] = useState(userInfo.user_birth);
  const [password, setUserPassword] = useState('');
  const [checkPassword, setCheckPassword] = useState('');
  const [vailErrorText, setVailErrorText] = useState('');
  const [checkErrorText, setCheckErrorText] = useState('');
  const [vailPassword, setVailPassword] = useState(true);
  const [doublePassword, setDoublePassword] = useState(true);
  const [nickName, setUserNickName] = useState(userInfo.user_name);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [kakaoLoginUser, setKakaoLoginUser] = useState(false);
  const maximumDate = new Date();
  const passwordInputRef = createRef();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const userEditState = useSelector(state => state.UserReducer.userEditState);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('kakaoLogin').then((value) => {
        if (value) {
          setKakaoLoginUser(true);
        }
      })
    }
  }, [isFocused])

  useEffect(() => {
    if (isFocused && userEditState == 'success') {
      setLoading(false);
      dispatch(setUserEditState(''));
      alert('회원정보가 수정되었습니다.');
      navigation.navigate('AccountInfoScreen');

    }
    else if (isFocused && userEditState == 'failure') {
      setLoading(false);
      dispatch(setUserEditState(''));
      alert('회원정보 수정 실패!');
    }

  }, [userEditState])

  const onPressHandler = () => {
    if (nickName == userInfo.user_name && birth == userInfo.user_birth && !password) {
      alert('수정된 정보가 없습니다!');
      return;
    }

    if (!nickName) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    if (!birth) {
      alert('생년월일을 입력해주세요!');
      return;
    }
    if (vailErrorText || checkErrorText) {
      alert('비밀번호를 다시 확인해주세요.');
      return;
    }

    setLoading(true);

    const user = {};

    if (nickName != userInfo.user) {
      user.user_name = nickName;
    }
    if (birth != userInfo.user_birth) {
      user.user_birth = birth;
    }

    if (!vailErrorText && !checkErrorText && password) {
      user.password = password;
    }
    user.email = userInfo.email;

    dispatch(editUser(userId, JSON.stringify(user)));

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

  const validationPassword = (e) => {

    var passwordExp = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,12}$/
    if (!passwordExp.test(e.nativeEvent.text)) {
      setVailPassword(false);
      setVailErrorText('비밀번호 규칙을 다시 확인해주세요');
    }
    else {
      setVailPassword(true);
      setVailErrorText('');
    }
  }

  const doubleCheckPassword = () => {
    if (checkPassword == password) {
      setCheckErrorText('');
      setDoublePassword(true);
    }
    else {
      setCheckErrorText('비밀번호가 일치하지 않습니다.');
      setDoublePassword(false);
    }
  }


  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />

      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.39,
            fontFamily: 'NanumGothicBold',
            color: '#000000',
          }}>
          회원정보 수정
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
      </View>

      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <KeyboardAvoidingView enabled>
          <View style={styles.wrapper}>
            <View style={styles.section}>
              <View style={styles.lineWrapper}>
                <Text style={styles.text}>       닉네임       :   </Text>
                <TextInput
                  style={styles.nickNameInput}
                  onChangeText={(nickName) =>
                    setUserNickName(nickName)
                  }
                  placeholder="Enter nickname"
                  placeholderTextColor="#808080"
                  returnKeyType="next"
                  value={nickName}
                  underlineColorAndroid="#A9A9A9"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.lineWrapper}>
                <Text style={styles.text}>       생년월일   :   </Text>
                <TouchableOpacity onPress={showDatePicker}>
                  <TextInput
                    pointerEvents="none"
                    style={styles.dateInput}
                    underlineColorAndroid="#A9A9A9"
                    placeholder="Date of birth"
                    placeholderTextColor="#808080"
                    editable={false}
                    blurOnSubmit={false}
                    value={birth}
                  />
                  <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="date"
                    onConfirm={handleConfirm}
                    minimumDate={new Date(1921, 0, 1)}
                    maximumDate={new Date(maximumDate.getFullYear(), maximumDate.getMonth(), maximumDate.getDate() - 1)}
                    onCancel={() => {
                      setDatePickerVisibility(false);
                    }} />
                </TouchableOpacity>
              </View>

              <View style={styles.lineWrapper}>
                <Text style={{
                  color: kakaoLoginUser != true ? "#000000" : "#808080",
                  fontSize: 14
                }}>       새로운 비밀번호   :   </Text>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={(password) =>
                    setUserPassword(password)
                  }
                  editable={kakaoLoginUser != true ? true : false}
                  selectTextOnFocus={kakaoLoginUser != true ? true : false}

                  placeholderTextColor="#808080"
                  placeholder="8~12자 영문,숫자,특수문자"
                  secureTextEntry={true}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    passwordInputRef.current &&
                    passwordInputRef.current.focus()
                  }
                  onEndEditing={
                    validationPassword
                  }
                  value={password}
                  underlineColorAndroid={vailPassword == false ? "red"
                    : "#A9A9A9"}
                  blurOnSubmit={false}
                />

              </View>
              {vailPassword == false ? (
                <Text style={styles.errorText}>
                  {vailErrorText}
                </Text>
              ) : null}

              <View style={styles.lineWrapper}>
                <Text style={{
                  color: kakaoLoginUser != true ? "#000000" : "#808080",
                  fontSize: 14
                }}>       비밀번호 확인       :   </Text>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={(password) =>
                    setCheckPassword(password)
                  }
                  ref={passwordInputRef}
                  placeholderTextColor="#808080"
                  placeholder="Check Password"
                  editable={kakaoLoginUser != true ? true : false}
                  selectTextOnFocus={kakaoLoginUser != true ? true : false}
                  secureTextEntry={true}
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    Keyboard.dismiss()
                  }
                  onEndEditing={
                    doubleCheckPassword
                  }
                  value={checkPassword}
                  underlineColorAndroid={doublePassword == false ? "red"
                    : "#A9A9A9"}
                  blurOnSubmit={false}
                />
              </View>
              {doublePassword == false ? (
                <Text style={styles.errorText}>
                  {checkErrorText}
                </Text>
              ) : null}
            </View>
          </View>

          <Text style={{ fontSize: 12, marginStart: Dimensions.get('window').width * 0.05, marginTop: Dimensions.get('window').height * 0.02 }}>수정이 완료되면 '확인' 버튼을 눌러주세요.</Text>
          {kakaoLoginUser == true ? (
            <Text style={{ fontSize: 12, color: '#000000', marginStart: Dimensions.get('window').width * 0.05, marginTop: Dimensions.get('window').height * 0.003 }}>*    카카오 로그인 유저는 비밀번호를 변경할 수 없습니다.</Text>
          ) : null}

          <TouchableOpacity
            style={styles.smallButton}
            activeOpacity={0.5}
            onPress={onPressHandler
            }>
            <Text style={{
              color: '#FFFFFF',
              paddingVertical: 10, fontSize: 10, fontWeight: "bold"
            }}>확인</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Footer />
      </View>

    </SafeAreaView>
  )
};



const styles = StyleSheet.create({

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: "#C9E7BE"
  },
  top: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width
  },

  section: {

    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.4,

  },


  smallButton: {
    backgroundColor: '#82B594',
    height: Dimensions.get('window').height * 0.05,
    marginTop: Dimensions.get('window').height * 0.01,
    marginStart: Dimensions.get('window').width * 0.75,
    width: Dimensions.get('window').width * 0.2,
    alignItems: 'center',
    borderRadius: 20,

  },
  lineWrapper: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nickNameInput: {
    width: Dimensions.get('window').width * 0.4,
    fontWeight: 'bold'
  },
  text: {
    color: "#000000",
    fontSize: 14
  },
  dateInput: {
    width: Dimensions.get('window').width * 0.4,
    fontWeight: 'bold',
    color: '#000000',
  },
  passwordInput: {
    width: Dimensions.get('window').width * 0.5,
  },
  errorText: {
    fontSize: 10,
    color: "red",
    marginStart: Dimensions.get('window').width * 0.39

  }
})

export default AccountEditScreen;