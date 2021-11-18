import React, {useState, useEffect, useCallback} from 'react';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from './src/Auth/LoginScreen';
import RegisterScreen from './src/Auth/RegisterScreen';
import SplashScreen from './src/Auth/SplashScreen';
import HomeScreen from './HomeScreen';
import DiaryScreen from './src/Diary/DiaryScreen';
import DiaryCreateScreen from './src/Diary/DiaryCreateScreen';
import DiaryDetailScreen from './src/Diary/DiaryDetail';
import DiaryEditScreen from './src/Diary/DiaryEditScreen';
import messaging from '@react-native-firebase/messaging';
import {Provider} from 'react-redux';
import Store from './src/store';
import AddProfileScreen from './src/Plant/AddPlantProfile';
import ManagePlantScreen from './src/Plant/ManagePlant';
import CommunityScreen from './src/Community';
import ShopScreen from './src/Shop';
import MyPageScreen from './src/MyPage/MyPageScreen';
import AccountInfoScreen from './src/MyPage/AccountInfoScreen';
import AccountDeleteScreen from './src/MyPage/AccountDelete';
import AccountEditScreen from './src/MyPage/AccountEditScreen';
import DiseaseDiagnosisHistoryScreen from './src/MyPage/DiseaseDiagnosisHistoryScreen';
import PointHistoryScreen from './src/MyPage/PointHistoryScreen';
import {Alert} from 'react-native';
import UpdatePlantProfileScreen from './src/Plant/UpdatePlantProfile';
import DiagnosisScreen from './src/Plant/DiagnosisScreen';
import * as RootNavigation from './RootNavigation';
import {navigationRef} from './RootNavigation';
const Stack = createNativeStackNavigator();

function App({navigation}) {
  //로그인 시 오고, 유저 아이디
  //로그인 시에만 오게
  //테스트 중
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage.data.plant_id);

      Alert.alert('물주기 알림', '식물에게 물을 줄 시간입니다!', [
        {
          text: '취소',
          onPress: () => console.log('취소'),
        },
        {
          text: '확인',
          onPress: () => {
            RootNavigation.navigate('ManagePlantScreen', {
              plantId: remoteMessage.data.plant_id,
            });
          },
        },
      ]);
    });
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    messaging().onNotificationOpenedApp(async remoteMessage => {
      console.log('open!');
      console.log(remoteMessage.data.plant_id);

      RootNavigation.navigate('ManagePlantScreen', {
        plantId: remoteMessage.data.plant_id,
      });
    });
  }, []);

  return (
    <Provider store={Store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName="SplashScreen">
          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="RegisterScreen"
            component={RegisterScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DiaryScreen"
            component={DiaryScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="DiaryCreateScreen"
            component={DiaryCreateScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="DiaryDetailScreen"
            component={DiaryDetailScreen}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="DiaryEditScreen"
            component={DiaryEditScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AddProfileScreen"
            component={AddProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ManagePlantScreen"
            component={ManagePlantScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="CommunityScreen"
            component={CommunityScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ShopScreen"
            component={ShopScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="MyPageScreen"
            component={MyPageScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AccountInfoScreen"
            component={AccountInfoScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="UpdatePlantProfileScreen"
            component={UpdatePlantProfileScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AccountEditScreen"
            component={AccountEditScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="AccountDeleteScreen"
            component={AccountDeleteScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DiseaseDiagnosisHistoryScreen"
            component={DiseaseDiagnosisHistoryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="PointHistoryScreen"
            component={PointHistoryScreen}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="DiagnosisScreen"
            component={DiagnosisScreen}
            options={{
              headerShown: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
