import React from "react";
import NavBar from "./NavBar.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './users.css';
import './userUpdate.css';

import {Link} from "react-router-dom";

function UserUpdate() {
    return (
        <div className="front">
            <NavBar class="top" />
            Update!
            <br/>
            <Link to="/administrator/user">
            <Button variant="danger">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/user">
            <Button variant="success">수정</Button>
            </Link>
        </div>
    );
}

export default UserUpdate;