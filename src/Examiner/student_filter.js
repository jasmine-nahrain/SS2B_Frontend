import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";
import styled from 'styled-components';
import { getExaminees } from '../api_caller.js';
// Main Components
import filterFactory from 'react-bootstrap-table2-filter';
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
    this.getExaminees = this.getExaminees.bind(this);

    this.state = {
      table_data: []
    };
  }

  async componentDidMount() {
    // Gets data before the render
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (!is_admin) window.location.href = '/';
    // else {
    const data = await getExaminees();
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
    // }
  }

  getExaminees(data) {
    var examinees = [];
    for(var i = 0; i < data.users.length; i++) {
      if(data.users[i].is_examiner == 0) {
        examinees.push(data.users[i]);
      }
    }
    console.log(examinees)

    this.setState({
      table_data: examinees
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

    // const admin_id = getUserID(false);
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (admin_id && is_admin) {
    return (
      <BrowserRouter>
      <div className="App">
      <ToolkitProvider
      keyField="student_id"
      data={ this.state.table_data }
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
          data={this.state.table_data }
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
    // } else {
    //   window.location.href = '/';
    // }
  }
} export default withRouter(StudentFilter);
