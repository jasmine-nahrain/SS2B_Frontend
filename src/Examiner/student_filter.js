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
import ToolkitProvider, { Search, CSVExport  } from 'react-bootstrap-table2-toolkit';
import {Tab, Tabs} from 'react-bootstrap';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
margin-bottom: 3%;
`;

const time = new Date();

const Button = styled.button`
  visibility: ${props => (new Date(props.start_time) >= time && new Date(props.end_time) <= time) ? 'visible' : 'hidden'};
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


var table_columns = [{
  dataField: 'user_id',
  text: 'Student ID',
  sort: true
}, {
  dataField: 'first_name',
  text: 'Student First Name',
  sort: true
}, {
  dataField: 'last_name',
  text: 'Student Last Name',
  sort: true,
}, {
  dataField: 'view',
  text: 'View',
  events: {
    onClick: (e, column, columnIndex, row) => {
      window.location.href = '/' + row.video_link;
      console.log(row.time_started);
    },
  },
  formatter: (cellContent, row) => (
    <Button class="btn btn-primary" start_time={row.time_started} end_time={row.time_ended}>View</Button>
  ),
}]

var upcoming = [{
  dataField: 'user_id',
  text: 'Student ID',
  sort: true
}, {
  dataField: 'first_name',
  text: 'Student First Name',
  sort: true
}, {
  dataField: 'last_name',
  text: 'Student Last Name',
  sort: true,
}, {
  dataField: 'time_started',
  text: 'Start Date',
}]

// Gets the length of the payload data to determine roof of pagination.
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
  Showing { from } to { to } of { size } Results
  </span>
);

var tablePaginationOptions, tablePaginationOptionsUpcoming;

class StudentFilter extends Component {

  constructor(props) {
    super(props);
    this.getExaminees = this.getExaminees.bind(this);

    this.state = {
      table_data: [],
      upcoming: []
    };
  }

  async componentDidMount() {
    // Gets data before the render
    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (!is_examiner) window.location.href = '/examinee/redirect';
    else {
      // const data = await getExaminees();
      const data = await getExamRecording();
      this.getExaminees(data);

      // Needs to be defined at this point because only now do we have a length for table_data
      tablePaginationOptions = {
        paginationSize: 4,
        pageStartIndex: 0,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: this.state.table_data.length
        }]
      };

      tablePaginationOptionsUpcoming = {
        paginationSize: 4,
        pageStartIndex: 0,
        firstPageText: 'First',
        prePageText: 'Back',
        nextPageText: 'Next',
        lastPageText: 'Last',
        nextPageTitle: 'First page',
        prePageTitle: 'Pre page',
        firstPageTitle: 'Next page',
        lastPageTitle: 'Last page',
        showTotal: true,
        paginationTotalRenderer: customTotal,
        disablePageTitle: true,
        sizePerPageList: [{
          text: '5', value: 5
        }, {
          text: '10', value: 10
        }, {
          text: 'All', value: this.state.upcoming.length
        }]
      };
    }
  }

  getExaminees(data) {
    var in_progress = [], upcoming = [];
    for(var i = 0; i < data.exam_recordings.length; i++) {
      if(data.exam_recordings[i].video_link !== null)
        in_progress.push(data.exam_recordings[i]);
      else if(new Date(data.exam_recordings[i].time_started) >= time)
        upcoming.push(data.exam_recordings[i]);

    }
    console.log(in_progress)
    console.log(upcoming)

    this.setState({
      table_data: in_progress,
      upcoming: upcoming
    });

  }

  render() {
    const searchBar = {
      width: '100vh',
      color: 'black',
      borderBottomColor: 'rgba(0,0,0,0)',
      backgroundColor: 'rgba(255,255,255,.5)',
      borderRadius: '1vh'
    }

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner == 1) {
    return (
      <BrowserRouter>
      <div className="App">
      <Header >
        <h1>Student List</h1>
      </Header>
      <Tabs defaultActiveKey="upcoming" id="manage" style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
        <Tab eventKey="in_progress" title="In Progress" style={{backgroundColor: 'white'}} >
          <ToolkitProvider
          keyField="student_id"
          data={ this.state.table_data }
          columns={ table_columns }
          search
          >
          {
            props => (
              <div>
              <div class="containerAdmin admin-table">
              <SearchBar { ...props.searchProps } style={searchBar} />
              <br/>
              {this.state.table_data.length == 0 ? <p>No Upcoming Exams</p> :
              <BootstrapTable
              bootstrap4
              { ...props.baseProps }
              bodyClasses="tbodyContainer"
              keyField='student_id'
              data={this.state.table_data }
              columns={ table_columns }
              pagination={ paginationFactory(tablePaginationOptions) }
              filter={ filterFactory() }  />
            }
              </div>
              </div>
            )}
          </ToolkitProvider>
        </Tab>

        <Tab eventKey="upcoming" title="Upcoming" style={{backgroundColor: 'white'}} >
          <ToolkitProvider
          keyField="student_id"
          data={ this.state.upcoming }
          columns={ upcoming }
          search
          >
          {
            props => (
              <div>
                <div class="containerAdmin admin-table">
                <SearchBar { ...props.searchProps } style={searchBar} />
                <br/>
                {this.state.upcoming.length == 0 ? <p>No Upcoming Exams</p> :
                <BootstrapTable
                bootstrap4
                { ...props.baseProps }
                bodyClasses="tbodyContainer"
                keyField='student_id'
                data={this.state.upcoming }
                columns={ upcoming }
                pagination={ paginationFactory(tablePaginationOptionsUpcoming) }
                filter={ filterFactory() }/>
              }
              </div>
            </div>
          )}
        </ToolkitProvider>
        </Tab>
      </Tabs>
    </div>
  </BrowserRouter>
    );
    } else {
      window.location.href = '/examinee/redirect';
    }
  }
} export default withRouter(StudentFilter);
