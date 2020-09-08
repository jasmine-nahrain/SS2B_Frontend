import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import {getUserID} from '../functions.js'

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

const Title = styled.h2`
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
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      start_date: Date,
      end_date: Date,
      start_time: Date,
      end_time: Date,
      exam_id: Number,
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
  onChangeStartTime(e) {
    this.setState({
      start_time: e.target.value
    });
  }
  onChangeEndTime(e) {
    this.setState({
      end_time: e.target.value
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  render() {
    // const admin_id = getUserID(false);
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (admin_id && is_admin) {
    return (
      <BrowserRouter>
        <div className="App">
          <Body>
            <Form className="create-exam-background" onSubmit={this.onSubmit}>
              <Title style={{ textAlign: "center" }}>
                <Text>Create a New Exam</Text>
              </Title>

              <Col style={{marginRight: "2%"}}>
                <Form.Group controlId="formName">
                  <Form.Control type="text" name="name" placeholder="Exam Name" value={this.state.name} onChange={this.onChangeName} required />
                </Form.Group>

                <Form.Group controlId="formName">
                  <Form.Control as="textarea" name="name" placeholder="Exam Description" rows="3" value={this.state.name} onChange={this.onChangeName} required />
                </Form.Group>
              </Col>

              <Col xs={6} md="auto">
                <Row>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginRight: '10px'}}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control type="date" name="start_date" placeholder="Start Date" value={this.state.start_date} onChange={this.onChangeStartDate} required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginLeft: '10px'}}>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control type="time" name="start_date" placeholder="Start Date" value={this.state.start_date} onChange={this.onChangeStartTime} required />
                  </Form.Group>

                </Row>
                <Row>
                  <Form.Group controlId="formStudentID" style={{fontSize: '16px', marginRight: '10px'}}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control type="date" name="end_date" placeholder="End Date" value={this.state.end_date} onChange={this.onChangeEndDate} required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginLeft: '10px'}}>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control type="time" name="start_date" placeholder="Start Date" value={this.state.start_date} onChange={this.onChangeEndTime} required />
                  </Form.Group>
                </Row>
              </Col>

              <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>
                Register
          </Button>
            </Form>
          </Body>
        </div>
      </BrowserRouter>
    );
  // } else {
  //   window.location.href = '/';
  // }
  }
} export default withRouter(CreateExam);
