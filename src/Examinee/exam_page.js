import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import CountDownTimer from './timer.js'


class ExamPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
        this.buttonClicked = this.buttonClicked.bind(this);
        }
    buttonClicked(event) {
    this.setState({value: this.state.value+1});
    }
      
    render() {
        return (
             <div>
             <img src={logo} class="Uts-logo" alt="logo"/>
             <div>{this.state.value}</div>
             <button onClick={this.buttonClicked} class="btn btn-primary btn-lg">Misconduct Strikes</button>
             <CountDownTimer></CountDownTimer>
            </div>
          );
        }
      } export default withRouter(ExamPage);