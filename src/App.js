import React, { Component } from 'react';
import {BrowserRouter, Route} from 'react-router-dom';
import ExaminerLogin from './Examiner/examiner_login.js';
import ExaminerRegister from './Examiner/examiner_register.js';
import ExamineeLogin from './Examinee/examinee_login.js';
import ExamineeRegister from './Examinee/examinee_register.js';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div>
          <Route exact={true} path='/examiner/login' render={() => (
            <div className="App">
              <ExaminerLogin />
            </div>
          )}/>
          <Route exact={true} path='/examiner/register' render={() => (
            <div className="App">
              <ExaminerRegister />
            </div>
          )}/>
          <Route exact={true} path='/examinee/login' render={() => (
            <div className="App">
              <ExamineeLogin />
            </div>
          )}/>
          <Route exact={true} path='/examinee/register' render={() => (
            <div className="App">
              <ExamineeRegister />
            </div>
          )}/>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
