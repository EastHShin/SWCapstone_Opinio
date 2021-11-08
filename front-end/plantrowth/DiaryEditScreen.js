import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    SafeAreaView,
    Dimensions,
    ScrollView,
    TextInput,
    KeyboardAvoidingView,
    Text
} from 'react-native';


const DiaryEditScreen = ({ navigation }) => {

    return (
        <SafeAreaView style={styles.body}>
            <Text>Edit Screen</Text>
        </SafeAreaView>
    )
}
export default DiaryEditScreen;

const styles = StyleSheet.create({
    body: {
        flex: 1,
        backgroundColor: "#8EB695",
        alignItems: 'center',
    },
    diaryWrapper: {
        height : Dimensions.get('window').height*1.2,
        width: Dimensions.get("window").width,
        borderRadius: 20,
        backgroundColor: "#FFFFFF",
        alignItems: "center"
    },
    title: {
        marginVertical: Dimensions.get("window").height * 0.02,
    },
    content: {
        marginBottom: Dimensions.get("window").height * 0.5,
        width: Dimensions.get('window').width * 0.8
    },
    titleInput:{
        fontWeight:"bold"
    },
    contentInput: {
        flexShrink: 1
    },
    imageButton: {
        marginBottom: Dimensions.get('window').width * 0.06,
        marginHorizontal:Dimensions.get('window').width * 0.04
    }
   

})