import { Action } from '@ngrx/store';

export const NEXT_PAGE = 'NEXT_PAGE';
export const PREVIOUS_PAGE = 'PREVIOUS_PAGE';
export const ACTION_FILTER = 'ACTION_FILTER';
export const REMOVE_ACTION_FILTER = 'REMOVE_ACTION_FILTER';
export const SET_CURRENT_PAGE = 'SET_CURRENT_PAGE';

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
}

export type Actions = NextPage | PreviousPage | ActionFilter | RemoveActionFilter | SetCurrentPage;
