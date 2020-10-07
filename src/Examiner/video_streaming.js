import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import '../App.css';
import { BrowserRouter } from "react-router-dom";
import styled from 'styled-components';

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

class VideoStreaming extends Component {

  constructor(props) {
     super(props);

     this.state = {
     };
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Body>
        </Body>
      </div>
      </BrowserRouter>
    );
  }
} export default withRouter(VideoStreaming);
