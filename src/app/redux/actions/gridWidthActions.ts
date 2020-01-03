import { Action } from '@ngrx/store';

export const UPDATE_COL_WIDTH = 'UPDATE_COL_WIDTH';
export const RESET_COL_WIDTH = 'RESET_COL_WIDTH';

export class UpdateColWidth implements Action {
  readonly type = UPDATE_COL_WIDTH;

  constructor(public payload: any) {}
}

export class ResetColWidth implements Action {
  readonly type = RESET_COL_WIDTH;

}

export type Actions = UpdateColWidth | ResetColWidth;
