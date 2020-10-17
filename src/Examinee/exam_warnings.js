import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert, Col } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import { getExamWarning, createExamWarning, deleteExamWarning, editExam } from '../api_caller';
import { formatDateToLocal } from '../functions.js';
import DateTime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { getLatestEndTime, datetimeformat, formatDateToUTC, formatDateToLocalString, formatDate } from '../functions.js';
import moment from 'moment';

const Title = styled.div`
    padding:14px 5px 14px 0px;
  `;

const Text = styled.span`
  vertical-align: text-top;
  `;

export default class ExamWarnings extends Component {

    constructor(props) {
        super(props);

        // Required props
        // <ExamWarnings data={{is_examiner:1, exam_recording_id: 617, time_started: '2020-10-14 05:30:00', duration: '03:00:00'}}/>
        // time_ended can be included or not - include if exam attempt has already been done, if in progress, leave out
        // component can be used for examinee or examiner
        this.getExamWarnings = this.getExamWarnings.bind(this);
        this.toggleCreate = this.toggleCreate.bind(this);
        this.deleteSingleExamWarning = this.deleteSingleExamWarning.bind(this);
        this.createSingleWarning = this.createSingleWarning.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeWarningTime = this.onChangeWarningTime.bind(this);
        this.onChangeWarningDate = this.onChangeWarningDate.bind(this);
        this.setExamWarnings = this.setExamWarnings.bind(this);
        this.endExam = this.endExam.bind(this);

        let time_started_string = formatDate(this.props.data.time_started).split(' ');
        
        let duration = this.props.data.duration;
        let latest_time_ended = this.props.data.time_ended;
        if (latest_time_ended === null || !latest_time_ended) latest_time_ended = getLatestEndTime(time_started_string, duration);

        this.state = {
            exam_recording_id: props.data.exam_recording_id,
            exam_warnings: [],
            is_examiner: props.data.is_examiner,
            time_started: time_started_string,
            latest_time_ended: latest_time_ended,
            create_new: false,
            new_description: '',
            user_id: props.data.user_id,
            new_warning_time: time_started_string[1],
            new_warning_date: time_started_string[0]
        }
    }

    componentDidMount = async () => {
        // change to 30000
        await this.getExamWarnings();
        this.interval = setInterval(async () => {
            await this.getExamWarnings();
        }, 10000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getExamWarnings = async () => {
        let params = {'exam_recording_id': this.state.exam_recording_id };
        if (!this.state.is_examiner) params['user_id'] = this.state.user_id;
        let exam_warning_data = await getExamWarning(params);
        //console.log("all warnings:", exam_warning_data);
        if (exam_warning_data !== null && exam_warning_data.exam_warnings.length > 0) {
            //console.log(exam_warning_data.exam_warnings.length, 'vs', )
            if (exam_warning_data.exam_warnings.length > this.state.exam_warnings.length && !this.state.is_examiner) {
                alert('You have been given a warning.');
            }
            await this.setExamWarnings(exam_warning_data.exam_warnings);
            if (exam_warning_data.exam_warnings.length > 2 && !this.state.is_examiner) {
                alert('You have reached the maximum number of warnings. \nYour exam will finish shortly.');
                setTimeout(async() => this.endExam(), 5000);
            }
        }
        
    }

    endExam = async () => {
        let response = await editExam(this.state.exam_recording_id);
        if (response === null) alert('Something went wrong!');
        else window.location.href = '/examinee/endpage'
    }

    setExamWarnings = async (warnings) => {
        this.setState({
            exam_warnings: warnings
        });
    }

    deleteSingleExamWarning = async (exam_warning_id) => {
        let success = deleteExamWarning(exam_warning_id);
        if (!success) {
            alert('The exam warning could not be deleted. Please try again.');
            return;
        }
        setTimeout(async () => {
            await this.getExamWarnings();
        }, 250);
    }

    createSingleWarning = async () => {
        var warning_time = new Date(this.state.new_warning_date + " " + this.state.new_warning_time)
        warning_time.setMinutes(warning_time.getMinutes() + (new Date()).getTimezoneOffset());
        let warning_time_string = moment(warning_time).format(datetimeformat)

        var new_warning = createExamWarning(this.state.exam_recording_id, warning_time_string, this.state.new_description)
        if (new_warning === null) alert('Something went wrong!');
        else {
            setTimeout(async () => {
                await this.getExamWarnings();
            }, 250);
            this.toggleCreate();
        }
        
    }

    toggleCreate = () => {
        this.setState({
            create_new: !this.state.create_new,
            new_description: ''
        });
    }

    onChangeDescription = async (e) => {
        e.preventDefault();
        this.setState({
            new_description: e.target.value
        });
    }

    onChangeWarningTime = (e) => {
        e.preventDefault()
        this.setState({
            new_warning_time: e.target.value
        });
    }

    onChangeWarningDate = (e) => {
        e.preventDefault()
        this.setState({
            new_warning_date: e.target.value
        });
    }

    render() {
        return (
            <div style={{ width: '30%', marginLeft: 'auto', marginRight: 'auto' }}>
                {this.state.is_examiner &&
                    <div class="my-3">
                        <button type="button" hidden={this.state.create_new} onClick={this.toggleCreate} class="btn btn-lg btn-block btn-danger">Give Warning</button>
                        {this.state.create_new &&
                            <div class="container">
                                <Form>
                                    <Form.Row>
                                        <Col>
                                        
                                            <Form.Control
                                                type="date" min={this.state.new_warning_date} name="warning_date" placeholder="Warning Date"
                                                value={this.state.new_warning_date} onChange={this.onChangeWarningDate} required />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                type="time" name="warning_time" placeholder="Warning Time" dateFormat="hh:mm"
                                                value={this.state.new_warning_time} selected={this.state.new_warning_time}
                                                onChange={this.onChangeWarningTime} required />
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <Form.Control
                                                type="text" name="warning_description" placeholder="Warning Description"
                                                value={this.state.new_description}
                                                onChange={this.onChangeDescription} required />
                                        </Col>
                                    </Form.Row>

                                    <Form.Row>
                                        <Col>
                                            <button class="btn btn-lg btn-block btn-danger" onClick={this.createSingleWarning}>Save</button>
                                            <button class="btn btn-lg btn-block btn-secondary" onClick={this.toggleCreate}>Cancel</button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                                <div class="row my-2">
                                </div>
                                <div class="row">
                                    <div class="col">

                                    </div>
                                </div>

                            </div>

                        }
                    </div>
                }
                {!this.state.is_examiner &&
                    <h2>Warnings: {this.state.exam_warnings.length} of 3</h2>
                }
                {
                    this.state.exam_warnings.map((warning) =>
                        <Alert key={warning.exam_warning_id} variant="danger">
                            {!this.state.is_examiner &&
                                <p>{formatDateToLocalString(warning.warning_time)}: {warning.description}</p>
                            }
                            {this.state.is_examiner &&
                                <div class="container">
                                    <div class="row">
                                        <div class="col-10">
                                            <p>{formatDateToLocalString(warning.warning_time)}: {warning.description}</p>
                                        </div>
                                        <div class="col">
                                            <button type="button" class="btn btn-lg btn-danger" onClick={() => this.deleteSingleExamWarning(warning.exam_warning_id)} >Delete</button>
                                        </div>
                                    </div>
                                </div>
                            }
                        </Alert>
                    )
                }


            </div >
        );
    }
}
