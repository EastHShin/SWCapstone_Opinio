import React from "react";
import NavBar from "../NavBar.js";
import Table from "./reportbackenddummy"
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './report.css'

import {Link} from "react-router-dom";

function Report() {
    return (
        <div className="front">
            <NavBar className="top" />
            <h1>유저신고</h1>
            <Table />
        </div>
    );
}

export default Report;