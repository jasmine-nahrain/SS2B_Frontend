import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap';
import styled from 'styled-components';
import { getExams, getExamRecording, createExamRecording } from '../api_caller.js';
import { BrowserRouter } from "react-router-dom";
import logo from '../images/logo.png';
import './exampage.css';
import {getTimeRemaining, datetimeformat} from '../functions.js';
import ExamWarnings from './exam_warnings'
import moment from 'moment';

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
    color: white;
  `;

const Text = styled.span`
  vertical-align: text-top;
  `;

class ExamStartPage extends Component {

  constructor(props) {
    super(props);
    this.getExamByLoginCode = this.getExamByLoginCode.bind(this);
    this.getExamsInProgress = this.getExamsInProgress.bind(this);

    this.state = {
      document_link: null,
      duration: null,
      end_date: null,
      exam_id: -1,
      exam_name: null,
      login_code: null,
      start_date: null,
      subject_id: -1,
      not_found: false,
      exam_in_progress: null
    }
  }

  async componentDidMount() {
    await this.getExamsInProgress();
  }

  onSubmit = async (e) => {
    e.preventDefault();
  }

  onChangeLoginCode = (e) => {
    e.preventDefault()
    this.setState({
      login_code: e.target.value
    });
  }

  getExamsInProgress = async () => {
    const user_id = localStorage.getItem("user_id");
    if (user_id === null) return;
    let exams_in_progress_data = await getExamRecording({ "user_id": user_id, "in_progress": 1 });
      //console.log(exams_in_progress_data);
    if (exams_in_progress_data !== null && exams_in_progress_data.exam_recordings.length > 0) {
      let exam_in_progress = exams_in_progress_data["exam_recordings"][0];

      var offset = - (new Date()).getTimezoneOffset();
      let time_started = (new Date(exam_in_progress["time_started"]));
      time_started.setMinutes(time_started.getMinutes() + offset);
      var duration = new Date("1970-01-01 " + exam_in_progress["duration"]);
      var latest_end_time = new Date(time_started);
      latest_end_time.setHours(latest_end_time.getHours() + duration.getHours())
      latest_end_time.setMinutes(latest_end_time.getMinutes() + duration.getMinutes());
      this.setState({
        exam_in_progress: {
          "exam_id": exam_in_progress["exam_id"],
          "exam_name": exam_in_progress["exam_name"],
          "exam_recording_id": exam_in_progress["exam_recording_id"],
          "exam_login_code":exam_in_progress["login_code"],
          "subject_id": exam_in_progress["subject_id"],
          "time_started": time_started.toLocaleString(),
          "duration":exam_in_progress["duration"],
          "latest_end_time": latest_end_time.toLocaleString(),
          "user_id": exam_in_progress["user_id"]
        }
      });
    }
  }

  getExamByLoginCode = async () => {
    let exam_data = await getExams({ "login_code": this.state.login_code });
    console.log(exam_data)
    if (exam_data !== null && exam_data['exams'].length) {
      let exam = exam_data['exams'][0];
      // Converts start_date and end_date to local time
      var offset = - (new Date()).getTimezoneOffset();
      let start_date = (new Date(exam['start_date']));
      start_date.setMinutes(start_date.getMinutes() + offset)
      let end_date = (new Date(exam['end_date']));
      end_date.setMinutes(end_date.getMinutes() + offset)

      this.setState({
        document_link: exam['document_link'],
        duration: exam['duration'],
        end_date: end_date.toLocaleString(),
        exam_id: exam['exam_id'],
        exam_name: exam['exam_name'],
        start_date: start_date.toLocaleString(),
        subject_id: exam['subject_id'],
        not_found: false
      });
    } else {
      this.setState({
        not_found: true
      });
    }
  }

  startExam = async () => {
    if (this.state.exam_in_progress) {
      let time_started_f = moment(this.state.exam_in_progress.time_started).utc().format(datetimeformat);
      const time = getTimeRemaining(time_started_f, this.state.exam_in_progress.duration);
      localStorage.setItem('time_started', time_started_f);
      localStorage.setItem('exam_duration', time);
      localStorage.setItem('exam_recording_id', this.state.exam_in_progress.exam_recording_id);
      window.location.href = `/examinee/exam/${this.state.exam_in_progress.exam_recording_id}`
    } else {
      let user_id = localStorage.getItem("user_id");
      let exam_id = this.state.exam_id;
      if (user_id === null || exam_id === -1) return;
      let new_exam_recording = await createExamRecording(exam_id, user_id);
      if(new_exam_recording !== null) {
        localStorage.setItem('exam_duration', this.state.duration);
        localStorage.setItem('exam_recording_id', new_exam_recording.exam_recording_id);
        console.log(new_exam_recording);
        window.location.href = `/examinee/exam/${new_exam_recording.exam_recording_id}`
      } else {
        alert("Unable to start exam.");
        window.location.href = '/examinee/start';
      }
    }

  }

  render() {
    return (
      <BrowserRouter>
        <body className="room">
          <div className="enter-room-container">
            {this.state.exam_in_progress === null &&
              <div style={{width: '100%'}}>
                {this.state.exam_id === -1 &&
                  <div>
                    <Form>
                      <input type="text" placeholder="Exam Login Code"
                        value={this.state.login_code} onChange={this.onChangeLoginCode}  />
                        <Button variant="outline-light" onClick={this.getExamByLoginCode}>
                        Find Exam
                      </Button>
                    </Form>
                    {this.state.not_found &&
                      <div class="my-3">
                        <h2 style={{ color: 'var(--light)' }}>
                          <strong>An exam with the login code provided could not be found. <br />Please try again.</strong>
                        </h2>
                      </div>
                    }
                  </div>
                }
                {this.state.exam_id !== -1 &&
                  <div class="text-center" style={{color: 'white'}}>
                    <h3>You are about to start</h3>
                    <h1 class="title-text"><strong>{this.state.exam_name}</strong></h1>
                    <h3>for Subject ID {this.state.subject_id}</h3>
                    <br />
                    <Text class="title-text">The exam is available from {this.state.start_date} to {this.state.end_date}.</Text>
                    <br />
                    <Text class="title-text">You have {this.state.duration} to complete it.</Text>
                    <br />
                    <div class="exam-rules mt-5">
                      <Button variant="outline-light" className="button" style={{ width: '100%' }} onClick={this.startExam}>
                        Start Exam
                  </Button>
                    </div>
                  </div>
                }
              </div>
            }
            {this.state.exam_in_progress !== null &&
              <div class="text-center" style={{color: 'white'}}>
                <h3>You have an exam in progress:</h3>
                <h1 class="title-text"><strong>{this.state.exam_in_progress["exam_name"]}</strong></h1>
                <h3>for Subject ID {this.state.exam_in_progress["subject_id"]}</h3>
                <Text class="title-text">You started at {this.state.exam_in_progress["time_started"]}.</Text>
                <br/>
                <Text class="title-text">Your exam will automatically finish at {this.state.exam_in_progress["latest_end_time"]}.</Text>
                <br />
                <div class="exam-rules mt-5">
                  <Button variant="outline-light" className="button" style={{ width: '100%' }} onClick={this.startExam}>
                    Continue Exam
                  </Button>
                </div>
              </div>
            }

          </div>
        </body>
      </BrowserRouter>
    );
  }
} export default withRouter(ExamStartPage);
