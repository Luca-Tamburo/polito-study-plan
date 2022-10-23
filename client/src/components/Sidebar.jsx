/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            Sidebar.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { NavLink } from 'react-router-dom';
import { Col, Offcanvas, OffcanvasHeader, OffcanvasTitle, OffcanvasBody } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

const Sidebar = (props) => {

    return (
        <Col>
            <Offcanvas show={props.show} onHide={props.onHide}>
                <OffcanvasHeader closeButton>
                    <OffcanvasTitle>Menu</OffcanvasTitle>
                </OffcanvasHeader>
                <OffcanvasBody>
                    <div className='d-flex flex-column'>
                        <NavLink to={'/'} onClick={props.onHide} className={({ isActive }) => !isActive ?
                            'fw-bold p-3 mb-3 rounded-3 text-decoration-none' :
                            'fw-bold p-3 mb-3 rounded-3 text-decoration-none bg-primary text-white'}>
                            <FontAwesomeIcon icon={faBook} size="lg" className="me-3 test-color" />Corsi
                        </NavLink>
                        <NavLink to={'/study-plan'} onClick={props.onHide} className={({ isActive }) => !isActive ?
                            'fw-bold p-3 mb-3 rounded-3 text-decoration-none' :
                            'fw-bold p-3 mb-3 rounded-3 text-decoration-none bg-primary text-white'}>
                            <FontAwesomeIcon icon={faGraduationCap} size="lg" className="me-3" />Piano di studi
                        </NavLink>
                    </div>
                </OffcanvasBody>
            </Offcanvas>
        </Col>
    );
}

export default Sidebar;


