import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  Animated,
  Text,
  Easing,
} from 'react-native';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native'
import { setLevelUpState, setEarnState } from './actions/PlantActions';

const LevelUp = props => {
  const { plant_level } = props;
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timeOut, setTimeOut] = useState(false);

  const isLevelUp = useSelector(state => state.PlantReducer.levelUp);

  const levelAnimation = useRef(new Animated.Value(0)).current;
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isLevelUp && isFocused) {
      setIsModalVisible(true);

    } else if (!isLevelUp & isFocused) {
      setTimeOut(false);
      endTextLevelUp();
      endNumberLevelUp();
    }
  }, [isLevelUp]);

  useEffect(() => {
    if (isModalVisible) {
      rotateX();

      Animated.loop(
        Animated.timing(shakeAnimation, {
          toValue: 3,
          duration: 1000,
          ease: Easing.bounce,
          useNativeDriver: true,
        }),
        {
          iterations: 4,
        },
      ).start();

      setTimeout(() => {
        setTimeOut(true);
        rotateX();
      }, 2000);
    }
  }, [isModalVisible]);

  const rotateX = () => {
    Animated.timing(levelAnimation, {
      toValue: 1,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const endTextLevelUp = () => {
    Animated.timing(shakeAnimation, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const endNumberLevelUp = () => {
    Animated.timing(levelAnimation, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start();
  };

  const interplated = shakeAnimation.interpolate({
    inputRange: [0, 0.5, 1, 1.5, 2, 2.5, 3],
    outputRange: [0, -15, 0, 15, 0, -15, 0],
  });

  const shakeStyles = {
    transform: [{ translateX: interplated }],
  };

  const levelUpStyles = {
    transform: [
      {
        rotateX: levelAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '360deg'],
        }),
      },
    ],
  };

  return (
    <Modal
      onBackButtonPress={() => {
        setTimeOut(false);
        setIsModalVisible(false);
        dispatch(setLevelUpState(false));
      }}
      isVisible={isModalVisible}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={styles.modalSectionWrapper}>
          <View style={styles.section}>
            <Animated.Text
              style={[
                { fontSize: 20, color: '#BEE9B4', fontWeight: 'bold' },
                shakeStyles,
              ]}>
              LEVEL UP !!
            </Animated.Text>
          </View>
          <View style={styles.section}>
            <Text style={{ fontSize: 35, color: '#000000' }}>Lv. </Text>

            <Animated.Text
              style={[levelUpStyles, { fontSize: 35, color: '#000000' }]}>
              {!timeOut ? plant_level - 1 : plant_level}
            </Animated.Text>
          </View>

          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.5}
            onPress={() => {
              setIsModalVisible(false);
              dispatch(setEarnState(true));
              setTimeout(() => {
                dispatch(setLevelUpState(false));
              }, 1000);

            }}>
            <Text style={{ color: '#000000' }}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default LevelUp;

const styles = StyleSheet.create({
  modalSectionWrapper: {
    backgroundColor: '#FFFFFF',
    height: Dimensions.get('window').height * 0.35,
    width: Dimensions.get('window').width * 0.8,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    height: 40,
    margin: 10,
  },
  button: {
    backgroundColor: '#BEE9B4',
    borderWidth: 0,
    height: Dimensions.get('window').height * 0.05,
    width: Dimensions.get('window').width * 0.25,
    marginTop: Dimensions.get('window').height * 0.09,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 5,
  },
});
