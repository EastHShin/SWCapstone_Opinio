import React, {useState, useEffect, Component} from "react";
import axios from 'axios';
import NavBar from "../NavBar.js";
import Button from 'react-bootstrap/Button';
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './report.css';

import {Link} from "react-router-dom";

function ReportConfirm() {
    const [posts, setPosts] = useState("")

    async function confirm() {
        let web
        if(localStorage.getItem("commentId")==-1) {
            web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/board/report/" + localStorage.getItem("reportId")
        } else {
            web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/comment/report/" + localStorage.getItem("reportId")
        }

        return await axios.post(web, {
            headers: {"Content-Type": `application/json`},
            report_id: localStorage.getItem("reportId")
        })
            .then(function (res) {
                toast.success('게시물 신고 상태를 COMPLETE로 변경했습니다.', {position: toast.POSITION.TOP_CENTER, autoClose:2500})
            })
    }

    async function GetValue() {
        axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
        const token = localStorage.getItem('auth')
        let web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/report/all"
        const reportResponse = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                for(let i = 0; i < res.data.data.length; i++) {
                    if(res.data.data[i].report_id == localStorage.getItem("reportId")) {
                        localStorage.setItem("reportInfo:id", res.data.data[i].report_id)
                        localStorage.setItem("reportInfo:userId", res.data.data[i].user_id)
                        localStorage.setItem("reportInfo:userName", res.data.data[i].username)
                    }
                }
            })

        web = "http://ec2-3-35-154-116.ap-northeast-2.compute.amazonaws.com:8080/api/admin/community/" + localStorage.getItem("boardId")
        const boardResponse = await axios.get(web, {
            headers: {
                "Content-Type": `application/json`
            }
        })
            .then(function (res) {
                setPosts({
                    report: localStorage.getItem("reportInfo:id"),
                    userId: localStorage.getItem("reportInfo:userId"),
                    userName: localStorage.getItem("reportInfo:userName"),
                    boardId: res.data.data.id,
                    content: res.data.data.content,
                    writerId: res.data.data.writerId,
                    writerName: res.data.data.writerName
                })
            })
    }

    useEffect(() => {
        GetValue()
    }, [setPosts])

    return (
        <div className="front">
            <NavBar className="top"/>
            <h2 className="yellow">신고 내용 확인</h2>
            <h3 className="confirm">
                신고한 유저 닉네임: <span style={{color:"#FEE12B", fontWeight:"Bold"}}>{posts.userName}</span>
                <br/>
                신고한 유저 번호: <span style={{color:"blue"}}>{posts.userId}</span>
                <br/>
                신고 번호: <span style={{color:"blue"}}>{posts.report}</span>
                <br/>
                신고된 게시물 번호: <span style={{color:"blue"}}>{posts.boardId}</span>
                <br/>
                게시물 내용: <span style={{color:"red"}}>{posts.content}</span>
                <br/>
                게시물 작성자 번호: <span style={{color:"blue"}}>{posts.writerId}</span>
                <br/>
                게시물 작성자 닉네임: <span style={{color:"red", fontWeight:"Bold"}}>{posts.writerName}</span>
                <br/>
            </h3>
            <Link to="/administrator/report">
                <Button className="mar" variant="success">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/front">
                <Button variant="warning" onClick={confirm}>처리 완료</Button>
            </Link>
        </div>
    )
}

export default ReportConfirm;