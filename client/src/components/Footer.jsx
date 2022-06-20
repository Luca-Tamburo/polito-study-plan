//Imports
import { Row } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

const Footer = () => {
    return (
        <Row>
            <footer className='bg-light text-dark p-4 mt-3'>
                <div className='d-block d-lg-flex justify-content-between'>
                    <h6 className='fw-bold'>Tamburo Luca s303907</h6>
                    <h6 className='fw-bold'>Copyright &copy; All rights reserved.</h6>
                    <div>
                        <a href="https://github.com/polito-AW1-2022-exams/esame1-piano-studi-Luca-Tamburo" rel='noreferrer' target='_blank' className='link-dark ms-1'><FontAwesomeIcon icon={faGithub} size="lg" className="me-4" /></a>
                        <a href="https://www.linkedin.com/in/luca-tamburo-6377b0226/" rel='noreferrer' target='_blank' className='link-dark ms-1'><FontAwesomeIcon icon={faLinkedin} size="lg" /></a>
                    </div>
                </div>
            </footer>
        </Row>
    );
}

export default Footer;