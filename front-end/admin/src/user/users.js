import React from "react";
import NavBar from "../NavBar.js";
import Table from './usersbackenddummy';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './users.css';
import UserIcon from '@material-ui/icons/Person';

import {Link} from "react-router-dom";

function Users() {
    return (
        <div className="front">
            <NavBar class="top"/>
            <h1>유저정보</h1>
            <Table/>
        </div>
    );
}

export default Users;