import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import '../App.css';
import styled from 'styled-components';
import logo from '../images/logo.png';
import {logout} from '../functions'

const Body = styled.body`
  // background-color: white;
  // background-blend-mode: multiply;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(20px + 2vmax);
  color: black;
`;

class ExamineeEndPage extends Component {

    onLogout = (e) => {
      e.preventDefault();
      logout();
    }

    render() {
      return (
        <div className="App">
          <Body>
            <img src={logo} class="Uts-logo"/>
            <h2 class="mt-5">Your exam has ended.</h2>
            <a href="/login" class="nav-link" onClick={this.onLogout}>
              <Button variant="outline-dark" type="submit" style={{width: '100%'}} >
                Logout
              </Button>
            </a>
          </Body>
        </div>
      );
    }
  } export default withRouter(ExamineeEndPage);