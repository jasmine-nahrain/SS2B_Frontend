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
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';
import { Form } from 'react-bootstrap';

const { SearchBar } = Search;
const { ExportCSVButton } = CSVExport;

const Header = styled.header`
background-color: #2196f3;
color: white;
padding: 1%;
`;

var table_columns = [{
  dataField: 'user_id',
  text: 'Student ID',
  sort: true
}, {
  dataField: 'first_name',
  text: 'First Name',
  sort: true
}, {
  dataField: 'last_name',
  text: 'Last Name',
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
    Showing { from} to { to} of { size} Results
  </span>
);

var tablePaginationOptions;

class StudentFilter extends Component {

  constructor(props) {
    super(props);
    this.processExaminees = this.processExaminees.bind(this);
    this.getFilteredExaminees = this.getFilteredExaminees.bind(this);
    this.onChangeFirstName = this.onChangeFirstName.bind(this);
    this.onChangeLastName = this.onChangeLastName.bind(this);
    this.onChangeID = this.onChangeID.bind(this);

    this.state = {
      table_data: [],
      student_id: "",
      first_name: "",
      last_name: ""
    };
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
      const data = await this.getFilteredExaminees();
      this.processExaminees(data);

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
    }
  }

  processExaminees = async(data) => {
    var examinees = [];
    for (var i = 0; i < data.users.length; i++) {
      if (data.users[i].is_examiner == 0) {
        examinees.push(data.users[i]);
      }
    }
    //console.log(examinees)

    this.setState({
      table_data: examinees
    });

  }

  getFilteredExaminees = async () => {
    let parameters = {
      'user_id': this.state.student_id,
      'first_name': this.state.first_name,
      'last_name': this.state.last_name,
      'is_examiner':false
    };
    let data = await getExaminees(parameters);
    await this.processExaminees(data);
    return data;
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
              data={this.state.table_data}
              columns={table_columns}
              search
            >
              {
                props => (
                  <div>
                    <Header >
                      <h1>Student List</h1>
                      <SearchBar {...props.searchProps} style={searchBar} />
                      <Form.Group controlId="formId">
                        <Form.Control style={searchBar} type="number" name="student_id" placeholder="Student ID" value={this.state.student_id} onChange={this.onChangeID}/>
                      </Form.Group>
                      <Form.Group controlId="formId">
                        <Form.Control style={searchBar} type="text" name="first_name" placeholder="First Name" value={this.state.first_name} onChange={this.onChangeFirstName}/>
                      </Form.Group>
                      <Form.Group controlId="formId">
                        <Form.Control style={searchBar} type="text" name="last_name" placeholder="Last Name" value={this.state.last_name} onChange={this.onChangeLastName}/>
                      </Form.Group>
                        <button type="submit" onClick={this.getFilteredExaminees}></button>
                    </Header>
                    <div class="containerAdmin admin-table">
                      <br />
                      <BootstrapTable
                        bootstrap4
                        {...props.baseProps}
                        bodyClasses="tbodyContainer"
                        keyField='student_id'
                        data={this.state.table_data}
                        columns={table_columns}
                        pagination={paginationFactory(tablePaginationOptions)}
                        filter={filterFactory()} />
                      <ExportCSVButton class="btn btn-primary" {...props.csvProps}>Export CSV</ExportCSVButton>
                    </div>
                  </div>

                )
              }
            </ToolkitProvider>
          </div>
        </BrowserRouter>
      );
    } else {
      window.location.href = '/examinee/redirect';
    }
  }
} export default withRouter(StudentFilter);
