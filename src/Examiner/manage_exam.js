import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';
import EditIcon from '../images/edit.svg';
import { getExams } from '../api_caller.js';
import CreateExam from './create_exam.js';
import EditExam from './edit_exam.js';
import {inProgress, getCurrentDate} from '../functions.js';
// Main Components
import filterFactory from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport  } from 'react-bootstrap-table2-toolkit';
import {Tab, Tabs, OverlayTrigger, Button} from 'react-bootstrap';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const Header = styled.header`
padding-top: 3%;
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

var upcoming_exams = [{
  dataField: 'edit',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white', width: "5%"},
  events: {
    onClick: (e, column, columnIndex, row) => {
        localStorage.setItem('exam', JSON.stringify(row));
    },
  },
  formatter: (cellContent, row) => (
    <A href="/examiner/edit" cellContent={row}><img src={EditIcon} /></A>
  ),
}, {
  dataField: 'exam_id',
  text: 'Exam ID',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'exam_name',
  text: 'Exam Name',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'start_date',
  text: 'Start Date',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
},{
  dataField: 'duration',
  text: 'Duration',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'login_code',
  text: 'Login Code',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'subject_id',
  text: 'Subject',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'},
  formatter: (cellContent, row) => (
    <Dot cellContent={row}/ >
  ),
}]
var past_exams = [ {
  dataField: 'exam_id',
  text: 'Exam ID',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'exam_name',
  text: 'Exam Name',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'start_date',
  text: 'Start Date',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
},{
  dataField: 'end_date',
  text: 'End Date',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'subject_id',
  text: 'Subject ID',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}]

// Gets the length of the payload data to determine roof of pagination.
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
  Showing { from } to { to } of { size } Results
  </span>
);

var tablePaginationOptions;

class ManageExam extends Component {

  constructor(props) {
    super(props);

    this.seperateExamLists = this.seperateExamLists.bind(this);

    this.state = {
      upcomingExams: [],
      pastExams: [],
    };
  }

  async componentDidMount() {
    // Gets data before the render
    const data = await getExams();
    this.seperateExamLists(data);

    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (!is_admin) window.location.href = '/';
    // else {

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
      }]
    };
    // }
  }

  seperateExamLists(data) {
    var upcomingExamList = [];
    var pastExamList = [];
    var currentDate = getCurrentDate();
      console.log(parseInt(currentDate[1]))
      for(var i = 0; i < data.exams.length; i++) {
        var start_date = data.exams[i].start_date.split('-');
        const day = start_date[2].split(" ")
        console.log(start_date);
         if(parseInt(day[0]) >= parseInt(currentDate[0]) && parseInt(start_date[1]) == parseInt(currentDate[1]) &&
           parseInt(start_date[0]) >= parseInt(currentDate[2])) {
               //if in current month
             upcomingExamList.push(data.exams[i]);
         } else if(parseInt(start_date[1]) > parseInt(currentDate[1]) &&
           parseInt(start_date[0]) >= parseInt(currentDate[2])) {
             //if in future month
              upcomingExamList.push(data.exams[i]);
          } else {
            pastExamList.push(data.exams[i]);
          }
      }
      this.setState({
        upcomingExams: upcomingExamList,
        pastExams: pastExamList,
      });
  }

  render() {
    const defaultSorted = [{
        dataField: 'start_date',
        order: 'asc'
    }];

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
    return (
      <BrowserRouter>
      <div className="App">
      <Header >
        <h1><b>Exam List</b></h1>
        <hr style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/>
      </Header>
      <br/>
      <Tabs defaultActiveKey="upcoming" id="manage" style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
        <Tab eventKey="upcoming" title="Upcoming" style={{backgroundColor: 'white'}} >
        <ToolkitProvider
        keyField="student_id"
        data={ this.state.upcomingExams }
        columns={ upcoming_exams }
        search
        exportCSV={{
          fileName: 'upcoming_exam_list.csv',
          onlyExportSelection: true,
          exportAll: true
        }}
        >
        {
          props => (
            <div>
              <div class="containerAdmin admin-table">
                <br/>
                <ExportCSVButton class="btn btn-primary" { ...props.csvProps } style={{float:'left', marginRight: '10px'}}>Export CSV</ExportCSVButton>
                <a href='/examiner/create'><button class="btn btn-primary" style={{float:'left'}}>Create New Exam</button></a>
                <SearchBar { ...props.searchProps } className="manage search"/>
                <br/>
                <BootstrapTable
                  bootstrap4
                  { ...props.baseProps }
                  bodyClasses="tbodyContainer"
                  keyField='student_id'
                  data={this.state.upcomingExams }
                  columns={ upcoming_exams }
                  pagination={ paginationFactory(tablePaginationOptions) }
                  hover
                  defaultSorted={ defaultSorted }
                  filter={ filterFactory() }  />
              </div>
            </div>

          )
        }
        </ToolkitProvider>
        </Tab>
        <Tab eventKey="past" title="Past">
        <ToolkitProvider
        keyField="student_id"
        data={ this.state.pastExams }
        columns={ past_exams }
        search
        exportCSV={{
          fileName: 'past_exam_list.csv',
          onlyExportSelection: true,
          exportAll: true
        }}
        >
        {
          props => (
            <div>
            <div class="containerAdmin admin-table">
            <br/>
            <ExportCSVButton class="btn btn-primary" { ...props.csvProps } style={{float:'left', marginRight: '10px'}}>Export CSV</ExportCSVButton>
            <SearchBar { ...props.searchProps } />
            <br/>
            <BootstrapTable
            bootstrap4
            { ...props.baseProps }
            bodyClasses="tbodyContainer"
            keyField='student_id'
            data={this.state.pastExams }
            columns={ past_exams }
            pagination={ paginationFactory(tablePaginationOptions) }
            defaultSorted={ defaultSorted }
            filter={ filterFactory() }  />
            </div>
            </div>
          )
        }
        </ToolkitProvider>
        </Tab>
      </Tabs>

      </div>
      </BrowserRouter>
    );
    } else {
      window.location.href = '/examinee/rules';
    }
  }
} export default withRouter(ManageExam);
