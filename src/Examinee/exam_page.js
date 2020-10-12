import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from '../images/logo_white.png';
import CountDownTimer from './timer.js'
import styled from 'styled-components';
import './exampage.css'
import './scripts/script.js';
//import { setupNewBroadcastButtonClickHandler } from './scripts/script.js';
var DetectRTC = require('detectrtc');

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 3%;
`;

class ExamPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      user_id: localStorage.getItem('user_id'),
      exam_id: localStorage.getItem('exam_id'),
      is_examiner: localStorage.getItem('is_examiner'),
      video: '',
    };
  }

  componentDidMount () { 
    const script = document.createElement("script");

    script.src = './scripts/script.js';
    script.async = true;
    
    document.body.appendChild(script);
  }

  handleToggle = () => {
    // setupNewBroadcastButtonClickHandler();
    // this.setState({
    //   isActive: !this.state.isActive,
    // });
    // this.btnReview.setAttribute("disabled", "disabled");
  };


  render() {
    const videoWidth = window.innerWidth / 2;
    const videoHeight = window.innerHeight / 2;
    return (
      <div className="App">
        <Header >
          <img src={logo} className="move" alt="logo" style={{ marginLeft: 'auto', marginRight: 'auto' }} />
          <h1>Examination Page</h1>
        </Header>
        <video id="videos-container" src={this.state.video} width={videoWidth} height={videoHeight} frameBorder="1" />
        <section class="experiment">
          {!this.state.is_examiner &&
            <div id="createBroadcast">
              <section>
                <input type="text" id="user_id" value={this.state.user_id} disabled />
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
          }
          {this.state.is_examiner &&
            <div id="listStudents">
              <table style={{ width: '100%' }} id="rooms-list"></table>
            </div>
          }
        </section>
      </div>
    );
  }
}
export default withRouter(ExamPage);
