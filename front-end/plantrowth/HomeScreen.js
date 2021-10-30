import React from 'react';

import {
    View,
    StyleSheet,
    Text,
} from 'react-native';

function HomeScreen() {

    return(
        <View style={styles.body}>
            <Text style = {styles.text}>
               Welcome
            </Text>
          
        </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({

    body:{
        flex:1,
        alignItems:'center',
        justifyContent:'center'
    },
    text:{
        fontSize:30,
        color:'#ffffff'
    },
})