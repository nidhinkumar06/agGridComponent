import * as GridActions from '../actions/gridWidthActions';

const initialState: any = {
  columns: [
    {field: '0', width: 100},
    {field: 'action', width: 200},
    {field: 'collectionName', width: 200},
    {field: 'date', width: 200},
    {field: 'endpoint', width: 200},
    {field: 'ipAddress', width: 200},
    {field: 'method', width: 200},
    {field: 'statusCode', width: 200},
  ]
};

export function gridReducer(state: any[] = initialState, action: GridActions.Actions) {
  switch (action.type) {
    case GridActions.UPDATE_COL_WIDTH:
      return {
        ...state,
        columns: [...action.payload]
      };
    case GridActions.RESET_COL_WIDTH:
      return {
        ...state,
        columns: [...initialState.columns]
      };
    default:
      return state;
  }
}
