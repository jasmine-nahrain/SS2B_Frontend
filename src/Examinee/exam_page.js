import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import CountDownTimer from './timer.js'
import exampage from './exampage.css'


class ExamPage extends React.Component {
  state = {
    isActive: false,
  };

  handleToggle = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
  };

  render() {
    return (
      <div>
        <img src={logo} className="move" alt="logo" />
        <h1 className = "Something"><b>Examination Page</b></h1>
        {this.state.isActive ? <CountDownTimer /> : null}
        <button
          type="button"
          class="btn btn-warning"
          onClick={this.handleToggle}
        >
          Start Exam?
        </button>
      </div>
    );
  }
}
export default withRouter(ExamPage);
