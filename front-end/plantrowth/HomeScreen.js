import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Button,
    Dimensions,
    TouchableOpacity,
    ScrollView,
    Image,
    Pressable,
    SafeAreaView,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { useIsFocused, useNavigation } from '@react-navigation/core';
import Footer from './src/component/Footer';
import Loader from './src/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getHomeInfo } from './src/actions/HomeActions';
import { logoutUser } from './src/actions/userActions';

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

HomeScreen = () => {
    const navigation = useNavigation();
    const isFocused = useIsFocused();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    const [userId, setUserId] = useState('');

    const infoList = useSelector(state => state.HomeReducer.infoList);
    const [name, setName] = useState('');
    const isLogin = useSelector(state => state.userReducer.isLogin);

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        if (isLogin == 'end') {
            navigation.replace('LoginScreen');
        }

    }, [isLogin])

    const getData = () => {
        try {
            AsyncStorage.getItem('userId').then(value => {
                if (value != null) {
                    setName(JSON.parse(value));
                };
            })
        } catch (error) {
            console.log(error);

        }
    }

    AsyncStorage.getItem('userId').then(value => {
        if (value !== null) {
            setUserId(JSON.parse(value));
            console.log('userId in async: ' + userId);
        }
    }).catch(err => {
        console.log(err);
    })

    useEffect(() => {
        if (userId !== null && userId !== undefined) {
            console.log('홈스크린 userId: '+userId);
            dispatch(getHomeInfo(userId));
            //console.log('홈인포 in use Effect: ');
            //console.log('홈인포 길이 in use Effect: ');
            setLoading(false);
        } else {
            console.log('userId가 없어요');
        }
    }, [isFocused])

    const renderPlantList = (PlantList) => {
        if (PlantList !== null && PlantList !== undefined) {
            return PlantList
                ? PlantList.map((item, index) => {
                    console.log('hi:' + item);
                    return (
                        <TouchableOpacity
                            style={styles.profileContainer}
                            key={index}
                            onPress={() => {
                                navigation.navigate('ManagePlantScreen', {
                                    plantId: item.plant_id
                                });
                            }}>
                            <Image
                                source={{ uri: item.file_name }}
                                style={styles.profileImage}
                            />
                            <Text>{item.plant_name}</Text>
                            <Text>{item.plant_exp}</Text>
                        </TouchableOpacity>
                    );
                })
                : null;
        }
    };
    const PlantList = () => {
        console.log('plants: '+infoList.plants);
        return (
            <View style={styles.plantListWrapper}>
                <ScrollView
                    contentContainerStyle={{
                        justifyContent: 'flex-start',
                        flexDirection: 'row',
                        flexWrap: 'wrap',
                    }}
                    style={{
                        backgroundColor: '#f0f0f0',
                        borderRadius: 10,
                        padding: 5,
                    }}>
                    {renderPlantList(infoList.plants)}
                    <TouchableOpacity
                        style={[styles.profileContainer, { justifyContent: 'center' }]}
                        onPress={() => navigation.navigate('AddProfileScreen', { userId: userId })}>
                        <Text>프로필 추가</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.profileContainer, { justifyContent: 'center' }]}
                        onPress={() => navigation.navigate('ShopScreen')}>
                        <Text>프로필 개수 추가</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        )
    }


    return (
        <SafeAreaView>
            <Loader loading={loading} />
            <View
                style={{
                    backgroundColor: '#C9E7BE',
                    height: '100%',
                    justifyContent: 'space-between',
                }}>
                <View style={styles.memberInfoSectionWrapper}>
                    <Text>환영합니다! {infoList.user_name}님</Text>
                    <Text>보유 포인트: {infoList.point}</Text>
                </View>
                <View style={styles.plantListSectionWrapper}>


                    <PlantList />
                </View>
                <View style={styles.hotSectionWrapper}></View>
                <Footer />

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    memberInfoSectionWrapper: {
        flex: 2,
        backgroundColor: '#fff',
        //width: screenWidth*0.4,
        //height: screenHeight * 0.2,
        borderRadius: 15,
        margin: 5,
        padding: 5,
    },
    plantListSectionWrapper: {
        backgroundColor: '#fff',
        //width: screenWidth*0.4,
        flex: 6,
        borderRadius: 15,
        margin: 5,
        padding: 10,
    },
    hotSectionWrapper: {
        flex: 3,
        backgroundColor: '#fff',
        //width: screenWidth*0.4,
        //height: screenHeight * 0.2,
        borderRadius: 15,
        margin: 5,
    },
    plantListWrapper: {
        flex: 1,
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
        shadowOffset: { width: 0, height: 2 },
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

export default HomeScreen;