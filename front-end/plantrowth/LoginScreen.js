import React from 'react';

import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

const LoginScreen = () =>{

    return(
        <View style={styles.body}>
          <Text style={styles.text}>
              Login Page
          </Text>
        </View>
    );
  };
  export default LoginScreen;
  
  const styles = StyleSheet.create({
    body: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: '#81C147',
      alignContent: 'center',
    },
    text:{
      textAlign:'center'
    }
    
  });