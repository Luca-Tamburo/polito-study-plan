//Imports
import './App.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';

//Components
import AppContainer from './components/AppContainter';
import ProtectedRoute from './components/ProtectedRoute';

//Views
import * as View from './views';

//Services
import api from './services/api';

const App = () => {
  const [course, setCourse] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    api.getCourses()
      .then(courses => {
        setCourse(courses);
      })
      .catch(err => {
        if (err.status === 404)
          setCourse([]);
        else
          //FIXARE
          console.log(err.data);
      })
      .finally(() => setLoading(false))
  }, []);

  if (loading)
    return (
      <div className='d-flex justify-content-center m-5'>
        <Spinner as='span' animation='border' size='xl' role='status' aria-hidden='true' />
        <h1 className='fw-bold mx-4'>LOADING...</h1>
      </div>
    )
  return (
    <AppContainer setCourse={setCourse}>
      <Routes location={location} key={location.pathname}>
        <Route index path='/' element={<View.Home course={course} />} />
        <Route index path='/login' element={<View.Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path='/study-plan' element={<View.StudyPlan course={course} />} />
          <Route path='/study-plan/edit' element={<View.EditStudyPlan course={course} />} />
        </Route>
        <Route path='*' element={<View.ErrorView />} />
      </Routes>
    </AppContainer>
  );
}

export default App;
