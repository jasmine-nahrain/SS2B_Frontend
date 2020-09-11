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

class ExamRules extends Component {

  constructor(props) {
    super(props);
    this.state = {
        examName: 'Exam Name',
        examRules: [
            'Rule 1: Ad dolore velit tempor est sunt sit.',
            'Rule 2: Reprehenderit ea ea minim labore eiusmod.',
            'Rule 3: Excepteur velit laborum ut occaecat quis.',
            'Rule 4: Ex dolor deserunt fugiat do.'
        ],
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


  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Body>
              <Title style={{ textAlign: "center" }}>
                <img src={logo} class="Uts-logo" alt="logo" />
                <h1 class="exam-name title-text">{this.state.examName}</h1>
                <br></br>
                
              </Title>
              <Text class="title-text">Exam Rules</Text>
                <br></br>
                <div class="exam-rules">
                    <>
                        {this.state.examRules.map((rule, index) => (
                            <p key={index}>{rule}</p>
                        ))}
                    </>
                </div>
                <form>
                    <label>
                        Accept:
                        <input type="checkbox" name="accept" />
                    </label>
                    <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>
                        Submit
                    </Button>
                </form>
          </Body>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(ExamRules);
