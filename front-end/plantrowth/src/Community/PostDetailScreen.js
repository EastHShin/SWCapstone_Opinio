import React, { useState, useEffect, createRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Image,
  Alert,
  Keyboard,
} from 'react-native';

import Moment from 'moment';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/dist/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Loader from '../Loader';
import { useIsFocused } from '@react-navigation/native';
import {
  getPost,
  deletePost,
  setResultState,
  createComment,
  setCommentResultState,
  like,
  setLikeState,
  deleteComment,
  updateComment,
  setReportState,
  report,
} from '../actions/CommunityActions';
import Modal from 'react-native-modal';

import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AutoHeightImage from 'react-native-auto-height-image';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const PostDetailScreen = ({ route, navigation }) => {
  const { selectedId } = route.params;

  const [loading, setLoading] = useState(false);

  const [userId, setUserId] = useState('');
  const [commentList, setCommentList] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [comment, setComment] = useState('');
  const [isCommentModalVisible, setCommentModalVisibility] = useState(false);
  const [selectedComment, setSelectedComment] = useState();
  const [selectedCommentId, setSelectedCommentId] = useState();
  const [selectedCommentWriterId, setSelectedCommentWriterId] = useState();
  const [selectedCommentContent, setSelectedCommentContent] = useState('');
  const [updating, setUpdating] = useState(false);
  const [postCreateDate, setPostCreateDate] = useState('');
  const [postUpdateDate, setPostUpdateDate] = useState('');
  const [reportType, setReportType] = useState(false);
  const [isReportModalVisible, setReportModalVisibility] = useState(false);
  const [reason, setReason] = useState('');

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const result = useSelector(state => state.CommunityReducer.result);
  const post = useSelector(state => state.CommunityReducer.post);
  const commentResult = useSelector(
    state => state.CommunityReducer.commentResult,
  );
  const reportState = useSelector(state => state.CommunityReducer.reportResult);
  const likeState = useSelector(state => state.CommunityReducer.likeResult);

  const nowYear = new Date().getFullYear();

  useEffect(() => {
    if (isFocused) {
      AsyncStorage.getItem('userId').then(value => {
        if (value) {
          setUserId(JSON.parse(value));
          dispatch(getPost(selectedId, JSON.parse(value)));
        }
      });
    }
  }, [isFocused]);

  useEffect(() => {
    setCommentList(post.comments);
    console.log(post);
    setPostCreateDate(new Date(post.createDate).getFullYear());
    if (post.updateDate) {
      setPostUpdateDate(new Date(post.updateDate).getFullYear());
    }
  }, [post]);

  useEffect(() => {
    if (result == 'success' && isFocused) {
      setLoading(false);
      dispatch(setResultState(''));
      setIsModalVisible(false);
      navigation.navigate('CommunityMainScreen');
    } else if (result == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setResultState(''));
      setIsModalVisible(false);
      Alert.alert('게시글 삭제 실패', '다시 시도해주십시오', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    }
  }, [result]);

  useEffect(() => {
    if (updating) {
      setCommentModalVisibility(false);
      setSelectedCommentContent(selectedComment.content);
      setComment(selectedComment.content);
    } else {
      setCommentModalVisibility(false);
      setSelectedCommentContent('');
      setComment('');
    }
  }, [updating]);

  const deleteMode = () => {
    Alert.alert('삭제', '게시글을 삭제하시겠습니까?', [
      {
        text: '취소',
        onPress: () => console.log('취소'),
      },
      {
        text: '확인',
        onPress: () => {
          setLoading(true);
          dispatch(deletePost(selectedId));
        },
      },
    ]);
  };

  useEffect(() => {
    if (commentResult == 'success' && isFocused) {
      setLoading(false);
      setUpdating(false);
      dispatch(getPost(selectedId, userId));
      setComment('');
      setSelectedCommentContent('');
      setCommentModalVisibility(false);
      dispatch(setCommentResultState(''));
    } else if (commentResult == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setCommentResultState(''));
      Alert.alert('오류 발생', '오류가 발생했습니다\n다시 시도해주세요', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    }
  }, [commentResult]);

  //좋아요useEffect
  useEffect(() => {
    if (likeState == 'success' && isFocused) {
      setLoading(false);
      post.boardLike
        ?
        Alert.alert('좋아요 취소', '좋아요를 취소하였습니다', [
          {
            text: '확인',
            onPress: () => {
              return;
            },
          }
        ])
        :
        Alert.alert('좋아요 완료', '게시글에 좋아요를 눌렀습니다', [
          {
            text: '확인',
            onPress: () => {
              return;
            },
          }
        ]);
      dispatch(getPost(selectedId, userId));
      dispatch(setLikeState(''));
    } else if (likeState == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setLikeState(''));
    }
  }, [likeState]);
  //좋아요useEffect

  //신고useEffect
  useEffect(() => {
    if (reportState == 'board' && isFocused) {
      setLoading(false);
      dispatch(setReportState(''));
      setReportModalVisibility(false);
      Alert.alert('게시글 신고 완료', '게시글을 신고하였습니다', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    } else if (reportState == 'comment' && isFocused) {
      setLoading(false);
      dispatch(setReportState(''));
      setReportModalVisibility(false);
      Alert.alert('댓글 신고 완료', '댓글을 신고하였습니다', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    } else if (reportState == 'failure' && isFocused) {
      setLoading(false);
      dispatch(setReportState(''));
      setReportModalVisibility(false);
      Alert.alert('신고 실패', '네트워크 오류로 신고를 실패하였습니다\n다시 시도해주십시오', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    }
  }, [reportState]);
  //신고useEffect

  //댓글
  const renderComment = comment => {
    if (comment) {
      return comment.map((item, index) => {
        return (
          <View
            key={index}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View>
              <View style={styles.commentWrapper}>
                <View style={{ flexDirection: 'row' }}>
                  <Feather name={'user'} size={16} />
                  <Text style={{ color: '#000000', fontWeight: 'bold' }}>
                    {item.writer}
                  </Text>
                </View>
                <Text
                  style={{
                    fontSize: 14,
                    marginBottom: Dimensions.get('window').height * 0.007,
                    marginTop: Dimensions.get('window').height * 0.003,
                  }}
                >
                  {item.content}
                </Text>
                <Text style={{ fontSize: 11 }}>
                  {nowYear == new Date(item.date).getFullYear() ? Moment(item.date).format("MM/DD HH:mm") : Moment(item.date).format("YYYY/MM/DD HH:mm")}
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: Dimensions.get('window').width * 0.95,
                  }}
                >
                  <View
                    style={{ flex: 1, height: 1, backgroundColor: '#A9A9A9' }}
                  />
                </View>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.likeButton, { marginRight: 10, padding: 4 }]}
              onPress={() => {
                setSelectedCommentId(item.comment_id);
                setSelectedCommentWriterId(item.writer_id);
                setSelectedComment(item);
                setCommentModalVisibility(true);
              }}
            >
              <Entypo name="dots-three-vertical" size={14} color="#363636" />
            </TouchableOpacity>
          </View>
        );
      });
    }
  };
  //댓글

  //댓글 작성 Handler
  const sendHandler = comment => {
    if (!comment) {
      Alert.alert('댓글 작성', '아무 내용도 입력하지 않으셨습니다', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
      return;
    }
    setLoading(true);
    if (updating) {
      dispatch(updateComment(selectedCommentId, userId, comment));
    } else {
      dispatch(createComment(selectedId, userId, comment));
    }
  };
  //댓글 작성 Handler

  //좋아요 Handler
  const likeHandler = () => {
    if (Number(post.userId) == userId) {
      Alert.alert('본인 게시글 좋아요', '본인이 작성한 게시글에는 좋아요를 누를 수 없습니다', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
      return;
    }
    setLoading(true);
    dispatch(like(selectedId, userId));
  };
  //좋아요 Handler

  //댓글 수정 Handler
  const updateCommentHandler = comment => {
    console.log(selectedCommentContent);
    console.log(comment);
    if (selectedCommentContent == comment || comment == '') {
      Alert.alert('댓글 수정 내용 입력', '댓글이 바뀐 내용이 없습니다', [
        {
          text: '확인',
          onPress: () => {
            return;
          },
        }
      ]);
    } else if (selectedCommentContent !== comment) {
      Alert.alert('댓글 수정', '댓글을 수정하시겠습니까?', [
        {
          text: '취소',
          onPress: () => {
            return;
          },
        },
        {
          text: '확인',
          onPress: () => {
            sendHandler(comment);
          },
        },
      ]);
    }
  };
  //댓글 수정 Handler

  //댓글 삭제 Handler
  const deleteCommentHandler = commentId => {
    console.log('handler 삭제 id: ' + commentId);
    Alert.alert('삭제', '댓글을 삭제하시겠습니까?', [
      {
        text: '취소',
        onPress: () => {
          return;
        },
      },
      {
        text: '확인',
        onPress: () => {
          setLoading(true);
          dispatch(deleteComment(commentId, userId));
        },
      },
    ]);
  };
  //댓글 삭제 Handler

  //신고 Handler
  const reportHandler = (type, reason) => {
    if (type) {
      setLoading(true);
      dispatch(report(type, Number(selectedId), userId, reason));
    }
    else if (!type) {
      console.log('댓글 id: ' + selectedCommentId);
      setLoading(true);
      dispatch(report(type, selectedCommentId, userId, reason));
    }
  }
  //신고 Handler
  return (
    <SafeAreaView style={styles.body}>
      <Loader loading={loading} />

      <View style={styles.top}>
        <TouchableOpacity
          style={{ marginStart: Dimensions.get('window').width * 0.03 }}
          activeOpacity={0.5}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-sharp" size={23} color="#000000" />
        </TouchableOpacity>
        <Text
          style={{
            marginEnd: Dimensions.get('window').width * 0.01,
            fontFamily: 'NanumGothicBold',

            color: '#000000',
          }}
        >
          커뮤니티
        </Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => setIsModalVisible(true)}
          style={{ marginEnd: Dimensions.get('window').width * 0.02 }}
        >
          <Entypo name="dots-three-vertical" size={22} color="#000000" />
        </TouchableOpacity>
      </View>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        {/* native modal */}
        <Modal
          animationIn="fadeIn"
          animationInTiming={10}
          animationOut="fadeOut"
          animationOutTiming={10}
          backdropOpacity={0}
          isVisible={isModalVisible}
          onBackButtonPress={() => {
            console.log('close');
            setIsModalVisible(false);
          }}
          onBackdropPress={() => {
            console.log('close');
            setIsModalVisible(false);
          }}
        >
          {/* native modal */}
          <TouchableOpacity
            style={styles.container}
            activeOpacity={1}
            onPressOut={() => {
              setIsModalVisible(false);
            }}
          >
            <View style={{ flex: 1, justifyContent: 'flex-start' }}>
              <View
                style={userId == post.userId ? styles.modal : styles.modalSmall}
              >
                {userId == post.userId ? (
                  <View>
                    <View style={styles.modalWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={deleteMode}
                      >
                        <Text style={styles.text}>삭제</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.modalWrapper}>
                      <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => {
                          setIsModalVisible(false);
                          navigation.navigate('PostEditScreen', {
                            selectedId: selectedId,
                          });
                        }}
                        style={{ flexDirection: 'row' }}
                      >
                        <Text style={styles.text}>수정</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={styles.modalWrapper}>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      onPress={() => {
                        setIsModalVisible(false);
                        setReportType(true);
                        setReportModalVisibility(true);
                      }}
                      style={{ flexDirection: 'row' }}
                    >
                      <Text style={styles.text}>신고</Text>
                    </TouchableOpacity>
                  </View>
                )
                }
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
        <View style={styles.postWrapper}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.userIcon}>
              <FontAwesome name={'user'} size={32} color={'white'} />
            </View>
            <View style={styles.userWrapper}>
              <Text
                style={{ fontSize: 15, fontWeight: 'bold', color: '#000000' }}
              >
                {post.writer}
              </Text>
              <Text style={{ fontSize: 14, color: '#000000' }}>
                Lv. {post.user_level}
              </Text>
            </View>
            {postCreateDate ?
              <View style={styles.date}>
                {nowYear == postCreateDate ? (
                  <Text
                    style={{
                      fontSize: 10,
                      marginLeft: Dimensions.get('window').width * 0.12,
                    }}
                  >
                    최초 게시일 : {Moment(post.createDate).format('MM/DD HH:mm')}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: 10,
                      marginLeft: Dimensions.get('window').width * 0.047,
                    }}
                  >
                    최초 게시일 :{' '}
                    {Moment(post.createDate).format('YYYY/MM/DD HH:mm')}
                  </Text>
                )}

                {post.updateDate != null ? (
                  <Text
                    style={
                      nowYear == postUpdateDate
                        ? {
                          fontSize: 10,
                          marginLeft: Dimensions.get('window').width * 0.12,
                        }
                        : {
                          fontSize: 10,
                          marginLeft: Dimensions.get('window').width * 0.047,
                        }
                    }
                  >
                    최근 수정일 :{' '}
                    {nowYear == postUpdateDate
                      ? Moment(post.updateDate).format('MM/DD HH:mm')
                      : Moment(post.updateDate).format('YYYY/MM/DD HH:mm')}
                  </Text>
                ) : null}
              </View> : null}
          </View>
          <View style={styles.textWrapper}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.content}>{post.content}</Text>
            {post.file_name != null ? (
              <View style={{ alignItems: 'center' }}>
                <AutoHeightImage
                  source={{ uri: post.file_name }}
                  width={Dimensions.get('window').width * 0.9}
                  style={{
                    marginBottom: Dimensions.get('window').height * 0.01,
                    marginTop: Dimensions.get('window').height * 0.01,
                  }}
                />
              </View>
            ) : null}
          </View>
          {/* 좋아요버튼 */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <View style={styles.likeAndComment}>
              <MaterialCommunityIcons
                name="heart-outline"
                size={15}
                color="#DC143C"
                style={{ marginRight: Dimensions.get('window').width * 0.01 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: '#DC143C',
                  marginRight: Dimensions.get('window').width * 0.02,
                }}
              >
                {post.countedLike}
              </Text>
              <SimpleLineIcons
                name="bubble"
                size={15}
                color="#00BFFF"
                style={{ marginRight: Dimensions.get('window').width * 0.01 }}
              />
              <Text
                style={{
                  fontSize: 12,
                  color: '#00BFFF',
                  marginRight: Dimensions.get('window').width * 0.02,
                }}
              >
                {post.countedComments}
              </Text>
            </View>
            <View style={{ marginRight: 10 }}>
              {post.boardLike ? (
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => likeHandler()}
                >
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={15}
                    color="#DC143C"
                    style={{
                      marginRight: Dimensions.get('window').width * 0.01,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 12,
                      color: '#DC143C',
                    }}
                  >
                    좋아요
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.likeButton}
                  onPress={() => likeHandler()}
                >
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={15}
                    color="#72787f"
                    style={{
                      marginRight: Dimensions.get('window').width * 0.01,
                    }}
                  />
                  <Text
                    style={{
                      fontFamily: 'NanumGothicBold',
                      fontSize: 12,
                      color: '#72787f',
                    }}
                  >
                    좋아요
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          {/* 좋아요버튼 */}
        </View>
        {renderComment(commentList)}
        {/* 댓글 수정신고삭제 */}
        <Modal
          isVisible={isCommentModalVisible}
          animationIn="fadeIn"
          animationInTiming={10}
          animationOut="fadeOut"
          animationOutTiming={10}
          backdropTransitionOutTiming={10}
          backdropTransitionInTiming={10}
          backdropOpacity={0.25}
          onBackButtonPress={() => {
            setCommentModalVisibility(false);
          }}
          onBackdropPress={() => {
            setCommentModalVisibility(false);
          }}
        >
          {selectedCommentWriterId == userId ? (
            <View>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: screenHeight * 0.05,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                }}
                onPress={() => setUpdating(true)}
              >
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  수정
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  width: '100%',
                  height: screenHeight * 0.05,
                  backgroundColor: 'white',
                  justifyContent: 'center',
                }}
                onPress={() => deleteCommentHandler(selectedCommentId)}
              >
                <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                  삭제
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={{
                width: '100%',
                height: screenHeight * 0.05,
                backgroundColor: 'white',
                justifyContent: 'center',
              }}
              onPress={() => {
                setCommentModalVisibility(false);
                setReportType(false);
                setReportModalVisibility(true);
              }}
            >
              <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16 }}>
                신고
              </Text>
            </TouchableOpacity>
          )}
        </Modal>
        {/* 댓글 수정신고삭제 */}

      </ScrollView>
      {/* 댓글작성 */}
      <KeyboardAvoidingView
        style={{ padding: 5, alignItems: 'center', justifyContent: 'center' }}
      >
        <Modal
          isVisible={isReportModalVisible}
          animationIn="fadeIn"
          animationInTiming={10}
          animationOut="fadeOut"
          animationOutTiming={10}
          backdropTransitionOutTiming={10}
          backdropTransitionInTiming={10}
          backdropOpacity={0.25}
          onBackButtonPress={() => {
            setReportModalVisibility(false);
          }}
          onBackdropPress={() => {
            setReportModalVisibility(false);
          }}
          style={{ alignItems: 'center' }}
        >
          <View style={{ alignItems: 'center', padding: 5, backgroundColor: 'white', width: screenWidth * 0.8, height: screenHeight * 0.5, borderRadius: 15 }}>
            <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 16, color: '#363636' }}>
              {reportType ? `게시글 신고` : `댓글 신고`}
            </Text>
            <View style={{ width: screenWidth * 0.75, flex: 1, marginTop: 15 }}>
              <Text style={{ fontFamily: 'NanumGothicBold', fontSize: 14, color: '#363636' }}>
                신고사유
              </Text>
              <View style={{ flex: 1, backgroundColor: '#f7f8f9' }}>
                <TextInput
                  onChangeText={reason => setReason(reason)}
                  multiline={true}
                  placeholder="신고 사유 입력"
                  placeholderTextColor="#808080"
                  returnKeyType="next"
                  blurOnSubmit={true}
                  underlineColorAndroid="#f000"
                  backgroundColor='#f7f8f9'
                  maxLength={250}
                />
              </View>
              <View style={{ alignItems: 'center', margin: 5 }}>
                <TouchableOpacity style={styles.smallButton} onPress={() => reportHandler(reportType, reason)}>
                  <Text style={{ fontFamily: 'NanumGothicBold', color: 'white' }}>신고</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <View style={styles.editScreen}>
          <TextInput
            multiline={true}
            placeholder={'내용을 입력하세요'}
            style={{
              width: screenWidth * 0.9,
            }}
            placeholderTextColor="#999999"
            underlineColorAndroid="#999999"
            onChangeText={editingComment => setComment(editingComment)}
            defaultValue={updating ? selectedCommentContent : ''}
            onSubmitEditing={Keyboard.dismiss}
            value={(!updating) ? comment : comment}
            maxLength={250}
          />
          <TouchableOpacity
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 5,
            }}
            onPress={() => {
              updating ? updateCommentHandler(comment) : sendHandler(comment);
            }}
          >
            <FontAwesome name={'send'} size={20} color={'#93d07d'} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {/* 댓글작성 */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  top: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: Dimensions.get('window').height * 0.06,
    width: Dimensions.get('window').width,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#000000',
  },
  content: {
    marginTop: Dimensions.get('window').height * 0.015,
    marginBottom: Dimensions.get('window').height * 0.015,
    color: '#000000',
  },
  postWrapper: {
    borderColor: '#C0C0C0',
    width: Dimensions.get('window').width * 0.95,
    marginTop: Dimensions.get('window').height * 0.015,
    marginBottom: Dimensions.get('window').height * 0.015,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 2,
  },
  userWrapper: {
    height: Dimensions.get('window').height * 0.07,
    width: Dimensions.get('window').width * 0.35,
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.017,
  },
  textWrapper: {
    width: Dimensions.get('window').width * 0.9,
    marginTop: Dimensions.get('window').height * 0.005,
    marginStart: Dimensions.get('window').width * 0.02,
  },
  button: {
    marginTop: Dimensions.get('window').height * 0.005,
    marginStart: Dimensions.get('window').width * 0.02,
  },
  commentWrapper: {
    marginVertical: Dimensions.get('window').height * 0.01,
    width: Dimensions.get('window').width * 0.8,
    marginStart: Dimensions.get('window').width * 0.021,
  },
  likeAndComment: {
    flexDirection: 'row',
    marginStart: Dimensions.get('window').width * 0.015,
    marginVertical: Dimensions.get('window').height * 0.01,
  },
  date: {
    marginTop: Dimensions.get('window').height * 0.01,
  },
  modal: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').height * 0.15,
    width: Dimensions.get('window').width * 0.47,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 10,
  },
  modalWrapper: {
    marginTop: Dimensions.get('window').height * 0.025,
  },
  text: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: Dimensions.get('window').width * 0.05,
  },
  modalSmall: {
    marginTop: Dimensions.get('window').height * 0.01,
    marginLeft: Dimensions.get('window').width * 0.5,
    height: Dimensions.get('window').height * 0.1,
    width: Dimensions.get('window').width * 0.47,
    backgroundColor: '#FFFFFF',
    flexDirection: 'column',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.0,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  //상웅
  editScreen: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 15,
    backgroundColor: '#e8ebed',
    width: '100%',
    padding: 5,
  },
  likeButton: {
    backgroundColor: '#e8ebed',
    borderRadius: 5,
    padding: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallButton: {
    backgroundColor: '#B22339',
    height: Dimensions.get('window').height * 0.04,
    width: Dimensions.get('window').width * 0.14,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center'
  },
  //상웅
  //예빈
  userIcon: {
    height: Dimensions.get('window').height * 0.055,
    width: Dimensions.get('window').width * 0.1,
    marginTop: Dimensions.get('window').height * 0.01,
    marginStart: Dimensions.get('window').width * 0.03,
    backgroundColor: '#C9E7BE',
    borderRadius: 7,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
});
export default PostDetailScreen;
