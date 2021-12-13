import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import * as ReactBootStrap from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import './report.css';

import {Link} from "react-router-dom";

function Table() {
    const [posts, setPosts] = useState({user: []})
    const nav = useNavigate()

    useEffect(() => {
        const fetchPostList = async () => {
            axios.defaults.headers.common['X-AUTH-TOKEN'] = localStorage.getItem("auth")
            const token = localStorage.getItem('auth')
            let web = "/api/admin/community/report/all"
            const response = await axios.get(web, {
                headers: {
                    "Content-Type": `application/json`
                }
            })
                .then(function (res) {
                    setPosts({data: res.data.data})
                })
                .catch(function (error) {
                    if(error.response.status == 403) {
                        localStorage.clear()
                        nav("/administrator")
                    }
                })
        }
        fetchPostList()
    }, [setPosts])

    function getId(report, board, comment) {
        localStorage.setItem("reportId", report)
        if(board!=null) localStorage.setItem("boardId", board)
        else localStorage.setItem("boardId", -1)
        if(comment!=null) localStorage.setItem("commentId", comment)
        else localStorage.setItem("commentId", -1)
        console.warn(localStorage.getItem("reportId"), localStorage.getItem("boardId"), localStorage.getItem("commentId"))
    }

    return (
        <div>
            <ReactBootStrap.Table striped bordered hover className="table">
                <thead>
                <tr className="head_font">
                    <th className="table-info" width="110px">신고 번호</th>
                    <th className="table-secondary" width="135px">게시글/댓글</th>
                    <th className="table-primary" width="130px">게시글 번호</th>
                    <th className="table-info" width="110px">댓글 번호</th>
                    <th className="table-light" width="110px">해결 여부</th>
                    <th className="table-primary">신고 내용</th>
                    <th className="table-warning" width="180px">해결</th>
                </tr>
                </thead>
                <tbody>
                {
                    posts.data && posts.data.map((item) => (
                        <tr key={item.id} className="content_font">
                            <td className="table-info" valign="middle">{item.report_id}</td>
                            {
                                item.tag === "BOARD" &&
                                <td className="table-secondary" valign="middle">게시글</td>
                            }
                            {
                                item.tag === "COMMENT" &&
                                <td className="table-secondary" valign="middle">댓글</td>
                            }
                            {
                                item.board_id != null &&
                                <td className="table-primary" valign="middle">{item.board_id}</td>
                            }
                            {
                                item.board_id == null &&
                                <td className="table-primary" valign="middle">X</td>
                            }
                            {
                                item.comment_id != null &&
                                <td className="table-info" valign="middle">{item.comment_id}</td>
                            }
                            {
                                item.comment_id == null &&
                                <td className="table-info" valign="middle">X</td>
                            }
                            {
                                item.state === "NOTPROCESSED" &&
                                <td className="table-danger" valign="middle">{item.state}</td>
                            }
                            {
                                item.state === "COMPLETE" &&
                                <td className="table-success" valign="middle">{item.state}</td>
                            }
                            <td className="table-primary" valign="middle">{item.reason}</td>
                            {
                                (item.state === "NOTPROCESSED" && item.tag === "BOARD") &&
                                <td className="table-warning" valign="middle">
                                    <Link to="/administrator/report/confirm">
                                        <Button variant="warning" onClick={() => getId(item.report_id, item.board_id, item.comment_id)}>게시글 처리</Button>
                                    </Link>
                                </td>
                            }
                            {
                                (item.state === "NOTPROCESSED" && item.tag === "COMMENT") &&
                                <td className="table-warning" valign="middle">
                                    <Link to="/administrator/report/confirm">
                                        <Button variant="warning" onClick={() => getId(item.report_id, item.board_id, item.comment_id)}>댓글 처리</Button>
                                    </Link>
                                </td>
                            }
                            {
                                item.state === "COMPLETE" &&
                                <td className="table-warning" valign="middle"></td>
                            }
                        </tr>
                    ))
                }
                </tbody>
            </ReactBootStrap.Table>
        </div>
    );
}

export default Table;