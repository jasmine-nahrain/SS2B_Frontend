import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ExaminerRegister from './Examiner/examiner_register.js';
import ExamineeLogin from './Examinee/login.js';
import ExamineeRegister from './Examinee/examinee_register.js';
import StudentFilter from './Examiner/student_filter.js';
import ManageExam from './Examiner/manage_exam.js';
import CreateExam from './Examiner/create_exam.js';
import ExamRules from './Examinee/exam_rules.js';
import Redirect from './Examinee/redirect_page.js';

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
          <Route exact={true} path='/examiner/manage' render={() => (
            <div className="App">
              <ManageExam />
            </div>
          )}/>
          <Route exact={true} path='/examiner/create' render={() => (
            <div className="App">
              <CreateExam />
            </div>
          )}/>
          <Route exact={true} path='/examinee/rules' render={() => (
            <div className="App">
              <ExamRules />
            </div>
          )}/>
          <Route exact={true} path='/examinee/redirect' render={() => (
            <div className="App">
              <Redirect />
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
