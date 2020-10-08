import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import CountDownTimer from './timer.js'


class ExamPage extends React.Component {
    
      
    render() {
        return (
             <div>
             <img src={logo} class="Uts-logo" alt="logo"/>
             <CountDownTimer/>
            </div>
          );
        }
      } export default withRouter(ExamPage);

      