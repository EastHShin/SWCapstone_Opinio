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
import { buyProfileSlot, getShopInfo, setBuyProfileSlotState } from '../actions/ShopActions';
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
  const [buyByPoint, setBuyByPoint] = useState(false);
  const [paymentModalVisible, setPaymentModalVisibility] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const point = useSelector(state => state.ShopReducer.point);
  const maxPlantNumber = useSelector(state => state.ShopReducer.maxPlantNumber);
  const shopInfo = useSelector(state => state.ShopReducer.shopInfo);
  const buyProfileSlotState = useSelector(
    state => state.ShopReducer.buyProfileSlotResult,
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
  }, [isFocused]);

  useEffect(() => {
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
    }
  }, [buyProfileSlotState]);

  const buySlotHandler = (choice) => {
    if (choice == 'point') {
      setLoading(true);
      console.log('buySlotHandler 호출');
      dispatch(buyProfileSlot(userId));
    }
    else if (choice == 'cash') {
    }
  };


  const renderBuySlotByPoint = (byPoint) => {
    if (byPoint) {
      return (
        <View>
          <Text style={styles.buyResultText}>
            50포인트를 소모하여 보유하고 계신 포인트가
          </Text>
          <View style={{ flexDirection: 'row' }}>
            <Text
              style={[
                styles.buyResultText,
                { color: '#7e57c2', fontFamily: 'NanumGothicExtraBold' },
              ]}>
              {point}{' '}
            </Text>
            <Text style={styles.buyResultText}>포인트가 되었어요!</Text>
          </View>
        </View>
      )
    } else if (!byPoint) {
      return (
        <View>
          <Text style={styles.buyResultText}>
            100원을 결제하셨어요
          </Text>
        </View>
      )
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, alignItems: 'center' }}>
      <Loader loading={loading} />
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#C9E7BE',
        }}>
        <View style={styles.sectionWrapper}>
          <View style={{width: screenWidth*0.8, alignItems: 'center',}}>
            <Text style={{ fontFamily: 'NanumGothicBold'}}>Shop</Text>
            <Text style={{ fontFamily: 'NanumGothicBold'}}>이름: {shopInfo.user_name}</Text>
            <Text style={{ fontFamily: 'NanumGothicBold'}}>보유 포인트: {shopInfo.point}</Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <View style={styles.goodsWrapper}>
              <View
                style={{
                  width: screenWidth * 0.6,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.goodsText}>{'프로필 슬롯 1개 구매'}</Text>
                <Text style={styles.goodsText}>{'100포인트'}</Text>
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => buySlotHandler('point')}>
                <Ionicons name={'cash-outline'} size={30} color={'white'} />
              </TouchableOpacity>
            </View>
            <View style={styles.goodsWrapper}>
              <View
                style={{
                  width: screenWidth * 0.6,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.goodsText}>{'프로필 슬롯 1개 구매'}</Text>
                <Text style={styles.goodsText}>{'100원'}</Text>
              </View>
              <TouchableOpacity
                style={styles.buyButton}
                onPress={() => setPaymentModalVisibility(true)}>
                <Ionicons name={'cash-outline'} size={30} color={'white'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Footer name={'Shop'} />
      </View>
      <Modal
        isVisible={isBuySlotModalVisible}
        onBackButtonPress={() => {
          setBuySlotModalVisibility(false);
        }}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
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
                ]}>
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
              }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  확인
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal isVisible={paymentModalVisible}
        onBackButtonPress={() => setPaymentModalVisibility(false)}>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.buyResultModalWrapper}>
            <Text style={[styles.buyResultText, { fontSize: 18 }]}>
              휴대폰 번호 입력
            </Text>
            <TextInput
              style={styles.input}
              onChangeText={number => setPhone(number)}
              underlineColorAndroid="#000"
              placeholder="휴대폰 번호"
              placeholderTextColor="#808080"
              onSubmitEditing={Keyboard.dismiss}
            />
            <TextInput
              style={styles.input}
              onChangeText={name => setName(name)}
              underlineColorAndroid="#000"
              placeholder="구매자명"
              placeholderTextColor="#808080"
              onSubmitEditing={Keyboard.dismiss}
            />
            <TextInput
              style={styles.input}
              onChangeText={email => setEmail(email)}
              underlineColorAndroid="#000"
              placeholder="이메일"
              placeholderTextColor="#808080"
              onSubmitEditing={Keyboard.dismiss}
            />
            <TouchableOpacity
              style={styles.earnModalButton}
              onPress={() => {
                setPaymentModalVisibility(false);
                if (phone != '' && name != '', email != '') {
                  navigation.navigate('Payment', { userId: userId, phone: phone, email: email, name: name })
                }
              }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  확인
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
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
  goodsWrapper: {
    width: screenWidth * 0.75,
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
    borderRadius: 10,
    padding: 5,
    fontFamily: 'NanumGothic',
  },
});

export default ShopScreen;
