import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';

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

const Title = styled.div`
    padding:14px 5px 14px 0px;
  `;

const Text = styled.span`
  vertical-align: text-top;
  `;

class ExaminerRegister extends Component {

  constructor(props) {
    super(props);

    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeStudentID = this.onChangeStudentID.bind(this);
    this.onChangeEmail = this.onChangeEmail.bind(this);
    this.onChangePassword = this.onChangePassword.bind(this);
    this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      studentID: '',
      is_admin: '',
      fname: '',
      lname: '',
      email: '',
      password: '',
      confirmPassword: '',
      confirmAdmin: '',
      invalid_password: false,
      invalid_details: false,
      mismatched_password: false
    }
  }

  onChangeFirstName(e) {
    this.setState({
      fname: e.target.value
    });
  }

  onChangeLastName(e) {
    this.setState({
      lname: e.target.value
    });
  }

  onChangeStudentID(e) {
    this.setState({
      studentID: e.target.value
    });
  }

  onChangeEmail(e) {
    this.setState({
      email: e.target.value
    });
  }

  onChangePassword(e) {
    this.setState({
      password: e.target.value
    });
  }

  onChangeConfirmPassword(e) {
    this.setState({
      confirmPassword: e.target.value
    })
  }

  onSubmit = async (e) => {
    e.preventDefault();

    // const newUser = {
    //   // need to add admin registration
    //   student_id: this.state.studentID,
    //   is_admin: 0,
    //   first_name: this.state.fname,
    //   last_name: this.state.lname,
    //   email: this.state.email,
    //   password: this.state.password,
    //   confirm_admin: "unconfirmed"
    // }

    // const invalid_password = !isValidPassword(this.state.password);
    // const mismatched_password = this.state.password !== this.state.confirmPassword;
    //let invalid_details = mismatched_password || invalid_password;

    // if (!invalid_details) {
    //   // create new account
    // }

    // this.setState({
    //   mismatched_password: mismatched_password,
    //   invalid_password: invalid_password,
    //   invalid_details: invalid_details
    // });
  }

/**
Removed HTML that can be added back later
<a style={this.state.invalid_details ? { textAlign: 'center', color: 'red' } : { visibility: 'hidden' }} >
  <h5 >
    {this.state.invalid_password ? ("Password needs to be at least 8 characters long with at least 1 number.")
      : this.state.mismatched_password ? ("Password does not match.")
        : ("An account with this student ID/email exists.")}
  </h5>
</a>
*/

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Body>
            <Form className="form-background" onSubmit={this.onSubmit} style={{padding:"0%"}}>
              <Title style={{ textAlign: "center" }}>
                <img src={logo} class="Uts-logo" alt="logo" />
                <Text>Register as a Examiner</Text>
              </Title>
              <Form.Group controlId="formFName">
                <Form.Control type="text" name="fname" placeholder="First Name" value={this.state.fname} onChange={this.onChangeFirstName} required />
              </Form.Group>

              <Form.Group controlId="formLName">
                <Form.Control type="text" name="lname" placeholder="Last Name" value={this.state.lname} onChange={this.onChangeLastName} required />
              </Form.Group>

              <Form.Group controlId="formStudentID">
                <Form.Control type="number" name="studentID" min="10000" max="9999999999" placeholder="User ID" value={this.state.studentID} onChange={this.onChangeStudentID} required />
              </Form.Group>

              <Form.Group controlId="formEmail">
                <Form.Control type="email" name="email" placeholder="User Email" value={this.state.email} onChange={this.onChangeEmail} required />
              </Form.Group>

              <Form.Group controlId="formPassword">
                <Form.Control type="password" name="password" placeholder="Password" value={this.state.password} onChange={this.onChangePassword} required />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword">
                <Form.Control type="password" name="confirmPassword" placeholder="Confirm Password" value={this.state.confirmPassword} onChange={this.onChangeConfirmPassword} required />
              </Form.Group>
              <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>
                Register
          </Button>
            </Form>
            <div style={{padding:"0.5%"}}>
              <hr />
              <a href="/examinee/register" role="button"><h6 class="register-text">Not a Examiner? Register here.</h6></a>
              <a href="/" role="button"><h6 class="register-text">Already a member? Login here.</h6></a>
            </div>
          </Body>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(ExaminerRegister);
