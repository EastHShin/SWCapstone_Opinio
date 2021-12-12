import logo from './logo.png';
import './App.css';

import React from "react";
import { Route, Link, BrowserRouter, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "./login";
import Front from './front.js';
import Users from "./user/users";
import UserInfo from "./user/userInfo"
import UserUpdate from "./user/userUpdate"
import UserDelete from "./user/userDelete"
import Board from "./board/userBoard"
import Comment from "./board/userComment"
import BoardDelete from "./board/boardDelete"
import Report from "./blame/report"

const RTL = ({check, value}) => {
    console.warn(check)
    console.warn(value)
    if(localStorage.getItem('status') === 'OK') value = localStorage.getItem('status')
    console.warn(localStorage.getItem('status'))
    return value ? check : <Navigate to="/administrator" replace />
}

function App() {
    return (
        <div className="App">
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/administrator" element={<Login />} />
                        <Route path="/administrator/front" element={<RTL value={localStorage.getItem('status')} check={<Front />}> <Front /> </RTL>} />
                        <Route path="/administrator/user" element={<RTL value={localStorage.getItem('status')} check={<Users />}> <Users /> </RTL>} />
                        <Route path="/administrator/user/update" element={<RTL value={localStorage.getItem('status')} check={<UserUpdate />}> <UserUpdate /> </RTL>} />
                        <Route path="/administrator/user/info" element={<RTL value={localStorage.getItem('status')} check={<UserInfo />}> <UserInfo /> </RTL>} />
                        <Route path="/administrator/user/delete" element={<RTL value={localStorage.getItem('status')} check={<UserDelete />}> <UserDelete /> </RTL>} />
                        <Route path="/administrator/report" element={<RTL value={localStorage.getItem('status')} check={<Report />}> <Report /> </RTL>} />
                        <Route path="/administrator/board" element={<RTL value={localStorage.getItem('status')} check={<Board />}> <Board /> </RTL>} />
                        <Route path="/administrator/board/comment" element={<RTL value={localStorage.getItem('status')} check={<Comment />}> <Comment /> </RTL>} />
                        <Route path="/administrator/board/delete" element={<RTL value={localStorage.getItem('status')} check={<BoardDelete />}> <BoardDelete /> </RTL>} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
