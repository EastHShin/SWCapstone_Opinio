import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const LoginScreen = ({navigation}) =>{

    return(
        <View style={styles.body}>
           <Text
                style={styles.text}
                onPress={() => navigation.navigate('RegisterScreen')}>
                New Here ? Register
              </Text>
        </View>
    );
  };
  export default LoginScreen;
  
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#8EB695',
      alignContent: 'center',
    },
    text:{
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: 14,
      alignSelf: 'center',
      padding: 10,
    }
    
  });