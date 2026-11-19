import React from "react";
import {NavLink,Link} from "react-router";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faBox, faCalendar, faChartLine, faFileLines, faGear, faHouse, faUser,faRightFromBracket, faGrip, faChevronLeft, faChevronRight} from "@fortawesome/free-solid-svg-icons";

const Sidebar = ({toggleSidebar,isOpen})=>{

    const menuItems = [
        {path:"/students",icon:faUser,label:"Students"},
    ];

    return(
        <aside className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
            {/* Header */}


            <div className="d-flex justify-content-between align-items-center p-4">

                {
                    isOpen && (
                        <div className="logo">
                            <h4 className="text-white mb-0"><FontAwesomeIcon icon={faGrip} className="me-2" />AdminPro</h4>
                            <small className="text-white opacity-75">Premium Dashboard</small>
                        </div>
                    ) 
                }
                


                <button type="button" className="btn btn-link text-white border-0 p-0" onClick={toggleSidebar}><FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} /></button>

            </div>


            {/* Menu */}
            <div className="sidebar-menus px-3">
                <ul className="nav flex-column">
                    {
                        menuItems.map((menuItem,idx)=>(
                            <li className="nav-item" key={idx}>
                                <NavLink to={menuItem.path} className={({isActive})=> `nav-links d-flex align-items-center ${isActive ? "active" : ""}`}>
                                    <FontAwesomeIcon icon={menuItem.icon} className="icon" />
                                    {isOpen && <span className="labels ms-3">{menuItem.label}</span>}
                                </NavLink>
                            </li>
                        ))
                    }
                </ul>



            </div>



        </aside>
    )
}

export default Sidebar;

// 25CB 
