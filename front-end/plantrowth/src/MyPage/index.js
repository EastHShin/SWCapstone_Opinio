import React,{useState, useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../actions/userActions';

import * as KakaoLogins from "@react-native-seoul/kakao-login";
import {
  View,
  StyleSheet,
  Text,
  Alert,
  TextInput,
  Pressable
} from 'react-native';

import Footer from '../component/Footer';

const MyPageScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const unlinkKaka = async () => {
    try {
      let result = await KakaoLogins.unlink();

      if (result) {
        console.log('unlink');
      }
    } catch (error) {
      console.log(error);
    }
  }

  const onPressHandler = () => {
    // unlinkKaka();
    dispatch(logoutUser());
    navigation.replace('LoginScreen');
  }

  return(
    <View style={styles.body}>
      <Text style={styles.text}>
        My page logout test
      </Text>

      <CustomButton
        title='Logout'
        color='#1eb900'
        onPressFunction={onPressHandler} />
    <Footer />
    </View>

    
)
};

const CustomButton = (props) => {
  return (
      <Pressable
          onPress={props.onPressFunction}
          hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
          android_ripple={{ color: '#00000050' }}
          style={({ pressed }) => [
              { backgroundColor: pressed ? '#dddddd' : props.color },
              styles.button,
              { ...props.style }
          ]}
      >
          <Text style={styles.text}>
              {props.title}
          </Text>
      </Pressable>
  )

}

const styles = StyleSheet.create({

  body:{
      flex:1,
      alignItems:'center',
      justifyContent:'space-between'

  },
 
  text:{
      fontSize:30,
      color:'#ffffff'
  },
  
  button: {
      width: 150,
      height: 50,
      alignItems: 'center',
      borderRadius: 5,
      margin: 10,
  },

}) 

export default MyPageScreen;
