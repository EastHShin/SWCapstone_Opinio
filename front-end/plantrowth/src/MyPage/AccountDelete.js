import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';

//laylout만 작성, 로그아웃은 가능
const AccountDeleteScreen = ({ navigation }) => {
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



  return (
    <View style={styles.body}>
     <Text>회원탈퇴 스크린</Text>
      <Footer />
    </View>
  )
};



const styles = StyleSheet.create({

  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between'
  }
})

export default AccountDeleteScreen;