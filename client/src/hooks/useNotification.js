/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          hooks
 * File:            useNotification.js
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { toast } from "react-toastify";

const useNotification = () => {
    // Notification configuration parameters
    const notification = {
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        pauseOnFocusLoss: true,
        draggable: false,
        draggableDirection: 'x',
        progress: undefined,
    }

    // Object that allows you to handle notify
    const notify = {
        // Error notification
        error: (error) => {
            toast.error(error, {
                type: toast.TYPE.ERROR,
                position: toast.POSITION.TOP_RIGHT,
                theme: 'colored',
                ...notification,
            });
        },

        // Success notification
        success: (response) => {
            toast.success(response, {
                type: toast.TYPE.SUCCESS,
                position: toast.POSITION.TOP_RIGHT,
                theme: 'colored',
                ...notification,
            });
        }
    }
    return notify;
}

export default useNotification;