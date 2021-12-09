import React from "react";
import NavBar from "./NavBar.js";
import './front.css';

function Front() {
    return (
        <div className="front">
            <NavBar class="top" />
            <h1>메인화면</h1>
        </div>
    );
}

export default Front;