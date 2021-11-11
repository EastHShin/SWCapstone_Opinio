import React from "react";
import NavBar from "./NavBar.js";
import Table from './usersbackenddummy';
import './users.css';

function Users() {
    return (
        <div className="front">
            <NavBar class="top" />
            <h1> this is user page</h1>
            <Table/>
        </div>
    );
}

export default Users;