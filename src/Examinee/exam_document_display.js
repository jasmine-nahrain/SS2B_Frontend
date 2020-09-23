import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../App.css';
import styled from 'styled-components';
import logo from '../images/logo.png';

const Body = styled.body`
  // background-color: white;
  // background-blend-mode: multiply;
  min-height: 75vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  // font-size: calc(20px + 2vmax);
  color: black;
`;

const Vid = styled.div`
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 100;
  height: 100%;
`;

class ExamDocumentDisplay extends Component {

    render() {
      return (
        <div className="App">         
            <Vid>
                <iframe width="500" height="300" src="https://www.youtube.com/embed/FzcfZyEhOoI" frameBorder="1"
                >
                </iframe>
            </Vid>   
            <Body>text</Body>         
        </div>
        
      );
    }
  } export default withRouter(ExamDocumentDisplay);
