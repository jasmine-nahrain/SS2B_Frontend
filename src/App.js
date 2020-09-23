import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ExaminerRegister from './Examiner/examiner_register.js';
import ExamineeLogin from './Examinee/login.js';
import ExamineeRegister from './Examinee/examinee_register.js';
import ExamineeEndPage from  './Examinee/examinee_endpage.js';
import StudentFilter from './Examiner/student_filter.js';
import ExaminerPortal from './Examiner/examiner_portal.js';
import CreateExam from './Examiner/create_exam.js';
import ExamDocumentDisplay from './Examinee/exam_document_display.js';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/examiner/register' render={() => (
            <div className="App">
              <ExaminerRegister />
            </div>
          )}/>
          <Route exact={true} path='/' render={() => (
            <div className="App">
              <ExamineeLogin />
            </div>
          )}/>
          <Route exact={true} path='/examinee/register' render={() => (
            <div className="App">
              <ExamineeRegister />
            </div>
          )}/>
          <Route exact={true} path='/examiner/' render={() => (
            <div className="App">
              <StudentFilter />
            </div>
          )}/>
          <Route exact={true} path='/examiner/create' render={() => (
            <div className="App">
              <CreateExam />
            </div>
          )}/>
          <Route exact={true} path='/examinee/endpage' render={() => (
            <div className="App">
              <ExamineeEndPage />
            </div>
          )}/>
          <Route exact={true} path='/examiner/portal' render={() => (
            <div className="App">
              <ExaminerPortal />
            </div>
          )}/>
          <Route exact={true} path='/examinee/examdisplay' render={() => (
            <div className="App">
              <ExamDocumentDisplay />
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
