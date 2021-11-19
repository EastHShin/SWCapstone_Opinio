import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../actions/UserActions';

import * as KakaoLogins from '@react-native-seoul/kakao-login';
import {
  SafeAreaView,
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity,
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';

//laylout만 작성, 로그아웃은 가능
const MyPageScreen = ({navigation}) => {
  const dispatch = useDispatch();

  const unlinkKakao = async () => {
    try {
      let result = await KakaoLogins.unlink();

      if (result) {
        console.log('unlink');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onPressHandler = () => {
    // unlinkKakao();
    // 카카오 세션 끊기 테스트
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {
        text: '취소',
        onPress: () => console.log('취소'),
      },
      {
        text: '확인',
        onPress: () => {
          // unlinkKakao();
          dispatch(logoutUser());
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.top}>
        <TouchableOpacity
          style={{marginStart: Dimensions.get('window').width * 0.03}}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.42,
            fontWeight: 'bold',
            color: '#000000',
          }}>
          My Page
        </Text>
      </View>
      <View style={{flex: 1,justifyContent: 'space-between'}}>
        <View style={styles.wrapper}>
          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={() => navigation.push('AccountInfoScreen')}>
            <View style={styles.section}>
              <Text style={styles.text}>회원정보 조회</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={() => navigation.push('AccountEditScreen')}>
            <View style={styles.section}>
              <Text style={styles.text}>회원정보 수정</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={() => navigation.push('PointHistoryScreen')}>
            <View style={styles.section}>
              <Text style={styles.text}>포인트 내역 조회</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={() => navigation.push('DiseaseDiagnosisHistoryScreen')}>
            <View style={styles.section}>
              <Text style={styles.text}>질병진단 내역 조회</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={onPressHandler}>
            <View style={styles.section}>
              <Text style={styles.text}>로그아웃</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{flexDirection: 'row'}}
            activeOpacity={0.5}
            onPress={() => navigation.push('AccountDeleteScreen')}>
            <View style={styles.section}>
              <Text style={styles.text}>회원탈퇴</Text>
              <Ionicons
                name="chevron-forward-sharp"
                size={23}
                color="#000000"
                style={styles.icon}
              />
            </View>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  top: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width,
  },
  wrapper: {
    //height: Dimensions.get('window').height * 0.82,
    width: Dimensions.get('window').width,
  },
  section: {
    marginBottom: Dimensions.get('window').height * 0.0009,
    backgroundColor: '#FFFFFF',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.07,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    color: '#000000',
    fontWeight: 'bold',
    marginStart: Dimensions.get('window').width * 0.05,
  },
  icon: {
    marginEnd: Dimensions.get('window').width * 0.05,
  },

  button: {
    width: 150,
    height: 50,
    alignItems: 'center',
    borderRadius: 5,
    margin: 10,
  },
});

export default MyPageScreen;
