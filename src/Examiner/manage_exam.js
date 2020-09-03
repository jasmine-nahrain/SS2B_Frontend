import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';
import EditIcon from '../images/edit.svg';

// Main Components
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
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
/* background-color: #e6e6e6; */
/* color: white; */
/* padding: 1%; */
padding-top: 3%;
`;
const Dot = styled.span`
height: 15px;
width: 15px;
box-shadow: 0px 1px 5px 1px ${props => (props.cellContent == true ? 'green' : 'red')};
background-color: ${props => (props.cellContent == true ? 'green' : 'red')};
border-radius: 50%;
display: inline-block;
`;
 var i = 1;

// dummy data to use in the meantime.
var graded_select = [
  {
  student_id: 23456,
  student_fname: 'Jasmine',
  student_lname: "Emanouel",
  exam_id: 12345,
  exam_name: "3456ygv",
  subject: "ftyuhjbv"
},
{
student_id: 1234567,
student_fname: 'Clark',
student_lname: "Kent",
exam_id: 12345,
exam_name: "3456ygv",
subject: "ftyuhjbv"
},
{
student_id: 838383883,
student_fname: 'Julia',
student_lname: "Gillard",
exam_id: 654,
exam_name: "rdxcbg",
subject: "chgsddd",
status: true,
}
];

var upcoming_exams = [{
  dataField: 'edit',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white', width: "5%"},
  formatter: (cellContent, row) => (
    <a href="/"><img src={EditIcon} /></a>
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
  dataField: 'subject',
  text: 'Subject',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'},
  formatter: (cellContent, row) => (
    <Dot cellContent={cellContent}/ >
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
  dataField: 'subject',
  text: 'Subject',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'}
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  headerStyle: {background: '#007bff', color: 'white'},
  formatter: (cellContent, row) => (
    <Dot cellContent={cellContent}/ >
  ),
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

    this.state = {
      table_data: []
    };
  }

  async componentDidMount() {
    // Gets data before the render
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (!is_admin) window.location.href = '/';
    // else {
    // this.setState({
    //   table_data: data
    // });
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
    // }
  }

  render() {


    const defaultSorted = [{
        dataField: 'exam_id',
        order: 'asc'
    }];

    // const admin_id = getUserID(false);
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (admin_id && is_admin) {
    return (
      <BrowserRouter>
      <div className="App">
      <Header >
        <h1><b>Exam List</b></h1>
        <hr style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}/>
      </Header>
      <br/>
      <Tabs defaultActiveKey="upcoming" id="uncontrolled-tab-example" style={{width: '90%', marginLeft: 'auto', marginRight: 'auto'}}>
        <Tab eventKey="upcoming" title="Upcoming" style={{backgroundColor: 'white'}} >
        <ToolkitProvider
        keyField="student_id"
        data={ graded_select }
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
                <button class="btn btn-primary" style={{float:'left'}}>Create New Exam</button>
                <SearchBar { ...props.searchProps }/>
                <br/>
                <BootstrapTable
                  bootstrap4
                  { ...props.baseProps }
                  bodyClasses="tbodyContainer"
                  keyField='student_id'
                  data={graded_select }
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
        data={ graded_select }
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
            data={graded_select }
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
    // } else {
    //   window.location.href = '/';
    // }
  }
} export default withRouter(ManageExam);
