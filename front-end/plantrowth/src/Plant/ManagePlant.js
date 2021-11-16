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

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ManagePlant = ({route}) => {
  console.log('manage Plant에서 plant_id: ' + JSON.stringify(route.params));
  const plantId = route.params.plantId;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalVisible, setModalVisibility] = useState(false);

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
      setLoading(false);
      alert('질병진단 성공');
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
        <Text>{profile.plant_name}</Text>

        <Image
          style={{
            width: 300,
            height: 300,
            borderRadius: 15,
            borderWidth: 5,
            borderColor: '#C9E7BE',
          }}
          source={{uri: profile.file_name}}
        />
        <Text>{profile.plant_exp}</Text>
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
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <Text>Manage Plant Screen</Text>
        {renderProfile(profile)}
        <View style={{flexDirection: 'row'}}>
          <Button
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
          />
        </View>
      </View>
      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => {
            wateringHandler();
          }}>
          <Text style={styles.tabLabel}>물 주기</Text>
          <Text>{profile.remain_cycle}일 후</Text>
          <Text>
            수분량: {Math.floor((1-((profile.alarm_cycle - profile.remain_cycle) /
              profile.alarm_cycle))*
              100)}
            %
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setModalVisibility(true)}>
          <Text style={styles.tabLabel}>질병 진단</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() =>
            navigation.navigate('DiaryScreen', {plantId: plantId, plantImg: profile.file_name})
          }>
          <Text style={styles.tabLabel}>식물 일기</Text>
        </TouchableOpacity>
      </View>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={() => setModalVisibility(false)}
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
            onPress={() => setModalVisibility(false)}
            style={{margin: 10}}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  plantImage: {
    width: screenWidth * 0.5,
    height: screenWidth * 0.5,
  },
  tabLabel: {
    textAlign: 'center',
    justifyContent: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    width: screenWidth * 0.33,
    height: 60,
    backgroundColor: '#A0A0A0',
    borderColor: 'gray',
    borderWidth: 1,
  },
  tabs: {
    height: 60,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderColor: '#A0A0A0',
  },
});

export default ManagePlant;
