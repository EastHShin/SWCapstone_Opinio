
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AppRegistry, Alert } from 'react-native';
import { Provider } from 'react-redux';

import LoginScreen from './src/Auth/LoginScreen';
import RegisterScreen from './src/Auth/RegisterScreen';
import SplashScreen from './src/Auth/SplashScreen';
import HomeScreen from './HomeScreen';
import DiaryScreen from './src/Diary/DiaryScreen';
import DiaryCreateScreen from './src/Diary/DiaryCreateScreen';
import DiaryDetailScreen from './src/Diary/DiaryDetail';
import DiaryEditScreen from './src/Diary/DiaryEditScreen';
import messaging from '@react-native-firebase/messaging';
import Store from './src/store';
import AddProfileScreen from './src/Plant/AddPlantProfile';
import ManagePlantScreen from './src/Plant/ManagePlant';
import CommunityMainScreen from './src/Community/CommunityMainScreen';
import ShopScreen from './src/Shop';
import MyPageScreen from './src/MyPage/MyPageScreen';
import AccountInfoScreen from './src/MyPage/AccountInfoScreen';
import AccountDeleteNoticeScreen from './src/MyPage/AccountDeleteNoticeScreen';
import AccountDeleteScreen from './src/MyPage/AccountDeleteScreen';
import AccountEditScreen from './src/MyPage/AccountEditScreen';
import DiseaseDiagnosisHistoryScreen from './src/MyPage/DiseaseDiagnosisHistoryScreen';
import PointHistoryScreen from './src/MyPage/PointHistoryScreen';
import PlantDiagnosisScreen from './src/MyPage/PlantDiagonosisScreen';
import UpdatePlantProfileScreen from './src/Plant/UpdatePlantProfile';
import DiagnosisScreen from './src/Plant/DiagnosisScreen';
import PasswordCheckScreen from './src/MyPage/PasswordCheckScreen';
import PostCreateScreen from './src/Community/PostCreateScreen';
import PostEditScreen from './src/Community/PostEditScreen';
import PostDetailScreen from './src/Community/PostDetailScreen';
import Payment from './src/Shop/Payment';
import PaymentHistoryScreen from './src/MyPage/PaymentHistoryScreen';

import * as RootNavigation from './RootNavigation';
import { navigationRef } from './RootNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  AsyncStorage.setItem('plantId', JSON.stringify(remoteMessage.data.plant_id))
  
});


const  AppFirebase = () => {

  messaging().onNotificationOpenedApp(async remoteMessage => {
    console.log('open : ' + remoteMessage.data.plant_id);
    AsyncStorage.removeItem('plantId');
    RootNavigation.navigate('ManagePlantScreen', {
      plantId: remoteMessage.data.plant_id,
    });
  });


  useEffect(() => {

    const foreground = messaging().onMessage(async remoteMessage => {
      console.log('어플 안 : ' + remoteMessage.data.plant_id);
      console.log(remoteMessage.notification.body);
      Alert.alert('물주기 알림', remoteMessage.notification.body, [
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

    return foreground;
  }, []);

  return (
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
        name="CommunityMainScreen"
        component={CommunityMainScreen}
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
        name="AccountDeleteNoticeScreen"
        component={AccountDeleteNoticeScreen}
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

      <Stack.Screen
        name="PlantDiagnosisScreen"
        component={PlantDiagnosisScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PasswordCheckScreen"
        component={PasswordCheckScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostCreateScreen"
        component={PostCreateScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostEditScreen"
        component={PostEditScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PostDetailScreen"
        component={PostDetailScreen}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name="Payment"
        component={Payment}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="PaymentHistoryScreen"
        component={PaymentHistoryScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  )
}

  const App =() => {

  return (
    <Provider store={Store}>
      <AppFirebase />
    </Provider>
  );
}

export default App;

AppRegistry.registerComponent('plantrowth', () => App);