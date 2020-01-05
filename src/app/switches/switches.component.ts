import { Component, OnInit, OnDestroy } from '@angular/core';
import { SwitchesService } from 'src/services/SwitchesService';
import { first, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';

import * as SwitchStoreActions from '../redux/actions/swtichesListActions';
import { Subscription, Subject } from 'rxjs';

import { FloatingFilterComponent } from '../floating-filter/floatingfilter';

@Component({
  selector: 'app-switches',
  templateUrl: './switches.component.html',
  styleUrls: ['./switches.component.css']
})
export class SwitchesComponent implements OnInit, OnDestroy {
  // grid columns
  columns;
  columnDefs;
  components;
  defaultColumnDefs;

  // grid initializing
  params;
  gridApi;
  columnApi;

  // ag-Grid
  rowModelType;
  rowData;
  rowSelection;

  // pagination
  perPage;
  pages;
  pagination;
  currentPageText = new Subject<number>();

  // dropDown
  dropdownSettings = {};
  dropDownList = [];
  selectedItems = [];

  // search
  globalSearch;
  searchGlobally;
  columnFilters;
  search = new Subject<string>();

  // subscriptions
  loadDataFromServer: Subscription;
  paginationInput: Subscription;

  // floating filter
  frameworkComponents;
  floatingFilter = true;

  constructor(
    private switchService: SwitchesService,
    private store: Store<any>
  ) {
    // load pagination details from state
    this.store.pipe(select('switchesList')).subscribe(val => {
      console.log('val is', val);
      this.perPage = val.pagination.limit;
      this.pagination = val.paginationPages;
      this.pages = val.pagination;
      this.rowData = val.datas;
      this.columnFilters = val.columns;
    });

    // global search
    this.searchGlobally = this.search.pipe(
      debounceTime(400),
      distinctUntilChanged()).subscribe(value => {
        this.store.dispatch(new SwitchStoreActions.SetCurrentPage(1));
        this.store.dispatch(new SwitchStoreActions.AddGlobalSearch(value));
        this.loadData();
      });

    // pagination input box
    this.paginationInput = this.currentPageText.pipe(
      debounceTime(400),
      distinctUntilChanged()).subscribe(value => {
        this.store.dispatch(new SwitchStoreActions.SetCurrentPage(value));
        this.loadData();
      });

    // this.rowModelType = 'infinite';
    this.rowSelection = 'multiple';

    this.columnDefs = [
      {
        headerName: 'ID',
        width: 100,
        valueGetter: (args) => this.getId(args),
        checkboxSelection: (params) => {
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        headerCheckboxSelection: (params) => {
          return params.columnApi.getRowGroupColumns().length === 0;
        },
        filter: false,
        cellRenderer: 'loadingCellRenderer',
      },
      {
        headerName: 'Action',
        field: 'action',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.action
        },
      },
      {
        headerName: 'Collection',
        field: 'collectionName',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.collectionName
        },
      },
      {
        headerName: 'Date',
        field: 'date',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.date
        },
      },
      {
        headerName: 'End Point',
        field: 'endpoint',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.endpoint
        },
      },
      {
        headerName: 'IP',
        field: 'ipAddress',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.ipAddress
        },
      },
      {
        headerName: 'Method',
        field: 'method',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.method
        },
      },
      {
        headerName: 'Status Code',
        field: 'statusCode',
        filter: 'agTextColumnFilter',
        floatingFilterComponent: 'FloatingFilterComponent',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
          initialValue: this.columnFilters.statusCode
        },
      },
    ];
    this.defaultColumnDefs = {
      filter: true,
      suppressSizeToFit: true,
      supressMenu: true,
      sortable: true,
      // floatingFilterComponentParams: { suppressFilterButton: true },

      // floatingFilterComponent: 'FloatingFilterComponent',
      // floatingFilterComponentParams: {
      //   maxValue: 7,
      //   suppressFilterButton: true
      // },
      // filter: 'agNumberColumnFilter',
    };

    // this.columnDefs = this.columnDefs.map((item, i) => Object.assign({}, item, this.columns[i]));

    this.components = {
      loadingCellRenderer: function(params) {
        if (params.value !== undefined) {
          return params.value;
        } else {
          return '<img src="https://raw.githubusercontent.com/ag-grid/ag-grid/master/packages/ag-grid-docs/src/images/loading.gif">';
        }
      }
    };

    this.frameworkComponents = { FloatingFilterComponent: FloatingFilterComponent };
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
    this.dropDownList = [
      { key: 'Action', value: 'action' },
      { key: 'Collection', value: 'collectionName' },
      { key: 'Date', value: 'date' },
      { key: 'EndPoint', value: 'endpoint' },
      { key: 'IP', value: 'ipAddress' },
      { key: 'Method', value: 'method' },
      { key: 'Status Code', value: 'statusCode' },
    ];
    this.selectedItems = [...this.dropDownList];
  }

  OnGridReady(params) {
    this.params = params;
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.loadData();
  }


  loadData() {
    // this.loadDataFromServer = this.switchService.getAllDatas()
    // .pipe(first())
    // .subscribe((datas: any) => {
    //   this.store.dispatch(new SwitchStoreActions.FetchDatas(datas));
    //   this.rowData = datas.docs;
    // });
    this.switchService.getAllDatas();
  }

  getId(args: any): any {
    return this.perPage * this.pagination.prev + parseInt(args.node.id, 10) + 1;
  }

  // drop-down select & Deselect
  onItemSelect(item: any) {
    this.columnApi.setColumnVisible(item.value, true);
  }

  onItemUnSelect(item: any) {
    this.columnApi.setColumnVisible(item.value, false);
  }

  onSelectAll(items: any) {
    items.map(item => this.columnApi.setColumnVisible(item.value, true));
  }

  drop(params) {
    const alteredColumns = [];
    params.map((param: any) => {
      alteredColumns.push(param.id);
    });
    this.columnApi.moveColumns(alteredColumns, 1);
  }

  //pagination
  previousPage() {
    if (this.pagination.hasPrev) {
      this.store.dispatch(new SwitchStoreActions.SetCurrentPage(this.pagination.prev));
      this.loadData();
    }
  }

  nextPage() {
    if (this.pagination.hasNext) {
      this.store.dispatch(new SwitchStoreActions.SetCurrentPage(this.pagination.next));
      this.loadData();
    }
  }


  // destroy all subscribe
  ngOnDestroy() {
    // this.loadDataFromServer.unsubscribe();
    this.searchGlobally.unsubscribe();
    this.paginationInput.unsubscribe();
  }

}
