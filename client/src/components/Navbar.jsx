/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            Navbar.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { Container, Row, Navbar as MyNavbar, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightToBracket, faHome, faBars, faDoorOpen } from '@fortawesome/free-solid-svg-icons';

// Components
import Sidebar from './Sidebar';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

// Services
import api from '../services/api';

// Hooks
import useNotification from '../hooks/useNotification';

const Navbar = ({ setCourse }) => {
    const [session, , setDirty] = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const navigate = useNavigate(); // Navigation handler
    const location = useLocation();
    const notify = useNotification(); // Notification handler

    // Perform logout
    const handleLogout = () => {
        api.logout()
            .then(() => {
                notify.success(`Arrivederci ${session.user.name}!`)
                setDirty(true);
                setCourse([]);
                navigate('/', { replace: true });
            })
            .catch((err) => notify.error(err));
    }

    return (
        <Row>
            {session.loggedIn && <Sidebar show={show} onHide={() => setShow(false)} />}
            <MyNavbar expand="lg" bg="light" variant="light">
                {session.loggedIn &&
                    <Button className='ms-3' variant='light' onClick={() => setShow(true)}>
                        <div className='d-flex'>
                            <FontAwesomeIcon icon={faBars} size='xl' className='mt-1 me-3' />
                            <h4>Menu</h4>
                        </div>
                    </Button>
                }
                <Container fluid>
                    <MyNavbar.Brand className='fs-1 fw-black text-dark'>
                        <span className='fw-bold fst-italic'>Study Plan</span>
                    </MyNavbar.Brand>
                    <div>
                        {session.loggedIn ?
                            <div className='d-flex'><h5 className='mt-2'>Hi, {session.user.name}!</h5><Button size='xl' className='ms-4 px-3 text-white fw-semibold' onClick={handleLogout}>
                                <FontAwesomeIcon icon={faDoorOpen} className='me-3' size='xl' />Logout
                            </Button>
                            </div> :
                            (
                                location.pathname !== '/login' ?
                                    <Link to='/login'>
                                        <Button size='xl' className='ms-4 px-3 text-white fw-semibold'>
                                            <FontAwesomeIcon icon={faArrowRightToBracket} size='lg' className='me-3' />
                                            Login
                                        </Button>
                                    </Link> :
                                    <Link to='/'>
                                        <Button size='xl' className='ms-4 px-3 text-white fw-semibold'>
                                            <FontAwesomeIcon icon={faHome} size='lg' className='me-3' />
                                            Torna alla lista dei corsi
                                        </Button>
                                    </Link>
                            )
                        }
                    </div>
                </Container>
            </MyNavbar>
        </Row >
    );
}

export default Navbar;

