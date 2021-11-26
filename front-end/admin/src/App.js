import logo from './logo.png';
import './App.css';

import {Route, Link, BrowserRouter, Routes} from "react-router-dom";
import Login from "./login";
import Front from './front.js';
import Advertisement from "./ads/advertisement"
import AdvertisementAdd from "./ads/advertisementAdd"
import AdvertisementUpdate from "./ads/advertisementUpdate"
import AdvertisementDelete from "./ads/advertisementDelete";
import Users from "./user/users";
import UserUpdate from "./user/userUpdate"
import UserInfo from "./user/userInfo"
import Board from "./board/userBoard"
import Post from "./board/userPost"
import Comment from "./board/userComment"
import Report from "./blame/report"
import React from "react";

function App() {
    return (
        <div className="App">
            <div>
                <BrowserRouter>
                    <Routes>
                        <Route exact path="/administrator" element={<Login />} />
                        <Route path="/administrator/front" element={<Front />} />
                        <Route path="/administrator/ad" element={<Advertisement />} />
                        <Route path="/administrator/ad/add" element={<AdvertisementAdd />} />
                        <Route path="/administrator/ad/update" element={<AdvertisementUpdate />} />
                        <Route path="/administrator/ad/Delete" element={<AdvertisementDelete />} />
                        <Route path="/administrator/user" element={<Users />} />
                        <Route path="/administrator/user/update" element={<UserUpdate />} />
                        <Route path="/administrator/user/info" element={<UserInfo />} />
                        <Route path="/administrator/report" element={<Report />} />
                        <Route path="/administrator/board" element={<Board />} />
                        <Route path="/administrator/board/post" element={<Post />} />
                        <Route path="/administrator/board/comment" element={<Comment />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
