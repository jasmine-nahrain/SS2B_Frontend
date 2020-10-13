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
        examTime: props.examTime,
        examName: props.examName,
    }
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
                <h1 class="exam-name title-text">{this.state.examTime}</h1>
                <br></br>

              </Title>
              <Text class="title-text">Exam Rules</Text>
                <br></br>
                <div class="exam-rules">
                  <div>
                    <p>There are strict <a href="http://www.gsu.uts.edu.au/rules/student/section-9.html#r9.2">rules surrounding the conduct of exams at UTS</a>.&nbsp; It is a student's responsibility to understand behaviour which is acceptable in an examination. There are severe penalties for students engaging in <a href="https://www.uts.edu.au/current-students/support/when-things-go-wrong/student-misconduct">misconduct</a> and disciplinary action may be taken if examination rules are not followed.</p>

                    <ul>
                      <li>You must display your current and valid<a href="https://www.uts.edu.au/current-students/managing-your-course/your-student-info/student-id-cards"> student ID card</a> before your exam. If you don’t have a current and valid student ID card, you can use other government-issued photo ID to verify your identity before you sit an AI or Live invigilated exam. This includes driver’s licenses or passports.</li>
                      <li>If you have an AI or live invigilated exam, you cannot leave your seat during the &nbsp;exam except in exceptional circumstances. Please make sure that you visit the bathroom before you enter the exam room.</li>
                      <li>Any form of cheating, including use or possession of unauthorised material or notes, using mobile phones, taking images of the exam or replicating it in any way, or colluding with other students will not be tolerated. Severe penalties up to and including exclusion from the university apply for students caught cheating during an exam.</li>
                      <li>Reading time is for reading only. You are not permitted to write, highlight, make any marks on any exam material or make calculations during reading time.&nbsp;</li>
                      <li>You can only sit an exam for a subject in which you are currently enrolled. It is your responsibility to ensure your <a href="https://www.uts.edu.au/node/78816/">subject enrolment</a> is correct.</li>
                      <li>If you are late for your examination, you will not be permitted any extra time. You must complete your exam within the exam window, so make sure you leave enough time.</li>
                      <li>Ensure camera is angled to capture your working environment as best as possible - failure to do so may result in a warning/misconduct.</li>
                    </ul>
                    <p>Items permitted in an online invigilated exam:</p>

                    <ul>
                      <li>Your mobile phone and other electronic devices (e.g iPads, tablets, smart watches) must be <strong>turned off</strong> and stored out of reach. If your phone is found to be switched on or rings during an exam, you may be charged&nbsp;with <a href="https://www.uts.edu.au/current-students/support/when-things-go-wrong/student-misconduct">student misconduct</a>.</li>
                      <li>Watches (except smart watches) should be removed from your wrist and placed on the desk or in your bag.</li>
                    </ul>
                    <p>Items prohibited in an online invigilated exam include:</p>

                    <ul>
                      <li>Baseball caps</li>
                      <li>Pencil cases</li>
                      <li>Food</li>
                      <li>Drinks (clear plastic bottled water allowed).</li>
                    </ul>
                    <p>Please check with your subject coordinator to confirm what items are permitted in your exam as this may differ subject to subject.</p>
                  </div>
                </div>
                <div class="exam-rules-button">
                  <Button variant="outline-dark" className="button" style={{width: '100%'}} href='/examinee/start'>
                      Accept Exam Rules
                  </Button>
                </div>
          </Body>
        </div>
      </BrowserRouter>
    );
  }
} export default withRouter(ExamRules);
