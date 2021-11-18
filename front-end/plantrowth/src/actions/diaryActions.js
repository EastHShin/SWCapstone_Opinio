import {
  RESULT_STATE,
  FETCH_DIARIES,
  FETCH_DIARY,
  SAVE_DIARY,
  EDIT_DIARY,
  DELETE_DIARY,
  GET_EXP,
  GET_POINT,
} from './type';
import axios from 'axios';

export const fetchDiaries = plantId => {
  return async dispatch => {
    return await axios
      .get(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${plantId}/all`,
      )
      .then(function (res) {
        if (res.status == 200) {
          console.log('diaries');
          console.log(res);
          dispatch({
            type: FETCH_DIARIES,
            payload: res.data.data,
          });
        } else {
          dispatch({
            type: FETCH_DIARIES,
            payload: [],
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
};

export const fetchDiary = diaryId => {
  return async dispatch => {
    return await axios
      .get(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${diaryId}`,
      )
      .then(function (res) {
        console.log('diary');
        console.log(res);
        if (res.status == 200) {
          dispatch({
            type: FETCH_DIARY,
            payload: res.data.data,
          });
          dispatch({
            type: GET_POINT,
            payload: res.data.data.point,
          });
          dispatch({
            type: GET_EXP,
            payload: res.data.data.plant_exp,
          });
        } else {
          dispatch({
            type: FETCH_DIARY,
            payload: {},
          });
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
};

export const setResultState = state => dispatch => {
  dispatch({
    type: RESULT_STATE,
    payload: state,
  });
};

export const saveDiary = (diary, plantId) => {
  return async dispatch => {
    console.log('식물일기 보낼때 diray' + JSON.stringify(diary));
    return await axios
      .post(
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${plantId}`,
        diary,
        {
          headers: {'Content-Type': `multipart/form-data`},
        },
      )
      .then(function (res) {
        console.log('save');
        console.log(res);
        if (res.status == 200) {
          dispatch({
            type: SAVE_DIARY,
            payload: 'success',
          });
        } else {
          dispatch({
            type: SAVE_DIARY,
            payload: 'failure',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};

export const editDiary = (diary, diaryId) => {
  return async dispatch => {
    return await axios
      .put(
        `https://74082338-1633-4d47-ae4e-cdf8a285f9f2.mock.pstmn.io/plants/diary/detail/${diaryId}`,
        diary,
        {
          headers: {'Content-Type': `application/json`},
        },
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: EDIT_DIARY,
            payload: 'success',
          });
        } else {
          dispatch({
            type: EDIT_DIARY,
            payload: 'failure',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};

export const deleteDiary = diaryId => {
  return async dispatch => {
    return await axios
      .delete(
        `https://74082338-1633-4d47-ae4e-cdf8a285f9f2.mock.pstmn.io/plants/diary/detail/${diaryId}`,
      )
      .then(function (res) {
        if (res.status == 200) {
          dispatch({
            type: DELETE_DIARY,
            payload: 'success',
          });
        } else {
          dispatch({
            type: DELETE_DIARY,
            payload: 'failure',
          });
        }
      })
      .catch(function (err) {
        console.log(err);
      });
  };
};
