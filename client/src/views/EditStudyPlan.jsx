/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          views
 * File:            EditStudyPlan.jsx
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
import { Link, useNavigate } from 'react-router-dom'
import { Col, Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFloppyDisk, faClockRotateLeft, faGraduationCap } from '@fortawesome/free-solid-svg-icons';

// Components
import Course from '../components/Course';

// Contexts
import { AuthContext } from '../contexts/AuthContext';

// Hooks
import useNotification from '../hooks/useNotification';

// Services
import api from '../services/api';

const EditStudyPlan = (props) => {
    const [session, , setDirty] = useContext(AuthContext);
    const [coursesPlan, setCoursesPlan] = useState(session.plan ? session.plan.courses : null);
    const [currentCredits, setCurrentCredits] = useState(session.plan ? session.plan.tot_credits : null);
    const [showModal, setShowModal] = useState(false);
    const notify = useNotification(); // Notification handler
    const navigate = useNavigate(); // Navigation handler

    if (!session.plan) {
        navigate('/study-plan', { replace: true });
    }

    const addCourse = (course) => {
        //Check propaedeuticity
        if (course.propaedeuticity.code && !coursesPlan.includes(course.propaedeuticity.code)) {
            notify.error(`Conflitto di propedeuticità con ${course.propaedeuticity.code} - ${course.propaedeuticity.name}.`);
        } else if (course.incompatibilities && course.incompatibilities.find(inc => coursesPlan.includes(inc.code))) { //Check incompatibilities.
            notify.error('Conflitto di incompatibilità con un corso presente nel piano di studio.');
        } else if (course.max_students && course.registered_students >= course.max_students) { //Check studenti massimi per corso.
            notify.error('Corso pieno. È stato raggiunto il numero massimo di iscritti al corso.');
        } else if (currentCredits + course.CFU > session.plan.plan_type.max_credits) { //Check crediti massimi.
            notify.error('Numero massimo di CFU raggiunto.');
        } else {
            setCoursesPlan((old) => [...old, course.code]);
            setCurrentCredits((old) => old + course.CFU);
        }
    }

    const removeCourse = (course) => {
        const propaedeuticityCourse = props.course.find(c => c.propaedeuticity && c.propaedeuticity.code === course.code);
        if (propaedeuticityCourse && coursesPlan.includes(propaedeuticityCourse.code)) {
            notify.error(`Vincolo di propedeuticità non soddisfatto. Rimuovi prima il corso ${propaedeuticityCourse.name}.`)
        } else {
            setCoursesPlan((old) => old.filter((c => c !== course.code)))
            setCurrentCredits((old) => old - course.CFU);
        }
    }

    const handleReset = () => {
        setCoursesPlan(session.plan.courses);
        setCurrentCredits(session.plan.tot_credits);
        notify.success('Reset al piano di studio effettuata con successo');
        setShowModal(false);
    }

    const handleSave = () => {
        if (currentCredits < session.plan.plan_type.min_credits) {
            notify.error("Limite minimo di crediti non raggiunto. Aggiungi almeno un corso e riprova.")
        } else if (session.plan.id) {
            const old_course = session.plan.courses.filter(c => !coursesPlan.includes(c));
            const new_course = coursesPlan.filter(c => !session.plan.courses.includes(c));

            api.updateStudyPlan(session.plan.id, currentCredits, old_course, new_course, session.plan.plan_type.id)
                .then(() => {
                    notify.success('Piano di studio aggiornato con successo');
                    setDirty(true);
                    navigate('/study-plan', { replace: true });
                })
                .catch((error) => {
                    notify.error(error);
                })
        } else {
            api.addStudyPlan(coursesPlan, session.plan.plan_type.id, currentCredits)
                .then(() => {
                    notify.success('Salvataggio effettuato con successo');
                    setDirty(true);
                    navigate('/study-plan', { replace: true })
                })
                .catch((error) => {
                    notify.error(error);
                })
        }
    }
    if (session.plan)
        return (
            <Col xs={{ span: 10, offset: 1 }}>
                <div className='d-flex justify-content-between mt-4'>
                    <div className='d-flex flex-column'>
                        <h4>Numero totale di crediti: {currentCredits}</h4>
                        <h6>Crediti minimi: {session.plan.plan_type.min_credits}</h6>
                        <h6>Crediti massimi: {session.plan.plan_type.max_credits}</h6>
                    </div>
                    <div className='d-flex justify-content-end'>
                        <Link to={'/study-plan'}>
                            <Button className='my-4 buttons-save-reset'>
                                <FontAwesomeIcon icon={faGraduationCap} size='lg' className='pe-2' />
                                Torna al piano studio
                            </Button>
                        </Link>
                        <Button className='my-4 mx-3 buttons-save-reset' onClick={handleSave}>
                            <FontAwesomeIcon icon={faFloppyDisk} size='lg' className='pe-2' />
                            Salva
                        </Button>
                        <Button className='my-4 buttons-save-reset' onClick={() => setShowModal(true)}>
                            <FontAwesomeIcon icon={faClockRotateLeft} size='lg' className='pe-2' />
                            Reset
                        </Button>
                        <Modal show={showModal} onHide={() => setShowModal(false)} centered size='lg'>
                            <Modal.Header className="justify-content-center">
                                <Modal.Title>
                                    Sei sicuro di voler reimpostare il piano di studio?
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body className="text-center">
                                Se confermi le modifiche successive all'ultimo salvataggio andranno perse.
                            </Modal.Body>
                            <Modal.Footer className="me-3">
                                <Button variant='secondary' onClick={() => setShowModal(false)}>
                                    Annulla
                                </Button>
                                <Button className='ms-3' variant='danger' onClick={handleReset}>
                                    <FontAwesomeIcon icon={faClockRotateLeft} size='lg' className='pe-2' />
                                    Reset
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
                <Course removeCourseToPlan courseSelected remove={removeCourse} course={props.course.filter(c => coursesPlan.includes(c.code))} />
                <Course addCourseToPlan add={addCourse} course={
                    props.course.filter(c => !coursesPlan.includes(c.code)).map(c => ({
                        ...c,
                        disable: (c.propaedeuticity.code && !coursesPlan.includes(c.propaedeuticity.code)) ||
                            (c.incompatibilities && c.incompatibilities.find(inc => coursesPlan.includes(inc.code))) ||
                            (c.max_students && c.registered_students >= c.max_students)
                    }))} />
            </Col>
        )
}

export default EditStudyPlan;