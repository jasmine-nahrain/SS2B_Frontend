import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Col, Row } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import {getUserID, getDate, getTime} from '../functions.js'
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
    this.onChangeEndDate = this.onChangeEndDate.bind(this);
    this.onChangeEndTime = this.onChangeEndTime.bind(this);
    this.onChangePDFUrl = this.onChangePDFUrl.bind(this);
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
      document_link: ''
    }
    //console.log(this.state);
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
    // console.log(e.target.value)

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

  onChangeEndDate(e) {
    this.setState({
      end_date: e.target.value
    });
  }

  onChangeEndTime(e) {
    this.setState({
      end_time: e.target.value
    });
  }

  onChangePDFUrl(e) {
    this.setState({
      document_link: e.target.value
    })
  }

  onSubmit = async (e) => {
    e.preventDefault();

    let start_date = getDate(this.state.start_date, this.state.start_time);
    const duration = getTime(this.state.duration_hours, this.state.duration_minutes);
    let end_date = getDate(this.state.end_date, this.state.end_time);
    let parsedData = createExam(this.state.name, this.state.subjectID, start_date, end_date, duration, this.state.document_link);

    if(parsedData) {
      alert("Successfully created exam.");
      window.location.href = '/examiner/manage';
    }
  }

  render() {
    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
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
                  <Form.Group controlId="formStudentID" style={{fontSize: '16px', marginRight: '10px', width: '49%', float: 'left'}}>
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
                 <Form.Group controlId="formStartDate" style={{fontSize: '16px',  width: '49%', float: 'left'}}>
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

                <h6>Duration</h6>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px', marginRight: '10px', width: '49%', float: 'left'}}>
                    <Form.Control
                      type="number"
                      name="duration_hours"
                      placeholder="Hours"
                      value={this.state.duration_hours}
                      onChange={this.onChangeDurationHours}
                      required />
                  </Form.Group>
                  <Form.Group controlId="formStartDate" style={{fontSize: '16px',  width: '49%', float: 'left'}}>
                    <Form.Control
                      type="number"
                      name="duration_minutes"
                      placeholder="Minutes"
                      value={this.state.duration_minutes}
                      onChange={this.onChangeDurationMinutes}
                      required />
                  </Form.Group>

                  <h6>Exam PDF URL</h6>
                  <Form.Group controlId="formName">
                  <Form.Control 
                    type="text" 
                    name="document_link" 
                    placeholder="e.g. https://www.uts.edu.au/exam/maths.pdf" 
                    value={this.state.document_link} 
                    onChange={this.onChangePDFUrl} required/>
                  </Form.Group>
              </Col>

              <Button variant="outline-dark" type="submit" className="button" style={{width: '100%'}}>
                Create New Exam
          </Button>
          <Button variant="outline-secondary" href='/examiner/manage' className="button" style={{width: '100%'}}>Cancel</Button>

            </Form>
          </Body>
        </div>
      </BrowserRouter>
    );
  } else {
    window.location.href = '/examinee/redirect';
  }
  }
} export default withRouter(CreateExam);
