import React from "react";
import NavBar from "../NavBar.js";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Table from './boardbackenddummy.js'
import "./Board.css"
import UserIcon from '@material-ui/icons/Person';

import {Link} from "react-router-dom";

function Board() {
    return (
        <div className="front">
            <NavBar class="top" />
            <h1>게시글/댓글 관리</h1>
            <Table/>
        </div>
    );
}

export default Board;