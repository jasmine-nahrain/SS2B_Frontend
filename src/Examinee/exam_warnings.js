import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import { getExamWarning, deleteExamWarning } from '../api_caller';
import { formatDateToLocal } from '../functions.js';

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

export default class ExamWarnings extends Component {

    constructor(props) {
        super(props);
        this.state = {
            exam_recording_id: props.exam_recording_id,
            exam_warnings: [],
            is_examiner: props.is_examiner
        }
    }

    async componentDidMount() {
        // Gets data before the render
        await this.getExamWarnings();
    }

    onSubmit = async (e) => {
        e.preventDefault();
    }

    getExamWarnings = async () => {
        let exam_warning_data = getExamWarning({ 'exam_recording_id': this.state.exam_recording_id });
        this.setState({
            exam_warnings: exam_warning_data.exam_warnings
        });
    }

    deleteSingleExamWarning = async (exam_warning_id) => {
        let success = deleteExamWarning(exam_warning_id);
        if (!success) {
            alert('The exam warning could not be deleted. Please try again.');
        }
    }

    render() {
        return (
            <div>
                <Body>
                    {this.state.exam_warnings.map((warning) =>
                        <div>
                            <Alert key={warning.exam_warning_id} variant="danger">{formatDateToLocal(warning.warning_time)}: {warning.descriptin}</Alert>
                            {this.state.is_examiner &&
                                <div>
                                    <Button onClick={()=>this.deleteSingleExamWarning(warning.exam_warning_id)} >Delete</Button>
                                </div>
                            }
                        </div>
                    )}
                </Body>
            </div>
        );
    }
}
