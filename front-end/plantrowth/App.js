import React, { useState, useEffect,useCallback }  from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import MyPageScreen from './src/MyPage';
import AsyncStorage from '@react-native-async-storage/async-storage';


const Stack = createNativeStackNavigator();

function App({navigation}) {

  useEffect(() => {

    AsyncStorage.getItem('user_id').then(value => {
      if (value != null) {
        
        messaging().onMessage(async remoteMessage => {
          console.log(remoteMessage.data.plant_id);

          Alert.alert(
            "물주기 알림", "식물에게 물을 줄 시간입니다!",[
                {
                    text:"취소",
                    onPress : () => console.log("취소")

            },
            {
                text:"확인",
                onPress : () => {
                    navigation.navigate("ManagePlantScreen", {plantId:remoteMessage.data.plant_id})
                }
            }
        ]
        )
        });

        messaging().setBackgroundMessageHandler(async remoteMessage => {
          console.log('Message handled in the background!', remoteMessage);
        });

        messaging().onNotificationOpenedApp(async remoteMessage => {
          console.log('open!');
          console.log(remoteMessage.data.plant_id);

          navigation.navigate("ManagePlantScreen",{plantId:remoteMessage.data.plant_id});

        })

      }
    })


  }, []);

 

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SplashScreen">

          <Stack.Screen
            name="SplashScreen"
            component={SplashScreen}
            options={{ 
              headerShown: false 
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
              headerShown: false
            }}
          />
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{
              headerShown: false
            }}
          />
          <Stack.Screen
            name="DiaryScreen"
            component={DiaryScreen}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="DiaryCreateScreen"
            component={DiaryCreateScreen}
            options={{
              headerShown: false
            }}
          />

          <Stack.Screen
            name="DiaryDetailScreen"
            component={DiaryDetailScreen}
            options={{
              headerShown: false
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
export default App;
