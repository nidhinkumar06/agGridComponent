import { Action } from '@ngrx/store';

export const NEXT_PAGE = 'NEXT_PAGE';
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
export const ACTION_FILTER = 'ACTION_FILTER';
export const REMOVE_ACTION_FILTER = 'REMOVE_ACTION_FILTER';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';
export const FETCH_DATAS = 'FETCH_DATAS';
export const ADD_GLOBAL_SEARCH = 'ADD_GLOBAL_SEARCH';
export const CLEAR_GLOBAL_SEARCH = 'CLEAR_GLOBAL_SEARCH';
export const UPDATE_COLUMN_SEARCH = 'UPDATE_COLUMN_SEARCH';


export class NextPage implements Action {
  readonly type = NEXT_PAGE;

  constructor(public payload: number) {}
}

export class PreviousPage implements Action {
  readonly type = PREVIOUS_PAGE;

  constructor(public payload: number) {}
}

export class ActionFilter implements Action {
  readonly type = ACTION_FILTER;

  constructor(public payload: string) {}
}

export class RemoveActionFilter implements Action {
  readonly type = REMOVE_ACTION_FILTER;

  constructor() {}
}

export class SetCurrentPage implements Action {
  readonly type = SET_CURRENT_PAGE;
  constructor(public payload: number) {}
}

export class FetchDatas implements Action {
  readonly type = FETCH_DATAS;
  constructor(public payload: any) {}
}

export class AddGlobalSearch implements Action {
  readonly type = ADD_GLOBAL_SEARCH;
  constructor(public payload: string) {}
}

export class ClearGlobalSearch implements Action {
  readonly type = CLEAR_GLOBAL_SEARCH;
}

export class UpdateColumnSearch implements Action {
  readonly type = UPDATE_COLUMN_SEARCH;
  constructor(public payload: any) {}
}

export type Actions =
  FetchDatas |
  NextPage |
  PreviousPage |
  ActionFilter |
  RemoveActionFilter |
  SetCurrentPage |
  AddGlobalSearch |
  ClearGlobalSearch |
  UpdateColumnSearch;
