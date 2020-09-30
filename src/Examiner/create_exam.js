import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import {getUserID, getEndDate} from '../functions.js'
import {createExam} from '../api_caller.js';

const Body = styled.body`
  background-color: rgba(0,0,0,0);
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
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeDurationHours = this.onChangeDurationHours.bind(this);
    this.onChangeDurationMinutes = this.onChangeDurationMinutes.bind(this);
    this.onChangeSubjectID = this.onChangeSubjectID.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      name: '',
      start_date: Date,
      end_date: Date,
      start_time: new Date(),
      end_time: Date,
      exam_id: Number,
      subjectID: Number,
      duration_hours: Number,
      duration_minutes: Number,
    }
    console.log(this.state);
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
  onChangeStartTime(e) {
    console.log(e.target.value)

    this.setState({
      start_time: e.target.value
    });
  }

onChangeSubjectID(e) {
  this.setState({
    subjectID: e.target.value
  });
}
onChangeDurationHours(e) {
  this.setState({
    duration_hours: e.target.value
  });
}
onChangeDurationMinutes(e) {
  this.setState({
    duration_minutes: e.target.value
  });
}



  onSubmit = async (e) => {
    e.preventDefault();

    let start_date = this.state.start_date + " " + this.state.start_time;
    let end_date = getEndDate(this.state.start_time, this.state.start_date, this.state.duration_hours, this.state.duration_minutes);
    const duration = this.state.duration_hours + ':' + this.state.duration_minutes;

    let parsedData = createExam(this.state.name, this.state.subjectID, start_date, end_date, duration);
    console.log(parsedData);
    if(parsedData) {
      // alert("Successfully created exam.");
      // window.location.href = '/examiner/manage';
    }
  }

  render() {
    // const admin_id = getUserID(false);
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (admin_id && is_admin) {
    const today = new Date().toISOString().split("T")[0];
    return (
      <BrowserRouter>
        <div className="App">
          <Body>
            <Form className="create-exam-background" onSubmit={this.onSubmit}>
              <Title style={{ textAlign: "center" }}>
                <Text>Create a New Exam</Text>
              </Title>

              <Col>
                <Form.Group controlId="formName">
                  <Form.Control type="text" name="name" placeholder="Exam Name" value={this.state.name} onChange={this.onChangeName} required />
                </Form.Group>

                <Form.Group controlId="formName">
                  <Form.Control type="number" name="name" placeholder="Subject ID" value={this.state.subjectID} onChange={this.onChangeSubjectID} required />
                </Form.Group>

                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginRight: '10px', width: '49%', float: 'left'}}>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Control
                      type="date"
                      min={today}
                      name="start_date"
                      placeholder="Start Date"
                      dateFormat="yyyy/MM/dd"
                      value={this.state.start_date}
                      onChange={this.onChangeStartDate}
                      required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px',  width: '49%', float: 'left'}}>
                    <Form.Label>Start Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="start_date"
                      placeholder="Start Date"
                      dateFormat="hh:mm"
                      value={this.state.start_time}
                      locale="aest"
                      selected={this.state.startDate}
                      onChange={this.onChangeStartTime}
                      required />
                  </Form.Group>
                <h6>Duration</h6>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', float: 'left'}}>
                    <Form.Control
                      type="number"
                      name="duration_hours"
                      placeholder="Hours"
                      value={this.state.duration_hours}
                      onChange={this.onChangeDurationHours}
                      required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px',float: 'left'}}>
                    <Form.Control
                      type="number"
                      name="duration_minutes"
                      placeholder="Minutes"
                      value={this.state.duration_minutes}
                      onChange={this.onChangeDurationMinutes}
                      required />
                  </Form.Group>
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
