import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import '../App.css';
import logo from '../images/logo.png';
import { BrowserRouter } from "react-router-dom";
import styled from 'styled-components';

const Title = styled.div`
  padding:14px 5px 14px 0px;
`;

const Text = styled.span`
vertical-align: text-top;
`;

const Body = styled.body`
  background-color: white;
  background-blend-mode: multiply;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: black;
`;

class Redirect extends Component {

  constructor(props) {
     super(props);
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Body>
          <h1>You dont have access to this page</h1>
          <Button variant="outline-dark" type="submit" className="button" href="/examinee/rules">Go Back</Button>
        </Body>
      </div>
      </BrowserRouter>
    );
  }
} export default withRouter(Redirect);
