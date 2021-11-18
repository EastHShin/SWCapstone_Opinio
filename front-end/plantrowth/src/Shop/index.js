import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import Footer from '../component/Footer';
import Ionicons from 'react-native-vector-icons/dist/Ionicons';
import Loader from '../Loader';
import {buyProfileSlot, setBuyProfileSlotState} from '../actions/ShopActions';
import {useSelector, useDispatch} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useIsFocused} from '@react-navigation/native';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

ShopScreen = () => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const point = useSelector(state => state.ShopReducer.point);
  const maxPlantNumber = useSelector(state => state.ShopReducer.maxPlantNumber);
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

        console.log('샵스크린 userId: ' + userId);
        setLoading(false);
      }
    });
  }, [isFocused]);

  useEffect(() => {
    if (buyProfileSlotState == 'success' && isFocused) {
      console.log('프로필 슬롯 구매 성공! ' + maxPlantNumber);
      setLoading(false);
      setBuyProfileSlotState('');
    } else if (buyProfileSlotState == 'failure' && isFocused) {
      console.log('프로필 슬롯 구매 실패! ');
      setLoading(false);
      setBuyProfileSlotState('');
    }
  }, [buyProfileSlotState]);

  const buySlotHandler = () => {
    setLoading(true);
    console.log('buySlotHandler 호출');
    dispatch(buyProfileSlot(userId));
  };

  return (
    <SafeAreaView
      style={{flex: 1, alignItems: 'center', justifyContent: 'space-between'}}>
      <Loader loading={loading} />
      <View style={styles.sectionWrapper}>
        <Text>ShopScreen</Text>
        <View style={{flex: 1, justifyContent: 'center'}}>
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
              onPress={() => buySlotHandler()}>
              <Ionicons name={'cash-outline'} size={30} color={'white'} />
            </TouchableOpacity>
          </View>
          {/* <View style={styles.goodsWrapper}>
            <View
              style={{
                width: screenWidth * 0.6,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.goodsText}>
                {'프로필 슬롯 1개 구매'}
              </Text>
              <Text style={styles.goodsText}>
                {'100원'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={() => buySlotHandler()}>
              <Ionicons name={'cash-outline'} size={30} color={'white'} />
            </TouchableOpacity>
          </View> */}
        </View>
      </View>
      <Footer name={'Shop'} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default ShopScreen;
