import { FETCH_DIARIES, FETCH_DIARY } from "./type";
import axios from "axios";

export const fetchDiaries = (plantId) =>  {

    return async dispatch =>{
        return await axios.get(`https://9605e160-bbf0-40ed-8055-1b45c403c2e3.mock.pstmn.io/plants/diary/${plantId}`)
        .then(function(res){
            if(res.status==200){
            dispatch({
                type:FETCH_DIARIES,
                payload:res.data,
            })
        }
        else{
            dispatch({
                type:FETCH_DIARIES,
                payload:[],
            })
        }
        })
            .catch(function (error){
                console.log(error);
            })
        }
}

export const fetchDiary = (diaryId) => {

    return async dispatch =>{
        return await axios.get(`https://9605e160-bbf0-40ed-8055-1b45c403c2e3.mock.pstmn.io/plants/diary/detail/${diaryId}`)
        .then(function(res){
            if(res.status==200){
            dispatch({
                type:FETCH_DIARY,
                payload:res.data,
            })
        }
        else{
            dispatch({
                type:FETCH_DIARY,
                payload:{},
            })
        }
    })
            .catch(function (error){
                console.log(error);
            })
        }

}