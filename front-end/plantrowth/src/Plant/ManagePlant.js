import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Alert,
} from 'react-native';
import Loader from '../Loader';
import {useSelector, useDispatch} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  getProfile,
  deletePlant,
  setDeletePlantState,
  waterPlant,
  setWateringState,
  diagnosisPlant,
  setDiagnosisState,
} from '../actions/PlantActions';
import Modal from 'react-native-modal';
import ProgressCircle from 'react-native-progress-circle';
import Icon from 'react-native-vector-icons/dist/Ionicons';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import Entypo from 'react-native-vector-icons/dist/Entypo';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ManagePlant = ({route}) => {
  console.log('manage Plant에서 plant_id: ' + JSON.stringify(route.params));
  const plantId = route.params.plantId;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDiagnosisModalVisible, setDiagnosisModalVisibility] = useState(false);
  const [isInfoModalVisible, setInfoModalVisibility] = useState(false);

  const profile = useSelector(state => state.PlantReducer.profile);
  const deletePlantState = useSelector(
    state => state.PlantReducer.deleteResult,
  );
  const wateringState = useSelector(state => state.PlantReducer.wateringResult);
  const diagnosisState = useSelector(
    state => state.PlantReducer.diagnosisResult,
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getProfile(plantId)); //plantId 추가
    console.log('Profile in use Effect: ' + JSON.stringify(profile));
    setLoading(false);
  }, [isFocused]);

  useEffect(() => {
    console.log(
      'deletePlantState: ' + deletePlantState + ' isFocused: ' + isFocused,
    );
    if (deletePlantState == 'success' && isFocused) {
      console.log('useEffect에서 delete success');
      setLoading(false);
      dispatch(setDeletePlantState(''));
      navigation.navigate('HomeScreen');
    } else if (deletePlantState == 'failure' && isFocused) {
      console.log('useEffect에서 delete failure');
      setLoading(false);
      dispatch(setDeletePlantState(''));
    }
  }, [deletePlantState]);

  useEffect(() => {
    console.log('wateringState: ' + wateringState + ' isFocused: ' + isFocused);
    if (wateringState == 'success' && isFocused) {
      console.log('useEffect에서 watering success');
      setLoading(false);
      alert('물 줬음');
      dispatch(getProfile(plantId));
      dispatch(setWateringState(''));
    } else if (wateringState == 'failure' && isFocused) {
      console.log('useEffect에서 watering failure');
      setLoading(false);
      dispatch(setWateringState(''));
    }
  }, [wateringState]);

  useEffect(() => {
    console.log(
      'diagnosisState: ' + diagnosisState + ' isFocused: ' + isFocused,
    );
    if (diagnosisState == 'success' && isFocused) {
      console.log('useEffect에서 diagnosis success');
      alert('질병진단 성공');
      setLoading(false);
      dispatch(setDiagnosisState(''));
      navigation.navigate('DiagnosisScreen');
    } else if (diagnosisState == 'failure' && isFocused) {
      console.log('useEffect에서 diagnosis failure');
      setLoading(false);
      dispatch(setDiagnosisState(''));
    }
  }, [diagnosisState]);

  const deletePlantHandler = () => {
    Alert.alert(
      `${profile.plant_name}과의 추억들이 모두 사라져요`,
      `그래도 ${profile.plant_name}를 떠나보내시겠어요?`,
      [
        {
          text: '잘 가, 안녕',
          onPress: () => {
            setLoading(true);
            console.log('deletePlantHandler 호출');
            dispatch(deletePlant(plantId));
          },
        },
        {
          text: '좀 더 생각해볼게요',
          onPress: () => {
            return;
          },
        },
      ],
    );
  };

  const wateringHandler = () => {
    setLoading(true);
    console.log('wateringHandler 호출');
    dispatch(waterPlant(plantId));
  };
  const diagnosisHandler = choice => {
    photoUpload(choice);
    setModalVisibility(false);
    if (selectedImage) {
      console.log('selectedImage' + selectedImage);
      const fd = new FormData();
      fd.append('file_name', {
        name: selectedImage.assets[0].fileName,
        uri: selectedImage.assets[0].uri,
        type: selectedImage.assets[0].type,
      });
      console.log(fd);
      setLoading(true);
      dispatch(diagnosisPlant(plantId, fd));
    }
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
      launchCamera({mediaType: 'photo'}, response => {
        if (!response.didCancel) {
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };
  const selectImage = () => {
    return new Promise((resolve, reject) => {
      launchImageLibrary({mediaType: 'photo'}, response => {
        if (!response.didCancel) {
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };

  const renderProfile = profile => {
    console.log('renderProfile에서: ' + JSON.stringify(profile));
    return profile ? (
      <View style={{alignItems: 'center'}}>
        <View
          style={{
            borderRadius: 15,
            borderWidth: 5,
            borderColor: '#93d07d',
            backgroundColor:'#93d07d',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,

            elevation: 10,
          }}>
          <Image
            style={{
              width: 300,
              height: 300,
              borderRadius: 10,
            }}
            source={{uri: profile.file_name}}
          />
        </View>
        <View style={styles.plantNameWrapper}>
          <Text style={{fontWeight: 'bold', fontSize: 14}}>
            {profile.plant_name}
          </Text>
        </View>
        <View style={styles.expWrapper}>
          <Text>{profile.plant_exp}</Text>
          <View style={styles.levelBar}>
            <View style={styles.expBar}></View>
          </View>
        </View>
      </View>
    ) : null;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <Loader loading={loading} />
      <View style={{justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={[styles.backButton, {marginLeft: 15, marginTop: 5}]}
            onPRess={() => navigation.goBack()}>
            <Icon name={'return-up-back'} size={40} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backButton, {marginRight: 15, marginTop: 5}]}
            onPress={() => navigation.navigate('ShopScreen')}>
            <Entypo name={'shop'} size={40} color={'white'} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 300,
              flexDirection: 'row',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity style={styles.plantInfoButton}>
              <Entypo name={'magnifying-glass'} size={30} color={'white'} />
            </TouchableOpacity>
            {/* <Button
              title="식물 정보 수정"
              onPress={() =>
                navigation.navigate('UpdatePlantProfileScreen', {
                  profile: profile,
                  plantId: plantId,
                })
              }
            />
            <Button
              title="식물 정보 삭제"
              onPress={() => {
                deletePlantHandler();
              }}
            /> */}
          </View>
          {renderProfile(profile)}
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.buttonOutside}
            onPress={() => {
              wateringHandler();
            }}>
            <ProgressCircle
              percent={Math.floor(
                (1 -
                  (profile.alarm_cycle - profile.remain_cycle) /
                    profile.alarm_cycle) *
                  100,
              )}
              radius={(screenWidth * 0.27) / 2}
              borderWidth={8}
              color="#5d9cec"
              shadowColor="#e8ebed"
              bgColor="#fff">
              <View
                style={{
                  flex: 1.5,
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}>
                <Icon name={'water'} size={40} color={'#5d9cec'} />
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <Text style={{fontSize: 13, fontWeight: 'bold'}}>물 주기</Text>
                <Text style={{fontSize: 12, fontWeight: 'bold'}}>
                  {profile.remain_cycle}일 후
                </Text>
              </View>
            </ProgressCircle>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOutside}
            onPress={() => setModalVisibility(true)}>
            <View
              style={{
                flex: 1.5,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <FontAwesome name={'plus-square'} size={40} color={'#8ab833'} />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontSize: 14, fontWeight: 'bold', margin: 3}}>
                질병진단
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.buttonOutside, {borderColor: '#a07e63'}]}
            onPress={() =>
              navigation.navigate('DiaryScreen', {
                plantId: plantId,
                plantImg: profile.file_name,
              })
            }>
            <View
              style={{
                flex: 1.5,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <Entypo name={'book'} size={40} color={'#a07e63'} />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text style={{fontSize: 14, fontWeight: 'bold', margin: 3}}>
                식물일기
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        isVisible={isDiagnosisModalVisible}
        onBackButtonPress={() => setDiagnosisModalVisibility(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            width: screenWidth * 0.6,
            padding: 10,
          }}>
          <View
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              height: screenHeight * 0.1,
            }}>
            <TouchableOpacity
              style={{margin: 10}}
              onPress={() => diagnosisHandler('pick')}>
              <Text>갤러리에서 이미지 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{margin: 10}}
              onPress={() => diagnosisHandler('take')}>
              <Text>카메라로 이미지 촬영</Text>
            </TouchableOpacity>
          </View>

          <Button
            title="close"
            onPress={() => setDiagnosisModalVisibility(false)}
            style={{margin: 10}}
          />
        </View>
      </Modal>
      <Modal>
        isVisible = {}
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  plantImage: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabs: {
    width: '100%',
    height: screenWidth * 0.27,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 10,
  },
  buttonOutside: {
    width: screenWidth * 0.27,
    height: screenWidth * 0.27,
    borderRadius: (screenWidth * 0.27) / 2,
    borderWidth: 8,
    borderColor: '#8ab833',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plantNameWrapper: {
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  expWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 5,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingLeft: 5,
    paddingRight: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelBar: {
    backgroundColor: 'white',
    width: screenWidth * 0.6,
    height: screenHeight * 0.03,
    borderRadius: 5,
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  expBar: {
    backgroundColor: '#f1c40f',
    //50+LV*10
    //width: screenWidth * 0.6 * ((50) - infoList.plant_exp)/
    height: screenHeight * 0.03,
    borderRadius: 5,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: '#93d07d',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.55,
    shadowRadius: 3.84,
    elevation: 7,
  },
  plantInfoButton: {
    width: 40,
    height: 35,
    paddingTop: 3,
    backgroundColor: '#93d07d',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,

    elevation: 10,
  },
});

export default ManagePlant;
