import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';
import EditIcon from '../images/edit.svg';
import { getExams } from '../api_caller.js';
import { inProgress, getCurrentDate, datetimeformat, formatDateToLocalString, formatDateToLocal } from '../functions.js';
// Main Components
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import { RightCaretIcon, LeftCaretIcon } from '../Examinee/scripts/Icons';
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import { Tab, Tabs, OverlayTrigger, Button, Form, Col } from 'react-bootstrap';
import moment from 'moment';


const searchBar = {
  color: 'black',
  borderBottomColor: 'rgba(0,0,0,0)',
  backgroundColor: 'rgba(220,220,240,.5)',
  borderRadius: '1vh'
}

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 1%;
`;

const Dot = styled.span`
height: 15px;
width: 15px;
box-shadow: 0px 1px 5px 1px ${props => (inProgress(props.cellContent) == true ? 'green' : 'red')};
background-color: ${props => (inProgress(props.cellContent) == true ? 'green' : 'red')};
border-radius: 50%;
display: inline-block;
`;

const A = styled.a`
visibility: ${props => (inProgress(props.cellContent) == true ? 'hidden' : 'visible')};
`;

var columns = (upcoming) => {
  return [{
    dataField: 'subject_id',
    text: 'Subject ID',
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'exam_id',
    text: 'Exam ID',
    hidden: true,
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'exam_name',
    text: 'Exam',
    //sort: true,
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'duration',
    text: 'Duration',
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'login_code',
    text: 'Login Code',
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'start_date',
    text: 'Starts',
    headerStyle: { background: '#007bff', color: 'white' },
    formatter: cell => formatDateToLocalString(cell)
  }, {
    dataField: 'end_date',
    text: 'Ends',
    headerStyle: { background: '#007bff', color: 'white' },
    formatter: cell => formatDateToLocalString(cell)
  }, {
    dataField: 'exam_recordings',
    text: 'Attempts',
    hidden: upcoming,
    headerStyle: { background: '#007bff', color: 'white' }
  }, {
    dataField: 'edit',
    hidden: !upcoming,
    headerStyle: { background: '#007bff', color: 'white', width: "5%" },
    events: {
      onClick: (e, column, columnIndex, row) => {
        localStorage.setItem('exam', JSON.stringify(row));
      },
    },
    formatter: (cellContent, row) => (
      <A href="/examiner/edit" cellContent={row}><img src={EditIcon} /></A>
    ),
  }]
}

class ManageExam extends Component {

  constructor(props) {
    super(props);
    this.onChangeExamName = this.onChangeExamName.bind(this);
    this.onChangeSubjectId = this.onChangeSubjectId.bind(this);
    this.handleTabSelect = this.handleTabSelect.bind(this);
    this.getFilteredExams = this.getFilteredExams.bind(this);
    this.nextPage = this.nextPage.bind(this);
    this.prevPage = this.prevPage.bind(this);

    this.state = {
      table_data: [],
      exam_name: "",
      subject_id: "",
      next_page_exists: false,
      prev_page_exists: false,
      current_datetime: moment.utc().format(datetimeformat),
      in_progress: 2,
      order_by: 'start_time',
      order: 'desc',
      page_number: 1,
      results_length: 10
    };
  }

  async componentDidMount() {
    await this.getFilteredExams(null, 2,1);
  }

  onChangeExamName(e) {
    e.preventDefault();
    this.setState({
      exam_name: e.target.value
    });
  }

  onChangeSubjectId(e) {
    e.preventDefault();
    this.setState({
      subject_id: e.target.value
    });
  }

  handleTabSelect = async (key) => {
    await this.getFilteredExams(null, key, 1);
  }

  getFilteredExams = async (e, in_progress = this.state.in_progress, page_number = this.state.page_number) => {
    let parameters = {
      'exam_name': this.state.exam_name,
      'subject_id': this.state.subject_id,
      'page_number': page_number,
      'results_length': this.state.results_length,
      'order_by': this.state.order_by,
      'order': this.state.order
    };
    //console.log("inpr", in_progress)
    if (parseInt(in_progress) === 2) parameters['period_start'] = this.state.current_datetime
    else parameters['in_progress'] = parseInt(in_progress);
    //console.log("params", parameters);
    let data = await getExams(parameters);
    //console.log("ez:", data);
    this.setState({
      table_data: data.exams,
      in_progress: in_progress,
      page_number: page_number,
      next_page_exists: data.next_page_exists,
      prev_page_exists: page_number > 1,
    });
  }

  nextPage = async () => {
    await this.getFilteredExams(null, this.state.in_progress, this.state.page_number + 1)
  }

  prevPage = async () => {
    await this.getFilteredExams(null, this.state.in_progress, this.state.page_number - 1)
  };

  SearchFields = () => (
    <div class="mt-4">
      <Form>
        <Form.Row>
          <Col>
            <Form.Control style={searchBar} type="number" name="subject_id" placeholder="Subject ID"
              value={this.state.subject_id} onChange={this.onChangeSubjectId} />
          </Col>
          <Col>
            <Form.Control style={searchBar} type="text" name="exam_name" placeholder="Exam Name"
              value={this.state.exam_name} onChange={this.onChangeExamName} />
          </Col>

          <Button onClick={this.getFilteredExams} class="btn btn-primary mt-2">Search</Button>
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

  CustomTable = (upcoming, empty_message) => {
    // upcoming can be 2 values - true (for upcoming), false (for in progress or for past)
    return (
      <ToolkitProvider
        keyField="exam_id"
        data={this.state.table_data}
        columns={columns(upcoming)}
      >
        {
          props => (
            <div>
              <div class="containerAdmin admin-table">
                <this.SearchFields />
                {upcoming &&
                  <a href='/examiner/create'><button class="btn btn-primary btn-block my-3" style={{ float: 'left' }}>Create New Exam</button></a>
                }
                <br />
                {this.state.table_data.length == 0 ? <p>{empty_message}</p> :
                  <div>
                    <BootstrapTable
                      bootstrap4
                      {...props.baseProps}
                      data={this.state.table_data}
                      columns={columns(upcoming)}
                      bodyClasses="tbodyContainer" />

                    <this.TableFooter />
                  </div>
                }
              </div>
            </div>
          )}
      </ToolkitProvider>
    )
  }

  render() {

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
      return (
        <BrowserRouter>
          <div className="App">
            <Header >
              <h1><b>Exam List</b></h1>
            </Header>
            <a href="/examiner" style={{textDecoration: 'none'}}><button  class="btn btn-success mb-1 btn-block" style={{width:'90%', marginLeft:'auto', marginRight: 'auto'}}>View Exam Attempts</button></a>
            <br />
            <Tabs onSelect={this.handleTabSelect} defaultActiveKey={2} id="manage" style={{ width: '90%', marginLeft: 'auto', marginRight: 'auto' }}>
              <Tab eventKey={2} title="Upcoming" style={{ backgroundColor: 'white' }} >
                {this.CustomTable(true, 'No upcoming exams found.')}
              </Tab>
              <Tab eventKey={1} title="In Progress">
                {this.CustomTable(false, 'No in progress exams found.')}
              </Tab>
              <Tab eventKey={0} title="Past">
                {this.CustomTable(false, 'No past exams found.')}
              </Tab>
            </Tabs>

          </div>
        </BrowserRouter>
      );
    } else {
      window.location.href = '/examinee/redirect';
    }
  }
} export default withRouter(ManageExam);
