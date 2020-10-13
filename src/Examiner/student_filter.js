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
import { formatDateToLocal, getTimeRemaining } from '../functions.js';

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 3%;
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
  text: 'Time Started',
  formatter: cell => formatDateToLocal(cell)
}, {
  dataField: 'time_ended',
  text: 'Time Ended',
  formatter: cell => formatDateToLocal(cell)
}, {
  dataField: 'view',
  text: 'View',
  events: {
    onClick: (e, column, columnIndex, row) => {
      /*
      window.location.href = '/' + row.video_link;
      console.log(row.time_started);
      */
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

    this.state = {
      table_data: [],
      student_id: "",
      first_name: "",
      last_name: "",
      exam_name: "",
      next_page_exists: false,
      prev_page_exists: false,
      in_progress: 1,
      order_by: 'start_time',
      order: 'desc',
      page_number: 1,
      results_length: 10
    };
  }

  SearchFields = () => (
    <div class="mt-4">
      <Form>
        <Form.Row>
          <Col>
            <Form.Control style={searchBar} type="text" name="exam_name" placeholder="Exam"
              value={this.state.exam_name} onChange={this.onChangeExamName} />
          </Col>
          <Col>
            <Form.Control style={searchBar} type="number" name="student_id" placeholder="Student ID"
              value={this.state.student_id} onChange={this.onChangeID} />
          </Col>
          <Col>
            <Form.Control style={searchBar} type="text" name="first_name" placeholder="First Name"
              value={this.state.first_name} onChange={this.onChangeFirstName} />
          </Col>
          <Col>
            <Form.Control style={searchBar} type="text" name="last_name" placeholder="Last Name"
              value={this.state.last_name} onChange={this.onChangeLastName} />
          </Col>
            <Button type="submit" onClick={this.getFilteredExamRecordings} class="btn btn-primary mt-2">Search</Button>
        </Form.Row>
      </Form>

      
    </div>
  )

  TableFooter = () => (
    <div class="container mb-2">
      <div class="row">
        <div class="col">
          <button class="btn btn-primary" type="submit" disabled={!this.state.prev_page_exists} onClick={this.prevPage}>
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
          <button class="btn btn-primary" type="submit" disabled={!this.state.next_page_exists} onClick={this.nextPage}>
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
      keyField="student_id"
      data={this.state.table_data}
      columns={columns}
      search
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
                    keyField='student_id'
                    data={this.state.table_data}
                    columns={columns}
                    filter={filterFactory()} />

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
    await this.getFilteredExamRecordings(key, 1);
  }

  onChangeExamName(e) {
    this.setState({
      exam_name: e.target.value
    });
  }

  onChangeFirstName(e) {
    this.setState({
      first_name: e.target.value
    });
  }

  onChangeLastName(e) {
    this.setState({
      last_name: e.target.value
    });
  }

  onChangeID(e) {
    this.setState({
      student_id: e.target.value
    });
  }

  async componentDidMount() {
    // Gets data before the render
    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (!is_examiner) window.location.href = '/examinee/redirect';
    else {
      await this.getFilteredExamRecordings(1, 1);
    }
  }

  getFilteredExamRecordings = async (in_progress=this.state.in_progress, page_number=this.state.page_number) => {
    let parameters = {
      'user_id': this.state.student_id,
      'first_name': this.state.first_name,
      'last_name': this.state.last_name,
      'exam_name': this.state.exam_name,
      'in_progress': in_progress,
      'is_examiner': 0,
      'page_number': page_number,
      'results_length': this.state.results_length,
      'order_by': 'time_started',
      'order': 'desc'
    };
    let data = await getExamRecording(parameters);
    this.setState({
      table_data: data.exam_recordings,
      in_progress: in_progress,
      page_number: page_number,
      next_page_exists: data.next_page_exists,
      prev_page_exists: page_number>1,
    }); 
  }

  nextPage = async () => {
    await this.getFilteredExamRecordings(this.state.in_progress, this.state.page_number + 1)
  }

  prevPage = async () => {
    await this.getFilteredExamRecordings(this.state.in_progress, this.state.page_number - 1)
  };

  render() {

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
      return (
        <BrowserRouter>
          <div className="App">
            <Header >
              <h1>Student List</h1>
            </Header>
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
