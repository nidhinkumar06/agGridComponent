import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../environments/environment';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuditService {
  page: Observable<number>;
  pageLimit: Observable<number>;
  action: Observable<string>;

  constructor(private http: HttpClient, private store: Store<any>) {
    store.pipe(select('auditList')).subscribe(val => {
      this.page = val.page;
      this.pageLimit = val.pageLimit;
      this.action = val.action;
    });
  }

  getAllAuditLogs() {
    console.log('this.pages is', this.page);
    console.log('this.action', this.action);
    return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}`);
    // if (this.action) {
    //   return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}&action=${this.action}`);
    // } else {
    //   return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}`);
    // }
  }

  getSearchedData(searchKey: string) {
    return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}&%24term=${searchKey}`);
  }

  // getColumnSearch(searchKey: string) {
  //   return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}&action=${searchKey}`);
  // }

  getColumnSearch(searchKey: string) {
    return this.http.get<any[]>(`${environment.baseUrl}/auditLog?%24page=${this.page}&%24limit=${this.pageLimit}&${searchKey}`);
  }
}
