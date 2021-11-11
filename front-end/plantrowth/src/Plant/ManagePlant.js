import React, {useState} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/core';

const ManagePlant = () => {
  const [isLoading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const navigation = useNavigation();
  const photoUpload = async choice => {
    if (choice === 'take') {
      await takePicture();
    } else if (choice === 'pick') {
      await selectImage();
    }
    //console.warn('after picture: ' + plantImage);
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
          // console.warn(response);
          // console.warn(response.assets[0].base64);
          setSelectedImage(response);
          resolve(response);
        }
      });
    });
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Manage Plant Screen</Text>
      <Text>질병진단</Text>
      <View style={{flexDirection: 'row'}}>
        <Button title="사진 촬영" onPress={() => photoUpload('take')} />
        <Button title="이미지 선택" onPress={() => photoUpload('pick')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({});

export default ManagePlant;
