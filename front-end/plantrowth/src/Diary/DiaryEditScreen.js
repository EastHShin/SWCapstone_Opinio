
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

import Loader from '../Loader';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { editDiary, setResultState } from '../actions/DiaryActions';
import { useIsFocused } from '@react-navigation/native'



//edit 할 때 카메라 다녀오면 modal이 켜지는거 변경하기 
const DiaryEditScreen = ({ route, navigation }) => {

    const {selectedId, plantId, plantImg} = route.params;

    const diary = useSelector(state => state.DiaryReducer.diary);

    const [title, setTitle] = useState(diary.title);
    const [content, setContent] = useState(diary.content);
    const originalImageUri = diary.file_name;
    const [imageUri, setImageUri] = useState(diary.file_name);
    const [fileName, setFileName] = useState("");
    const [imageType, setImageType] = useState("");
    const [loading, setLoading] = useState(false);

    const contentInputRef = createRef();

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    
    const result = useSelector(state => state.DiaryReducer.result);
 
   useEffect(() => {
      if(result == "success" && isFocused){
          setLoading(false);
          dispatch(setResultState(''));
          navigation.navigate('DiaryDetailScreen',{selectedId: selectedId, plantId: plantId, plantImg:plantImg});
      }
      else if(result == "failure" && isFocused){
          setLoading(false);
          dispatch(setResultState(''));
          alert("식물일기 수정 실패");
      }
   }, [result])

    const addGalleryImage = () => {
        launchImageLibrary({mediaType:'photo' }, response =>{
            if(!response.didCancel){
                setImageType(response.assets[0].type);
                setFileName(response.assets[0].fileName);
                setImageUri(response.assets[0].uri);
                }
        })
    }

    const addCameraImage = () => {
        launchCamera({mediaType:'photo'}, response => {
            if(!response.didCancel){
                setImageType(response.assets[0].type);
                setFileName(response.assets[0].fileName);
                setImageUri(response.assets[0].uri);
                }
        })
    }
    
    const onPressHandler = () => {

        setLoading(true);

        const Data = new FormData();

        if(diary.title != title){
            Data.append('title', title);
        }

        if(diary.content != content){
            Data.append('content', content);
           
        }
        if (imageUri!=originalImageUri) {
            console.log("새로운 사진");
            Data.append('file_name', {
                name: fileName,
                type: imageType,
                uri: imageUri
            });
        }
        else if(!imageUri){
            console.log("사진 없어짐");
            Data.append('file_name','delete');
        }
        dispatch(editDiary(Data, selectedId));
        
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
                                value = {title}
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
                                value = {content}
                                multiline={true}
                                placeholder="Enter Content"
                                placeholderTextColor="#808080"
                                returnKeyType="next"
                                ref={contentInputRef}
                                blurOnSubmit={true}
                                underlineColorAndroid="#f000"
                            />
                        </View>

                        {imageUri != '' ? (
                            <View style = {{marginBottom:Dimensions.get('window').width * 0.06,}}>
                                <Image source={{ uri: imageUri }}
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
                                    onPress={() => {
                                        setImageUri('');
                                        setFileName('');
                                        setImageType('');
                                    }
                                    }>
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