import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  View,
  StyleSheet,
  Text,
  Alert,
  Pressable,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';

import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  getPaymentHistory,
  refund,
  setRefundState,
} from '../actions/ShopActions';
import Loader from '../Loader';
import { useIsFocused } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PaymentHistoryScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const isLogin = useSelector(state => state.UserReducer.isLogin);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState('');
  const paymentInfoList = useSelector(
    state => state.ShopReducer.paymentRecord.paymentInfoList,
  );
  const refundState = useSelector(state => state.ShopReducer.refundResult);

  useEffect(() => {
    if (isLogin == 'end') {
      navigation.reset({ routes: [{ name: 'LoginScreen' }] });
    }
  }, [isLogin]);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(value => {
      if (value != null) {
        setUserId(JSON.parse(value));
        console.log('결제 내역 userId: ' + userId);
        if (isFocused) {
          dispatch(getPaymentHistory(JSON.parse(value)));
          setLoading(false);
        }
      }
    });
    console.log('paymentInfoList: ' + JSON.stringify(paymentInfoList));
    if (refundState == 'true' && isFocused) {
      console.log('useEffect 환불 성공');
      dispatch(setRefundState(''));
      setLoading(false);
    } else if (refundState == 'false' && isFocused) {
      console.log('useEffect 환불 실패');
      dispatch(setRefundState(''));
      setLoading(false);
    }
  }, [isFocused, refundState]);

  const renderRefundButton = paymentInfo => {
    return paymentInfo.paymentStatus == 'PAYMENT' ? (
      <TouchableOpacity
        style={styles.refundButton}
        onPress={() => refundHandler(paymentInfo)}
      >
        <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>
          환불 요청
        </Text>
      </TouchableOpacity>
    ) : (
      <View style={styles.refundButton}>
        <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>
          환불 완료
        </Text>
      </View>
    );
  };

  const refundHandler = paymentInfo => {
    Alert.alert(
      '질병진단 구독 서비스 가입 해지',
      '앞으로는 질병진단시 포인트가 소비돼요. 그래도 환불하시겠어요?',
      [
        {
          text: '네',
          onPress: () => {
            setLoading(true);
            let amount = 0;

            console.log('paymentInfo: ' + JSON.stringify(paymentInfo));
            let YYYYMMDD = String(paymentInfo.payment_date);
            let sYear = YYYYMMDD.substring(0, 4);
            let sMonth = YYYYMMDD.substring(5, 7);
            let sDate = YYYYMMDD.substring(8, 10);
            const paymentDate = new Date(
              Number(sYear),
              Number(sMonth) - 1,
              Number(sDate),
            );
            const today = new Date();
            const timelapse = Math.ceil(
              (today.getTime() - paymentDate.getTime()) / (1000 * 3600 * 24),
            );
            console.log('timelapse: ' + timelapse);

            if (timelapse <= 3) {
              amount = Number(paymentInfo.amount);
            } else if (timelapse <= 14) {
              amount = Number(paymentInfo.amount) / 50;
            } else {
              alert('결제하신지 14일이 지나 환불이 불가능합니다.');
              return;
            }
            dispatch(
              refund(paymentInfo.merchant_id, amount, '질병진단 구독 환불'),
            );
          },
        },
        {
          text: '아니오',
          onPress: () => {
            return;
          },
        },
      ],
    );
  };

  const renderMerchant = paymentInfoList => {
    if (paymentInfoList !== null && paymentInfoList !== undefined) {
      return paymentInfoList
        ? paymentInfoList.map((item, index) => {
            return (
              <View style={styles.merchantWrapper}>
                <View>
                  <Text style={styles.merchantText}>
                    결제 금액: {item.amount}원
                  </Text>
                  <Text style={styles.merchantText}>
                    {`결제 상품: ${
                      item.paymentType == 'SLOT'
                        ? '프로필 슬롯'
                        : '질병진단 구독'
                    }`}
                  </Text>
                  <Text style={styles.merchantText}>
                    결제일: {item.payment_date}
                  </Text>
                </View>
                {item.paymentType == 'SLOT' ? null : renderRefundButton(item)}
              </View>
            );
          })
        : null;
    }
  };

  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={styles.sectionWrapper}>
          <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 18 }}>
            결제 내역
          </Text>
          <ScrollView style={{ margin: 10, overflow: 'hidden' }}>
            {renderMerchant(paymentInfoList)}
          </ScrollView>
        </View>
      </View>
      <Footer name={'My Page'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: screenWidth * 0.92,
    height: screenHeight * 0.83,
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  merchantWrapper: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#93d07d',
    width: screenWidth * 0.85,
    height: screenHeight * 0.105,
    borderRadius: 15,
    margin: 5,
  },
  merchantText: {
    fontFamily: 'NanumGothicBold',
  },
  refundButton: {
    width: 100,
    height: 50,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#f1c40f',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default PaymentHistoryScreen;
