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
} from 'react-native';
import Loader from '../Loader';
import {useSelector, useDispatch} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation, useIsFocused} from '@react-navigation/native';
import {
  getProfile,
  deletePlant,
  setDeletePlantState,
} from '../actions/PlantActions';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const ManagePlant = ({route}) => {
  console.log('manage Plant에서 plant_id: ' + JSON.stringify(route.params));
  const plantId = route.params.plantId;
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteSuccess, setDeleteSuccess] = useState(false);
  const [isGetProfileSuccess, setGetProfileSuccess] = useState(false);

  const profile = useSelector(state => state.PlantReducer.profile);
  const deletePlantState = useSelector(
    state => state.PlantReducer.deleteResult,
  );
  const getProfileState = useSelector(
    state => state.PlantReducer.getProfileResult,
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
      setDeleteSuccess(true);
      dispatch(setDeletePlantState(''));
      navigation.navigate('HomeScreen');
    } else if (deletePlantState == 'failure' && isFocused) {
      console.log('useEffec에서 delete failure');
      setLoading(false);
      dispatch(setDeletePlantState(''));
    }
  }, [deletePlantState]);

  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
    //console.warn('after picture: ' + plantImage);
  };

  const deletePlantHandler = () => {
    setLoading(true);
    console.log('deletePlantHandler 호출');
    dispatch(deletePlant(plantId));
  };

  const takePicture = () => {
    return new Promise((resolve, reject) => {
      launchCamera({mediaType: 'photo'}, response => {
        if (!response.didCancel) {
          // console.warn(response);
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

  // if (isGetProfileSuccess) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <Text>Manage Plant Screen</Text>
  //       <Text>{profile.plant_id}</Text>
  //       <Text>질병진단</Text>
  //       <View style={{ flexDirection: 'row' }}>
  //         <Button title="식물 정보 수정" onPress={() => updatePlant} />
  //         <Button title="식물 정보 삭제" onPress={() => deletePlant} />
  //         <Button title="사진 촬영" onPress={() => photoUpload('take')} />
  //         <Button title="이미지 선택" onPress={() => photoUpload('pick')} />
  //       </View>
  //     </View>
  //   );
  // }
  // else return (
  //   <View>
  //     <Text>
  //       식물 관리화면 불러오는 중
  //     </Text>
  //   </View>);
  const renderProfile = profile => {
    console.log('renderProfile에서: ' + JSON.stringify(profile));
    return profile ? (
      <View style={{alignItems:'center'}}>
        <Text>{profile.plant_name}</Text>

        <Image style = {{width: 300, height: 300, borderRadius: 15, borderWidth: 5, borderColor: '#C9E7BE'}}source={{uri: profile.file_name}} />
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
          <Button title="식물 정보 수정" onPress={() => navigation.navigate('UpdatePlantProfileScreen', {profile: profile})} />
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
          onPress={() => alert('물 줬음')}>
          <Text style={styles.tabLabel}>물 주기</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => alert('질병진단 했음')}>
          <Text style={styles.tabLabel}>질병 진단</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() =>
            navigation.navigate('DiaryScreen', {plantId: plantId})
          }>
          <Text style={styles.tabLabel}>식물 일기</Text>
        </TouchableOpacity>
      </View>
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
