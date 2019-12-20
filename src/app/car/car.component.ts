import { AuditService } from '../../services/AuditService';
import { Component, OnInit } from '@angular/core';

import { first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as ListStoreActions from '../redux/actions/auditListActions';
import { PagerService } from '../../services/PagerService';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  page: number;
  pager;
  columnDefs;
  defaultColDefs;
  rowData;
  gridApi;
  columnApi;
  globalSearch;
  selectedRows;
  rowSelection;
  dropdownSettings = {};
  showEdit = false;
  showDelete = false;
  floatingFilter = false;
  dropDownList = [
    { key: 'Action', value: 'action' },
    { key: 'Collection', value: 'collectionName' },
    { key: 'Date', value: 'date' },
    { key: 'EndPoint', value: 'endpoint' },
    { key: 'IP', value: 'ipAddress' },
    { key: 'Method', value: 'method' },
    { key: 'Status Code', value: 'statusCode' },
  ];
  selectedItems = [
    ...this.dropDownList
  ];
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

  constructor(private auditService: AuditService, private pagerService: PagerService, private store: Store<any>) {
    store.pipe(select('auditList')).subscribe(val => {
      this.page = val.page;
    });
    this.defaultColDefs = {
      filter: true,
    };
    this.rowSelection = 'multiple';
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
      },
      {
        headerName: 'Action',
        field: 'action',
        debounceMs: 2000,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true }
      },
      { headerName: 'Collection', field: 'collectionName' },
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

  toggleFloatingFilter() {
    this.floatingFilter = !this.floatingFilter;
    setTimeout(() => {
      this.gridApi.refreshHeader();
    }, 0);
  }

  onSelectionChanged() {
    this.selectedRows = this.gridApi.getSelectedRows();
    if (this.selectedRows.length === 0) {
      this.showEdit = false;
      this.showDelete = false;
    } else if (this.selectedRows.length === 1) {
      this.showEdit = true;
      this.showDelete = false;
    } else if (this.selectedRows.length > 1) {
      this.showEdit = false;
      this.showDelete = true;
    }
  }

  searchGlobalData() {
    this.store.dispatch(new ListStoreActions.SetCurrentPage());
    this.auditService.getSearchedData(this.globalSearch).pipe(first()).subscribe((searchDatas: any) => {
      this.rowData = searchDatas.docs;
      this.pagination = searchDatas.items;
      this.paginationPages = searchDatas.pages;
    });
  }

  searchData(text: string) {
    this.auditService.getColumnSearch(text).pipe(first()).subscribe((searchDatas: any) => {
      this.rowData = searchDatas.docs;
      this.pagination = searchDatas.items;
      this.paginationPages = searchDatas.pages;
    });
  }

  exportCSV() {
    const currentTime = new Date().getTime();
    const params = {
      allColumns: true,
      skipHeader: false,
      skipFooters: true,
      skipGroups: true,
      fileName: `grid_${currentTime}.csv`
    };
    this.gridApi.exportDataAsCsv(params);
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

  setPage(page: number): void {
    this.store.dispatch(new ListStoreActions.NextPage(page));
    this.pager = this.pagerService.getPager(this.pagination.total, page, this.pagination.limit);
    this.loadData();
  }

  onItemSelect(item: any) {
    this.columnApi.setColumnVisible(item.value, true);
  }

  onItemUnSelect(item: any) {
    this.columnApi.setColumnVisible(item.value, false);
  }

  onSelectAll(items: any) {
    items.map(item => this.columnApi.setColumnVisible(item.value, true));
  }

  ngOnInit() {
    this.dropdownSettings = {
      singleSelection: false,
      idField: 'value',
      textField: 'key',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true,
      enableCheckAll: true,
    };
    this.setPage(this.pagination.begin);
  }

}
