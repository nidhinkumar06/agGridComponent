import * as ListActions from '../actions/swtichesListActions';

const initialState: any = {
  columns: {
    action: '',
    collectionName: '',
    date: '',
    endpoint: '',
    ipAddress: '',
    method: '',
    statusCode: '',
  },
  pagination: {
    begin: 0,
    end: 0,
    total: 0,
    limit: 10
  },
  paginationPages: {
    current: 0,
    hasNext: false,
    hasPrev: false,
    next: 0,
    prev: 0,
    total: 0
  },
  datas: [],
  globalSearch: ''
};

  export function switchesReducer(state: any[] = initialState, action: ListActions.Actions) {
     switch (action.type) {
       case ListActions.FETCH_DATAS:
        return {
          ...state,
          pagination: action.payload.items,
          paginationPages: action.payload.pages,
          datas: action.payload.docs
        };
        case ListActions.ADD_GLOBAL_SEARCH:
          return {
            ...state,
            globalSearch: action.payload
          };
        case ListActions.CLEAR_GLOBAL_SEARCH:
          return {
            ...state,
            globalSearch: ''
          };
        case ListActions.SET_CURRENT_PAGE:
          state['paginationPages']['current'] = action.payload;
            return {
              ...state
            };
        case ListActions.UPDATE_COLUMN_SEARCH:
          const key = Object.keys(action.payload)[0];
          state['columns'][key.toString()] = Object.values(action.payload)[0];
          return {
            ...state
          };
       default:
        return state;
     }
  }
