import * as ListActions from '../actions/auditListActions';

const initialState: any = {
  page: 1,
  pageLimit: 10,
  action: ''
};

export function listReducer(state: any[] = initialState, action: ListActions.Actions) {
  switch (action.type) {
    case ListActions.NEXT_PAGE:
      return {
        ...state,
        page: action.payload
      };

    case ListActions.PREVIOUS_PAGE:
      return {
        ...state,
        page: action.payload
      };

    case ListActions.ACTION_FILTER:
      return {
        ...state,
        action: action.payload
      };

    case ListActions.REMOVE_ACTION_FILTER:
      return {
        ...state,
        action: ''
      };

    case ListActions.SET_CURRENT_PAGE:
      return {
        ...state,
        page: 1
      };

    default:
      return state;
  }
}
