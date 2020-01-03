import { Component, OnInit } from '@angular/core';
import { AuditService } from 'src/services/AuditService';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.css']
})
export class SwitchesComponent implements OnInit {
  columnDefs;
  gridApi;
  columnApi;
  pagination = {
    begin: 0,
    end: 0,
    limit: 0,
    total: 0
  };
  paginationPages = {
    current: 0,
    hasNext: false,
    hasPrev: false,
    next: 0,
    prev: 0,
    total: 0
  };
  rowData;

  constructor(private auditService: AuditService) {
    this.columnDefs = [
      {
        headerName: 'ID',
        width: 100,
        valueGetter: (args) => this.getIdValue(args),
        checkboxSelection: (params) => {
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelection: (params) => {
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        suppressSizeToFit: true,
      },
      {
        headerName: 'Action',
        field: 'action',
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
        },
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true }
      },
      {
        headerName: 'Collection',
        field: 'collectionName',
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true }
      },
      { headerName: 'Date', field: 'date' },
      { headerName: 'End Point', field: 'endpoint' },
      { headerName: 'IP', field: 'ipAddress' },
      { headerName: 'Method', field: 'method' },
      { headerName: 'Status Code', field: 'statusCode' },
    ];
  }


  OnGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.loadData();
  }

  getIdValue(args: any): any {
    return this.pagination.limit * this.paginationPages.prev + parseInt(args.node.id, 10) + 1;
  }

  loadData(): void {
    this.auditService.getAllAuditLogs().pipe(first()).subscribe((audits: any) => {
      this.rowData = audits.docs;
      this.pagination = audits.items;
      this.paginationPages = audits.pages;
    });
  }

  ngOnInit() {
  }

}
