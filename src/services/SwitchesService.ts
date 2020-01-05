import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import * as SwitchStoreActions from '../app/redux/actions/swtichesListActions';

@Injectable({ providedIn: 'root' })
export class SwitchesService {
  page: Observable<number>;
  perPage: Observable<number>;
  globalSearch: Observable<string>;
  columnSearch;

  constructor(private http: HttpClient, private store: Store<any>) {
    this.store.pipe(select('switchesList')).subscribe(val => {
      this.globalSearch = val.globalSearch;
      this.page = val.paginationPages.current;
      this.perPage = val.pagination.limit;
      this.columnSearch = val.columns;
    });
  }

  getAllDatas() {
    const filterParams = [];
    for (const column in this.columnSearch) {
      if (this.columnSearch[column]) {
        filterParams.push(`${column}=${this.columnSearch[column]}`);
      }
    }

    if (filterParams.length > 0) {
      const columnSearchKey = filterParams.join('&');
      const url = `${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.perPage}&%24term=${this.globalSearch}&${columnSearchKey}`;
      this.getData(url);
    } else {
      const url = `${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.perPage}&%24term=${this.globalSearch}`;
      this.getData(url);
    }
  }

  getData(url) {
    this.http
      .get<any[]>(url)
      .pipe(first())
      .subscribe((datas: any) => {
        this.store.dispatch(new SwitchStoreActions.FetchDatas(datas));
      });
  }
}
