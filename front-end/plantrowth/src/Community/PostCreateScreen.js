import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { View, StyleSheet, Text, Dimensions, TouchableOpacity, SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native';


import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import Loader from '../Loader';
import { useIsFocused } from '@react-navigation/native'
import { createPost, setResultState } from '../actions/CommunityActions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AutoHeightImage from 'react-native-auto-height-image';

const PostCreateScreen = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const [imageType, setImageType] = useState('');
    const [fileName, setFileName] = useState('');
    const [imageUri, setImageUri] = useState('');

    const [userId, setUserId] = useState('');

    const dispatch = useDispatch();
    const isFocused = useIsFocused();
    const result = useSelector(state => state.CommunityReducer.result);
    const contentInputRef = createRef();

    useEffect(() => {
        if (isFocused) {
            AsyncStorage.getItem('userId').then(value => {
                if (value != null) {
                    setUserId(JSON.parse(value));
                }
            }
            )
        }
    }, [isFocused])


    useEffect(() => {
        if (result == 'success' && isFocused) {
            setLoading(false);
            dispatch(setResultState(''));
            navigation.navigate('CommunityMainScreen');
        }
        else if (result == 'failure' && isFocused) {
            setLoading(false);
            dispatch(setResultState(''));
            alert('게시글 생성 실패!');
        }

    }, [result])

    const addGalleryImage = () => {
        launchImageLibrary({ mediaType: 'photo' }, response => {
            if (!response.didCancel) {
                setImageType(response.assets[0].type);
                setFileName(response.assets[0].fileName);
                setImageUri(response.assets[0].uri);
            }
        })
    }

    const addCameraImage = () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (!response.didCancel) {
                setImageType(response.assets[0].type);
                setFileName(response.assets[0].fileName);
                setImageUri(response.assets[0].uri);
            }
        })
    }

    const onPressHandler = () => {

        if (!title) {
            alert('제목을 입력해주세요!');
            return;
        }
        if (!content) {
            alert('내용을 입력해주세요!');
            return;
        }

        setLoading(true);

        const Data = new FormData();

        Data.append('title', title);
        Data.append('content', content);
      
        if (imageUri) {
            console.log("사진 있음");
            Data.append('file_name', {
                name: fileName,
                type: imageType,
                uri: imageUri
            });
        }

        dispatch(createPost(userId, Data));

    }


    return (
      <SafeAreaView style={styles.body}>
        <Loader loading={loading} />

        <View style={styles.top}>
          <TouchableOpacity
            style={{ marginStart: Dimensions.get('window').width * 0.03 }}
            activeOpacity={0.5}
            onPress={() => navigation.goBack()}
          >
            <Feather name="x" size={27} color="#000000" />
          </TouchableOpacity>
          <Text
            style={{
              marginLeft: Dimensions.get('window').width * 0.08,
              fontWeight: 'bold',
              color: '#000000',
              fontSize: 15,
            }}
          >
            게시글 작성
          </Text>
          <TouchableOpacity
            style={styles.smallButton}
            activeOpacity={0.5}
            onPress={onPressHandler}
          >
            <Text
              style={{
                color: '#FFFFFF',
                paddingVertical: 8,
                fontSize: 10,
                fontWeight: 'bold',
              }}
            >
              완료
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <KeyboardAvoidingView enabled>
            <View style={styles.wrapper}>
              <View style={styles.title}>
                <TextInput
                  style={styles.titleInput}
                  onChangeText={title => setTitle(title)}
                  placeholder="Title"
                  placeholderTextColor="#808080"
                  returnKeyType="next"
                  onSubmitEditing={() =>
                    contentInputRef.current && contentInputRef.current.focus()
                  }
                  underlineColorAndroid="#A9A9A9"
                  blurOnSubmit={false}
                />
              </View>
              <View style={styles.content}>
                <TextInput
                  style={styles.contentInput}
                  onChangeText={content => setContent(content)}
                  multiline={true}
                  placeholder="Enter Content"
                  placeholderTextColor="#808080"
                  returnKeyType="next"
                  ref={contentInputRef}
                  // blurOnSubmit={true}
                  underlineColorAndroid="#f000"
                />
              </View>

              {imageUri != '' ? (
                <View
                  style={{
                    marginBottom: Dimensions.get('window').height * 0.02,
                  }}
                >
                  <AutoHeightImage
                    source={{ uri: imageUri }}
                    width={Dimensions.get('window').width * 0.9}
                    style={{
                      marginBottom: Dimensions.get('window').height * 0.01,
                      marginTop: Dimensions.get('window').height * 0.01,
                    }}
                  />
                </View>
              ) : (
                <View
                  style={{
                    marginBottom: Dimensions.get('window').height * 0.04,
                    height: Dimensions.get('window').height * 0.4,
                  }}
                ></View>
              )}

              <View style={{ flexDirection: 'row' }}>
                <View style={styles.imageButton}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={addGalleryImage}
                  >
                    <FontAwesome name="image" size={35} color="#000000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.imageButton}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={() => setImageUri('')}
                  >
                    <MaterialIcons name="cancel" size={43} color="#FF0000" />
                  </TouchableOpacity>
                </View>
                <View style={styles.imageButton}>
                  <TouchableOpacity
                    activeOpacity={0.5}
                    onPress={addCameraImage}
                  >
                    <FontAwesome name="camera" size={35} color="#000000" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    );
};



const styles = StyleSheet.create({

    body: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF'
    },
    top: {
        backgroundColor: '#FFFFFF',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Dimensions.get('window').height * 0.08,
        width: Dimensions.get('window').width,
    },
    wrapper: {
        alignItems: "center",
        flex: 1,


    },
    title: {
        marginVertical: Dimensions.get("window").height * 0.01,
        width: Dimensions.get('window').width * 0.9

    },
    titleInput: {
        fontWeight: 'bold',
        fontSize: 20
    },
    content: {
        marginBottom: Dimensions.get("window").height * 0.22,
        width: Dimensions.get('window').width * 0.9
    },
    contentInput: {
        flexShrink: 1
    },
    imageButton: {
        marginBottom: Dimensions.get('window').height * 0.06,
        marginHorizontal: Dimensions.get('window').width * 0.04
    },
    smallButton: {
        backgroundColor: '#B22339',
        height: Dimensions.get('window').height * 0.04,
        width: Dimensions.get('window').width * 0.14,
        alignItems: 'center',
        borderRadius: 20,
        marginEnd: Dimensions.get('window').width * 0.06

    },
})

export default PostCreateScreen;