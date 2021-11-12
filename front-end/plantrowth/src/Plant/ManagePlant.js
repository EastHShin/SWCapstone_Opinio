import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { getProfile } from '../actions/PlantActions';

const ManagePlant = ({ route }) => {

  console.log('manage Plant에서 plant_id: ' + JSON.stringify(route.params));
  const plantId = route.params.plantId;
  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDeleteSuccess, setDeleteSuccess] = useState(false);
  const [isGetProfileSuccess, setGetProfileSuccess] = useState(false);

  const profile = useSelector(state => state.PlantReducer.profile)
  const deletePlantState = useSelector(state => state.PlantReducer.deleteResult);
  const getProfileState = useSelector(state => state.PlantReducer.getProfileResult);
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const navigation = useNavigation();


  // useEffect(() => {
  //   console.log('getProfileState: ' + getProfileState + ' isFocused: ' + isFocused);
  //   if (getProfileState == 'success' && isFocused) {
  //     console.log('useEffect에서 get profile success');
  //     setLoading(false);
  //     setGetProfileSuccess(true);
  //     dispatch(setGetProfileState(''));
  //   } else if (getProfileState == 'failure' && isFocused) {
  //     console.log('useEffect에서 get profile failure');
  //     setLoading(false);
  //     dispatch(setGetProfileState(''));
  //   }
  // }, [getProfileState]);

  useEffect(() => {
    dispatch(getProfile(plantId)); //plantId 추가
    console.log('Profile in use Effect: ' + JSON.stringify(profile));;
    setLoading(false);
  }, [isFocused]);

  useEffect(() => {
    console.log('deletePlantState: ' + deletePlantState + ' isFocused: ' + isFocused);
    if (deletePlantState == 'success' && isFocused) {
      console.log('useEffect에서 delete success');
      setLoading(false);
      setDeleteSuccess(true);
      dispatch(setDeletePlantState(''));
    } else if (deletePlantState == 'failure' && isFocused) {
      console.log('useEffec에서 delete failure');
      setLoading(false);
      dispatch(setDeletePlantState(''));
    }
  }, [deletePlantState]);


  const onPressDeleteHandler = () => {
    setLoading(true);

    dispatch(deletePlant(plantId));
  };


  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
    //console.warn('after picture: ' + plantImage);
  };

  const updatePlant = () => {

  }
  const deletePlant = () => {

  }

  const takePicture = () => {
    return new Promise((resolve, reject) => {
      launchCamera({ mediaType: 'photo' }, response => {
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
      launchImageLibrary({ mediaType: 'photo' }, response => {
        if (!response.didCancel) {
          // console.warn(response);
          // console.warn(response.assets[0].base64);
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
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Manage Plant Screen</Text>
      <Text>plant ID: {plantId}</Text>
      <Text>질병진단</Text>
      <View style={{ flexDirection: 'row' }}>
        <Button title="식물 정보 수정" onPress={() => updatePlant} />
        <Button title="식물 정보 삭제" onPress={() => deletePlant} />
        <Button title="사진 촬영" onPress={() => photoUpload('take')} />
        <Button title="이미지 선택" onPress={() => photoUpload('pick')} />
        <Button title="식물 일기" onPress={() => navigation.navigate('DiaryScreen', {plantId: plantId})} />
      </View>
    </View>
  )
};

const styles = StyleSheet.create({});

export default ManagePlant;
