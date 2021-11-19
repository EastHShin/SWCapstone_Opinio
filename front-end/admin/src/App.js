import logo from './logo.png';
import './App.css';

import {Route, Link, BrowserRouter, Routes} from "react-router-dom";
import Login from "./login";
import Front from './front.js';
import Advertisement from "./advertisement";
import Users from "./users";
import Update from "./userUpdate"
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
                        <Route path="/administrator/user" element={<Users />} />
                        <Route path="/administrator/user/update" element={<Update />} />
                    </Routes>
                </BrowserRouter>
            </div>
        </div>
    );
}

export default App;
