/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            AppContainer.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { Col, Row, Container } from "react-bootstrap";

// Components
import Navbar from './Navbar';
import Footer from "./Footer";

const AppContainer = ({ ...props }) => {
    return (
        <Container fluid className='app-container'>
            <Navbar />
            <Row className='flex-fill'>
                <Col>{props.children}</Col>
            </Row>
            <Footer />
        </Container >
    );
}

export default AppContainer;