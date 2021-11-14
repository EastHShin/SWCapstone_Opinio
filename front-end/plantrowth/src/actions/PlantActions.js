import {ADD_PLANT, DELETE_PLANT, UPDATE_PLANT, GET_PLANT_PROFILE} from './type';
import axios from 'axios';

export const addPlant = (profile, userId) => {
  console.log('axios 안');
  console.log('add profile: '+JSON.stringify(profile));
  //const userId = 1;
  return async dispatch => {
    return await axios
      .post(
        // `https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${userId}`,
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/1`,
        profile,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(function (res) {
        if (res.status === 200) {
          console.log('status 200, addProfile 확인용: ' + JSON.stringify(res));
          dispatch({type: ADD_PLANT, payload: 'success'});
        }
      })
      .catch(function (error) {
        dispatch({type: ADD_PLANT, payload: 'failure'});
        console.warn('에러요~~~~~~~~~~~~');
        console.log(error);
      });
  };
};

export const updatePlant = (profile, plantId) => {
  return async dispatch => {
    console.log('update action Id: ' + plantId);
    console.log('update profile: ' + JSON.stringify(profile));
    return await axios
      .put(
        // `https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${plantId}`,
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/${plantId}`,
        profile,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )
      .then(function (response) {
        console.log('update response :', response);
        if (response.status === 200) {
          dispatch({type: UPDATE_PLANT, payload: 'success'});
        }
      })
      .catch(function (error) {
        console.warn('update 에러요~~~~~~~~~~~~');
        dispatch({type: UPDATE_PLANT, payload: 'failure'});
        console.log(error);
      });
  };
};

export const deletePlant = plantId => {
  return async dispatch => {
    console.log('delete action Id: ' + plantId);
    return await axios
      .delete(
        // `https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${plantId}`,
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/${plantId}`,
      )
      .then(function (response) {
        console.log('delete response :', response);
        if (response.status === 200) {
          dispatch({type: DELETE_PLANT, payload: 'success'});
        }
      })
      .catch(function (error) {
        console.warn('delete 에러요~~~~~~~~~~~~');
        dispatch({type: DELETE_PLANT, payload: 'failure'});
        console.log(error);
      });
  };
};

export const setAddPlantState = state => dispatch => {
  dispatch({
    type: ADD_PLANT,
    payload: state,
  });
};

export const setDeletePlantState = state => dispatch => {
  dispatch({
    type: DELETE_PLANT,
    payload: state,
  });
};

export const setUpdatePlantState = state => dispatch => {
  dispatch({
    type: UPDATE_PLANT,
    payload: state,
  });
};

export const getProfile = plantId => {
  return async dispatch => {
    return axios
      .get(
        //`https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${plantId}`,
        `http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/manage/${plantId}`,
        {
          headers: {'content-Type': `application/json`},
        },
      )
      .then(function (res) {
        console.log('getProfile 확인용: ' + JSON.stringify(res));
        console.log('get Profile res:' + JSON.stringify(res.data));
        if (res.status == 200) {
          console.log('get profile in reducer: ' + JSON.stringify(res.data));
          //console.log('get 식물 리스트 response: '+JSON.stringify(res.data.data));
          dispatch({
            type: GET_PLANT_PROFILE,
            payload: res.data,
          });
          //console.warn(Store.getState());
        }
      })
      .catch(function (error) {
        console.warn('get profile error: ' + error);
      });
  };
};
