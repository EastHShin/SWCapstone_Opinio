import * as React from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import SplashScreen from './SplashScreen';
import HomeScreen from './HomeScreen';
import { Provider } from 'react-redux';
import Store  from './store';


const Stack = createNativeStackNavigator();

function App() {
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
            }} />

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

        </Stack.Navigator>

      </NavigationContainer>
    </Provider>
  );
}

export default App;
