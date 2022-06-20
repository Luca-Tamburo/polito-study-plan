//Imports
import { useContext, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

//Components
import LoginForm from "../components/LoginForm";

//Contexts
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
    const [session] = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (session.loggedIn)
            navigate('/', { replace: true });
    }, []); //eslint-disable-line react-hooks/exhaustive-deps

    if (!session.loggedIn)
        return (
            <Row className="p-4 my-4 flex-fill align-items-center">
                <div className="text-center">
                    <h1 className="fw-extrabold text-primary text-center">Welcome to Politecnico di Torino</h1>
                    <h4 className="text-dark">Accedi per visualizzare il tuo piano di studio!</h4>
                </div>
                <Col xs={{ span: 12 }} lg={{ span: 6 }} className="mx-auto">
                    <LoginForm />
                </Col>
            </Row>
        );
}

export default Login;