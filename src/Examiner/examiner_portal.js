import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Navbar, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import '../App.css';
import styled from 'styled-components';
import logo from '../images/logo.png';

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
`;

const Body = styled.body`
  // background-color: white;
  // background-blend-mode: multiply;
  min-height: 50vh;
  display: flex;
  flex-direction: row;
  margin: 10px;
  align-items: center;
  justify-content: center;
  font-size: calc(20px + 2vmax);
  color: black;
  
`;

class ExaminerPortal extends Component {
  onLogout = (e) => {
    e.preventDefault();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  }

    render() {
      return (
        <div className="App">
            <Header>
              <h1>Portal</h1>
              <ButtonToolbar>
                <ButtonGroup className="mr-2" >
                    <Button href="/examiner/" variant="primary" size="lg">Filter</Button>
                </ButtonGroup>
                <ButtonGroup className="mr-2" >
                    <Button href="/examiner/manage" variant="primary" size="lg">Manage</Button>
                </ButtonGroup>    
                <ButtonGroup className="mr-2" >
                  <a href="/login" onClick={this.onLogout}>
                  <Button href="/examiner/manage" variant="primary" size="lg">Logout</Button> 
                  </a>                      
                </ButtonGroup>             
              </ButtonToolbar>               
            </Header>
            <Body>      
                                            
            </Body>          
        </div>
      );
    }
} export default withRouter(ExaminerPortal);
