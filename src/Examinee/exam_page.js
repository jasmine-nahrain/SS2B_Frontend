import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo.png';
import CountDownTimer from './timer.js'
import styled from 'styled-components';
import './exampage.css'

const Vid = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
`;

class ExamPage extends React.Component {
  state = {
    isActive: false,
  };

  handleToggle = () => {
    this.setState({
      isActive: !this.state.isActive,
    });
    this.btnReview.setAttribute("disabled", "disabled");
  };

  render() {
    return (
      <div>
        <img src={logo} className="move" alt="logo" />
        <h1 className = "Something"><b>Examination Page</b></h1>
        <Vid>
          <iframe width="500" height="300" frameBorder="1">
          </iframe>
          <br/><br/><br/>
          {this.state.isActive ? <CountDownTimer /> : null}
            <button
            type="button"
            class="btn btn-warning"
            onClick={this.handleToggle}
            ref={btnReview => {
              this.btnReview = btnReview;
            }}
            >
            Start Exam
            </button>
        </Vid>   
      </div>
    );
  }
}
export default withRouter(ExamPage);
