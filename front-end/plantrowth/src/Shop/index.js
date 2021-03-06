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
  Alert,
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
import { ScrollView } from 'react-native-gesture-handler';

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
      console.log('????????? ?????? ???????????? ?????? ??????! ' + maxPlantNumber);
      setLoading(false);
      setBuyByPoint(true);
      setBuySlotModalVisibility(true);
      dispatch(setBuyProfileSlotState(''));
    } else if (buyProfileSlotState == 'cash' && isFocused) {
      console.log('????????? ?????? ????????? ?????? ??????! ' + maxPlantNumber);
      setLoading(false);
      setBuyByPoint(false);
      setBuySlotModalVisibility(true);
      dispatch(setBuyProfileSlotState(''));
    } else if (buyProfileSlotState == 'failure' && isFocused) {
      console.log('????????? ?????? ?????? ??????! ');
      setLoading(false);
      Alert.alert('????????? ?????? ?????? ?????? ??????', '????????? ???????????? ???????????????\n?????? ?????????????????????', [{
        text: '???????????????',
        onPress: () => { return }
      }])
      dispatch(setBuyProfileSlotState(''));
    } else if (buySubscribeState == 'success' && isFocused) {
      console.log('???????????? ?????? ??????');
      setLoading(false);
      setBuySubscribeModalVisibility(true);
      dispatch(setBuySubscribeState(''));
    } else if (buySubscribeState == 'failure' && isFocused) {
      console.log('???????????? ?????? ??????');
      setLoading(false);
      Alert.alert('???????????? ?????? ?????? ??????', '????????? ???????????? ???????????????\n?????? ?????????????????????', [{
        text: '???????????????',
        onPress: () => { return }
      }])
      dispatch(setBuySubscribeState(''));
    }
    console.log('setName');
    setName('');
    setPhone('');
  }, [isFocused, buyProfileSlotState, buySubscribeState]);

  const buySlotHandler = () => {
    console.log(shopInfo.point);
    if (shopInfo.point >= 300) {
      setLoading(true);
      dispatch(buyProfileSlot(userId));
    } else {

      Alert.alert('?????? ??????', '???????????? ???????????? ????????? ??????????????????.', [{
        text: '???????????????',
        onPress: () => { return }
      }])
    }
  };

  const renderBuySlotByPoint = byPoint => {
    if (byPoint) {
      return (
        <View>
          <Text style={styles.buyResultText}>
            300???????????? ???????????? ???????????? ?????? ????????????
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
            <Text style={styles.buyResultText}>???????????? ????????????!</Text>
          </View>
        </View>
      );
    } else if (!byPoint) {
      return <Text style={styles.buyResultText}>1000?????? ??????????????????</Text>;
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
              ??????{`\n`}
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
                ???????????????!{`\n`}
                {shopInfo.user_name}?????? ?????? ?????????: {shopInfo.point}
              </Text>
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.slotSection}>
              <View style={styles.goodsWrapper}>
                <View style={styles.goodsTextWrapper}>
                  <Text style={styles.goodsText}>{'????????? ?????? 1??? ??????'}</Text>
                  <Text style={styles.goodsText}>{'300?????????'}</Text>
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
                  <Text style={styles.goodsText}>{'????????? ?????? 1??? ??????'}</Text>
                  <Text style={styles.goodsText}>{'1000???'}</Text>
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
                    ????????? ?????????????
                  </Text>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => {
                      setTermsType('SLOT');
                      setTermsModalVisibility(true);
                    }}
                  >
                    <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>?????? ??????</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    color: '#363636',
                    fontSize: 13,
                  }}
                >
                  ????????? ??? ?????? ?????? ???????????? ????????? 1??? ????????????!
                </Text>
              </View>
            </View>
            <View style={styles.slotSection}>
              <View style={styles.goodsWrapper}>
                <View style={styles.goodsTextWrapper}>
                  <Text style={styles.goodsText}>
                    {'???????????? ?????? ????????? ??????'}
                  </Text>
                  <Text style={styles.goodsText}>{'5900???/???'}</Text>
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
                      ?????? ???
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
                    ???????????? ?????? ?????????????
                  </Text>
                  <TouchableOpacity
                    style={styles.termsButton}
                    onPress={() => {
                      setTermsType('DIAGNOSIS');
                      setTermsModalVisibility(true);
                    }}
                  >
                    <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>?????? ??????</Text>
                  </TouchableOpacity>
                </View>
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    color: '#363636',
                    fontSize: 13,
                  }}
                >
                  ??? ?????? ????????? ????????????,{`\n`}????????? ?????? ?????? ???????????? ?????????
                  ????????? ??? ?????????!
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
              ?????? ?????? ??????
            </Text>
            {renderBuySlotByPoint(buyByPoint)}
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.buyResultText}>????????? </Text>
              <Text
                style={[
                  styles.buyResultText,
                  { color: '#93d07d', fontFamily: 'NanumGothicExtraBold' },
                ]}
              >
                {maxPlantNumber}
              </Text>
              <Text style={styles.buyResultText}>
                ??? ????????? ??? ?????? ????????????!
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
                  ??????
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
                {`???????????? ?????? ?????????\n?????? ??????`}
              </Text>
              <Text style={[styles.buyResultText, { fontSize: 14 }]}>
                ?????? ??????????????? ???????????? ?????????
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
                  ??????
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
              ????????? ?????? ??????
            </Text>
            <View>
              <Text
                style={{
                  fontFamily: 'NanumGothicBold',
                  color: '#363636',
                  fontSize: 13,
                }}
              >
                ????????????
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={name => setName(name)}
                underlineColorAndroid="#000"
                placeholder="????????????"
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
                ????????????
              </Text>
              <TextInput
                style={styles.input}
                onChangeText={number => setPhone(number)}
                underlineColorAndroid="#000"
                placeholder="????????????"
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
                ?????????
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
            <View style={{ width: screenWidth * 0.4, flexDirection: 'row', justifyContent: 'space-evenly' }}>
              <TouchableOpacity
                style={[styles.earnModalButton, { backgroundColor: '#ef5350' }]}
                onPress={() => {
                  setPaymentModalVisibility(false);
                  setName('');
                  setPhone('');
                }}
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16, color: 'white' }}>
                    ??????
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.earnModalButton}
                onPress={() => {
                  console.log('email:' + email);
                  console.log('user name' + name);
                  console.log('phone' + phone);
                  if (phone != '' && name != '') {
                    setPaymentModalVisibility(false);
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
                  } else {
                    console.log('???????????? ?????????');
                    Alert.alert(
                      '?????? ?????? ?????????',
                      '????????? ?????? ????????? ??????????????????!',
                      [
                        {
                          text: '???????????????',
                          onPress: () => {
                            return;
                          },
                        },
                      ],
                    );
                  }
                }}
              >
                <View
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16, color: 'white' }}>
                    ??????
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isTermsModalVisible}
        onBackButtonPress={() => setTermsModalVisibility(false)}>
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <View style={[styles.buyResultModalWrapper, { height: termsType == 'SLOT' ? screenHeight * 0.3 : screenHeight * 0.55 }]}>
            <Text style={[styles.buyResultText, { fontSize: 18, marginBottom: 10 }]}>
              ?????? ??????
            </Text>
            {termsType == 'SLOT'
              ? (
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <Text style={{ color: '#363636', textAlign: 'justify', fontSize: 14 }}>????????? ?????? ??? </Text>
                  <Text style={{ color: '#ef5350', textAlign: 'justify', fontSize: 14 }}>????????? ?????????</Text>
                  <Text style={{ color: '#363636', textAlign: 'justify', fontSize: 14 }}>??? ???????????????</Text>
                </View>
              ) : (
                <ScrollView>
                  <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 16, margin: 5 }}>
                    {`\n?????? ?????? ????????? ?????? ??????`}
                  </Text>
                  <Text style={{ color: '#363636', margin: 5, textAlign: 'justify', fontSize: 13 }}>
                    ?????? ????????? ??? ??? ????????? ????????????, ?????? ????????? ?????? ????????? ????????? ???????????????.
                    ?????? ??????, 3??? 1??? 23??? 59?????? ???????????????, 4??? 1??? 0?????? ????????? ???????????????.
                  </Text>
                  <Text style={{ color: '#363636', fontFamily: 'NanumGothicBold', fontSize: 16, margin: 5 }}>
                    {'\n'}?????? ??????
                  </Text>
                  <Text style={{ color: '#363636', textAlign: 'justify', fontSize: 13 }}>
                    ???????????? ???????????? ????????? ????????? ???????????? ?????? ???:
                  </Text>
                  <Text style={{ color: '#ef5350', textAlign: 'justify', fontSize: 14 }}>{`  ?????? ??????\n`}</Text>
                  <Text style={{ color: '#363636', textAlign: 'justify', fontSize: 13 }}>
                    ????????? ?????? 3?????? ????????? ?????????:{`\n  `}
                    ?????? ????????? 100% ??????{`\n\n`}
                    ????????? ?????? 3?????? ?????? ???????????? 14?????? ????????? ?????????:{`\n  `}
                    ?????? ????????? 50% ??????{`\n\n`}
                    ????????? ?????? 14?????? ?????? ????????????:
                  </Text>
                  <Text style={{ color: '#ef5350', textAlign: 'justify', fontSize: 13 }}>
                    {`  ?????? ??????\n`}
                  </Text>
                </ScrollView>
              )
            }
            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => setTermsModalVisibility(false)}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  ??????
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
  termsButton: {
    justifyContent: 'center',
    backgroundColor: '#EF5350',
    padding: 7, borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default ShopScreen;
