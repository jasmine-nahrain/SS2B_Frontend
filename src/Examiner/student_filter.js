import '../App.css';
import React, { Component } from 'react';
import { BrowserRouter, withRouter } from "react-router-dom";

// Main Components
import filterFactory, { textFilter, numberFilter } from 'react-bootstrap-table2-filter';
import paginationFactory from 'react-bootstrap-table2-paginator';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-filter/dist/react-bootstrap-table2-filter.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import BootstrapTable from 'react-bootstrap-table-next';


// dummy data to use in the meantime.
const graded_select = {
  0: 'Not Graded',
  1: 'Graded'
};

var table_columns = [{
  dataField: 'student_id',
  text: 'Student ID',
  filter: numberFilter({withoutEmptyComparatorOption: true, comparatorStyle: {width: 0, padding: 0, visibility: "hidden"}, numberStyle: {marginRight: 0, width: '100%'}}),
}, {
  dataField: 'student_fname',
  text: 'Student First Name',
  filter: textFilter(),
  sort: true
}, {
  dataField: 'student_lname',
  text: 'Student Last Name',
  filter: textFilter(),
}, {
  dataField: 'exam_id',
  text: 'Exam ID',
  filter: numberFilter({withoutEmptyComparatorOption: true, comparatorStyle: {width: 0, padding: 0, visibility: "hidden"}, numberStyle: {marginRight: 0, width: '100%'}}),
}, {
  dataField: 'exam_name',
  text: 'Exam Name',
  filter: textFilter(),
}, {
  dataField: 'subject',
  text: 'Subject',
  filter: textFilter(),
}, {
  dataField: 'in_progress',
  text: 'In Progress',
  headerStyle: () => {return{width:"7%"}},
}, {
  dataField: 'view',
  text: 'View',
  headerStyle: () => {return{width:"5%"}},
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
      var data = await this.getCircuits();
      this.setState({
        table_data: data
      });
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

  getCircuits = async () => {
    var list = [];
   //  const results = await retrieveCircuits({
   //    'is_submitted': 1
   // });
    // for (var i = 0; i < results['circuits'].length; i++) {
    //     list[i] = results['circuits'][i];
    // }
    //console.log(list);
    return list;
  }

  onSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('student_id', this.state.studentID);
    // window.location.href = '/';
  }

  render() {
    // const admin_id = getUserID(false);
    // const is_admin = parseInt(localStorage.getItem('is_admin'));
    // if (admin_id && is_admin) {
      return (
        <BrowserRouter>
          <div className="App">
            <h1>Student List</h1>
              <div><br></br></div>
              <div class="containerAdmin admin-table">
                  <BootstrapTable
                  bodyClasses="tbodyContainer"
                  keyField='student_id'
                  data={ this.state.table_data }
                  columns={ table_columns }
                  pagination={ paginationFactory(tablePaginationOptions) }
                  filter={ filterFactory() }  />
              </div>
          </div>
        </BrowserRouter>
      );
    // } else {
    //   window.location.href = '/';
    // }
  }
} export default withRouter(StudentFilter);
