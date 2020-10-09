import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo_white.png';
import CountDownTimer from './timer.js'
import styled from 'styled-components';
import './exampage.css'
import './scripts/script.js';
import {setupNewBroadcastButtonClickHandler} from './scripts/script.js';
const Vid = styled.div`
  /* position: fixed;
  /* top: 0; */
  /* width: 100%;
  z-index: 100;
  height: 100%;  */
`;

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 3%;
`;

class ExamPage extends React.Component {
  state = {
    isActive: false,
  };

  handleToggle = () => {
    setupNewBroadcastButtonClickHandler();
    this.setState({
      isActive: !this.state.isActive,
    });
    this.btnReview.setAttribute("disabled", "disabled");
  };


  render() {
    return (
      <div className="App">
        <Header >
          <img src={logo} className="move" alt="logo" style={{marginLeft: 'auto', marginRight: 'auto'}}/>
          <h1>Examination Page</h1>
        </Header>
        <Vid>
          <iframe width="500" height="300" frameBorder="1">
          </iframe>
          <br/><br/><br/>


        <section class="experiment">
          <div id="createBroadcast">
            <section>
              <input type="text" id="user_id" value={localStorage.getItem('user_id')} disabled/>
              {this.state.isActive ? <CountDownTimer /> : null}
                <button
                type="button"
                id="setup-new-broadcast"
                class="btn btn-warning"
                onClick={this.handleToggle}
                ref={btnReview => {
                  this.btnReview = btnReview;
                }}
                disabled={this.state.isActive}
                >
                Start Exam
                </button>
            </section>
          </div>
          <div id="listStudents">
            <table style={{width: '100%'}} id="rooms-list"></table>
          </div>
          <div id="videos-container"></div>
        </section>
        </Vid>
      </div>
    );
  }
}
export default withRouter(ExamPage);
