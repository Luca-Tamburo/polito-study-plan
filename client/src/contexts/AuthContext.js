//Imports
import { createContext, useEffect, useState } from 'react'
import { Spinner } from 'react-bootstrap';

//Services
import api from '../services/api';

//Hooks
import useNotification from '../hooks/useNotification';

const AuthContext = createContext([{}, () => { }]);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState({ user: null, plan: null, loggedIn: false });
    const [dirty, setDirty] = useState(true); //Stato per ricaricare le informazioni dell'utente
    const notify = useNotification();

    useEffect(() => {
        if (dirty)
            api.getUserInfo()
                .then((user) => {
                    setUser({ user: { ...user }, plan: null, loggedIn: true });
                    api.getStudyPlan()
                        .then((plan) => {
                            setUser({ user: { ...user }, plan: { ...plan }, loggedIn: true });
                            setDirty(false);
                        })
                        .catch((error) => {
                            if (error.status === 404)
                                setUser({ user: { ...user }, plan: null, loggedIn: true });
                            else notify.error(error.data)
                            setDirty(false);
                        })
                })
                .catch(() => {
                    setUser({ user: undefined, loggedIn: false });
                    setDirty(false);
                })
    }, [dirty]); //eslint-disable-line react-hooks/exhaustive-deps

    if (!dirty) {
        return (
            <AuthContext.Provider value={[user, setUser, setDirty]}>
                {children}
            </AuthContext.Provider>
        );
    }

    return (
        <div className='h-100 d-flex align-items-center justify-content-center'>
            <Spinner animation='border' variant='primary' className='opacity-25' />
        </div>
    );
}

export { AuthContext, AuthProvider };