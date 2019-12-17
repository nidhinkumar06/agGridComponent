import { AuditService } from '../../services/AuditService';
import { Component, OnInit } from '@angular/core';
import { IDropdownSettings } from 'ng-multiselect-dropdown';

import { first } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as ListStoreActions from '../redux/actions/auditListActions';

@Component({
  selector: 'app-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {

  page: number;
  columnDefs;
  defaultColDefs;
  rowData;
  gridApi;
  columnApi;
  globalSearch;
  dropDownList = [
    {key: 'Action', value: 'action'},
    {key: 'Collection', value: 'collectionName'},
    {key: 'Date', value: 'date'},
    {key: 'EndPoint', value: 'endpoint'},
    {key: 'IP', value: 'ipAddress'},
    {key: 'Method', value: 'method'},
    {key: 'Status Code', value: 'statusCode'},
  ];
  selectedItems = [
    ...this.dropDownList
  ];
  dropdownSettings = {};

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

  constructor(private auditService: AuditService, private store: Store<any>) {
    store.pipe(select('auditList')).subscribe(val => {
      this.page = val.page;
    });
    this.columnDefs = [
      { headerName: 'ID', width: 100, valueGetter: (args) => this.getIdValue(args) },
      {
        headerName: 'Action',
        field: 'action',
        // filterParams: {
        //   filterOptions: ['contains'],
        //   textCustomComparator: function(filter, value, filterText) {
        //     const filteredText = filterText.charAt(0).toUpperCase() + filterText.slice(1);
        //     if (filteredText) {
        //       store.dispatch(new ListStoreActions.ActionFilter(filteredText));
        //       store.dispatch(new ListStoreActions.SetCurrentPage());
        //     } else {
        //       console.log('else block got called');
        //       store.dispatch(new ListStoreActions.RemoveActionFilter());
        //     }
        //   },
        // },
        debounceMs: 2000,
        suppressMenu: true,
        floatingFilterComponentParams: { suppressFilterButton: true }
      },
      { headerName: 'Collection', field: 'collectionName'},
      { headerName: 'Date', field: 'date'},
      { headerName: 'End Point', field: 'endpoint'},
      { headerName: 'IP', field: 'ipAddress' },
      { headerName: 'Method', field: 'method' },
      { headerName: 'Status Code', field: 'statusCode' },
    ];
    this.defaultColDefs = {
      filter: true
    };
  }

  OnGridReady(params) {
    console.log('gridReady', params);
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.loadData();
  }

  searchGlobalData() {
    this.store.dispatch(new ListStoreActions.SetCurrentPage());
    this.auditService.getSearchedData(this.globalSearch).pipe(first()).subscribe((searchDatas: any) => {
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

  previous(): void {
    console.log('previous got called', this.page);
    if (this.paginationPages.hasPrev) {
      this.store.dispatch(new ListStoreActions.NextPage(this.page - 1));
      this.loadData();
    }
  }

  next(): void {
    if (this.paginationPages.hasNext) {
      this.store.dispatch(new ListStoreActions.NextPage(this.page + 1));
      this.loadData();
    }
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
  }

}
