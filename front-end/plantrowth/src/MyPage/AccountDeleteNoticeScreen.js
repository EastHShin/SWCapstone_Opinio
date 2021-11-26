import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';


const AccountDeleteNoticeScreen = ({ navigation }) => {


  return (
    <SafeAreaView style={styles.body}>
      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}>
          <Ionicons name='chevron-back-sharp' size={23} color="#000000" />
        </TouchableOpacity>
        <Text style={{ marginEnd: Dimensions.get('window').width * 0.42, fontWeight: "bold", color: "#000000" }}>회원탈퇴</Text>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', width: Dimensions.get('window').width, }}>
        <View style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }} />
      </View>
      <View style={{ flex: 1, justifyContent: 'space-between' }}>
        <View style={styles.wrapper}>
          <View style={styles.section}>
            <Text style={styles.bigText}>회원탈퇴 안내</Text>
            <View style={styles.textWrapper}>
              <Text style={styles.dot}>·  </Text>
              <Text style={styles.smallText}>Plantrowth 회원탈퇴를 하시면 더이상 Plantrowth가 제공하는 서비스를
                사용할 수 없습니다. 또한 해당 계정에 존재하는 모든 정보와 포인트가 소멸됩니다.</Text>
            </View>
            <View style={styles.textWrapper}>
              <Text style={styles.dot}>·  </Text>
              <Text style={styles.smallText}>회원탈퇴 진행을 위해 비밀번호 인증이 필요합니다.</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, marginStart: Dimensions.get('window').width * 0.05, marginTop: Dimensions.get('window').height * 0.02 }}>회원탈퇴를 진행하시려면 '다음' 버튼을 눌러주세요.</Text>
          <TouchableOpacity
            style={styles.smallButton}
            activeOpacity={0.5}
            onPress={() => {
              navigation.push('AccountDeleteScreen');
            }
            }>
            <Text style={{
              color: '#FFFFFF',
              paddingVertical: 10, fontSize: 10, fontWeight: "bold"
            }}>다음</Text>
          </TouchableOpacity>
        </View>
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
  wrapper: {

    width: Dimensions.get('window').width,
  },
  section: {

    backgroundColor: "#FFFFFF",
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height * 0.3,

  },
  bigText: {
    fontSize: 18,
    marginStart: Dimensions.get('window').width * 0.05,
    marginBottom: Dimensions.get('window').height * 0.02,
    marginTop: Dimensions.get('window').height * 0.02,
    color: "#000000"

  },
  smallText: {
    fontSize: 13,
    marginTop: Dimensions.get('window').height * 0.006,


  },
  textWrapper: {
    flexDirection: "row",
    width: Dimensions.get('window').width * 0.9,
    marginStart: Dimensions.get('window').width * 0.05,
    marginBottom: Dimensions.get('window').height * 0.02,
    marginTop: Dimensions.get('window').height * 0.01,

  },
  dot: {
    fontSize: 20,
    fontWeight: "bold"
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


})

export default AccountDeleteNoticeScreen;