import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Image,
  SafeAreaView,
} from 'react-native';
import {getPlantList} from '../actions/PlantActions';
import {useSelector, useDispatch} from 'react-redux';
import {useIsFocused} from '@react-navigation/native';
import Loader from '../Loader';
import {useNavigation} from '@react-navigation/core';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const PlantList = () => {
  // let PlantList = Store.getState().Plant.plantList;
  const PlantList = useSelector(state => state.PlantReducer.plantList);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const navigation = useNavigation();

  useEffect(() => {
    setLoading(true);
    dispatch(getPlantList()); //userId 추가
    console.log('plantList in use Effect: ' + JSON.stringify(PlantList));
    console.log('PlantList 길이 in use Effect: ' + PlantList.length);
    setLoading(false);
  }, [isFocused]);
  //언마운트 때는 할 필요 없음

  const renderPlantList = PlantList => {
    //setLoading(true);
    console.log('plantList in render: ' + JSON.stringify(PlantList));
    console.log('PlantList 길이 in render: ' + PlantList.length);
    if (PlantList.length !== 0) {
      return PlantList
        ? PlantList.map((item, index) => {
            console.log('hi:' + item);
            return (
              <TouchableOpacity
                style={styles.profileContainer}
                key={index}
                onPress={() => {
                  navigation.navigate('ManagePlantScreen', {
                    profileData: item,
                    index: index,
                  });
                }}>
                <Image
                  source={{uri: item.fileName}} //file_name으로 수정 예정
                  style={styles.profileImage}
                />
                <Text>{item.plantName}</Text>
                {/* <Text>{item.profile.plant_exp}</Text> */}
              </TouchableOpacity>
            );
          })
        : null;
    }
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <Loader loading={loading} />
      <View style={styles.plantListWrapper}>
        <ScrollView
          contentContainerStyle={{
            justifyContent: 'flex-start',
            flexDirection: 'row',
            flexWrap: 'wrap',
          }}
          style={{
            backgroundColor: '#f0f0f0',
            padding: 5,
          }}>
          {renderPlantList(PlantList)}
          <TouchableOpacity
            style={[styles.profileContainer, {justifyContent: 'center'}]}
            onPress={() => navigation.navigate('AddProfileScreen')}>
            <Text>프로필 추가</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.profileContainer, {justifyContent: 'center'}]}
            onPress={() => navigation.navigate('ShopScreen')}>
            <Text>프로필 개수 추가</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  plantListWrapper: {
    flex: 1,
    backgroundColor: 'red',
    padding: 2,
  },
  profileContainer: {
    width: screenWidth * 0.273,
    height: screenHeight * 0.3,
    padding: 5,
    backgroundColor: '#C9E7BE',
    flexDirection: 'column',
    alignItems: 'center',
    margin: 5,
    shadowColor: '#cccccc',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    borderRadius: 10,
  },
  profileImage: {
    width: screenWidth * 0.2,
    height: screenWidth * 0.2,
    borderRadius: 20,
  },
});

export default PlantList;
