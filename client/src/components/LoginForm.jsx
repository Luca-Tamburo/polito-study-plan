/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            LoginForm.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { useState, useContext } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useNavigate } from "react-router-dom";
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// Services
import api from '../services/api';

// Components
import Input from "./Input"

// Contexts
import { AuthContext } from "../contexts/AuthContext";

// Hooks
import useNotification from '../hooks/useNotification';

const LoginForm = () => {
    const [loading, setLoading] = useState(false);
    const [, , setDirty] = useContext(AuthContext);
    const notify = useNotification(); // Notification handler
    const navigate = useNavigate(); // Navigation handler

    // Perform authentication and login
    const handleSubmit = (credentials) => {
        setLoading(true);
        api.login(credentials)
            .then(user => {
                setDirty(true);
                notify.success(`Benvenuto ${user.name}!`)
                navigate('/', { replace: true });
            })
            .catch(err => notify.error(err))
            .finally(() => setLoading(false));
    }

    const LoginSchema = Yup.object().shape({
        username: Yup.string().email('Email non valida').required('Email necessaria'),
        password: Yup.string().required('Password necessaria')
    });

    return (
        <Formik validateOnMount initialValues={{ username: '', password: '' }} validationSchema={LoginSchema} onSubmit={(values) => handleSubmit(values)}>
            {({ touched, isValid }) => {
                const disableSubmit = (!touched.username && !touched.password) || !isValid || loading;
                return (
                    <Form>
                        <Input className="mt-3" id="login-email" name="username" type="email" placeholder="Inserisci il tuo indirizzo email" label="Email" />
                        <Input className="mt-3" id="login-password" name="password" type="password" placeholder="Inserisci la tua password" label="Password" />
                        <Button variant="primary" type="submit" className='p-3 rounded-3 mt-4 w-100 fw-semibold' disabled={disableSubmit}>
                            {loading && <Spinner animation='grow' size='sm' as='span' role='status' aria-hidden='true' className='me-2' />}
                            Accedi
                        </Button>
                    </Form>
                );
            }}
        </Formik>
    );
}

export default LoginForm;