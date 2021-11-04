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


const DiaryDetailScreen =({route, navigation}) =>{
    
    const selectedId = route.params;

    useEffect(() => {
        console.log(selectedId);    
    }, [])

    return(
        <View style={styles.body}>
            <Text>
                Detail Screen
            </Text>

        </View>
    )
}
export default DiaryDetailScreen;

const styles = StyleSheet.create({
    body:{
        flex:1,
        backgroundColor: "#8EB695",
        alignItems:'center',
        justifyContent:'center'
    },
  
})