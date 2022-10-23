/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          views
 * File:            StudyPlan.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { useContext, useEffect, useState } from "react";
import { Row, Col, Button, Image, Card, Modal } from "react-bootstrap"
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashCan, faFilePen } from '@fortawesome/free-solid-svg-icons';

// Compontents
import Course from "../components/Course";

// Contexts
import { AuthContext } from "../contexts/AuthContext";

// Hooks
import useNotification from '../hooks/useNotification';

// Services
import api from "../services/api";

const StudyPlan = (props) => {
    const [session, setSession, setDirty] = useContext(AuthContext);
    const [types, setType] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const notify = useNotification(); // Notification handler

    useEffect(() => {
        api.getStudyPlanType()
            .then((types) => {
                setType(types);
            })
            .catch(err => {
                notify.error(err.message);
            })
    }, []) //eslint-disable-line react-hooks/exhaustive-deps

    const handleStudyPlan = (typeId) => {
        const type = types.find(type => type.id === typeId);

        setSession((old) => ({
            ...old,
            plan: {
                plan_type: {
                    id: type.id,
                    name: type.name,
                    min_credits: type.min_credits,
                    max_credits: type.max_credits
                },
                courses: [],
                tot_credits: 0,
            }
        }));
    }

    const handleDelete = () => {
        if (session.plan.id) {
            api.deleteStudyPlan(session.plan.id)
                .then(() => {
                    notify.success('Piano di studio eliminato correttamente');
                    setDirty(true);
                })
                .catch((error) => notify.error(error.message))
        } else {
            setSession((old) => ({
                ...old,
                plan: null
            }));
            notify.success('Operazione effettuata con successo');
        }
        setShowModal(false);
    }

    return (
        <div>
            {
                session.plan ?
                    <>
                        <div className="d-flex justify-content-center text-center">
                            <Card className='border-0 shadow h-100 px-4 py-2'>
                                <Card.Body>
                                    <h5>Tipologia: {session.plan.plan_type.name}</h5>
                                    <h6>Numero totale di crediti: {session.plan.tot_credits}</h6>
                                    <hr />
                                    <Link to={'/study-plan/edit'}>
                                        <Button className="colore-bottone-modifica">
                                            <FontAwesomeIcon icon={faFilePen} className="me-2" />
                                            Modifica
                                        </Button>
                                    </Link>
                                    <Button className="ms-3" variant='danger' onClick={() => setShowModal(true)}>
                                        <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                                        Elimina
                                    </Button>
                                    <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                                        <Modal.Header className="justify-content-center mt-3">
                                            <Modal.Title>
                                                Sei sicuro di voler eliminare il piano di studio?
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body className="text-center">
                                            Se confermi non sarà più possibile recuperare il piano di studio.
                                        </Modal.Body>
                                        <Modal.Footer className="me-3">
                                            <Button variant='secondary' onClick={() => setShowModal(false)}>
                                                Annulla
                                            </Button>
                                            <Button className="ms-3" variant='danger' onClick={handleDelete}>
                                                <FontAwesomeIcon icon={faTrashCan} className="me-2" />
                                                Elimina
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Card.Body>
                            </Card>
                        </div>
                        <Col xs={{ span: 10, offset: 1 }} className='mt-3' >
                            {session.plan.courses.length !== 0 && <h3>Corsi selezionati: </h3>}
                            <Course course={props.course.filter(c => session.plan.courses.includes(c.code))} className='mt-3' />
                        </Col>
                    </> :
                    <Row className='p-4 my-4 mx-auto flex-fill text-dark align-items-center'>
                        <div className='d-flex flex-column align-items-center'>
                            <Image fluid src='http://localhost:3001/public/img/add_study_plan.svg' width={325} />
                            <h4 className='mb-0 fw-bold mt-3'>Aggiungi un piano di studio</h4>
                            <div className='d-flex text-center mt-4'>
                                {
                                    types.map((type, index) => {
                                        return (
                                            <div key={index} className='px-4 mt-3'>
                                                <Button className='mx-3' onClick={() => handleStudyPlan(type.id)}> {type.name} </Button>
                                                <h6 className="mt-3">Crediti minimi: {type.min_credits}.</h6>
                                                <h6 className="mt-3">Crediti massimi: {type.max_credits}.</h6>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </Row>
            }
        </div>

    );
}

export default StudyPlan;