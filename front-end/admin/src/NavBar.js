import React from 'react';
import {Link} from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    return (
        <header className="top">
            <ul>
                <li className="inline"><Link to="/administrator" className="inline">로그아웃</Link></li>
                <li className="inline"><Link to="/administrator/front" className="inline">메인화면</Link></li>
                <li className="inline"><Link to="/administrator/ad" className="inline">광고관리</Link></li>
                <li className="inline"><Link to="/administrator/user" className="inline">유저관리</Link></li>
                <li className="inline"><Link to="/administrator/report" className="inline">신고관리</Link></li>
                <li className="inline"><Link to="/administrator/board" className="inline">게시글/댓글</Link></li>
            </ul>
        </header>
    )
}

export default NavBar;