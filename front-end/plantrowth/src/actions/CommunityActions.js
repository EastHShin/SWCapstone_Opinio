import { GET_BOARD_LIST, GET_POST, EDIT_POST, DELETE_POST, SAVE_POST, RESULT_STATE_POST } from './type';
import axios from "axios";

export const getBoardList = () => {
    return async dispatch => {
        return await axios.get('http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/')
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: GET_BOARD_LIST,
                        payload: res.data.data
                    })
                }
            })
            .catch(function (err) {
                console.log(err+"게시글 목록 조회");
                dispatch({
                    type: GET_BOARD_LIST,
                    payload: []
                })
            })
    }

}

export const getPost = (boardId, userId) => {
    console.log(boardId);
    return async dispatch => {
        return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${boardId}`,
        {
            headers: { "userId": `${userId}` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: GET_POST,
                        payload: res.data.data
                    })
                }
            })
            .catch(function (err) {
                console.log(err+ "게시글 조회");
                console.log(err.response);
                dispatch({
                    type: GET_POST,
                    payload: {}
                })
            })
    }

}

export const createPost = (userId, post) => {
    return async dispatch => {
        return await axios.post(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${userId}`, post, {
            headers: { 'Content-Type': `multipart/form-data` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: SAVE_POST,
                        payload: 'success'
                    })
                }
            })
            .catch(function (err) {
                console.log(err+"게시글 생성")
                console.log(err);
                dispatch({
                    type: SAVE_POST,
                    payload: 'failure'
                })
            })
    }
}

export const editPost = (boardId, post) => {
    return async dispatch => {
        return await axios.put(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${boardId}`, post, {
            headers: { 'Content-Type': `multipart/form-data` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: EDIT_POST,
                        payload: 'success'
                    })
                }
            })
            .catch(function (err) {
                console.log(err);
                dispatch({
                    type: EDIT_POST,
                    payload: 'failure'
                })
            })
    }

}

export const deletePost = (boardId) => {
    return async dispatch => {
        return await axios.delete(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/community/${boardId}`)
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: DELETE_POST,
                        payload: 'success'
                    })
                }
            })
            .catch(function (err) {
                console.log(err);
                dispatch({
                    type: DELETE_POST,
                    payload: 'failure'
                })
            })
    }

}



export const setResultState = state => dispatch => {
    dispatch({
        type: RESULT_STATE_POST,
        payload: state,
    });
};