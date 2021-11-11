import {ADD_PLANT, GET_PLANT_LIST} from './type';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import Store from '../store';

export const addPlant = profile => {
  console.log('axios 안');
  console.log(profile);
  const userId = 1;
  return async dispatch => {
    return await fetch(
      // `https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${userId}`,
      `http://ec2-3-37-194-56.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/${userId}`,
      {
        method: 'POST',
        //mode: 'no-cors',

        //data: "plant_species=ddd&plant_name=ddd&plant_birth=2021-11-09&water_supply=5&alarm_recycle=5&recent_watering=2021-11-10",
        // body: profile,
        // body: "plant_species=ddd&plant_name=ddd&plant_birth=2021-11-09&water_supply=5&alarm_recycle=5&recent_watering=2021-11-10",
        body: profile,
        headers: {
          'Content-Type': 'multipart/form-data',
          //'Content-Type': 'multipart/form-data;boundary=--------------------------666341725624267226949082'
          //"type": "formData"
          // 'Content-Type': 'application/x-www-form-urlencoded',
          // 'Content-Type': 'application/json',
        },
      },
    )
      .then(function (response) {
        if (response.status === 200) {
          console.log('post response :', response);
          dispatch({type: ADD_PLANT, payload: 'success'});
        } else {
          dispatch({type: ADD_PLANT, payload: 'failure'});
        }
      })
      .catch(function (error) {
        console.warn('에러요~~~~~~~~~~~~');
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
//   return async () => {
//     return await axios
//       .post(
//         // `https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${userId}`,
//         `http://ec2-3-37-194-56.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/${userId}`,
//         profile,
//         {
//           //headers: {'Content-type': 'application/JSON'},
//           headers: {
//             'Content-Type': 'multipart/form-data',
//           }
//         },
//       )
//       .then(res => {
//         console.warn(res);
//         if (res.status == 200) {
//           console.warn('status가 200');
//           console.warn(res);
//           dispatch({
//             type: ADD_PLANT,
//             payload: profile,
//           });
//         } else {
//           console.warn('else가 떴어요~~~~~~~~~~~~~~');
//           dispatch({
//             type: ADD_PLANT,
//             payload: profile,
//           });
//         }
//       })
//       .catch(function (error) {
//         console.warn(error);
//       });
//   };
// };

export const getPlantList = () => {
  const userId = 1;
  return async dispatch => {
    return axios
      .get(
        //`https://58c0739c-1d48-48a7-b99b-4be92192716b.mock.pstmn.io/api/plants/profiles/${userId}`,
        `http://ec2-3-37-194-56.ap-northeast-2.compute.amazonaws.com:8080/api/plants/profiles/${userId}`,
        {
          headers: {'content-Type': `application/json`},
        },
      )
      .then(function (res) {
        //console.warn(res);
        if (res.status == 200) {
          console.log('get in reducer: ' + JSON.stringify(res.data.data));
          //console.log('get 식물 리스트 response: '+JSON.stringify(res.data.data));
          dispatch({
            type: GET_PLANT_LIST,
            payload: res.data.data,
          });
          //console.warn(Store.getState());
        }
      })
      .catch(function (error) {
        console.warn(error);
      });
  };
};
