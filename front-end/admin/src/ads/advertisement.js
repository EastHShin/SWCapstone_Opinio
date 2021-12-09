import React from "react";
import NavBar from "../NavBar.js";
import Table from "./adbackenddummy.js"
import './advertisement.css';
import Button from 'react-bootstrap/Button';

import {Link} from "react-router-dom";

function Advertisement() {
    return (
        <div className="front">
            <NavBar className="top" />
            <h1>광고내역</h1>
            <Link to="/administrator/ad/add">
                <Button className="add" variant="success">광고 추가</Button>
            </Link>
            <Table/>
        </div>
    );
}

export default Advertisement;