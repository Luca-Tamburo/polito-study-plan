//Imports
import { Row, Col } from 'react-bootstrap';

//Components
import Course from "../components/Course";

const Home = (props) => {
    return (
        <Row className='flex-fill'>
            <Col xs={{ span: 10, offset: 1 }} className='mt-3'>
                <Course course={props.course} />
            </Col>
        </Row >
    );
}

export default Home;