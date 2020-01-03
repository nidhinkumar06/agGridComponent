import { AuditService } from '../../services/AuditService';
import { Component, OnInit } from '@angular/core';

import { first, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as ListStoreActions from '../redux/actions/auditListActions';
import * as GridStoreActions from '../redux/actions/gridWidthActions';
import { PagerService } from '../../services/PagerService';
import { HttpClient } from '@angular/common/http';

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
  rowModelType;
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

  columns;
  params;


  constructor(
    private auditService: AuditService,
    private pagerService: PagerService,
    private store: Store<any>,
    private http: HttpClient) {
    console.log('car component got called');
    store.pipe(select('auditList')).subscribe(val => {
      this.page = val.page;
    });
    store.pipe(select('gridList')).subscribe(val => {
      this.columns = val.columns;
    });
    this.defaultColDefs = {
      filter: true,
    };
    this.rowSelection = 'multiple';
    this.rowModelType = 'infinite';
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
    this.columnDefs = this.columnDefs.map((item, i) => Object.assign({}, item, this.columns[i]));
  }

  OnGridReady(params) {
    this.params = params;
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    // this.loadData(); //without column filter
    this.loadFilteredData(this.params);
  }

  loadFilteredData(params) {
    this.auditService.getAllAuditLogs().pipe(first()).subscribe((audits: any) => {
      this.rowData = audits.docs;
      this.pagination = audits.items;
      this.paginationPages = audits.pages;
      const dataSource = {
        rowCount: null,
        getRows: (params) => {
          console.log('params is', params);

          setTimeout(() => {
            let dataAfterSortingAndFiltering;
            this.sortAndFilter(audits.docs, params.sortModel, params.filterModel).then((datas: any) => {
              dataAfterSortingAndFiltering = datas;
              this.rowData = datas;
              const rowsThisPage = dataAfterSortingAndFiltering.slice(0, audits.items.end);
              let lastRow = -1;
              if (dataAfterSortingAndFiltering.length <= params.endRow) {
                lastRow = dataAfterSortingAndFiltering.length;
              }
              params.successCallback(rowsThisPage, lastRow);
            });
          }, 3000);
        }
      };
      params.api.setDatasource(dataSource);
    });
  }

  sortAndFilter(allOfTheData, sortModel, filterModel) {
    return this.sortData(sortModel, this.filterData(filterModel, allOfTheData));
  }

  sortData(sortModel, data) {
    const sortPresent = sortModel && sortModel.length > 0;
    if (!sortPresent) {
      return data;
    }
    const resultOfSort = data.slice();
    resultOfSort.sort((a, b) => {
      for (let k = 0; k < sortModel.length; k++) {
        const sortColModel = sortModel[k];
        const valueA = a[sortColModel.colId];
        const valueB = b[sortColModel.colId];
        if (valueA == valueB) {
          continue;
        }
        const sortDirection = sortColModel.sort === 'asc' ? 1 : -1;
        if (valueA > valueB) {
          return sortDirection;
        } else {
          return sortDirection * -1;
        }
      }
      return 0;
    });
    return resultOfSort;
  }

  async filterData(filterModel, data) {
    const filterKeys = Object.keys(filterModel);
    const filterPresent = filterModel && Object.keys(filterModel).length > 0;
    if (!filterPresent) {
      return data;
    }
    const resultOfFilter = [];
    const filterParams = [];
    for (let i = 0; i < filterKeys.length; i++) {
      filterParams.push(`${filterKeys[i]}=${filterModel[filterKeys[i]].filter}`);
    }
    const params = filterParams.join('&');

    await this.auditService.getColumnSearch(params).pipe(first()).toPromise()
    .then((datas: any) => {
      console.log('data is', datas);
      this.pagination = datas.items;
      this.paginationPages = datas.pages;
      resultOfFilter.push(...datas.docs);
    });
    return resultOfFilter;
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

  drop(params) {
    const alteredColumns = [];
    params.map((param: any) => {
      alteredColumns.push(param.id);
    });
    this.columnApi.moveColumns(alteredColumns, 1);
  }

  onColumnResized() {
    const allColumnIds = [];
    this.columnApi.getColumnState().forEach((column) => {
      allColumnIds.push({field: column.colId, width: column.width});
    });
    this.store.dispatch(new GridStoreActions.UpdateColWidth(allColumnIds));
  }

  autoSizeAll() {
    const allColumnIds = [];
    this.columnApi.getColumnState().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    this.columnApi.autoSizeColumns(allColumnIds, false);
    this.store.dispatch(new GridStoreActions.ResetColWidth());
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
    // this.loadData();
    this.loadFilteredData(this.params);
  }

  previous(): void {
    if (this.paginationPages.hasPrev) {
      this.store.dispatch(new ListStoreActions.NextPage(this.page - 1));
      this.loadFilteredData(this.params);
      // this.loadData();
    }
  }

  next(): void {
    if (this.paginationPages.hasNext) {
      this.store.dispatch(new ListStoreActions.NextPage(this.page + 1));
      this.loadFilteredData(this.params);
      // this.loadData();
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
    this.setPage(this.pagination.begin);
  }

}
