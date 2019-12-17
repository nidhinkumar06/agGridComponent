import { Component, OnInit } from '@angular/core';
import { user } from '../../mockDatas/user.js';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  rowSelection;
  gridApi;

  constructor() {
    this.rowSelection = 'multiple';
  }

  columnDefs = [
    { headerName: 'ID',
      field: 'id',
      sortable: true,
      width: 100,
      checkboxSelection: function (params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
      headerCheckboxSelection: function (params) {
        return params.columnApi.getRowGroupColumns().length === 0;
      },
    },
    { headerName: 'First Name', field: 'first_name', sortable: true, filter: true },
    { headerName: 'Last Name', field: 'last_name', sortable: true, filter: true },
    { headerName: 'Email', field: 'email', sortable: true, filter: true },
    { headerName: 'Gender', field: 'gender', sortable: true, filter: true },
    { headerName: 'IP Address', field: 'ip_address', sortable: true, filter: true },
  ];

  rowData = user;

  onSelectionChanged(params) {
    if (params.getSelectedRows().length !== 0) {
      alert(`selected ${params.getSelectedRows().length} rows`);
    }
  }

  ngOnInit() {
  }

}
