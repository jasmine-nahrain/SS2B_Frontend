import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';
import { getExaminees, getExamRecording } from '../api_caller.js';
// Main Components
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider from 'react-bootstrap-table2-toolkit';
import { Form, Col, Tab, Tabs } from 'react-bootstrap';
import { RightCaretIcon, LeftCaretIcon } from '../Examinee/scripts/Icons';
import { formatDateToLocalString, getTimeRemaining, formatDateToLocal } from '../functions.js';

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 1%;
`;

const searchBar = {
  color: 'black',
  borderBottomColor: 'rgba(0,0,0,0)',
  backgroundColor: 'rgba(220,220,240,.5)',
  borderRadius: '1vh'
}

const Button = styled.button`
  color: #fff;
  background-color: #007bff;
  border-color: #007bff;
  display: inline-block;
  font-weight: 400;
  text-align: center;
  vertical-align: middle;
  -webkit-user-select: none;
  user-select: none;
  border: 1px solid transparent;
  padding: .375rem .75rem;
  font-size: 1rem;
  line-height: 1.5;
  border-radius: .25rem;
  transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out;
`;


var columns = [{
  dataField: 'exam_recording_id',
  text: 'Exam Recording ID',
  hidden: true
}, {
  dataField: 'exam_id',
  text: 'Exam ID',
  hidden: true
}, {
  dataField: 'exam_name',
  text: 'Exam',
  //sort: true
},
{
  dataField: 'user_id',
  text: 'Student ID',
  //sort: true
}, {
  dataField: 'first_name',
  text: 'First Name',
  //sort: true
}, {
  dataField: 'last_name',
  text: 'Last Name',
  //sort: true,
}, {
  dataField: 'time_started',
  text: 'Started',
  formatter: cell => formatDateToLocalString(cell)
}, {
  dataField: 'time_ended',
  text: 'Ended',
  formatter: cell => formatDateToLocalString(cell)
}, {
  dataField: 'warning_count',
  text: 'Warnings',
}, {
  dataField: 'view',
  text: 'View',
  events: {
    onClick: (e, column, columnIndex, row) => {
      localStorage.setItem('user_id', row['user_id'])
      localStorage.setItem('exam_id', row['exam_id'])
      localStorage.setItem('exam_recording_id', row['exam_recording_id'])
      localStorage.setItem('exam_duration', row['duration'])
      localStorage.setItem('exam_name', row['exam_name'])
      localStorage.setItem('time_started', formatDateToLocal(row['time_started']))
      localStorage.setItem('student_name', row['first_name'] + " " + row['last_name'])
      window.location.href = `/examinee/exam/${row.exam_recording_id}`
      // console.log(row['user_id']);
    },
  },
  formatter: (cellContent, row) => (
    <Button class="btn btn-primary btn-lg" >View</Button>
  ),
}]


class StudentFilter extends Component {

  constructor(props) {
    super(props);
    this.getFilteredExamRecordings = this.getFilteredExamRecordings.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeID = this.onChangeID.bind(this);
    this.onChangeExamName = this.onChangeExamName.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);

    this.state = {
      table_data: [],
      user_id: "",
      first_name: "",
      last_name: "",
      exam_name: "",
      next_page_exists: false,
      prev_page_exists: false,
      in_progress: 1,
      order_by: 'time_started',
      order: 'desc',
      page_number: 1,
      results_length: 10
    };
  }

  SearchFields = () => (
    <div class="mt-4">
      <Form.Row>
        <Col>
          <Form.Control style={searchBar} type="text" name="exam_name" placeholder="Exam Name"
            value={this.state.exam_name} onChange={this.onChangeExamName} />
        </Col>
        <Col>
          <Form.Control style={searchBar} type="number" name="user_id" placeholder="Student ID"
            value={this.state.user_id} onChange={this.onChangeID} />
        </Col>
        <Col>
          <Form.Control style={searchBar} type="text" name="first_name" placeholder="First Name"
            value={this.state.first_name} onChange={this.onChangeFirstName} />
        </Col>
        <Col>
          <Form.Control style={searchBar} type="text" name="last_name" placeholder="Last Name"
            value={this.state.last_name} onChange={this.onChangeLastName} />
        </Col>
        <Button onClick={this.getFilteredExamRecordings} class="btn btn-primary mt-2">Search</Button>
      </Form.Row>
    </div>
  )

  TableFooter = () => (
    <div class="container mb-2">
      <div class="row">
        <div class="col">
          <button class="btn btn-primary" disabled={!this.state.prev_page_exists} onClick={this.prevPage}>
            <LeftCaretIcon />
            Prev Page
          </button>
        </div>
        <div class="col-7">
          <p>
            Results {(this.state.page_number - 1) * this.state.results_length + (this.state.table_data.length > 0)} - {(this.state.page_number - 1) * this.state.results_length + this.state.table_data.length}
          </p>
        </div>
        <div class="col">
          <button class="btn btn-primary" disabled={!this.state.next_page_exists} onClick={this.nextPage}>
            Next Page
            <RightCaretIcon />
          </button>
        </div>
      </div>
    </div>
  )

  CustomTable = (empty_message) => {
    return (
    <ToolkitProvider
      keyField="exam_recording_id"
      data={this.state.table_data}
      columns={columns}
    >
      {
        props => (
          <div>
            <div class="containerAdmin admin-table">
              <this.SearchFields />
              <br />
              {this.state.table_data.length == 0 ? <p>{empty_message}</p> :
                <div>
                  <BootstrapTable
                    bootstrap4
                    {...props.baseProps}
                    bodyClasses="tbodyContainer"
                    data={this.state.table_data}
                    columns={columns} />

                  <this.TableFooter />
                </div>
              }
            </div>
          </div>
        )}
    </ToolkitProvider>
    )
  }

  handleTabSelect = async (key) => {
    await this.getFilteredExamRecordings(null, key, 1);
  }

  onChangeExamName(e) {
    e.preventDefault();
    this.setState({
      exam_name: e.target.value
    });
  }

  onChangeFirstName(e) {
    e.preventDefault();
    this.setState({
      first_name: e.target.value
    });
  }

  onChangeLastName(e) {
    e.preventDefault();
    this.setState({
      last_name: e.target.value
    });
  }

  onChangeID(e) {
    e.preventDefault();
    this.setState({
      user_id: e.target.value
    });
  }

  async componentDidMount() {
    await this.getFilteredExamRecordings(null, 1, 1);
  }

  getFilteredExamRecordings = async (e=null, in_progress=this.state.in_progress, page_number=this.state.page_number) => {
    let parameters = {
      'user_id': this.state.user_id,
      'first_name': this.state.first_name,
      'last_name': this.state.last_name,
      'exam_name': this.state.exam_name,
      'in_progress': in_progress,
      'is_examiner': 0,
      'page_number': page_number,
      'results_length': this.state.results_length,
      'order_by': this.state.order_by,
      'order': this.state.order
    };
    //console.log("params",parameters)

    let data = await getExamRecording(parameters);
    //console.log(data)
    this.setState({
      table_data: data.exam_recordings,
      in_progress: in_progress,
      page_number: page_number,
      next_page_exists: data.next_page_exists,
      prev_page_exists: page_number>1,
    });
  }

  nextPage = async () => {
    await this.getFilteredExamRecordings(null, this.state.in_progress, this.state.page_number + 1)
  }

  prevPage = async () => {
    await this.getFilteredExamRecordings(null, this.state.in_progress, this.state.page_number - 1)
  };

  render() {

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
      return (
        <BrowserRouter>
          <div className="App">
            <Header >
            <div class="d-flex" style={{marginLeft: "auto", marginRight: "auto", width: "70%"}}>
              <div class="align-self-center" style={{ marginLeft: "10px"}}>              
                  <h2><b> Student List </b></h2>
              </div>
              <div class="ml-auto align-self-center">
                <div class="logout-btn">
                    <a href="/" ><Button className="button" style={{width: '80px', position: 'right', marginTop: '10px', marginBottom: '20px', fontSize: '15px', backgroundColor: '#82CAFF', outlineColor: 'black', color: 'black'}}>
                        Logout
                    </Button></a>
                </div>
              </div>
            </div>
            </Header>
        
        <h1>Exam Attempt List</h1>
            <a href="/examiner/manage" style={{textDecoration: 'none'}}><button  class="btn btn-success mb-4 btn-block" style={{width:'90%', marginLeft:'auto', marginRight: 'auto'}}>View Exams</button></a>
            <Tabs defaultActiveKey={1} id="manage" style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}
              onSelect={this.handleTabSelect}>
              <Tab eventKey={1} title="In Progress" style={{ backgroundColor: 'white' }} >
                {this.CustomTable('No Exam Attempts In Progress')}
              </Tab>
              <Tab eventKey={0} title="Finished" style={{ backgroundColor: 'white' }} >
                {this.CustomTable('No Past Exam Attempts')}
              </Tab>
            </Tabs>
          </div>
        </BrowserRouter>
      );
    } else {
      window.location.href = '/examinee/redirect';
    }
  };
}
export default withRouter(StudentFilter);
