import React, {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux';
import {logoutUser} from '../actions/UserActions';

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


  const onPressHandler = () => {
   
    Alert.alert('로그아웃', '로그아웃 하시겠습니까?', [
      {
        text: '취소',
        onPress: () => console.log('취소'),
      },
      {
        text: '확인',
        onPress: () => {
        
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
            fontFamily: 'NanumGothicBold',
            color: '#000000',
          }}>
          My Page
        </Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center',width:Dimensions.get('window').width,}}>
                        <View style={{ flex: 1, height: 1 ,backgroundColor: '#A9A9A9' }} />
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
            onPress={() => navigation.push('AccountDeleteNoticeScreen')}>
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
        <Footer name={'My Page'}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#C9E7BE'
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
    backgroundColor: '#e8ebed'
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
    fontFamily: 'NanumGothicBold',
    marginStart: Dimensions.get('window').width * 0.05,
  },
  icon: {
    marginEnd: Dimensions.get('window').width * 0.05,
  },


});

export default MyPageScreen;
