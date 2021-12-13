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
import Modal from 'react-native-modal';
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
  const [isRefundModalVisible, setRefundModalVisibility] = useState(false);
  const [selectedPaymentInfo, setSelectedPaymentInfo] = useState('');
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
        if (isFocused) {
          dispatch(getPaymentHistory(JSON.parse(value)));
          setLoading(false);
        }
      }
    });
    console.log('paymentInfoList: ' + JSON.stringify(paymentInfoList));
    if (refundState == 'success' && isFocused) {
      dispatch(setRefundState(''));
      setLoading(false);
    } else if (refundState == 'diagnosis' && isFocused) {
      Alert.alert('환불 실패', '질병진단을 실행한 경우 환불이 불가능합니다.', [{
        text: '알겠습니다',
        onPress: () => { return }
      }])
      dispatch(setRefundState(''));
      setLoading(false);
    } else if (refundState == 'failure' && isFocused) {
      Alert.alert('환불 실패', '네트워크 오류로 환불을 못했습니다.', [{
        text: '알겠습니다',
        onPress: () => { return }
      }])
      dispatch(setRefundState(''));
      setLoading(false);
    }
  }, [isFocused, refundState]);

  const renderRefundButton = paymentInfo => {
    return paymentInfo.paymentStatus == 'PAYMENT' ? (
      timelapseCalculator(paymentInfo.payment_date) <= 14 ?
        <TouchableOpacity
          style={styles.refundButton}
          onPress={() => {
            setRefundModalVisibility(true);
            setSelectedPaymentInfo(paymentInfo);
          }}
        >
          <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>
            환불 요청
          </Text>
        </TouchableOpacity> : <View style={[styles.refundButton, { backgroundColor: '#cccccc' }]}>
          <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>
            환불 완료
          </Text>
        </View>
    ) : (
      <View style={[styles.refundButton, { backgroundColor: '#cccccc' }]}>
        <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>
          환불 완료
        </Text>
      </View>
    );
  };

  const timelapseCalculator = (date) => {
    let YYYYMMDD = String(date);

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

    return timelapse;
  }

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

            const timelapse = timelapseCalculator(String(paymentInfo.payment_date));

            if (timelapse <= 3) {
              amount = Number(paymentInfo.amount);
            } else if (timelapse <= 14) {
              amount = Number(paymentInfo.amount) / 50;
            } else {
              return;
            }
            dispatch(
              refund(paymentInfo.merchant_id, amount, '질병진단 구독 환불', userId),
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
    if (paymentInfoList !== null && paymentInfoList !== undefined && paymentInfoList.length != 0) {
      return paymentInfoList
        ? paymentInfoList.map((item, index) => {
          return (
            <View key={index} style={styles.merchantWrapper}>
              <View>
                <Text style={styles.merchantText}>
                  {`결제 상품: ${item.paymentType == 'SLOT'
                    ? '프로필 슬롯'
                    : '질병진단 구독'
                    }`}
                </Text>
                <Text style={styles.merchantText}>
                  결제 금액: {item.amount}원
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
    } else {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 20, color: '#363636' }}>
            결제 내역이 없습니다
          </Text>
        </View>
      )
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
      <Modal
        isVisible={isRefundModalVisible}
        onBackButtonPress={() => setRefundModalVisibility(false)}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.buyResultModalWrapper}>
            <Text style={[styles.buyResultText, { fontSize: 18, marginBottom: 10 }]}>
              환불 요청
            </Text>
            <View style={{backgroundColor: '#f7f8f9', padding: 10, borderRadius: 5}}>
              <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10}}>
                <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                  질병진단 구독을 결제한지{' '}
                </Text>
                <Text style={{ color: '#ef5350', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                  {timelapseCalculator(selectedPaymentInfo.payment_date)}일
                </Text>
                <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                  이 지났으므로
                </Text>
              </View>
              {timelapseCalculator(selectedPaymentInfo.payment_date) > 14 ?
                (
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#3ef5350', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                      환불이 불가능
                    </Text>
                    <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                      합니다
                    </Text>
                  </View>
                ) :
                timelapseCalculator(selectedPaymentInfo.payment_date) > 3 ? (
                  <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                    결제 금액의 50%인 {5900 / 2}원을 환불받습니다
                  </Text>)
                  : (<Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 14 }}>
                    결제 금액의 100%인 5900원을 환불받습니다
                  </Text>)
              }
            </View>
            <View>
              <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 12 }}>
                * 상점 화면의 결제 약관 참조{'\n\n'}
                * 단, 질병진단 구독을 결제하고 질병진단을 한 적이 있으면
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginTop: 5 }}>
                <Text style={{ color: '#ef5350', fontFamily: 'NanumGothicBold', fontSize: 12 }}>
                  환불이 불가능
                </Text>
                <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 12, }}>
                  합니다{'\n'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', width: screenWidth * 0.5, justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                style={[styles.earnModalButton, { backgroundColor: '#ef5350' }]}
                onPress={() => setRefundModalVisibility(false)}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16, color: 'white' }}>
                    닫기
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.earnModalButton}
                onPress={() => { setRefundModalVisibility(false), refundHandler(selectedPaymentInfo) }}>
                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16, color: 'white' }}>
                    환불
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

          </View>
        </View>
      </Modal>
    </SafeAreaView >
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
    backgroundColor: '#C9E7BE',
  },
  merchantWrapper: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f7f8f9',
    width: screenWidth * 0.85,
    height: screenHeight * 0.105,
    borderRadius: 15,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
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
  buyResultModalWrapper: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.4,
    backgroundColor: 'white',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  earnModalButton: {
    width: 50,
    height: 35,
    backgroundColor: '#93d07d',
    borderRadius: 3,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  buyResultText: {
    fontFamily: 'NanumGothicBold',
    fontSize: 16,
    color: '#222222',
    marginTop: 15,
    textAlign: 'center',
  },
});

export default PaymentHistoryScreen;
