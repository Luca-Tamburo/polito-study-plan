/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          views
 * File:            ErrorView.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { Link } from 'react-router-dom';
import { Row, Button, Image } from 'react-bootstrap';

const ErrorView = () => {
    return (
        <Row className='p-4 my-4 mx-auto flex-fill text-dark align-items-center'>
            <div className='d-flex flex-column align-items-center'>
                <Image fluid src='http://localhost:3001/public/img/404_page_not_found.svg' width={450} />
                <h3 className='mb-0 fw-bold mt-3'>Page Not Found</h3>
                <div className='my-5'>
                    <Link to={'/'}>
                        <Button size='xs'>Back to home</Button>
                    </Link>
                </div>
            </div>
        </Row>
    );
}

export default ErrorView;