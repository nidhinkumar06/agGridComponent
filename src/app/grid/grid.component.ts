import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  gridApi;

  constructor() { }

  @Input() columnName: any[];
  @Input() rowData: any[];
  @Input() defaultColDef: any;
  @Input() hasPagination: boolean;
  @Input() hasRowAnimation: boolean;
  @Input() hasMultipleRows: string;
  @Input() hasFloatingFilter: boolean;
  @Output() selectionChanged = new EventEmitter();
  @Output() gridReady = new EventEmitter();

  onGridReady(params): void {
    console.log('params', params);

    this.gridApi = params.api;
    this.gridReady.emit(params);
  }

  onSelectionChanged() {
    this.selectionChanged.emit(this.gridApi);
  }

  ngOnInit() {
  }

}
