import logo from './logo.png';
import './App.css';

import {Route, Link, BrowserRouter, Routes} from "react-router-dom";
import Login from "./login";
import Front from './front.js';
import Advertisement from "./advertisement";
import AdvertisementAdd from "./advertisementAdd"
import AdvertisementUpdate from "./advertisementUpdate"
import AdvertisementDelete from "./advertisementDelete";
import Users from "./users";
import UserUpdate from "./userUpdate"
import UserInfo from "./userInfo"
import Board from "./userBoard"
import Report from "./report"
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
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
