import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Dimensions,
  Button,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Keyboard,
  Alert,
} from 'react-native';
import { updatePlant, setUpdatePlantState } from '../actions/PlantActions';
import { useDispatch, useSelector } from 'react-redux';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import Loader from '../Loader';
import Modal from 'react-native-modal';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Slider from '@react-native-community/slider';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

UpdatePlantProfile = ({ route }) => {
  const [loading, setLoading] = useState(false);

  //const [plantName, setPlantName] = useState(route.params.profile.plant_name);
  const [plantName, setPlantName] = useState('');
  //const [plantSpecies, setPlantSpecies] = useState(route.params.profile.plant_species);
  const [plantSpecies, setPlantSpecies] = useState('');
  //const [plantBirth, setPlantBirth] = useState(route.params.profile.plant_birth);
  const [plantBirth, setPlantBirth] = useState('');
  const [plantTextBirth, setPlantTextBirth] = useState('');
  //const [alarmCycle, setAlarmCycle] = useState(route.params.profile.alarm_cycle);
  const [alarmCycle, setAlarmCycle] = useState();
  const [textAlarmCycle, setTextAlarmCycle] = useState('');
  const [lastWatering, setLastWatering] = useState(
    route.params.profile.recent_watering !== null
      ? route.params.profile.recent_watering
      : '',
  );
  //const [lastWatering, setLastWatering] = useState('');
  const [textLastWatering, setTextLastWatering] = useState('');
  //const [waterSupply, setWaterSupply] = useState(route.params.profile.water_supply);
  const [waterSupply, setWaterSupply] = useState();
  const [plantImage, setPlantImage] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);

  const [isDayPickerVisible, setDayPickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isWateringDatePickerVisible, setWateringDatePickerVisibility] =
    useState(false);

  const [updateSomething, setUpdateSomething] = useState(false);
  const updatePlantState = useSelector(
    state => state.PlantReducer.updateResult,
  );
  const isFocused = useIsFocused();
  const maximumDate = new Date();

  const dispatch = useDispatch();
  const navigation = useNavigation();
  const dayArray = [];

  for (let i = 0; i < 30; i++) {
    dayArray[i] = i + 1;
  }

  useEffect(() => {
    if (updatePlantState == 'success' && isFocused) {
      console.log('useEffect에서 success');
      setLoading(false);
      dispatch(setUpdatePlantState(''));
      navigation.goBack();
    } else if (updatePlantState == 'failure' && isFocused) {
      console.log('useEffect에서 failure');
      setLoading(false);
      dispatch(setUpdatePlantState(''));
    }
  }, [updatePlantState]);

  const onPressHandler = () => {
    console.log(updateSomething);
    const fd = new FormData();

    // if (plantSpecies !== '') {
    //   fd.append('plant_species', plantSpecies);
    //   setUpdateSomething(true);
    // }
    // if (plantName !== '') {
    //   fd.append('plant_name', plantName);
    //   setUpdateSomething(true);
    // }
    // if (plantBirth !== '') {
    //   fd.append('plant_birth', plantBirth);
    //   setUpdateSomething(true);
    // }
    // if (waterSupply !== undefined) {
    //   fd.append('water_supply', waterSupply);
    //   setUpdateSomething(true);
    // }
    // if (alarmCycle !== undefined) {
    //   fd.append('alarm_cycle', alarmCycle);
    //   setUpdateSomething(true);
    // }
    // if (plantImage !== '') {
    //   fd.append('file_name', {
    //     name: selectedImage.assets[0].fileName,
    //     uri: selectedImage.assets[0].uri,
    //     type: selectedImage.assets[0].type,
    //   });
    //   setUpdateSomething(true);
    // }
    if (updateSomething == false) {
      alert('아직 아무 정보도 수정하지 않으셨어요!');
      return;
    } else if (lastWatering == '') {
      Alert.alert(
        '마지막으로 물 준 날을 입력해주세요',
        '아직 물을 주지 않으셨나요?',
        [
          {
            text: '네',
            onPress: () => {
              const fd = new FormData();

              if (plantSpecies) fd.append('plant_species', plantSpecies);
              if (plantName) fd.append('plant_name', plantName);
              if (plantBirth) {
                console.log('update할 때' + plantBirth);
                fd.append('plant_birth', plantBirth);
                fd.append('recent_watering', plantBirth);
              } else {
                console.log(
                  'update할 때 not plantBirth' +
                    route.params.profile.plant_birth,
                );
                fd.append('recent_watering', route.params.profile.plant_birth);
              }

              if (waterSupply) fd.append('water_supply', waterSupply);
              if (alarmCycle) fd.append('alarm_cycle', alarmCycle);

              if (plantImage) {
                fd.append('file_name', {
                  name: selectedImage.assets[0].fileName,
                  uri: selectedImage.assets[0].uri,
                  type: selectedImage.assets[0].type,
                });
              }
              console.log(fd);
              setLoading(true);
              dispatch(updatePlant(fd, route.params.plantId));
            },
          },
          {
            text: '입력할게요',
            onPress: () => {
              return;
            },
          },
        ],
      );
    } else {
      const fd = new FormData();
      if (plantSpecies) fd.append('plant_species', plantSpecies);
      if (plantName) fd.append('plant_name', plantName);
      if (plantBirth) fd.append('plant_birth', plantBirth);

      if (waterSupply) fd.append('water_supply', waterSupply);
      if (alarmCycle) fd.append('alarm_cycle', alarmCycle);

      fd.append('recent_watering', lastWatering);

      if (plantImage) {
        fd.append('file_name', {
          name: selectedImage.assets[0].fileName,
          uri: selectedImage.assets[0].uri,
          type: selectedImage.assets[0].type,
        });
      }
      console.log(fd);
      setLoading(true);
      dispatch(updatePlant(fd, route.params.plantId));
    }
  };

  const showDatePicker = value => {
    if (value === 'plantBirth') {
      setDatePickerVisibility(true);
    } else if (value === 'watering') {
      setWateringDatePickerVisibility(true);
    }
  };

  const hideDatePicker = value => {
    if (value === 'plantBirth') {
      setDatePickerVisibility(false);
    } else if (value === 'watering') {
      setWateringDatePickerVisibility(false);
    }
  };

  const handlePlantBirthConfirm = date => {
    setDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setPlantBirth(year + '-' + month + '-' + day);
    setPlantTextBirth(year + '-' + month + '-' + day);
    setUpdateSomething(true);
  };

  const handleLastWateringConfirm = date => {
    setWateringDatePickerVisibility(false);

    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    setLastWatering(year + '-' + month + '-' + day);
    setTextLastWatering(year + '-' + month + '-' + day);
    setUpdateSomething(true);
  };

  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
  };

  const takePicture = () => {
    return new Promise((resolve, reject) => {
      launchCamera({ mediaType: 'photo' }, response => {
        if (!response.didCancel) {
          // console.warn(response);
          setPlantImage(response.assets[0].uri);
          setSelectedImage(response);
          setUpdateSomething(true);
          resolve(response);
        }
      });
    });
  };
  const selectImage = () => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (!response.didCancel) {
          // console.warn(response);
          // console.warn(response.assets[0].base64);
          setPlantImage(response.assets[0].uri);
          setSelectedImage(response);
          setUpdateSomething(true);
          resolve(response);
        }
      });
    });
  };

  const renderImage = () => {
    if (plantImage) {
      return (
        <Image
          style={{ width: screenWidth * 0.3, height: screenWidth * 0.3 }}
          source={{ uri: plantImage }}
        />
      );
    } else {
      return (
        <Image
          style={{ width: screenWidth * 0.3, height: screenWidth * 0.3 }}
          source={{ uri: route.params.profile.file_name }}
        />
      );
    }
  };
  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5,
        backgroundColor: '#BEE9B4',
      }}
    >
      <Loader loading={loading} />
      <View style={styles.sectionWrapper}>
        <KeyboardAwareScrollView>
          <Text
            style={{
              fontWeight: 'bold',
              color: '#556951',
              marginBottom: 10,
              textAlign: 'center',
            }}
          >
            식물 프로필 수정
          </Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TouchableOpacity
              style={styles.photoButton}
              activeOpacity={0.5}
              onPress={() => photoUpload('pick')}
            >
              <Icon name="image" size={35} color="#556951" />
            </TouchableOpacity>
            <View style={styles.imageWrapper}>{renderImage()}</View>
            <TouchableOpacity
              style={styles.photoButton}
              activeOpacity={0.5}
              onPress={() => photoUpload('take')}
            >
              <Icon name="camera" size={35} color="#556951" />
            </TouchableOpacity>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <FontAwesome name="pencil" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>식물 이름</Text>
              <TextInput
                style={styles.input}
                onChangeText={PlantName => {
                  setPlantName(PlantName);
                  setUpdateSomething(true);
                }}
                underlineColorAndroid="#666666"
                placeholder={route.params.profile.plant_name}
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-rose" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>식물 종</Text>
              <TextInput
                style={styles.input}
                onChangeText={PlantSpecies => {
                  setPlantSpecies(PlantSpecies);
                  setUpdateSomething(true);
                }}
                underlineColorAndroid="#666666"
                placeholder={route.params.profile.plant_species}
                placeholderTextColor="#808080"
                onSubmitEditing={Keyboard.dismiss}
              />
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-calendar" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>키우기 시작한 날짜</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => showDatePicker('plantBirth')}
              >
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder={route.params.profile.plant_birth}
                  placeholderTextColor="#808080"
                  underlineColorAndroid="#666666"
                  editable={false}
                  value={plantTextBirth}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handlePlantBirthConfirm}
              onCancel={() => hideDatePicker('plantBirth')}
              minimumDate={new Date(1921, 0, 1)}
              maximumDate={
                new Date(
                  maximumDate.getFullYear(),
                  maximumDate.getMonth(),
                  maximumDate.getDate() - 1,
                )
              }
            />
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="notifications" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>물 주기</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => setDayPickerVisibility(true)}
              >
                <TextInput
                  style={styles.input}
                  underlineColorAndroid="#666666"
                  placeholder={`물을 ${route.params.profile.alarm_cycle}일마다 줘요`}
                  placeholderTextColor="#808080"
                  editable={false}
                  value={textAlarmCycle}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
          </View>
          <Modal
            isVisible={isDayPickerVisible}
            onBackButtonPress={() => setDayPickerVisibility(false)}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'space-between',
                backgroundColor: 'white',
                width: screenWidth * 0.6,
                height: screenHeight * 0.5,
                padding: 10,
              }}
            >
              <View
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text> </Text>
                <View style={{ width: 150, height: 250 }}>
                  <ScrollPicker
                    dataSource={dayArray}
                    selectedIndex={route.params.profile.alarm_cycle}
                    onValueChange={selectedIndex => {
                      setAlarmCycle(selectedIndex);
                      setUpdateSomething(true);
                      setTextAlarmCycle(`물을 ${selectedIndex}일 마다 줘요`);
                    }}
                    wrapperHeight={250}
                    wrapperWidth={50}
                    itemHeight={50}
                    highlightColor={'#93d07d'}
                  />
                </View>
                <Text style={{ fontFamily: 'NanumGothicBold' }}> Days</Text>
              </View>

              <TouchableOpacity
                style={styles.ModalButton}
                onPress={() => {
                  setDayPickerVisibility(false);
                }}
              >
                <Text
                  style={{
                    fontFamily: 'NanumGothicBold',
                    textAlign: 'center',
                  }}
                >
                  닫기
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="water" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>물 주는 양</Text>
              <View
                style={{
                  backgroundColor: '#f7f8f9',
                  borderRadius: 5,
                  marginTop: 3,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'space-between',
                    marginTop: 10,
                    marginRight: 10,
                  }}
                >
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 11,
                      paddingLeft: 5,
                    }}
                  >
                    조금만
                  </Text>
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 11,
                      paddingRight: 10,
                    }}
                  >
                    적당히
                  </Text>
                  <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 11 }}>
                    많이
                  </Text>
                </View>
                <Slider
                  style={{
                    width: screenWidth * 0.6,
                    height: 20,
                    alignItems: 'center',
                  }}
                  minimumValue={1}
                  maximumValue={3}
                  step={1}
                  minimumTrackTintColor="#0067a3"
                  maximumTrackTintColor="#000000"
                  thumbTintColor="#0067a3"
                  value={route.params.profile.water_supply}
                  renderTrackMarkComponent={true}
                  onValueChange={value => {
                    setWaterSupply(value);
                    setUpdateSomething(true);
                  }}
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.iconWrapper}>
              <Icon name="md-calendar" size={30} color="#93d07d" />
            </View>
            <View>
              <Text style={styles.infoLabel}>마지막으로 물 준 날짜</Text>
              <TouchableOpacity
                style={{ backgroundColor: '#fff' }}
                onPress={() => showDatePicker('watering')}
              >
                <TextInput
                  pointerEvents="none"
                  style={styles.input}
                  placeholder={
                    route.params.profile.recent_watering
                      ? route.params.profile.recent_watering
                      : '식물에게 마지막으로 물을 준 날짜'
                  }
                  placeholderTextColor="#808080"
                  underlineColorAndroid="#666666"
                  editable={false}
                  value={textLastWatering}
                  onSubmitEditing={Keyboard.dismiss}
                />
              </TouchableOpacity>
            </View>
            <DateTimePickerModal
              isVisible={isWateringDatePickerVisible}
              mode="date"
              onConfirm={handleLastWateringConfirm}
              onCancel={() => hideDatePicker('watering')}
              //예외처리 해야함
              minimumDate={new Date(1921, 0, 1)}
              maximumDate={
                new Date(
                  maximumDate.getFullYear(),
                  maximumDate.getMonth(),
                  maximumDate.getDate() - 1,
                )
              }
            />
          </View>
        </KeyboardAwareScrollView>
        <View
          style={{
            width: 400,
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          >
            <FontAwesome name={'close'} size={40} color={'#e3242b'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => onPressHandler()}>
            <FontAwesome name={'check'} size={40} color={'#93d07d'} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};
export default UpdatePlantProfile;

const styles = StyleSheet.create({
  imageWrapper: {
    width: screenWidth * 0.3,
    height: screenWidth * 0.3,
    backgroundColor: '#f1f3f5',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
  },
  sectionWrapper: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth * 0.9,
    padding: 10,
    margin: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  section: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: screenWidth * 0.75,
    height: screenHeight * 0.09,
    marginTop: 5,
    paddingTop: 5,
  },
  input: {
    color: '#222222',
    width: screenWidth * 0.6,
    borderRadius: 5,
    fontFamily: 'NanumGothic',
    padding: 5,
    marginTop: 5,
    backgroundColor: '#f7f8f9',
  },
  photoButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 9,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ModalButton: {
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
  infoLabel: {
    fontFamily: 'NanumGothicBold',
    fontSize: 12,
    marginLeft: 10,
  },
});
