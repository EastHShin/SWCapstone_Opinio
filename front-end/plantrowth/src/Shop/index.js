import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  TextInput,
  Keyboard,
} from 'react-native';
import Modal from 'react-native-modal';
import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Loader from '../Loader';
import {
  getShopInfo,
  buyProfileSlot,
  setBuyProfileSlotState,
  setBuySubscribeState,
} from '../actions/ShopActions';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

ShopScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [isBuySlotModalVisible, setBuySlotModalVisibility] = useState(false);
  const [isBuySubscribeModalVisible, setBuySubscribeModalVisibility] =
    useState(false);
  const [buyByPoint, setBuyByPoint] = useState(false);
  const [goods, setGoods] = useState('');
  const [paymentModalVisible, setPaymentModalVisibility] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [termsType, setTermsType] = useState('');
  const [isTermsModalVisible, setTermsModalVisibility] = useState(false);

  const point = useSelector(state => state.ShopReducer.point);
  const maxPlantNumber = useSelector(state => state.ShopReducer.maxPlantNumber);
  const shopInfo = useSelector(state => state.ShopReducer.shopInfo);
  const buyProfileSlotState = useSelector(
    state => state.ShopReducer.buyProfileSlotResult,
  );
  const buySubscribeState = useSelector(
    state => state.ShopReducer.buySubscribeResult,
  );

  const isLogin = useSelector(state => state.UserReducer.isLogin);

  useEffect(() => {
    if (isLogin == 'end') {
      navigation.replace('LoginScreen');
    }
  }, [isLogin]);

  useEffect(() => {
    AsyncStorage.getItem('userId').then(value => {
      if (value != null) {
        setUserId(JSON.parse(value));
        if (isFocused) {
          dispatch(getShopInfo(JSON.parse(value)));
          setLoading(false);
          console.log('shopInfo: ' + shopInfo.user_name);
        }
      }
    });
    if (buyProfileSlotState == 'point' && isFocused) {
      console.log('프로필 슬롯 포인트로 구매 성공! ' + maxPlantNumber);
      setLoading(false);
      setBuyByPoint(true);
      setBuySlotModalVisibility(true);
      dispatch(setBuyProfileSlotState(''));
    } else if (buyProfileSlotState == 'cash' && isFocused) {
      console.log('프로필 슬롯 캐시로 구매 성공! ' + maxPlantNumber);
      setLoading(false);
      setBuyByPoint(false);
      setBuySlotModalVisibility(true);
      dispatch(setBuyProfileSlotState(''));
    } else if (buyProfileSlotState == 'failure' && isFocused) {
      console.log('프로필 슬롯 구매 실패! ');
      setLoading(false);
      dispatch(setBuyProfileSlotState(''));
    } else if (buySubscribeState == 'success' && isFocused) {
      console.log('질병진단 구독 성공');
      setLoading(false);
      setBuySubscribeModalVisibility(true);
      dispatch(setBuySubscribeState(''));
    } else if (buySubscribeState == 'failure' && isFocused) {
      console.log('질병진단 구독 실패');
      setLoading(false);
      dispatch(setBuySubscribeState(''));
    }
  }, [isFocused, buyProfileSlotState, buySubscribeState]);

  const buySlotHandler = () => {
    setLoading(true);
    dispatch(buyProfileSlot(userId));
  };

  const renderBuySlotByPoint = byPoint => {
    if (byPoint) {
      return (
        <View>
          <Text style={styles.buyResultText}>
            300포인트를 소모하여 보유하고 계신 포인트가
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.buyResultText,
                { color: '#7e57c2', fontFamily: 'NanumGothicExtraBold' },
              ]}
            >
              {point}{' '}
            </Text>
            <Text style={styles.buyResultText}>포인트가 되었어요!</Text>
          </View>
        </View>
      );
    } else if (!byPoint) {
      return <Text style={styles.buyResultText}>1000원을 결제하셨어요</Text>;
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <Loader loading={loading} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#C9E7BE',
        }}
      >
        <View style={styles.sectionWrapper}>
          <View style={{ width: screenWidth * 0.8, alignItems: 'center' }}>
            <Text
              style={{
                fontFamily: 'NanumGothicBold',
                color: '#363636',
                fontSize: 18,
              }}
            >
              상점{`\n`}
            </Text>
            <View
              style={{
                backgroundColor: '#e8ebed',
                padding: 10,
                borderRadius: 10,
                width: screenWidth * 0.8,
              }}
            >
              <Text style={{ fontFamily: 'NanumGothicBold', color: '#363636' }}>
                어서오세요!{`\n`}
                {shopInfo.user_name}님의 보유 포인트: {shopInfo.point}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.slotSection}>
              <View style={styles.goodsWrapper}>
                <View style={styles.goodsTextWrapper}>
                  <Text style={styles.goodsText}>{'프로필 슬롯 1개 구매'}</Text>
                  <Text style={styles.goodsText}>{'300포인트'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => buySlotHandler()}
                >
                  <Ionicons name={'cash-outline'} size={30} color={'white'} />
                </TouchableOpacity>
              </View>
              <View style={styles.goodsWrapper}>
                <View style={styles.goodsTextWrapper}>
                  <Text style={styles.goodsText}>{'프로필 슬롯 1개 구매'}</Text>
                  <Text style={styles.goodsText}>{'1000원'}</Text>
                </View>
                <TouchableOpacity
                  style={styles.buyButton}
                  onPress={() => {
                    setGoods('slot');
                    setPaymentModalVisibility(true);
                  }}
                >
                  <Ionicons name={'cash-outline'} size={30} color={'white'} />
                </TouchableOpacity>
              </View>
              <View style={{ width: screenWidth * 0.75, marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      color: '#363636',
                    }}
                  >
                    프로필 슬롯이란?
                  </Text>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => {
                      setTermsType('SLOT');
                      setTermsModalVisibility(true);
                    }}
                  >
                    <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>결제 약관</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    color: '#363636',
                    fontSize: 13,
                  }}
                >
                  저장할 수 있는 식물 프로필의 개수를 1개 늘려줘요!
                </Text>
              </View>
            </View>
            <View style={styles.slotSection}>
              <View style={styles.goodsWrapper}>
                <View style={styles.goodsTextWrapper}>
                  <Text style={styles.goodsText}>
                    {'질병진단 구독 서비스 가입'}
                  </Text>
                  <Text style={styles.goodsText}>{'5900원/월'}</Text>
                </View>
                {shopInfo.is_subscription ? (
                  <View
                    style={[styles.buyButton, { backgroundColor: '#cccccc' }]}
                  >
                    <Text
                      style={{
                        fontFamily: 'NanumGothicBold',
                        color: 'white',
                        fontSize: 10,
                      }}
                    >
                      구독 중
                    </Text>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.buyButton}
                    onPress={() => {
                      setGoods('subscribe');
                      setPaymentModalVisibility(true);
                    }}
                  >
                    <Ionicons name={'cash-outline'} size={30} color={'white'} />
                  </TouchableOpacity>
                )}
              </View>
              <View style={{ width: screenWidth * 0.75, marginVertical: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      color: '#363636',
                      marginBottom: 5,
                    }}
                  >
                    질병진단 구독 서비스란?
                  </Text>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => {
                      setTermsType('DIAGNOSIS');
                      setTermsModalVisibility(true);
                    }}
                  >
                    <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>결제 약관</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    color: '#363636',
                    fontSize: 13,
                  }}
                >
                  월 일정 금액을 지불하고,{`\n`}포인트 소모 없이 질병진단 기능을
                  이용할 수 있어요!
                </Text>
              </View>
            </View>
          </View>
        </View>
        <Footer name={'Shop'} />
      </View>
      <Modal
        isVisible={isBuySlotModalVisible}
        onBackButtonPress={() => {
          setBuySlotModalVisibility(false);
        }}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.buyResultModalWrapper}>
            <Text style={[styles.buyResultText, { fontSize: 18 }]}>
              슬롯 구매 성공
            </Text>
            {renderBuySlotByPoint(buyByPoint)}
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.buyResultText}>식물을 </Text>
              <Text
                style={[
                  styles.buyResultText,
                  { color: '#93d07d', fontFamily: 'NanumGothicExtraBold' },
                ]}
              >
                {maxPlantNumber}
              </Text>
              <Text style={styles.buyResultText}>
                개 저장할 수 있게 되셨어요!
              </Text>
            </View>
            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => {
                setBuySlotModalVisibility(false);
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  확인
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isBuySubscribeModalVisible}
        onBackButtonPress={() => {
          setBuySlotModalVisibility(false);
        }}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.buyResultModalWrapper}>
            <View
              style={{
                flex: 5,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={[styles.buyResultText, { fontSize: 18 }]}>
                {`질병진단 구독 서비스\n가입 완료`}
              </Text>
              <Text style={[styles.buyResultText, { fontSize: 14 }]}>
                이제 질병진단을 무한으로 즐겨요
              </Text>
            </View>
            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => {
                setBuySubscribeModalVisibility(false);
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  확인
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={paymentModalVisible}
        onBackButtonPress={() => setPaymentModalVisibility(false)}
      >
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.buyResultModalWrapper}>
            <Text style={[styles.buyResultText, { fontSize: 18 }]}>
              구매자 정보 입력
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: 'NanumGothicBold',
                  color: '#363636',
                  fontSize: 13,
                }}
              >
                구매자명
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={name => setName(name)}
                underlineColorAndroid="#000"
                placeholder="구매자명"
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>

            <View>
              <Text
                style={{
                  fontFamily: 'NanumGothicBold',
                  color: '#363636',
                  fontSize: 13,
                }}
              >
                전화번호
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={number => setPhone(number)}
                underlineColorAndroid="#000"
                placeholder="전화번호"
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'NanumGothicBold',
                  color: '#363636',
                  fontSize: 13,
                }}
              >
                이메일
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={email => setEmail(email)}
                underlineColorAndroid="#000"
                placeholder={shopInfo.email}
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
                value={shopInfo.email}
              />
            </View>

            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => {
                setPaymentModalVisibility(false);
                console.log('email:' + email)
                if ((phone != '' && name != '')) {
                  if (goods == 'slot') {
                    navigation.navigate('Payment', {
                      userId: userId,
                      phone: phone,
                      email: email ? email : shopInfo.email,
                      name: name,
                      amount: '1000',
                    });
                  } else if (goods == 'subscribe') {
                    navigation.navigate('Payment', {
                      userId: userId,
                      phone: phone,
                      email: email ? email : shopInfo.email,
                      name: name,
                      amount: '5900',
                    });
                  }
                }
              }}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  구매
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isTermsModalVisible}
        onBackButtonPress={() => setTermsModalVisibility(false)}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={styles.buyResultModalWrapper}>
            <Text style={[styles.buyResultText, { fontSize: 18 }]}>
              결제 약관
            </Text>
            {termsType == 'SLOT'
              ? (
                <View>
                  <Text>슬롯</Text>
                </View>
              ) : (
                <View>
                  <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 16, margin: 5 }}>
                    구독 결제 시점과 이용 기간
                  </Text>
                  <Text style={{ color: '#363636', margin: 5, textAlign: 'justify', fontSize: 13 }}>
                    구독 결제는 한 달 단위로 결제되고, 해당 날짜가 되는 자정에 구독이 해지됩니다.
                    예를 들어, 3월 1일 23시 59분에 결제한다면, 4월 1일 0시에 구독이. 해지됩니다.
                  </Text>
                  <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 16, margin: 5 }}>
                    {'\n'}환불 정책
                  </Text>
                  {/* <Text style={{ color: '#363636', margin: 5, textAlign: 'justify', fontSize: 13}}>
                  질병진단 내역에서 구독일 이후로 질병진단 실행 시:{`\n  `}
                  <Text style={{ color: '#ef5350', margin: 5, textAlign: 'justify', fontSize: 13}}>환불 불가{`\n`}</Text>
                  결제일 이후 3일이 지나기 전까지:{`\n  `}
                  결제 금액의 100% 환불{`\n`}
                  결제일 이후 3일이 지난 시점에서 14일이 지나기 전까지:{`\n  `}
                  결제 금액의 50% 환불{`\n`}
                  결제일 이후 14일이 지난 시점부터:{`\n  `}
                  환불 불가{`\n`}
                  </Text> */}
                </View>
              )
            }
            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => setTermsModalVisibility(false)}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  닫기
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: screenWidth * 0.92,
    flex: 1,
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
  slotSection: {
    width: screenWidth * 0.85,
    backgroundColor: '#e8ebed',
    borderRadius: 15,
    alignItems: 'center',
    paddingBottom: 10,
    marginBottom: 15,
  },
  goodsWrapper: {
    width: screenWidth * 0.8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#93d07d',
    alignItems: 'center',
    borderRadius: 10,
    paddingLeft: 10,
    margin: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,

    elevation: 7,
  },
  buyButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1c40f',
    borderRadius: 5,
    margin: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  goodsTextWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  goodsText: {
    fontSize: 12,
    color: '#363636',
    fontFamily: 'NanumGothicBold',
    textAlign: 'center',
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
  buyResultModalWrapper: {
    width: screenWidth * 0.8,
    height: screenHeight * 0.5,
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
  input: {
    color: '#222222',
    width: screenWidth * 0.6,
    marginLeft: 5,
    padding: 5,
    fontFamily: 'NanumGothic',
  },
  termsButton: { justifyContent: 'center', backgroundColor: '#EF5350', padding: 7, borderRadius: 10 },
});

export default ShopScreen;
