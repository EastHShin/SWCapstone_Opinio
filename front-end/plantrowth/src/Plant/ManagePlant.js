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
import LevelUp from '../LevelUp';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ManagePlant = ({route}) => {
  console.log('manage Plant에서 plant_id: ' + JSON.stringify(route.params));
  const plantId = route.params.plantId;
  const [testPoint, setTestPoint] = useState(route.params.point);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDiagnosisModalVisible, setDiagnosisModalVisibility] =
    useState(false);
  const [isInfoModalVisible, setInfoModalVisibility] = useState(false);
  const [isEarnModalVisible, setEarnModalVisibility] = useState(false);
  const [isDoingDiagnosis, setDoingDiagnosis] = useState(false);
  const [imagePath, setImagePath] = useState('');

  const profile = useSelector(state => state.PlantReducer.profile);
  const deletePlantState = useSelector(
    state => state.PlantReducer.deleteResult,
  );
  const wateringState = useSelector(state => state.PlantReducer.wateringResult);
  const diagnosisState = useSelector(
    state => state.PlantReducer.diagnosisResult,
  );
  const point = useSelector(state => state.PlantReducer.point);
  const exp = useSelector(state => state.PlantReducer.exp);
  const diagnosisChart = useSelector(
    state => state.PlantReducer.diagnosisChart,
  );
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    dispatch(getProfile(plantId)); //plantId 추가
    console.log('Profile in use Effect: ' + JSON.stringify(profile));
    setLoading(false);
  }, [isFocused, selectedImage]);

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
      setTestPoint(testPoint + 10);
      setLoading(false);
      dispatch(getProfile(plantId));
      dispatch(setWateringState(''));
      setDoingDiagnosis(false);
      setEarnModalVisibility(true);
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
      setLoading(false);
      dispatch(setDiagnosisState(''));
      setDoingDiagnosis(true);
      setSelectedImage(false);
      setEarnModalVisibility(true);
    } else if (diagnosisState == 'failure' && isFocused) {
      console.log('useEffect에서 diagnosis failure');
      setLoading(false);
      setSelectedImage(false);
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
            setInfoModalVisibility(false);
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

  const diagnosisHandler = () => {
    setDiagnosisModalVisibility(false);
    if (selectedImage) {
      console.log('selectedImage' + selectedImage);
      const fd = new FormData();
      fd.append('file_name', {
        name: selectedImage.assets[0].fileName,
        uri: selectedImage.assets[0].uri,
        type: selectedImage.assets[0].type,
      });
      console.log(fd);
      setImagePath(selectedImage.assets[0].uri);
      setLoading(true);
      setDoingDiagnosis(true);
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

  const renderWaterSupply = index => {
    switch (index) {
      case 1:
        return <Text style={styles.infoModalText}>조금만</Text>;
      case 2:
        return <Text style={styles.infoModalText}>적당히</Text>;
      case 3:
        return <Text style={styles.infoModalText}>많이</Text>;
      default:
        return;
    }
  };

  const renderExp = () => {
    console.log('plant_exp: ' + exp);
    console.log('plant_level: ' + profile.plant_level);
    if (profile.plant_level) {
      if (profile.plant_level == 1) return 30;
      else return 30 + (profile.plant_level - 1) * 10;
    } else return 0;
  };

  const renderEarnPoint = isDoingDiagnosis => {
    if (!isDoingDiagnosis)
      return (
        <View>
          <Text style={styles.earnText}>포인트를 10만큼 획득하셨어요!</Text>
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Text style={[styles.earnText, {fontSize: 16}]}>보유 포인트:</Text>
            <Text
              style={[
                styles.earnText,
                {
                  fontSize: 16,
                  fontFamily: 'NanumGothicExtraBold',
                  color: '#7e57c2',
                },
              ]}>
              {' '}
              {point}
            </Text>
            <Entypo name={'arrow-up'} size={20} color={'#93d07d'} />
          </View>
        </View>
      );
  };

  const renderDiagnosisModal = () => {
    if (selectedImage) {
      return (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: 'white',
            width: screenWidth * 0.6,
            padding: 10,
          }}>
          <View>
            <Image
              source={{uri: selectedImage.assets[0].uri}}
              style={{width: screenWidth * 0.55, height: screenWidth * 0.55}}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => {
                setDiagnosisModalVisibility(false);
              }}>
              <FontAwesome name={'close'} size={35} color={'#222222'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => diagnosisHandler()}>
              <FontAwesome name={'check'} size={35} color={'#222222'} />
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return (
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
              height: screenHeight * 0.2,
            }}>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => photoUpload('pick')}>
              <Text style={styles.imageModalText}>갤러리에서 이미지 선택</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.imageButton}
              onPress={() => photoUpload('take')}>
              <Text style={styles.imageModalText}>카메라로 이미지 촬영</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.infoModalButton}
            onPress={() => {
              setDiagnosisModalVisibility(false);
            }}>
            <FontAwesome name={'close'} size={35} color={'#222222'} />
          </TouchableOpacity>
        </View>
      );
    }
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
            backgroundColor: '#93d07d',
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
        <View style={styles.expWrapper}>
          <View style={styles.levelBar}>
            <View
              style={[
                styles.expBar,
                {
                  width: profile.plant_exp
                    ? (screenWidth * 0.6 * profile.plant_exp) / renderExp()
                    : 0,
                },
              ]}>
              <Text
                style={{
                  width: screenWidth * 0.6,
                  textAlign: 'center',
                  fontFamily: 'NanumGothicExtraBold',
                  color: '#363636',
                }}>
                {`LV. ${profile.plant_level} ( ${
                  profile.plant_exp
                } / ${renderExp()} )`}
              </Text>
            </View>
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
      <LevelUp />
      <View style={{justifyContent: 'space-between'}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity
            style={[styles.backButton, {marginLeft: 15, marginTop: 5}]}
            onPress={() => navigation.navigate('HomeScreen')}>
            <Icon name={'return-up-back'} size={40} color={'white'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.backButton, {marginRight: 15, marginTop: 5}]}
            onPress={() => navigation.navigate('ShopScreen', {point: point})}>
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
              justifyContent: 'space-between',
            }}>
            <View style={styles.plantNameWrapper}>
              <Text
                style={{
                  fontFamily: 'NanumGothicBold',
                  fontSize: 14,
                  color: '#363636',
                }}>
                {profile.plant_name}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.plantInfoButton}
              onPress={() => setInfoModalVisibility(true)}
              activeOpacity={1.0}>
              <Entypo name={'magnifying-glass'} size={30} color={'white'} />
            </TouchableOpacity>
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
              radius={(screenWidth * 0.29) / 2}
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
                <Text
                  style={{fontSize: 13, fontFamily: 'NanumGothicExtraBold'}}>
                  물 주기
                </Text>
                <Text style={{fontSize: 12, fontFamily: 'NanumGothicBold'}}>
                  {profile.remain_cycle}일 후
                </Text>
              </View>
            </ProgressCircle>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buttonOutside}
            onPress={() => {
              Alert.alert(
                `질병진단에는 30포인트가 소모돼요`,
                `질병진단을 계속 하시겠어요?`,
                [
                  {
                    text: '아니오',
                    onPress: () => {},
                  },
                  {
                    text: '계속할게요',
                    onPress: () => {
                      if (testPoint >= 30) {
                        setDiagnosisModalVisibility(true);
                      } else {
                        alert(
                          '갖고 계신 포인트가 모자라요!\n식물에게 물을 주거나, 식물일기를 작성하시면 포인트를 얻으실 수 있어요!\n',
                        );
                      }
                    },
                  },
                ],
              );
            }}>
            <View
              style={{
                flex: 1.5,
                alignItems: 'center',
                justifyContent: 'flex-end',
              }}>
              <FontAwesome name={'plus-square'} size={40} color={'#8ab833'} />
            </View>
            <View style={{flex: 1, alignItems: 'center'}}>
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NanumGothicExtraBold',
                  margin: 3,
                }}>
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
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: 'NanumGothicExtraBold',
                  margin: 3,
                }}>
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
        {renderDiagnosisModal()}
      </Modal>
      <Modal
        isVisible={isInfoModalVisible}
        onBackButtonPress={() => setInfoModalVisibility(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: screenWidth * 0.7,
            height: screenHeight * 0.7,
            backgroundColor: 'white',
            justifyContent: 'space-between',
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'NanumGothicBold',
              fontSize: 19,
              color: '#222222',
            }}>
            식물 상세정보
          </Text>
          <View style={{flex: 10, alignItems: 'flex-start', padding: 10}}>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>이름: </Text>
              <Text style={styles.infoModalText}>{profile.plant_name}</Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>식물 종: </Text>
              <Text style={styles.infoModalText}>{profile.plant_species}</Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>키우기 시작한 날짜: </Text>
              <Text style={styles.infoModalText}>{profile.plant_birth}</Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>최근에 물 준 날짜: </Text>
              <Text style={styles.infoModalText}>
                {profile.recent_watering}
              </Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>물 주는 정도: </Text>
              {renderWaterSupply(profile.water_supply)}
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>식물 레벨: </Text>
              <Text style={styles.infoModalText}>{profile.plant_name}</Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>현재 보유 경험치: </Text>
              <Text style={styles.infoModalText}>{profile.plant_exp}</Text>
            </View>
            <View style={styles.infoModalTextWrapper}>
              <Text style={styles.infoModalText}>
                레벨업 까지 필요한 경험치:{' '}
              </Text>
              <Text style={styles.infoModalText}>{profile.plant_exp}</Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-evenly',
              alignItems: 'center',
            }}>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => {
                setInfoModalVisibility(false);
                navigation.navigate('UpdatePlantProfileScreen', {
                  profile: profile,
                  plantId: plantId,
                });
              }}>
              <FontAwesome name={'pencil'} size={35} color={'#222222'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => {
                setInfoModalVisibility(false);
              }}>
              <FontAwesome name={'close'} size={35} color={'#222222'} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.infoModalButton}
              onPress={() => {
                deletePlantHandler();
              }}>
              <FontAwesome name={'trash'} size={35} color={'#222222'} />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        isVisible={isEarnModalVisible}
        onBackButtonPress={() => setEarnModalVisibility(false)}
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View
          style={{
            width: screenWidth * 0.6,
            height: screenHeight * 0.4,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: 5,
            paddingBottom: 10
          }}>
          {/* <EarnModal point={point}/> */}
          <View
            style={{
              marginTop: 5,
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            <Text style={[styles.earnText, {fontSize: 18}]}>축하드려요!</Text>
            {renderEarnPoint(isDoingDiagnosis)}
            <Text style={styles.earnText}>경험치를 10만큼 획득하셨어요!</Text>
            <View style={styles.expWrapper}>
              <View style={[styles.levelBar, {width: screenWidth * 0.5}]}>
                <View
                  style={[
                    styles.expBar,
                    {
                      width: exp
                        ? (screenWidth * 0.5 * exp) / renderExp()
                        : 0,
                    },
                  ]}>
                  <Text
                    style={{
                      width: screenWidth * 0.5,
                      textAlign: 'center',
                      fontFamily: 'NanumGothicBold',
                      color: '#363636',
                    }}>
                    {`LV. ${profile.plant_level} ( ${
                      exp
                    } / ${renderExp()} )`}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (isDoingDiagnosis) {
                setEarnModalVisibility(false);
                navigation.navigate('DiagnosisScreen', {
                  chart: diagnosisChart,
                  image: imagePath,
                });
              } else {
                setEarnModalVisibility(false);
              }
            }}>
            <View style={styles.earnModalButton}>
              <Text
                style={{fontFamily: 'NanumGothicBold', textAlign: 'center'}}>
                확인
              </Text>
            </View>
          </TouchableOpacity>
        </View>
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
    height: screenWidth * 0.29,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    margin: 10,
  },
  buttonOutside: {
    width: screenWidth * 0.29,
    height: screenWidth * 0.29,
    borderRadius: (screenWidth * 0.29) / 2,
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
    marginLeft: 15,
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
    height: screenHeight * 0.03,
    borderRadius: 5,
    justifyContent: 'center',
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
    height: 40,
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
  infoModalButton: {
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageButton: {
    width: screenWidth * 0.5,
    height: 50,
    margin: 3,
    backgroundColor: 'white',
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
  imageModalText: {
    fontFamily: 'NanumGothicBold',
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
  },
  infoModalText: {
    fontFamily: 'NanumGothicBold',
    color: '#363636',
    fontSize: 13,
    margin: 10,
  },
  infoModalTextWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  earnText: {
    fontFamily: 'NanumGothicBold',
    marginTop: 10,
    marginBottom: 5,
    color: '#363636',
    fontSize: 13,
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
});

export default ManagePlant;
