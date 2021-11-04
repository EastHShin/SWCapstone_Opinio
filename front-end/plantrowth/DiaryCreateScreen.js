import React, {useState, useEffect} from 'react';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    FlatList,
    Text,
    Dimensions
} from 'react-native';

const DiaryCreateScreen =({navigation}) =>{
    
    return(
        <View style={styles.body}>
            <Text>
               Create Screen
            </Text>

        </View>
    )
}
export default DiaryCreateScreen;

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor: "#8EB695",
        alignItems:'center',
        justifyContent:'center'
    },
  
})