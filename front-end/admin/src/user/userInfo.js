import React from "react";
import NavBar from "../NavBar.js";
import './users.css';
import './userUpdate.css';

import {Link} from "react-router-dom";

function userInfo() {
    return (
        <div className="front">
            <NavBar class="top" />
        </div>
    );
}

export default userInfo;