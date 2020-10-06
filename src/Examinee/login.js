import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import '../App.css';
import logo from '../images/logo.png';
import { BrowserRouter } from "react-router-dom";
import styled from 'styled-components';
import { login } from './userInfo';

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

class ExamineeLogin extends Component {

  constructor(props) {
     super(props);

     this.onChangeUserId = this.onChangeUserId.bind(this); //Needed for input fields if they change
     this.onChangePassword = this.onChangePassword.bind(this);
     this.onSubmit = this.onSubmit.bind(this);

     this.state = {
         email: '',
         password: '',
         invalid_details: false
     };
  }

  onChangeUserId(e) {
    this.setState({
        user_id: e.target.value
    });
  }

  onChangePassword(e) {
   this.setState({
       password: e.target.value
   });
  }

  onSubmit = async (e) => {
    e.preventDefault();

    const user = {
      user_id: this.state.user_id,
      password: this.state.password
    };

    //login
    await login(user).then(loggedin => {
      if (loggedin) {
        localStorage.setItem('user_id', this.state.user_id);
        if (localStorage.is_examiner === "0") this.props.history.push('/dnd');
        else this.props.history.push('/examinee/rules');

      } else {
        this.setState({
          invalid_details: true
        });
      }
    })
  }

  render() {
    return (
      <BrowserRouter>
      <div className="App">
        <Body>
          <Form className="form-background" onSubmit={this.onSubmit}>
            <Title style={{textAlign:"center"}}>
              <img src={logo} class="Uts-logo" alt="logo"/>
              <Text>Exam Login</Text>
            </Title>
            <Form.Group controlId="formBasicEmail">
              <Form.Control type="text" name="user_id" placeholder="User Id" value={this.state.user_id} onChange={this.onChangeUserId} required/>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} required/>
            </Form.Group>
            <Button variant="outline-dark" type="submit" style={{width: '100%'}} >
              Login
            </Button>
            <Form.Text style={ this.state.invalid_details ? {textAlign: 'center', color: 'red'} : { visibility: 'hidden'}}>
              Email or Password is incorrect.
            </Form.Text>
            <hr/>
            <a href="/examinee/register" role="button"><h6 class="register-text">Not a member? Register here.</h6></a>
          </Form>
        </Body>
      </div>
      </BrowserRouter>
    );
  }
} export default withRouter(ExamineeLogin);
