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
import { editUser, setUserEditState, checkNickname, setCheckNicknameState } from '../actions/UserActions';
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
  const [checkedNickName, setCheckedNickName] = useState('');

  const maximumDate = new Date();
  const passwordInputRef = createRef();
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const userEditState = useSelector(state => state.UserReducer.userEditState);
  const checkNicknameState = useSelector(state => state.UserReducer.checkNicknameState);
  const [loading, setLoading] = useState(false);

 

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

  useEffect(() => {
    if (checkNicknameState == 'success' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName(nickName);
      alert('사용할 수 있는 닉네임입니다.');
    }
    else if (checkNicknameState == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setCheckNicknameState(''));
      setCheckedNickName('');
      alert('이미 존재하는 닉네임입니다!');
    }
  }, [checkNicknameState])

  const onPressHandler = () => {
    
    if (nickName == userInfo.user_name && birth == userInfo.user_birth && !password) {
      alert('수정된 정보가 없습니다!');
      return;
    }

    if (!nickName) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    if(nickName && nickName != userInfo.user_name){
      if (!checkedNickName) {
        alert('닉네임을 인증해주세요!');
        return;
      }
      if (checkedNickName != nickName) {
        alert('닉네임을 인증해주세요!');
        return;
      }
    }
    if (!birth) {
      alert('생년월일을 입력해주세요!');
      return;
    }
    if(password && !checkPassword){
      alert('비밀번호 확인 절차를 완료해주세요.');
      return;
    }
    if(checkPassword && !password){
      alert('비밀번호를 다시 확인해주세요.');
      return;
    }
    if(checkPassword != password){
      alert('비밀번호를 다시 확인해주세요.');
      return;
    }
    if(!doublePassword || !vailPassword){
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

    if (password) {
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

  const checkUserNickname = () => {
    if (!nickName) {
      alert('닉네임을 입력해주세요!');
      return;
    }
    if(nickName == userInfo.user_name){
      alert('현재 닉네임입니다!');
      return;
    }
    setLoading(true);

    dispatch(checkNickname(nickName));
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
                  onSubmitEditing={() =>
                    Keyboard.dismiss()
                  }
                  underlineColorAndroid="#A9A9A9"
                  blurOnSubmit={false}
                />
                 <TouchableOpacity
                style={styles.button}
                activeOpacity={0.5}
                onPress ={checkUserNickname}
               >
                <Text style={{
                  color: '#FFFFFF',
                  fontSize: 10,
                  marginVertical:Dimensions.get('window').height*0.01
                }}>중복확인</Text>
              </TouchableOpacity>
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
                  color:  "#000000",
                  fontSize: 14
                }}>       새로운 비밀번호   :   </Text>
                <TextInput
                  style={styles.passwordInput}
                  onChangeText={(password) =>
                    setUserPassword(password)
                  }
                  editable={true}
                  selectTextOnFocus={true}

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
                  color: "#000000",
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
                  editable={true}
                  selectTextOnFocus={true}
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

          <TouchableOpacity
            style={styles.smallButton}
            activeOpacity={0.5}
            onPress={onPressHandler
            }>
            <Text style={{
              color: '#FFFFFF',
              paddingVertical: 11, fontSize: 10, fontWeight: "bold"
            }}>확인</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
        <Footer name={'My Page'} />
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

  },
  button: {
    backgroundColor: '#BEE9B4',
    height: Dimensions.get('window').height*0.04,
    marginLeft: Dimensions.get('window').width * 0.02,
    width: "15%",
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
})

export default AccountEditScreen;