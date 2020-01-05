import { Component } from '@angular/core';
import { AgFrameworkComponent } from 'ag-grid-angular';
import { IFloatingFilterParams, IFloatingFilter, NumberFilter, NumberFilterModel, TextFilter } from 'ag-grid-community';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import * as SwitchStoreActions from '../redux/actions/swtichesListActions';
import { SwitchesService } from 'src/services/SwitchesService';


export interface FloatingFilterParams extends IFloatingFilterParams {
  value: number;
  maxValue: number;
  initialValue: string;
}

@Component({
  template: `
    <input
      type="text"
      min="0"
      [max]="maxValue"
      data-show-value="true"
      data-popup-enabled="true"
      [(ngModel)]="currentValue"
      (ngModelChange)="this.search.next($event)"
    />
  `
})
export class FloatingFilterComponent
  implements IFloatingFilter, AgFrameworkComponent<FloatingFilterParams> {

  private params: FloatingFilterParams;

  public maxValue: number;
  public currentValue: string;
  public initialValue: string;

  public columnSearch;
  search = new Subject<string>();

  constructor(private store: Store<any>, private switchService: SwitchesService) {
    this.columnSearch = this.search.pipe(
      debounceTime(400),
      distinctUntilChanged()).subscribe(value => {
        console.log('this.params parent', this.params);
        const columnName = this.params.filterParams.colDef.field;
        const searchData = {
          [columnName]: value
        };
        this.store.dispatch(new SwitchStoreActions.SetCurrentPage(1));
        this.store.dispatch(new SwitchStoreActions.UpdateColumnSearch(searchData));
        this.switchService.getAllDatas();

        // below code is for local filter
        // this.params['parentFilterInstance']((instance) => {
        //   (<TextFilter>instance).onFloatingFilterChanged(
        //     'contains',
        //     value
        //   );
        // });
      });
  }

  agInit(params: FloatingFilterParams): void {
    this.params = params;
    this.maxValue = this.params.maxValue;
    this.currentValue = params.initialValue;
  }

  onParentModelChanged(parentModel: NumberFilterModel): void {
    if (!parentModel) {
      this.currentValue = '';
    } else {
      // note that the filter could be anything here, but our purposes we're assuming a greater than filter only,
      // so just read off the value and use that
      // this.currentValue = parentModel.filter;
    }
  }
}
