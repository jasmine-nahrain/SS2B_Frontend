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

class CreateExam extends Component {

  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      start_date: Date,
      end_date: Date,
    }
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  onChangeStartDate(e) {
    this.setState({
      start_date: e.target.value
    });
  }
  onChangeEndDate(e) {
    this.setState({
      end_date: e.target.value
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Body>
            <Form className="form-background" onSubmit={this.onSubmit} style={{padding:"0%"}}>
              <Title style={{ textAlign: "center" }}>
                <img src={logo} class="Uts-logo" alt="logo" />
                <Text>Create a New Exam</Text>
              </Title>
              <Form.Group controlId="formName">
                <Form.Control type="text" name="name" placeholder="Exam Name" value={this.state.name} onChange={this.onChangeName} required />
              </Form.Group>

              <Form.Group controlId="formStartDate">
                <Form.Label style={{fontSize: '16px'}}>Start Date</Form.Label>
                <Form.Control type="date" name="start_date" placeholder="Start Date" value={this.state.start_date} onChange={this.onChangeStartDate} required />
              </Form.Group>

              <Form.Group controlId="formStudentID">
                <Form.Label style={{fontSize: '16px'}}>End Date</Form.Label>
                <Form.Control type="date" name="end_date" placeholder="End Date" value={this.state.end_date} onChange={this.onChangeEndDate} required />
              </Form.Group>
              <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>
                Register
          </Button>
            </Form>
          </Body>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(CreateExam);
