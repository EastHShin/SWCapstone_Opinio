import React,{useState, createRef} from 'react';

import {
  StyleSheet,
  TextInput,
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  ScrollView,

} from 'react-native'

import Loader from './Loader';
import EntypoIcons from 'react-native-vector-icons/Entypo';

import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {useDispatch} from 'react-redux';
import {registerUser} from './actions/userActions';


Date.prototype.format = function(f) {
  if (!this.valueOf()) return " ";

  var weekName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  var d = this;
   
  return f.replace(/(yyyy|yy|MM|dd|E|hh|mm|ss|a\/p)/gi, function($1) {
      switch ($1) {
          case "yyyy": return d.getFullYear();
          case "yy": return (d.getFullYear() % 1000).zf(2);
          case "MM": return (d.getMonth() + 1).zf(2);
          case "dd": return d.getDate().zf(2);
          case "E": return weekName[d.getDay()];
          case "HH": return d.getHours().zf(2);
          case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2);
          case "mm": return d.getMinutes().zf(2);
          case "ss": return d.getSeconds().zf(2);
          case "a/p": return d.getHours() < 12 ? "오전" : "오후";
          default: return $1;
      }
  });
};

String.prototype.string = function(len){var s = '', i = 0; while (i++ < len) { s += this; } return s;};
String.prototype.zf = function(len){return "0".string(len - this.length) + this;};
Number.prototype.zf = function(len){return this.toString().zf(len);};



function RegisterScreen({navigation}) {

  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');

  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userBirth, setUserBirth] = useState(new Date());
  const [textBirth, setTextBirth] = useState('');
  
  const [checkEmail, setCheckEmail] = useState(true);
  const [checkPassword, setCheckPassword] = useState(true);
      
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [
    isRegistraionSuccess,
    setIsRegistraionSuccess
  ] = useState(false);
 
  const dispatch = useDispatch();
  
  const emailInputRef = createRef();
  const passwordInputRef = createRef();

  const onPressHandler = () =>{
    setErrortext('');

    if (!userName) {
      alert('이름을 입력해주세요.');
      return;
    }
    if (!textBirth){
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

    const user = JSON.stringify({
                name:userName,
                birth:userBirth,
                email:userEmail,
                password:userPassword,
                
            });

  const res = dispatch(registerUser(user));
  res.payload.then(data=>{
    if(data.message == 'success'){
      setLoading(false);
      setIsRegistraionSuccess(true);
    }
    else{
      setLoading(false);
      setErrortext('회원가입 실패');
    }
  });

  }  

  const showDatePicker = () =>{
      setDatePickerVisibility(true);
      console.log(userBirth);
  };

  const handleConfirm = (date) =>{
    setDatePickerVisibility(false);
    setUserBirth(date);
    setTextBirth(date.format("yyyy-MM-dd"));
  
    console.log(userBirth);
    console.log(textBirth);
  }

  const validationEmail = (e) => {

    var emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    if(!emailExp.test(e.nativeEvent.text)){
      setCheckEmail(false);
    }
    else{
      setCheckEmail(true);
    }

  }

  const validationPassword = (e) => {

    var passwordExp = /^(?=.*\d)(?=.*[a-zA-Z])[0-9a-zA-Z]{8,12}$/;
    if(!passwordExp.test(e.nativeEvent.text)){
      setCheckPassword(false);
    }
    else{
      setCheckPassword(true);
    }
  }

    if(isRegistraionSuccess){

        return(
            <View style = {{
                flex:1, backgroundColor:'#8EB69',
                justifyContent:'center'
            }}>
                <Image 
                source = {require('./assets/plantrowth.png')}
                style={{
                    height:150,
                    resizeMode:'contain',
                    alignSelf:'center'
                }}/>

        <Text style={styles.successText}>
          회원가입 성공
        </Text>
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonText}>Login Now</Text>
        </TouchableOpacity>

            </View>
        )
    }

    return(
      <View style={{flex: 1, backgroundColor: '#8EB695'}}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}>
        <View style={{alignItems: 'center'}}>
          <Image
            source={require('./assets/plantrowth.png')}
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
            <EntypoIcons  name='user' size={20} color="#8EB695" style={styles.icon}/>
            <TextInput
              style={styles.input}
              onChangeText={(UserName) => setUserName(UserName)}
              underlineColorAndroid="#f000"
              placeholder="Name"
              placeholderTextColor="#808080"
              autoCapitalize="sentences"
              returnKeyType="next"
              onSubmitEditing={
                Keyboard.dismiss
              }
              blurOnSubmit={false}
            />
          </View>

          <View style={styles.section}>
          <EntypoIcons name='calendar' size={20} color="#8EB695" style={styles.icon}/>
            <TouchableOpacity onPress = {showDatePicker}>
            <TextInput
              pointerEvents="none"
              style={styles.input}
              underlineColorAndroid="#f000"
              placeholder="Date of birth"
              placeholderTextColor="#808080"
              editable={false}
              blurOnSubmit={false}
              value = {textBirth} 
            />

            <DateTimePickerModal 
            isVisible={isDatePickerVisible}
            mode = "date"
            onConfirm={handleConfirm}
            onCancel={()=>{
              setDatePickerVisibility(false);
            }}/>
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
              ref={emailInputRef}
              returnKeyType="next"
              onEndEditing = {
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
            <EntypoIcons name='key'size={20} color="#8EB695" style={styles.icon}/>
            <TextInput
              style={styles.input}
              onChangeText={(UserPassword) =>
                setUserPassword(UserPassword)
              }
              underlineColorAndroid="#f000"
              placeholder="8~12자 영문,숫자 조합"
              placeholderTextColor="#808080"
              ref={passwordInputRef}
              returnKeyType="next"
              secureTextEntry={true}
              onEndEditing = {
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
          
          
          {errortext!= '' ? (
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
    </View>
    )
}

export default RegisterScreen;


const styles = StyleSheet.create({
  sectionWrapper:{
    backgroundColor: '#FFFFFF',
    height: 450,
    width: 300,
    borderRadius: 20,
    display: 'flex',
    justifyContent: 'center',
    marginLeft:30,
    shadowColor:'#000000',
    shadowOffset:{
      width: 0,
      height: 2,
    },
    shadowOpacity:0.3,
    shadowRadius: 3.00,
    elevation:5
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
      color: '#FFFFFF',
      height: 40,
      alignItems: 'center',
      borderRadius: 30,
      marginLeft: 35,
      marginRight: 35,
      marginTop: 20,
      marginBottom: 20,
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
    icon:{
      marginTop:8,
      marginRight:10,
      marginLeft:-5
    }
  }); 