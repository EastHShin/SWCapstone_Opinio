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
    
} from 'react-native';

import Loader from '../Loader';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { saveDiary, setResultState } from '../actions/diaryActions';
import { useIsFocused } from '@react-navigation/native'

const DiaryCreateScreen = ({ navigation }) => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const contentInputRef = createRef();

    const dispatch = useDispatch();
    const isFocused = useIsFocused();

    const result = useSelector(state => state.diaryReducer.result);
   // const plantId   plant id 가져오기

   useEffect(() => {
       if(result == "success" && isFocused){
           console.log('dd');
           setLoading(false);
           dispatch(setResultState(''));
           navigation.navigate("DiaryScreen");
       }
       
       else if(result == "failure" && isFocused){
           setLoading(false);
           dispatch(setResultState(''));
           alert("식물일기 업로드 실패");
       }
      
   }, [result])
    
    const addGalleryImage = () => {
        launchImageLibrary({mediaType:'photo' }, response =>{
            console.log(response.assets[0].uri);
            setImage(response.assets[0].uri);
        })
    }

    const addCameraImage = () => {
        launchCamera({mediaType:'photo'}, response => {
            console.log(response.assets[0].uri);
            setImage(response.assets[0].uri);
        })
    }
    
    const onPressHandler = () => {

        setLoading(true);
        const date = new Date();
    
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2);
        const day = ('0' + date.getDate()).slice(-2);
    
        const plantId = 123; //예시


        //???
        const Data = new FormData();

        Data.append('plant_id', plantId);
        Data.append('diary_title', title);
        Data.append('diary_content', content);
        Data.append('diary_date', year+ '-' + month + '-' + day );
        Data.append('file_name',image);

        console.log(Data);

        // const diaryData = JSON.stringify({
        //     plant_id: plantId,
        //     diary_title: title,
        //     diary_content: content,
        //     diary_date: year+ '-' + month + '-' + day,
        //     file_name : image
        //   });
         
        
        //   dispatch(saveDiary(diaryData, plantId));
    }

    return (
        <SafeAreaView style={styles.body}>
            <Loader loading={loading} />
            <View style={{ marginVertical: "5%", marginEnd: "-80%" }}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => navigation.goBack()}>
                    <Foundation name='x' size={22} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{
                    justifyContent: 'center',
                    alignContent: 'center',
                }}>
                <KeyboardAvoidingView enabled>
                    <View style={styles.diaryWrapper}>
                        <View style={styles.title}>
                            <TextInput
                                style={styles.titleInput}
                                onChangeText={(title) =>
                                    setTitle(title)
                                }
                                placeholder="Enter Title"
                                placeholderTextColor="#808080"
                                returnKeyType="next"
                                onSubmitEditing={() =>
                                    contentInputRef.current &&
                                    contentInputRef.current.focus()
                                }
                                underlineColorAndroid="#f000"
                                blurOnSubmit={false}
                            />
                        </View>

                        <View style={styles.content}>
                            <TextInput
                                style={styles.contentInput}
                                onChangeText={(content) =>
                                    setContent(content)
                                }
                                multiline={true}
                                placeholder="Enter Content"
                                placeholderTextColor="#808080"
                                returnKeyType="next"
                                ref={contentInputRef}
                                blurOnSubmit={true}
                                underlineColorAndroid="#f000"
                            />
                        </View>

                        {image != '' ? (
                            <View style = {{marginBottom:Dimensions.get('window').width * 0.06,}}>
                                <Image source={{ uri: image }}
                                    style={{
                                        width: Dimensions.get('window').width * 0.8,
                                        height: Dimensions.get('window').height * 0.4,
                                        resizeMode: 'contain',
                                    }}
                                />
                            </View>
                        ) : null}

                        <View style={{ flexDirection: "row" }}>
                            <View style={styles.imageButton}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={addGalleryImage}>
                                    <FontAwesome name='image' size={35} color="#000000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageButton}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={() => setImage('')}>
                                    <MaterialIcons name='cancel' size={43} color="#FF0000" />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.imageButton}>
                                <TouchableOpacity
                                    activeOpacity={0.5}
                                    onPress={addCameraImage}>
                                    <FontAwesome name='camera' size={35} color="#000000" />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </View>
                </KeyboardAvoidingView>
            </ScrollView>
            <View style={{
                marginBottom: Dimensions.get('window').height * 0.03,
                marginTop: Dimensions.get('window').height * 0.02
            }}>
                 <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={onPressHandler}>
                    <FontAwesome name='check' size={25} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}
export default DiaryCreateScreen;

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