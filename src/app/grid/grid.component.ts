import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  gridApi;
  gridColumnApi;

  constructor() {}

  @Input() columnName: any[];
  @Input() rowData: any[];
  @Input() defaultColDef: any;
  @Input() hasPagination: boolean;
  @Input() hasRowAnimation: boolean;
  @Input() hasMultipleRows: string;
  @Input() hasFloatingFilter: boolean;
  @Input() hasServerSideFilter: boolean;
  @Input() rowModelType: string;
  @Output() selectionChanged = new EventEmitter();
  @Output() columnResized = new EventEmitter();
  @Output() gridReady = new EventEmitter();

  onGridReady(params): void {
    this.gridApi = params.api;
    this.gridReady.emit(params);
  }

  onSelectionChanged() {
    this.selectionChanged.emit(this.gridApi);
  }

  onColumnResized() {
    this.columnResized.emit(this.gridApi);
  }

  ngOnInit() { }

}
