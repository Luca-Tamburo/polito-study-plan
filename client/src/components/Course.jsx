/*
 * --------------------------------------------------------------------
 * 
 * Package:         client
 * Module:          components
 * File:            Course.jsx
 * 
 * Author:          Luca Tamburo
 * Last modified:   2022-10-23
 * 
 * Copyright (c) 2022 - Luca Tamburo
 * All rights reserved.
 * --------------------------------------------------------------------
 */

// Imports
import { Accordion, Alert, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';

const Course = (props) => {
    if (props.course.length === 0 && !props.removeCourseToPlan) {
        return (
            <div className='d-flex justify-content-center mt-4'>
                <Alert className="color-alert fw-bold p-3 my-2 rounded-3 px-5" variant='warning' >
                    Non sono presenti corsi.
                </Alert>
            </div>
        )
    } else
        return (
            <Accordion alwaysOpen >
                {props.course.map((course, index) => {
                    return (
                        <Accordion.Item eventKey={index} key={index} className={props.courseSelected ? 'border border-success border-3 mt-2 border-top shadow' : (course.disable ? 'opacity-25 mt-2 border-top shadow' : 'mt-2 border-top shadow')}>
                            <Accordion.Header>
                                <div>
                                    <h6>{course.code} - {course.name} - {course.CFU} CFU</h6>
                                    <h6>{course.max_students ? `Numero di iscritti al corso: ${course.registered_students} / ${course.max_students} ` : `Numero di iscritti al corso: ${course.registered_students}`}</h6>
                                    <h6 className='mb-0'>{course.max_students ? `Numero massimo di studenti: ${course.max_students}` : "Corso aperto a tutti."}</h6>
                                </div>
                            </Accordion.Header>
                            <Accordion.Body>
                                <h6>{course.propaedeuticity.code ? `Propedeuticità: ${course.propaedeuticity.code} - ${course.propaedeuticity.name}` : "Corso non propedeutico."}</h6>
                                {course.incompatibilities ?
                                    course.incompatibilities.map((inc, index) => {
                                        return (
                                            <h6 key={index}>Incompatilibità: {inc.code} - {inc.name} </h6>
                                        )
                                    }) : <h6>Nessuna incompatibilità</h6>
                                }
                            </Accordion.Body>
                            <div className='mx-3 mb-3'>
                                {props.addCourseToPlan && <Button className='button-aggiungi-study-plan' onClick={() => props.add(course)} >
                                    <FontAwesomeIcon icon={faCirclePlus} className='me-2' />
                                    Aggiungi
                                </Button>}
                                {props.removeCourseToPlan && <Button variant='danger' onClick={() => props.remove(course)}>
                                    <FontAwesomeIcon icon={faTrash} className='me-2' />
                                    Rimuovi
                                </Button>}
                            </div>
                        </Accordion.Item>
                    )
                })}
            </Accordion >
        );
}

export default Course;