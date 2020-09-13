import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import {getUserID} from '../functions.js'
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

class EditExam extends Component {

  constructor(props) {
    super(props);

    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeStartDate = this.onChangeStartDate.bind(this);
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeStartTime = this.onChangeStartTime.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onChangeSubjectID = this.onChangeSubjectID.bind(this);
    this.onChangeDuration = this.onChangeDuration.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.delete = this.delete.bind(this);

    this.state = {
      name: '',
      start_date: Date,
      end_date: Date,
      start_time: new Date(),
      end_time: Date,
      exam_id: Number,
      subjectID: Number,
      duration: Number,
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

onChangeSubjectID(e) {
  this.setState({
    subjectID: e.target.value
  });
}
onChangeDuration(e) {
  this.setState({
    duration: e.target.value
  });
}

getDurationTime = () => {
  var duration_hours = this.state.end_time.split(":")[0] - this.state.start_time.split(":")[0];
  var duration_minutes = this.state.end_time.split(":")[1] - this.state.start_time.split(":")[1];
  var duration_year = this.state.end_date.split('-')[0] - this.state.start_date.split('-')[0];
  var duration_month = this.state.end_date.split('-')[1] - this.state.start_date.split('-')[1];
  var duration_day = this.state.end_date.split('-')[2] - this.state.start_date.split('-')[2];

  if(duration_minutes < 0) {
    duration_hours--;
    duration_minutes = 60 + duration_minutes;
    if(duration_minutes > 60) {
      duration_minutes -= 60;
      duration_hours++;
    }
  }

  if(duration_hours < 0) {
    duration_hours += 24;
    duration_day--;
  }

  if(duration_hours < 10) {
    duration_hours = "0" + duration_hours;
  }
  if(duration_minutes < 10) {
    duration_minutes = "0" + duration_minutes;
  }

  if(duration_year == 0 && duration_month == 0 && duration_day < 0) {
    alert("Invalid time. End time cannot be before start time.");
    this.setState({end_date: ''});
    this.setState({end_time: ''});
  }
  if(duration_year == 0 && duration_month == 0 && duration_day == 0 && duration_hours < 0) {
      alert("Invalid time. End time cannot be before start time.");
      this.setState({end_time: ''});
  }
  return duration_year + "-" + duration_month + "-" + duration_day + " " + duration_hours + ":" + duration_minutes;
}

  onSubmit = async (e) => {
    e.preventDefault();

    const duration = this.getDurationTime();
    let start_date = this.state.start_date + " " + this.state.start_time;
    let end_date = this.state.end_date + " " + this.state.end_time;

    // createExam(this.state.name, this.state.subjectID, start_date, end_date, duration);
  }

  delete() {

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
                <Text>Edit Exam #</Text>
              </Title>

              <Col>
                <Form.Group controlId="formName">
                  <Form.Control type="text" name="name" placeholder="Exam Name" value={this.state.name} onChange={this.onChangeName} required />
                </Form.Group>

                <Form.Group controlId="formName">
                  <Form.Control type="number" name="name" placeholder="Subject ID" value={this.state.subjectID} onChange={this.onChangeSubjectID} required />
                </Form.Group>
              </Col>

              <Col xs={6} md="auto">
                <Row>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginRight: '10px'}}>
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
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginLeft: '10px'}}>
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

                </Row>
                <Row>
                  <Form.Group controlId="formStudentID" style={{fontSize: '16px', marginRight: '10px'}}>
                    <Form.Label>End Date</Form.Label>
                    <Form.Control
                      type="date"
                      name="end_date"
                      min={this.state.start_date}
                      placeholder="End Date"
                      dateFormat="yyyy/MM/dd"
                      value={this.state.end_date}
                      onChange={this.onChangeEndDate}
                      required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginLeft: '10px'}}>
                    <Form.Label>End Time</Form.Label>
                    <Form.Control
                      type="time"
                      name="start_date"
                      placeholder="Start Date"
                      dateFormat="hh:mm"
                      value={this.state.end_time}
                      onChange={this.onChangeEndTime}
                      required />
                  </Form.Group>
                </Row>
              </Col>

              <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>Update</Button>
              <Button variant="outline-danger" onClick={this.delete()} className="button" style={{width: '100%'}}>Delete</Button>
            </Form>
          </Body>
        </div>
      </BrowserRouter>
    );
  // } else {
  //   window.location.href = '/';
  // }
  }
} export default withRouter(EditExam);
