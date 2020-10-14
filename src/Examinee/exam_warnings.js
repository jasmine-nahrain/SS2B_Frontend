import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Alert } from 'react-bootstrap';
import styled from 'styled-components';
import { BrowserRouter } from "react-router-dom";
import { getExamWarning, deleteExamWarning } from '../api_caller';
import { formatDateToLocal } from '../functions.js';
import DateTime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { getLatestEndTime } from '../functions.js';
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
        // this.getExamWarnings = this.getExamWarnings.bind(this);
        // var offset = - (new Date()).getTimezoneOffset();
        // let time_started = (new Date(props.data.time_started));
        // time_started.setMinutes(time_started.getMinutes() + offset)
        // let latest_time_ended = getLatestEndTime(props.data.time_started, props.data.duration);

        this.state = {
            exam_recording_id: props.data.exam_recording_id,
            exam_warnings: [],
            is_examiner: props.data.is_examiner === true || props.data.is_examiner === 1,
            time_started: "2020-10-14 18:11:00",
            latest_time_ended: "2020-10-14 21:11:00",
            create_new: false,
            new_description: '',
            new_warning_time: null
        }
        console.log(moment(this.state.time_started).format('YYYY-MM-DD hh:mm:ss'))
        console.log(moment(this.state.latest_time_ended).format('YYYY-MM-DD hh:mm:ss'))
    }

    componentDidMount = async () => {
        // change to 30000
        await this.getExamWarnings();
        if (!this.state.is_examiner) this.interval = setInterval(async () => {
            await this.getExamWarnings();
        }, 30000);
    }

    componentWillUnmount() {
        if (!this.state.is_examiner) clearInterval(this.interval);
    }

    onSubmit = async (e) => {
        e.preventDefault();
    }

    getExamWarnings = async () => {
        let exam_warning_data = await getExamWarning({ 'exam_recording_id': this.state.exam_recording_id });
        console.log(exam_warning_data);
        if (exam_warning_data !== null && exam_warning_data.exam_warnings.length > 0) {
            this.setState({
                exam_warnings: exam_warning_data.exam_warnings
            }, () => { console.log(this.state.exam_warnings) });
        }

    }

    deleteSingleExamWarning = async (exam_warning_id) => {
        let success = deleteExamWarning(exam_warning_id);
        if (!success) {
            alert('The exam warning could not be deleted. Please try again.');
        } else await this.getExamWarnings();
    }

    createSingleWarning = async () => {

    }

    allowCreate = () => {
        this.setState({
            create_new: true
        });
    }

    cancelCreate = () => {
        this.setState({
            create_new: false,
            new_description: '',
            new_warning_time: null
        });
    }

    onChangeNewDescription = (e) => {
        e.preventDefault();
        this.setState({
            new_description: e.target.value
        }, () => { console.log(this.state.new_description) });
    }

    onChangeNewWarningTime = (datetime) => {
        this.setState({
            new_warning_time: datetime._d
        }, () => { console.log(this.state.new_warning_time) });
    }

    isValidDateTime = (current) => {

        return current.isAfter(moment(this.state.time_started).format('YYYY-MM-DD hh:mm:ss'))
            && current.isBefore(moment(this.state.latest_time_ended).format('YYYY-MM-DD hh:mm:ss'))
    }

    render() {
        return (
            <div>
                {this.state.exam_warnings.map((warning) =>
                    <Alert key={warning.exam_warning_id} variant="danger">
                        {!this.state.is_examiner &&
                            <p>{formatDateToLocal(warning.warning_time)}: {warning.description}</p>
                        }
                        {this.state.is_examiner &&
                            <div class="container">
                                <div class="row">
                                    <div class="col-10">
                                        <p>{formatDateToLocal(warning.warning_time)}: {warning.description}</p>
                                    </div>
                                    <div class="col">
                                        <button type="button" class="btn btn-lg btn-danger" onClick={() => this.deleteSingleExamWarning(warning.exam_warning_id)} >Delete</button>
                                    </div>
                                </div>
                            </div>
                        }
                    </Alert>
                )}
                {this.state.is_examiner &&
                    <div>
                        <button type="button" hidden={this.state.create_new} onClick={this.allowCreate} class="btn btn-lg btn-block btn-danger">Give Warning</button>
                        {this.state.create_new &&
                            <div class="container">
                                <div class="row">
                                    <div class="col">
                                        <DateTime isValidDate={this.isValidDateTime} initialValue={new Date()} onChange={this.onChangeNewWarningTime} value={this.state.new_warning_time} />
                                        <input onChange={this.onChangeNewDescription} placeholder="Enter warning description here." value={this.state.new_description} ></input>
                                    </div>
                                </div>
                                <div class="row">
                                    <div class="col">
                                        <button class="btn btn-lg btn-block btn-primary">Save</button>
                                        <button class="btn btn-lg btn-block btn-secondary" onClick={this.cancelCreate}>Cancel</button>
                                    </div>
                                </div>
                            </div>

                        }
                    </div>
                }

            </div>
        );
    }
}
