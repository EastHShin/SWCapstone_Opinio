import React from "react";
import NavBar from "../NavBar.js";
import './advertisement.css';
import Button from 'react-bootstrap/Button';

import {Link} from "react-router-dom";

function AdvertisementAdd() {
    return (
        <div className="front">
            <NavBar class="top"/>
            Hello World!
            <br/>
            <Link to="/administrator/ad">
                <Button className="mar" variant="danger">뒤로 가기</Button>
            </Link>
            <Link to="/administrator/ad">
                <Button variant="success">수정</Button>
            </Link>
        </div>
    );
}

export default AdvertisementAdd;