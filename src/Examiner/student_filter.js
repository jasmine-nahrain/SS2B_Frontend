import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';

// Main Components
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';
import ToolkitProvider, { Search, CSVExport  } from 'react-bootstrap-table2-toolkit';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
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

var table_columns = [{
  dataField: 'student_id',
  text: 'Student ID',
  sort: true
}, {
  dataField: 'student_fname',
  text: 'Student First Name',
  sort: true
}, {
  dataField: 'student_lname',
  text: 'Student Last Name',
  sort: true,
}, {
  dataField: 'exam_id',
  text: 'Exam ID',
  sort: true,
}, {
  dataField: 'exam_name',
  text: 'Exam Name',
  sort: true,
}, {
  dataField: 'subject',
  text: 'Subject',
  sort: true,
}, {
  dataField: 'status',
  text: 'Status',
  sort: true,
  formatter: (cellContent, row) => (
    <Dot cellContent={cellContent}/ >
  ),
}, {
  dataField: 'view',
  text: '',
  events: {
    onClick: (e, column, columnIndex, row) => {
      // window.location.href = '/';
    },
  },
  formatter: (cellContent, row) => (
    <button class="btn btn-primary">View</button>
  ),
}]

// Gets the length of the payload data to determine roof of pagination.
const customTotal = (from, to, size) => (
  <span className="react-bootstrap-table-pagination-total">
  Showing { from } to { to } of { size } Results
  </span>
);

var tablePaginationOptions;

class StudentFilter extends Component {

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
    const searchBar = {
      width: '100vh',
      color: 'black',
      borderBottomColor: 'rgba(0,0,0,0)',
      backgroundColor: 'rgba(255,255,255,.5)',
      borderRadius: '1vh'
    }

    const is_examiner = parseInt(localStorage.getItem('is_examiner'));
    if (is_examiner) {
    return (
      <BrowserRouter>
      <div className="App">
      <ToolkitProvider
      keyField="student_id"
      data={ graded_select }
      columns={ table_columns }
      search
      >
      {
        props => (
          <div>
          <Header >
            <h1>Student List</h1>
            <SearchBar { ...props.searchProps } style={searchBar} />
          </Header>
          <div class="containerAdmin admin-table">
          <br/>
          <BootstrapTable
          bootstrap4
          { ...props.baseProps }
          bodyClasses="tbodyContainer"
          keyField='student_id'
          data={graded_select }
          columns={ table_columns }
          pagination={ paginationFactory(tablePaginationOptions) }
          filter={ filterFactory() }  />
          <ExportCSVButton class="btn btn-primary" { ...props.csvProps }>Export CSV</ExportCSVButton>
          </div>
          </div>

        )
      }
      </ToolkitProvider>
      </div>
      </BrowserRouter>
    );
    } else {
      window.location.href = '/examinee/rules';
    }
  }
} export default withRouter(StudentFilter);
