import { RESULT_STATE, FETCH_DIARIES, FETCH_DIARY, SAVE_DIARY, EDIT_DIARY, DELETE_DIARY, GET_EXP, GET_POINT, GET_LEVEL } from "./type";
import { setLevelUpState, setEarnState } from "./PlantActions";

import axios from "axios";

export const fetchDiaries = (plantId) => {
    return async dispatch => {
        return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${plantId}/all`)
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: FETCH_DIARIES,
                        payload: res.data.data,
                    })

                }
            })
            .catch(function (error) {
                console.log(error);

                dispatch({
                    type: FETCH_DIARIES,
                    payload: [],
                })

            })
    }
}

export const fetchDiary = (diaryId) => {

	return async dispatch => {
		return await axios.get(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${diaryId}`)
			.then(function (res) {
				if (res.status == 200) {
					dispatch({
						type: FETCH_DIARY,
						payload: res.data.data,
					})
				}
			})
			.catch(function (error) {
				dispatch({
					type: FETCH_DIARY,
					payload: {},
				})
				console.log(error);
			})
	}
}

export const setResultState = state => dispatch => {
	dispatch({
		type: RESULT_STATE,
		payload: state,
	});
};

export const saveDiary = (diary, plantId) => {
	return async dispatch => {
		console.log(JSON.stringify(diary));
		return await axios.post(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${plantId}`, diary, {

    return async dispatch => {
        console.log(JSON.stringify(diary));
        return await axios.post(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${plantId}`, diary, {

            headers: { 'Content-Type': `multipart/form-data` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    console.log(JSON.stringify(res))
                    dispatch({
                        type: SAVE_DIARY,
                        payload: "success"
                    })
                    dispatch({ type: GET_POINT, payload: res.data.data.point })
                    dispatch({ type: GET_EXP, payload: res.data.data.plantExp })
                    dispatch({ type: GET_LEVEL, payload: res.data.data.plant_level })
                    dispatch(setLevelUpState(res.data.data.isLevelUp));
                    if (!res.data.data.isLevelUp) dispatch(setEarnState(true));
                }

            })
            .catch(function (err) {
                console.log(err);
                dispatch({
                    type: SAVE_DIARY,
                    payload: "failure"
                })
            })
    }
}

export const editDiary = (diary, diaryId) => {
    return async dispatch => {
        console.log('diary' + diary);
        console.log('id' + diaryId);
        return await axios.put(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${diaryId}`, diary, {
            headers: { "Content-Type": `multipart/form-data` }
        })
            .then(function (res) {
                if (res.status == 200) {
                    dispatch({
                        type: EDIT_DIARY,
                        payload: "success"
                    })
                }

            })
            .catch(function (err) {
                console.log(err);
                dispatch({
                    type: EDIT_DIARY,
                    payload: "failure"
                })
            })
    }
}

export const deleteDiary = (diaryId) => {
	return async dispatch => {
		return await axios.delete(`http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/plants/diary/${diaryId}`)
			.then(function (res) {
				if (res.status == 200) {
					dispatch({
						type: DELETE_DIARY,
						payload: "success"
					})
				}
			})
			.catch(function (err) {
				console.log(err);
				dispatch({
					type: DELETE_DIARY,
					payload: "failure"
				})
			})
	}
}
