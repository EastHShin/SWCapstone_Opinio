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


const Stack = createNativeStackNavigator();

function App({navigation}) {

  //로그인 시 오고, 유저 아이디
//로그인 시에만 오게 
//테스트 중 
  useEffect(() => {
    messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage.data.plant_id);
      console.log(remoteMessage.data.user_id);
      // Alert.alert("식물에게 물을 줄 시간입니다!",[
      //   {
      //     text: "확인",
      //     onPress: () =>{
      //       navigation.navigate("RegisterScreen");
      //     }
      //   },
      //   {
      //     text:"취소"
      //   }
      // ])
    });

    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
      console.log(remoteMessage.data.plant_id); //이거다 
      
    });

    //알림 눌렀을 때 data로 온 plant 아이디 받아서 해당 식물로 이동
    messaging().onNotificationOpenedApp(async remoteMessage=>{
      console.log('open!');
     
      console.log(remoteMessage.data.plant_id);

      // navigation.navigate("")
      
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
