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
import { Form, Col } from 'react-bootstrap';

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
  //sort: true
}, {
  dataField: 'first_name',
  text: 'First Name',
  //sort: true,
}, {
  dataField: 'last_name',
  text: 'Last Name',
  //sort: true,
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
      last_name: "",
      next_page_exists: false,
      prev_page_exists: false,
      page_number: 1,
      results_length: 10
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

  processExaminees = async (data) => {
    var examinees = [];
    for (var i = 0; i < data.users.length; i++) {
      examinees.push(data.users[i]);
    }
    //console.log(examinees)

    this.setState({
      table_data: examinees,
      next_page_exists: data.next_page_exists
    });

  }

  getFilteredExaminees = async (page_number = this.state.page_number, results_length = this.state.results_length) => {
    let parameters = {
      'user_id': this.state.student_id,
      'first_name': this.state.first_name,
      'last_name': this.state.last_name,
      'is_examiner': 0,
      'page_number': page_number,
      'results_length': results_length,
      'order_by': 'first_name',
      'order': 'asc'
    };
    let data = await getExaminees(parameters);
    await this.processExaminees(data);
    return data;
  }

  nextPage = async () => {
    let new_page_number = this.state.page_number + 1;
    await this.getFilteredExaminees(new_page_number)
    this.setState({
      page_number: new_page_number,
      prev_page_exists: true
    });
  }

  prevPage = async () => {
    let new_page_number = this.state.page_number - 1;
    await this.getFilteredExaminees(new_page_number)
    this.setState({
      page_number: new_page_number,
      prev_page_exists: new_page_number > 1
    });
  }

  render() {
    const searchBar = {
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
                      <Form>
                        <Form.Row>
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
                        </Form.Row>
                      </Form>

                      <button type="submit" onClick={this.getFilteredExaminees} class="btn btn-primary mt-2">Search</button>
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

                        filter={filterFactory()} />

                      <div class="container mb-2">
                        <div class="row">
                          <div class="col">
                            <button class="btn btn-primary" type="submit" disabled={!this.state.prev_page_exists} onClick={this.prevPage}>
                              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-left-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3.86 8.753l5.482 4.796c.646.566 1.658.106 1.658-.753V3.204a1 1 0 0 0-1.659-.753l-5.48 4.796a1 1 0 0 0 0 1.506z" />
                              </svg>
                              Prev Page
                            </button>
                          </div>
                          <div class="col-7">
                            <text>
                              Results {(this.state.page_number - 1) * this.state.results_length + (this.state.table_data.length > 0)} - {(this.state.page_number - 1) * this.state.results_length + this.state.table_data.length}
                            </text>
                          </div>
                          <div class="col">
                            <button class="btn btn-primary" type="submit" disabled={!this.state.next_page_exists} onClick={this.nextPage}>
                              Next Page
                              <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-caret-right-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.14 8.753l-5.482 4.796c-.646.566-1.658.106-1.658-.753V3.204a1 1 0 0 1 1.659-.753l5.48 4.796a1 1 0 0 1 0 1.506z" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                        <ExportCSVButton class="btn btn-primary" {...props.csvProps}>Export CSV</ExportCSVButton>
                        {/*pagination={paginationFactory(tablePaginationOptions)}*/}
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
