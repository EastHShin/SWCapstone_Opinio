import {
  GET_BOARD_LIST,
  GET_POST,
  EDIT_POST,
  DELETE_POST,
  SAVE_POST,
  RESULT_STATE_POST,
  CREATE_COMMENT,
  RESULT_STATE_COMMENT,
  LIKE,
  UPDATE_COMMENT,
  DELETE_COMMENT,
  REPORT
} from './type';
import axios from 'axios';

export const getBoardList = () => {
  return async dispatch => {
    return await axios
      .get(
        'http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community',
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log(JSON.stringify(res.data));
          dispatch({
            type: GET_BOARD_LIST,
            payload: res.data.data,
          });
        }
      })
      .catch(function (err) {
        console.log(err + '게시글 목록 조회');
        dispatch({
          type: GET_BOARD_LIST,
          payload: [],
        });
      });
  };
};

export const getPost = (boardId, userId) => {
  return async dispatch => {
    return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/view?board-id=${boardId}&user-id=${userId}`)
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: GET_POST,
            payload: res.data.data,
          });
        }
      })
      .catch(function (err) {
        console.log(err + '게시글 조회');
        dispatch({
          type: GET_POST,
          payload: {},
        });
      });
  };
};

export const setPost = () => dispatch => {
  dispatch({
    type: GET_POST,
    payload: {},
  });
};

export const createPost = (userId, post) => {
  return async dispatch => {
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${userId}`,
        post,
        {
          headers: { 'Content-Type': `multipart/form-data` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: SAVE_POST,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log(err + '게시글 생성');
        dispatch({
          type: SAVE_POST,
          payload: 'failure',
        });
      });
  };
};

export const editPost = (boardId, post) => {
  return async dispatch => {
    return await axios
      .put(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${boardId}`,
        post,
        {
          headers: { 'Content-Type': `multipart/form-data` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: EDIT_POST,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        dispatch({
          type: EDIT_POST,
          payload: 'failure',
        });
      });
  };
};

export const deletePost = boardId => {
  return async dispatch => {
    return await axios
      .delete(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${boardId}`,
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: DELETE_POST,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
        dispatch({
          type: DELETE_POST,
          payload: 'failure',
        });
      });
  };
};

export const createComment = (boardId, userId, comment) => {
  console.log('bId, uId, comment : ' + boardId, userId, comment);
  console.log(new Date());
  return async dispatch => {
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/comments?board-id=${boardId}&user-id=${userId}`,
        { content: comment, date: new Date() },
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('댓글 작성' + JSON.stringify(res.data));
          dispatch({
            type: CREATE_COMMENT,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log('댓글 작성 에러' + err);
        dispatch({
          type: CREATE_COMMENT,
          payload: 'failure',
        });
      });
  };
};

export const updateComment = (commentId, userId, comment) => {
  return async dispatch => {
    return await axios
      .put(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/comments?comment-id=${commentId}&user-id=${userId}`,
        { content: comment, date: new Date() },
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('댓글 수정' + JSON.stringify(res.data));
          dispatch({
            type: UPDATE_COMMENT,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log('댓글 수정 에러' + err);
        dispatch({
          type: UPDATE_COMMENT,
          payload: 'failure',
        });
      });
  };
};

export const report = (isBoard, reportId, userId, reason) => {
  return async dispatch => {
    console.log('게시글 신고?: ' + isBoard);
    console.log('신고 ID: ' + reportId);
    console.log('userId: ' + userId);
    console.log('신고 사유: ' + reason);
    return await axios
      .post(
        isBoard
          ? `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/board/report?board-id=${reportId}&user-id=${userId}`
          : `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/comment/report?comment-id=${reportId}&user-id=${userId}`,
        { reason: reason },
        {
          headers: { 'Content-Type': `application/json` },
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('신고 완료' + JSON.stringify(res.data));
          dispatch({
            type: REPORT,
            payload: isBoard ? 'board' : 'comment'
          });
        }
      })
      .catch(function (err) {
        console.log('신고 에러' + err);
        dispatch({
          type: REPORT,
          payload: 'failure',
        });
      });
  };
};


export const deleteComment = (commentId, userId) => {
  return async dispatch => {
    console.log('삭제할 comment Id: ' + commentId);
    return await axios
      .delete(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/comments?comment-id=${commentId}&user-id=${userId}`,
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('댓글 삭제' + JSON.stringify(res.data));
          dispatch({
            type: DELETE_COMMENT,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log('댓글 삭제 에러' + err);
        dispatch({
          type: DELETE_COMMENT,
          payload: 'failure',
        });
      });
  };
};

export const like = (boardId, userId) => {
  return async dispatch => {
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/like?board-id=${boardId}&user-id=${userId}`,
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('좋아요' + JSON.stringify(res.data));
          dispatch({
            type: LIKE,
            payload: 'success',
          });
        }
      })
      .catch(function (err) {
        console.log('좋아요 에러' + err);
        dispatch({
          type: LIKE,
          payload: 'failure',
        });
      });
  };
};

export const setLikeState = state => dispatch => {
  dispatch({
    type: LIKE,
    payload: state,
  });
};

export const setResultState = state => dispatch => {
  dispatch({
    type: RESULT_STATE_POST,
    payload: state,
  });
};

export const setCommentResultState = state => dispatch => {
  dispatch({
    type: RESULT_STATE_COMMENT,
    payload: state,
  });
};

export const setReportState = state => dispatch => {
  dispatch({
    type: REPORT,
    payload: state,
  })
}